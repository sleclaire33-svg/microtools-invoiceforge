-- Remote migration: mts_provider_test_products. Preserve raw provider IDs.
-- Existing live-ID synthetic fixtures remain valid. Real test catalog IDs may
-- only be stored with test_mode=true. No access grants or RLS changes.
alter table mts_private.orders drop constraint orders_first_product_id_check;
alter table mts_private.orders add constraint orders_first_product_id_check check (
  first_product_id in ('1470398','1470404','1470417','1470420','1470422')
  or (test_mode and first_product_id in ('1470500','1470502','1470504','1470505','1470506'))
);

-- The earlier hard-coded numbers were store order numbers, not resource IDs.
-- The receiver now sets is_qa from the correct store/order_number pair.
create or replace view mts_private.campaign_orders with (security_invoker = true) as
 select (ordered_at at time zone 'Asia/Bangkok')::date as order_date,
   coalesce(campaign_id, 'unattributed') as campaign_id, currency,
   count(*) as paid_orders_including_refunds,
   count(*) filter (where status = 'refunded') as fully_refunded_orders,
   sum(total_minor) as customer_charged_minor,
   sum(refunded_minor) as customer_refunded_minor,
   sum(total_minor - refunded_minor) as customer_retained_minor_including_tax
 from mts_private.orders
 where not test_mode and not is_qa and total_minor > 0
   and status in ('paid','partial_refund','refunded')
 group by 1, 2, 3;
