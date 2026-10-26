-- Integration checks run against the real schema, then roll back all fixtures.
begin;
set local role service_role;
do $$
declare
  base jsonb := '{"store_id":"9999999999999999999","order_id":"9999999999999999991","test_mode":false,"first_product_id":"1470398","is_qa":false,"campaign_id":"if-balance-a-ig","currency":"USD","status":"paid","total_minor":1900,"tax_minor":0,"refunded_minor":0,"ordered_at":"2020-01-01T00:00:00Z","source_updated_at":"2020-01-01T00:00:00Z"}';
  r mts_private.orders%rowtype;
begin
  if exists(select 1 from mts_private.orders where store_id=base->>'store_id') then raise exception 'Fixture identifier in use'; end if;
  perform public.mts_record_order(base);
  perform public.mts_record_order(base);
  if (select count(*) from mts_private.orders where store_id=base->>'store_id') <> 1 then raise exception 'Duplicate counted twice'; end if;
  perform public.mts_record_order(base || '{"status":"partial_refund","refunded_minor":600,"campaign_id":null,"source_updated_at":"2020-01-02T00:00:00Z"}');
  perform public.mts_record_order(base);
  select * into r from mts_private.orders where store_id=base->>'store_id';
  if r.status <> 'partial_refund' or r.refunded_minor <> 600 or r.campaign_id <> 'if-balance-a-ig' then raise exception 'Stale event lost refund or label'; end if;
  perform public.mts_record_order(base || '{"status":"refunded","refunded_minor":1900,"source_updated_at":"2020-01-02T00:00:00Z"}');
  select * into r from mts_private.orders where store_id=base->>'store_id';
  if r.status <> 'refunded' or r.refunded_minor <> 1900 then raise exception 'Same-time full refund not applied'; end if;
  -- Receive the refund before order_created; the later arrival restores only label.
  perform public.mts_record_order(base || '{"order_id":"9999999999999999992","campaign_id":null,"status":"refunded","refunded_minor":1900,"source_updated_at":"2020-01-02T00:00:00Z"}');
  perform public.mts_record_order(base || '{"order_id":"9999999999999999992"}');
  select * into r from mts_private.orders where store_id=base->>'store_id' and order_id='9999999999999999992';
  if r.status <> 'refunded' or r.campaign_id <> 'if-balance-a-ig' then raise exception 'Late attribution repair failed'; end if;
  perform public.mts_record_order(base || '{"order_id":"9999999999999999993","test_mode":true}');
  perform public.mts_record_order(base || '{"order_id":"9999999999999999994","is_qa":true}');
  perform public.mts_record_order(base || '{"order_id":"9999999999999999995","total_minor":0}');
  perform public.mts_record_order(base || '{"order_id":"9999999999999999996","status":"pending"}');
  perform public.mts_record_order(base || '{"order_id":"9999999999999999997","currency":"EUR"}');
  perform public.mts_record_order(base || '{"order_id":"9999999999999999998","test_mode":true,"first_product_id":"1470500"}');
  begin
    perform public.mts_record_order(base || '{"order_id":"9999999999999999999","first_product_id":"1470500"}');
    raise exception 'Test product accepted as live';
  exception when check_violation then null;
  end;
  if (select paid_orders_including_refunds from mts_private.campaign_orders where order_date='2020-01-01' and campaign_id='if-balance-a-ig' and currency='USD') <> 2 then raise exception 'QA, test, zero or pending orders counted'; end if;
  if (select customer_retained_minor_including_tax from mts_private.campaign_orders where order_date='2020-01-01' and campaign_id='if-balance-a-ig' and currency='USD') <> 0 then raise exception 'Refund total incorrect'; end if;
  if (select customer_charged_minor from mts_private.campaign_orders where order_date='2020-01-01' and campaign_id='if-balance-a-ig' and currency='EUR') <> 1900 then raise exception 'Currencies mixed'; end if;
end $$;
reset role;
do $$ begin
  if has_function_privilege('anon','public.mts_record_order(jsonb)','EXECUTE') or has_function_privilege('authenticated','public.mts_record_order(jsonb)','EXECUTE') then raise exception 'Public write permission'; end if;
  if has_schema_privilege('anon','mts_private','USAGE') or has_schema_privilege('authenticated','mts_private','USAGE') then raise exception 'Private schema exposed'; end if;
  if has_table_privilege('anon','mts_private.orders','SELECT') or has_table_privilege('authenticated','mts_private.orders','SELECT') then raise exception 'Public read permission'; end if;
  if not (select relrowsecurity from pg_class where oid='mts_private.orders'::regclass) then raise exception 'RLS missing'; end if;
end $$;
rollback;
select 'PASS: duplicate, out-of-order, refund, attribution recovery, currency, exclusions and access checks; fixtures rolled back' as result;
