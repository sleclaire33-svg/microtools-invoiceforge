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
