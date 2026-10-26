# Campaign measurement — 25 October 2026

Metricool brand 7640484 is connected to Instagram @microtoolsstudio, timezone Asia/Bangkok. No scheduled posts were present at the initial check. This is a new connection; suggested posting hours are a starting hypothesis, not evidence of buyer demand.

## Truthful funnel

1. Instagram: record published post URL, impressions/reach, engagement and supported profile/link metrics from Metricool. Keep missing values blank, not zero. An Instagram caption URL is not a reliable clickable checkout path; use a verified profile website link or show the short domain in the graphic.
2. Website: Metricool visit measurement is integrated on an explicit allowlist of public storefront and preview pages. Query strings/fragments are removed, referrers are reduced to origins, checkout/work-tool pages are excluded, and supported GPC/DNT signals prevent collection. Open any storefront URL with ?qa=1 to exclude the whole browser-tab session from subsequent measurement. These are visit counts, not checkout starts or purchase attribution. Vercel Web Analytics remains disabled; it is not needed for this basic Metricool implementation. Dashboard connection verification must pass before reporting live collection.
3. Purchases: use Lemon Squeezy genuine paid orders, actual fees/refunds and actual payouts. Exclude the five $0 QA orders and all sandbox orders. Do not equate scheduled posts, checkout visits, orders and bank receipts.

## Optional future Vercel analytics (not required for Metricool visits)

Confirm the hosting plan and cost authorization in the dashboard. Current official documentation says Hobby is for noncommercial personal use; if this project is on Hobby, resolve commercial hosting eligibility before scaling the store. No paid upgrade is authorized by this checklist.

Enable Web Analytics, obtain the project’s current script instructions, implement the documented SDK/script, redact unknown URL parameters and fragments, exclude QA sessions, update the privacy notice and redeploy. Verify a deliberate non-sensitive test view arrives. Retain raw test counts separately. Custom events require an eligible plan; UTM reporting has a separate feature requirement. Do not claim source-to-purchase attribution unless independently verified across the checkout boundary.

## Initial review

Review each published post after 24 and 72 hours using matching reporting windows. Track qualified enquiries and genuine paid orders alongside reach. Spend stays at $0 until a budget is explicitly authorized. Change one product message or creative variable at a time; small samples are inconclusive.

Sources checked 25 October 2026:
- https://vercel.com/docs/analytics/quickstart
- https://vercel.com/docs/analytics/limits-and-pricing
- https://vercel.com/docs/plans/hobby

## Update — 26 October 2026

Metricool website connection was verified on 25 October. The collection and InvoiceForge posts now show PUBLISHED with public Instagram URLs. The 25 October website report has three visits, potentially including verification traffic; no inference of demand is justified.

The new campaign.js preserves only 24 predefined creative/channel labels in tab session storage for up to 24 hours. It passes an approved campaign_id as Lemon Squeezy checkout custom data. It accepts no arbitrary source strings, personal IDs or form data and honors QA/GPC/DNT exclusions. Checkout still works when storage or the optional campaign module fails. Four automated tests validate these boundaries.

This is attribution preparation, NOT completed source-to-sale reporting. A signed Lemon Squeezy order webhook or supported analytics integration still needs account setup and an end-to-end test. Do not treat checkout handoff as a purchase or manufacture virtual page views as events. Current Metricool visit reporting remains unchanged.

Reference: https://docs.lemonsqueezy.com/help/checkout/passing-custom-data

## Guide discovery and scheduled launch posts

Six public guide pages are included in the existing minimal visit measurement allowlist. QA/GPC/DNT protections and query/referrer redaction are unchanged. The guide index links to one practical guide for each of the five products, each with a relevant preview and product-page path. See INSTAGRAM_SCHEDULE_20261027.md for the six confirmed upcoming Reels.

## Purchase backend prepared

Supabase is connected and restored, its production URL has been corrected, and a restricted order ledger with refund/duplicate protections has been created and transaction-tested. The signed receiver is implemented separately from checkout and file delivery. Provider webhook setup and a labeled provider-to-database test remain pending secure Lemon Squeezy sign-in. See PURCHASE_TRACKING.md for exact completed work, exclusions, remaining verification and reporting limits. Do not report source-to-sale attribution as live yet.
