-- Remote migration: mts_purchase_ledger. No customer names, emails, receipts,
-- raw webhook payloads, or downloaded-workspace records are retained here.
create schema if not exists mts_private;
revoke all on schema mts_private from public, anon, authenticated;
grant usage on schema mts_private to service_role;

create table mts_private.orders (
  store_id text not null check (store_id ~ '^[1-9][0-9]{0,18}$'),
  order_id text not null check (order_id ~ '^[1-9][0-9]{0,18}$'),
  test_mode boolean not null,
  first_product_id text not null check (first_product_id in ('1470398','1470404','1470417','1470420','1470422')),
  is_qa boolean not null default false,
  campaign_id text check (campaign_id ~ '^(if-balance-[ab]|ao-kickoff|cp-renewal|si-retest|cl-evidence)-(ig|li|yt|pin)$'),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  status text not null check (status in ('pending','failed','paid','refunded','partial_refund','fraudulent')),
  total_minor numeric(20,6) not null check (total_minor >= 0),
  tax_minor numeric(20,6) not null check (tax_minor >= 0 and tax_minor <= total_minor),
  refunded_minor numeric(20,6) not null check (refunded_minor >= 0 and refunded_minor <= total_minor),
  ordered_at timestamptz not null,
  source_updated_at timestamptz not null check (source_updated_at >= ordered_at),
  received_at timestamptz not null default now(),
  primary key (store_id, order_id, test_mode)
);
alter table mts_private.orders enable row level security;
revoke all on mts_private.orders from public, anon, authenticated;
grant select, insert, update on mts_private.orders to service_role;

create function public.mts_record_order(p_order jsonb) returns void
language plpgsql security invoker set search_path = '' as $$
declare
  r mts_private.orders%rowtype;
begin
  r := jsonb_populate_record(null::mts_private.orders, p_order);
  -- Only allow explicit typed fields; received_at is always our server time.
  insert into mts_private.orders as old
    (store_id, order_id, test_mode, first_product_id, is_qa, campaign_id,
     currency, status, total_minor, tax_minor, refunded_minor, ordered_at, source_updated_at)
  values (r.store_id, r.order_id, r.test_mode, r.first_product_id, r.is_qa, r.campaign_id,
     r.currency, r.status, r.total_minor, r.tax_minor, r.refunded_minor, r.ordered_at, r.source_updated_at)
  on conflict (store_id, order_id, test_mode) do update set
    status = excluded.status, total_minor = excluded.total_minor,
    tax_minor = excluded.tax_minor, refunded_minor = excluded.refunded_minor,
    source_updated_at = excluded.source_updated_at, received_at = now(),
    campaign_id = coalesce(old.campaign_id, excluded.campaign_id),
    is_qa = old.is_qa or excluded.is_qa
  where old.currency = excluded.currency and old.first_product_id = excluded.first_product_id
    and excluded.refunded_minor >= old.refunded_minor
    and (excluded.source_updated_at > old.source_updated_at
      or (excluded.source_updated_at = old.source_updated_at and excluded.refunded_minor > old.refunded_minor));
  if exists (select 1 from mts_private.orders o where o.store_id = r.store_id and o.order_id = r.order_id
    and o.test_mode = r.test_mode and (o.currency <> r.currency or o.first_product_id <> r.first_product_id)) then
    raise exception 'Order identity mismatch';
  end if;
  -- A delayed order_created event can carry the label absent from an earlier
  -- refund notification; recover it without replacing the newer payment state.
  update mts_private.orders as o set campaign_id = coalesce(o.campaign_id, r.campaign_id), is_qa = o.is_qa or r.is_qa
   where o.store_id = r.store_id and o.order_id = r.order_id and o.test_mode = r.test_mode
     and o.currency = r.currency and o.first_product_id = r.first_product_id
     and ((o.campaign_id is null and r.campaign_id is not null) or (r.is_qa and not o.is_qa));
end;
$$;
revoke all on function public.mts_record_order(jsonb) from public, anon, authenticated;
grant execute on function public.mts_record_order(jsonb) to service_role;

-- Private report: retain currencies separately and never imply profit/payouts.
-- first_product_id describes the checkout's first item, not allocated line revenue.
create view mts_private.campaign_orders with (security_invoker = true) as
 select (ordered_at at time zone 'Asia/Bangkok')::date as order_date,
   coalesce(campaign_id, 'unattributed') as campaign_id, currency,
   count(*) as paid_orders_including_refunds,
   count(*) filter (where status = 'refunded') as fully_refunded_orders,
   sum(total_minor) as customer_charged_minor,
   sum(refunded_minor) as customer_refunded_minor,
   sum(total_minor - refunded_minor) as customer_retained_minor_including_tax
 from mts_private.orders
 where not test_mode and not is_qa and total_minor > 0
   and order_id not in ('4956971','4956972','4956973','4956974','4956975')
   and status in ('paid','partial_refund','refunded')
 group by 1, 2, 3;
revoke all on mts_private.campaign_orders from public, anon, authenticated;
grant select on mts_private.campaign_orders to service_role;
