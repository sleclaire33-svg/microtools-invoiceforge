# Lemon Squeezy Checkout Migration — InvoiceForge

## Goal
Replace the current PayPal-specific checkout with Lemon Squeezy hosted checkout for the two existing one-time digital products, test the full flow in Lemon Squeezy Test mode, and only then prepare a live release. Keep the existing free browser tools available without payment.

Lemon Squeezy supports hosted checkout or an overlay. Its Test mode is separate from Live mode; test products, API keys, and webhooks do not automatically become live resources. Do not use real card details in Test mode. Official references:
- https://docs.lemonsqueezy.com/help/getting-started/test-mode
- https://docs.lemonsqueezy.com/guides/developer-guide/testing-going-live
- https://docs.lemonsqueezy.com/guides/developer-guide/taking-payments
- https://docs.lemonsqueezy.com/guides/developer-guide/webhooks
- https://docs.lemonsqueezy.com/help/getting-started/getting-paid

## Current InvoiceForge products to configure in Test mode
1. **InvoiceForge Get-Paid-Faster Starter Kit** — current site price hypothesis: $14.99 one-time.
2. **InvoiceForge Workflow Resource Bundle** — current site price hypothesis: $29.00 one-time.

Verify exact product contents and files before publishing each product. Do not represent a product as including a file or feature until that asset exists and has been attached to the relevant Lemon Squeezy variant. Keep the existing product names/prices only if they match the intended product setup.

## Required account/dashboard information
- Store URL/slug and store ID.
- Test-mode product/variant ID for each paid product.
- Confirmation that both test-mode products are published and checkout URLs work.
- Confirmation of the desired payout destination: verified PayPal account or bank account. If PayPal is selected, Lemon Squeezy says PayPal payouts are in USD, are scheduled twice monthly, and have a $50 minimum threshold; account-specific fees/conversion may apply.
- Later, after tests pass: live-mode product/variant IDs and a live-mode webhook. Never paste API keys or webhook secrets into chat.

## Implementation approach
1. Prefer server-created checkout URLs via Lemon Squeezy API or verified dashboard checkout URLs; do not accept arbitrary checkout URLs or prices supplied by the browser.
2. Keep API key and webhook signing secret only in Netlify environment variables.
3. Use Lemon Squeezy hosted checkout first for reliability; consider overlay only after the hosted flow works.
4. Configure webhook endpoint and verify the X-Signature header against the raw request body with a timing-safe comparison. Start with only required events such as order_created and order_refunded.
5. Decide delivery model explicitly:
   - Preferred simple route: attach final downloadable resources to the relevant Lemon Squeezy product variants and use Lemon Squeezy's order receipt/download delivery.
   - If custom on-site fulfillment is still required, build and test a separate verified webhook-backed fulfillment flow. Do not assume the old PayPal signed-link endpoints work with Lemon Squeezy.
6. Remove/replace PayPal-specific checkout messaging in homepage, product descriptions, Terms, Privacy, and Refund Policy after the new flow is verified.
7. Test in Test mode: successful purchase, declined/failed payment, checkout cancel/back, order appears in dashboard, correct receipt, correct file delivery, webhook signature validation, duplicate webhook retry, and refund event.
8. Switch to Live mode only after the user explicitly authorizes it. Create new Live-mode products/variants/API key/webhook as needed; test resources do not automatically transfer.

## Environment variables (names only; do not store values in Git)
Expected server-side configuration will be selected during implementation. Likely names:
- LEMONSQUEEZY_MODE (test or live)
- LEMONSQUEEZY_API_KEY
- LEMONSQUEEZY_STORE_ID
- LEMONSQUEEZY_STARTER_VARIANT_ID
- LEMONSQUEEZY_BUNDLE_VARIANT_ID
- LEMONSQUEEZY_WEBHOOK_SECRET

Do not add these variables until the corresponding integration code is deployed. Never commit their values or share secrets in chat.

## Acceptance gate
- [ ] Product names, prices, variant IDs and product files match.
- [ ] Checkout URL is generated only for a known product.
- [ ] Test-mode checkout completes successfully with test details.
- [ ] Customer receives correct receipt and downloadable resources.
- [ ] Cancel/failed checkout never shows success.
- [ ] Webhook signature is validated against raw bytes.
- [ ] Duplicate webhook deliveries are safely idempotent.
- [ ] Refund handling is documented and tested.
- [ ] Legal pages and checkout messaging accurately describe Lemon Squeezy.
- [ ] Live mode is not enabled without explicit user authorization.