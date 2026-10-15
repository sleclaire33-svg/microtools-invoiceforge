# Micro Tools Studio — InvoiceForge

Micro Tools Studio is the working umbrella brand. InvoiceForge is the invoice product. This hosted-first web app offers free browser tools and PayPal-powered checkout.

## Products
- Free tools
- Get-Paid-Faster Starter Kit — $14.99 (one-time static resources)
- Workflow Resource Bundle — $29 (one-time static resources; no future software features)

## Payment strategy
PayPal is the required payment/settlement provider. The checkout is designed to show eligible PayPal-supported payment options rather than forcing every buyer to use a PayPal account, including:
- PayPal
- Guest card checkout when eligible
- Venmo when eligible
- Pay Later when eligible
- Apple Pay / Google Pay integration components and eligibility detection are prepared for wallet-specific setup

Availability varies by buyer, country, currency, device, and merchant eligibility. PayPal's current SDK supports these payment categories and recommends eligibility checks before rendering methods.

## Required environment variables
PAYPAL_CLIENT_ID
PAYPAL_CLIENT_SECRET
PAYPAL_ENV=sandbox or production
PAYPAL_CURRENCY=USD
PAYPAL_WEBHOOK_ID
FULFILLMENT_SIGNING_SECRET

Never commit PayPal secrets or the fulfillment signing secret.

## Fulfillment
Successful PayPal captures return a time-limited signed delivery URL. The Get-Paid-Faster Starter Kit is delivered as a browser-based printable template document; customers can use Print → Save as PDF.

The current fulfillment flow is intentionally lightweight for the MVP. Before public launch, run a complete PayPal Sandbox purchase and verify order creation, buyer approval, capture, signed delivery, webhook behavior, and refund handling.

## Brand and legal setup

- Working public brand: **Micro Tools Studio**.
- Product name: **InvoiceForge** (write as “Invoice Forge” in explanatory copy when helpful; keep existing technical identifiers and URLs unchanged for launch).
- Operating plan: start as a sole proprietor to minimize startup costs, subject to confirming applicable Washington licensing, trade-name, local, and tax requirements.
- Name screening is preliminary, not legal clearance. Do not claim trademark availability or register/file a trademark until federal, Washington, marketplace, and common-law searches have been reviewed.
- Do not use “Micro Tools Studio” as a verified legal entity name. A sole proprietor’s legal identity and any required trade-name registration are separate.

## Hosting
Vercel remains supported, but a Netlify fallback is included:
- `netlify/functions/` contains adapters for the existing API handlers.
- `netlify.toml` preserves the existing `/api/*` URLs.
- Netlify can connect directly to the GitHub repository for continuous deployment.
- Runtime secrets belong in the Netlify UI, not `netlify.toml`.

Netlify's current documentation supports GitHub continuous deployment, serverless Functions, and runtime environment variables.

## Launch blockers
1. Connect the GitHub repository to Netlify or repair the Vercel GitHub authorization.
2. Add PayPal Sandbox credentials in the hosting dashboard.
3. Configure a PayPal Sandbox webhook URL and subscribed events.
4. Complete end-to-end sandbox payment tests.
5. Replace placeholder support contact and draft legal/refund language.
6. Configure a production custom domain.
7. Switch PayPal to production only after sandbox validation.
8. Add analytics/conversion tracking after the payment path is proven.

No PayPal or hosting secret should ever be pasted into chat or committed to GitHub.
