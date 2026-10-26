# Purchase tracking setup — 26 October 2026

## Verified infrastructure

- Supabase project `vdxlrjrdjwtocwtcqbxq` restored from paused to ACTIVE_HEALTHY.
- Vercel production `VITE_SUPABASE_URL` corrected to the single HTTPS project origin; the previous value contained copied Markdown link text.
- Existing empty `profiles`, `subscriptions` and `app_reports` tables preserved.
- Applied remote migration `mts_purchase_ledger`; source in `sql/purchase-ledger.sql`.
- New `mts_private.orders` table uses RLS and no public/client privileges. Its lack of user RLS policies is deliberate: only the server service role may use it. The advisor reports this as informational, not a permission to add public policies. Explanation: https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy
- `public.mts_record_order(jsonb)` is SECURITY INVOKER and executable only by the service role (plus privileged administrators). It never elevates a browser user's access.
- Database transaction tests passed for duplicates, refunds, out-of-order events, late campaign recovery, currency separation, test/QA/free/pending exclusions and access controls. All fixtures rolled back; zero persisted orders after testing.

## Receiver

Vercel endpoint: `https://www.microtoolsstudio.com/api/lemon-webhook`

Required production variables already have entries in Vercel: `LEMON_SQUEEZY_SIGNING_SECRET`, `LEMON_SQUEEZY_STORE_ID`, `SUPABASE_SERVICE_ROLE_KEY`, and corrected `VITE_SUPABASE_URL` (or server-only `SUPABASE_URL`). Presence is not proof of valid secret values. No secrets are stored in this repository or printed in logs.

The handler verifies HMAC-SHA256 against the original request bytes, restricts the configured store and five current product IDs, retains only explicit non-contact fields, limits payloads to 256 KiB and waits for a successful database write before acknowledging. Database errors return 503 so the provider can retry. The PayPal webhook and delivery paths are unchanged.

## Still required before calling attribution live

1. Lemon Squeezy sign-in is restored. The live webhook form is prepared with the callback URL and order/refund events; signing-key entry and Save Webhook remain pending.
2. Inspect existing webhooks before adding or changing any. Configure `order_created` and `order_refunded` to the exact HTTPS receiver above. Ensure the signing secret matches the production variable through a secure credential/configuration flow. Do not expose, guess, or reuse a secret from chat.
3. Verify a provider-generated test-mode order event reaches the receiver and database. A synthetic local signature test is not a provider end-to-end test. Repeat one event and verify only one database row; simulate a refund on a test order, never a real customer's order.
4. Verify a labeled test checkout carries the approved campaign ID into the persisted row. Keep test mode and QA flags intact; do not count it as revenue. Do not charge a real card solely to prove this integration.
5. Inspect webhook delivery history and reconcile actual orders/refunds after enabling. Failed delivery retries are finite; recover missed notifications from the provider. No background reconciliation or alerting has been enabled yet.

## Reporting and interpretation

Use `select * from mts_private.campaign_orders order by order_date desc;` through authorized database administration. It groups by Bangkok order date, campaign and currency. `customer_retained_minor_including_tax` is customer charges minus reported refunds, **not profit, merchant net revenue or payout**. Reconcile fees, tax, disputes, discounts and actual payouts separately in Lemon Squeezy. Do not sum different currencies together. First product ID is the first checkout item, not an allocation of order revenue across multiple items.

Campaign labels can be absent, blocked, copied or modified by visitors. This is observed campaign association, not causal proof or complete cross-device attribution. The checkout-label expiry/privacy rules remain unchanged. Chargebacks or payment-state changes without a subscribed event must be reconciled in the provider dashboard. Historical orders are not automatically imported.

Supabase can pause free projects after inactivity; inspect health if delivery fails. Do not create artificial keepalive traffic or purchase an upgrade without authorization. Checkout and Lemon Squeezy download delivery do not depend on this measurement endpoint.

The older unused schema has performance advisories for a missing `app_reports.user_id` index and six per-row auth policy expressions. These are separate from purchase tracking and were not altered during this integration:
- https://supabase.com/docs/guides/database/database-linter?lint=0001_unindexed_foreign_keys
- https://supabase.com/docs/guides/database/database-linter?lint=0003_auth_rls_initplan

## References checked

- https://docs.lemonsqueezy.com/help/webhooks/signing-requests
- https://docs.lemonsqueezy.com/api/orders/the-order-object
- https://vercel.com/docs/functions/runtimes/node-js

## Rollback

Revert the receiver/privacy deployment or disable its Lemon Squeezy webhook if necessary. Preserve the private ledger and existing store downloads; do not drop order records to roll back application code. The URL correction is valid and should remain.


## Evening verification — 26 October 2026

- Owner-provided signing key was configured as a sensitive production Vercel variable; no key values were copied into source, reports or chat. Its previous value did not match the supplied record.
- The PDF's Lemon Squeezy API credential returned 401 on a read-only store-list request; it is not usable for automated provider setup.
- Verified store identity from the signed-in Stores screen: Micro Tools Studio, microtoolsai.lemonsqueezy.com, store 495697.
- Signed requests now pass the production receiver. A synthetic test-mode, QA-marked order was written through HTTPS to the actual Supabase ledger. Duplicate delivery, full refund and late original delivery all returned 200. One row retained the refunded status and campaign label; sales report remained empty.
- This test was generated by our diagnostic script, not Lemon Squeezy. It proves website-to-database operation, not provider delivery or labeled checkout-to-sale attribution.
- Synthetic order ID 9000000000000261026 remains test_mode=true and is_qa=true. Cleanup through the database connector twice returned Invalid or expired requestState; the row is excluded from sales. Do not count or present it as a customer purchase.
- Instagram schedule reread: all six October 27–November 1 Reels remain PENDING with automatic publication enabled at 10:00 Asia/Bangkok. No duplicate posts created.
- The latest service enquiry additions were preserved when redeploying the corrected configuration. Paid service acceptance is still gated by docs/SERVICE_LAUNCH.md; these service offers are not Lemon Squeezy products.
- Removed duplicate campaign-script tags from six guide pages. This avoids running campaign handling twice on a single visit.
