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

1. Lemon Squeezy sign-in is restored. The owner reported saving the webhook, but a fresh authenticated inspection found no live webhook entries; the previously prepared URL opened with empty fields. Saved live registration is therefore still unverified.
2. Inspect existing webhooks before adding or changing any. Configure `order_created` and `order_refunded` to the exact HTTPS receiver above. Ensure the signing secret matches the production variable through a secure credential/configuration flow. Do not expose, guess, or reuse a secret from chat.
3. Configure a separate test-mode webhook before simulating orders. Live and test webhooks are separate. Verify a provider-generated test-mode order event reaches the receiver and database. A synthetic local signature test is not a provider end-to-end test. Repeat one event and verify only one database row; simulate a refund on a test order, never a real customer's order.
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

## Provider identity correction — 26 October 2026

- Fresh authenticated test catalog inspection found distinct product IDs: InvoiceForge 1470500; Agency OS 1470502; CertPai 1470504; SiteIntellect 1470505; ClaimProof 1470506. Live product IDs above remain unchanged.
- The receiver retains the raw provider product ID. It accepts those five additional IDs only for test-mode events. The `mts_provider_test_products` migration adds the same test-only condition to the database constraint; RLS and access grants stay unchanged. Apply `sql/provider-test-products.sql` after the initial ledger migration when rebuilding this setup.
- QA references 4956971–4956975 are store order numbers, not JSON:API resource IDs. The receiver now sets is_qa from attributes.order_number scoped to store 495697. Resource IDs remain the deduplication key. The reporting view uses is_qa and no longer compares resource IDs to those store order numbers.
- Database inspection still found only the synthetic QA test row. No provider-generated event has been verified in the ledger.
- The existing test webhooks target four legacy Vercel addresses. The visible ClaimProof delivery returned DEPLOYMENT_NOT_FOUND (404). No legacy webhook was deleted or secret changed during this inspection.
- Test-mode catalog attachments are older v3 copies. The live v4 customer releases are separate; do not report a test attachment as proof of the current live download.
- Remaining: create and verify live and test webhook registration with matching signing credentials; trigger a provider test order/refund; verify campaign-labeled checkout attribution. Do not count the synthetic checks as real sales.
