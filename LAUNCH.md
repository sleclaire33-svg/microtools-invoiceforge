# MicroTools Hub + InvoiceForge — Launch Checklist

## Current status

The application is built as a browser-first static site with serverless payment adapters. PayPal remains the settlement backbone; eligible checkout methods are determined by PayPal and buyer context.

### 11 launch tasks

1. **Payment architecture** — DONE  
   Server-side product pricing, PayPal order creation, server verification, capture, and signed fulfillment URLs are implemented.

2. **PayPal checkout options** — IN PROGRESS  
   PayPal v6 is wired for PayPal, eligible Venmo, guest card checkout, and eligible Pay Later. Apple Pay / Google Pay are loaded for eligibility work but require their own wallet-specific integration/setup before being advertised as standalone buttons.

3. **Payment security** — DONE / TEST REQUIRED  
   Browser input is not trusted for price. Product/amount/currency are rechecked before capture. Capture retries safely recognize an already-completed PayPal order.

4. **Digital fulfillment** — IN PROGRESS  
   Purchases receive expiring signed fulfillment URLs. The Template Pack now contains multiple practical copy-ready templates; Lifetime Pro includes a usable quick-start guide. A later product-packaging pass can turn these into richer downloadable assets.

5. **Webhook/reconciliation** — IN PROGRESS  
   PayPal webhook signature verification is present. Production launch should configure the webhook ID and test completed-capture events; persistent reconciliation is optional for the first low-volume release.

6. **Netlify deployment path** — READY TO CONNECT  
   Netlify Functions adapters, redirects, public publishing, and environment-variable hooks are in the repository. A Netlify site still needs to be connected and deployed.

7. **Vercel fallback** — BLOCKED  
   Vercel remains blocked by the current GitHub authorization/scope mismatch. It is not a dependency for continuing with Netlify.

8. **Automated validation** — DONE  
   GitHub Actions checks JavaScript syntax and verifies the Netlify public copy stays synchronized with the root static files.

9. **Legal/contact pages** — BLOCKED ON BUSINESS DETAILS  
   Privacy, Terms, and Refund pages exist, but the real support email and final business/legal details must be supplied before live sales. Do not use the placeholder support address for launch.

10. **SEO / trust / launch polish** — IN PROGRESS  
    Core title, description, responsive layout, legal navigation, and security headers are present. Final domain-specific metadata should be added after the production domain is known.

11. **Production test + go-live** — NOT STARTED  
    After Netlify deployment and PayPal sandbox credentials are configured, test every checkout path, fulfillment link, expiry, cancellation/error path, mobile layout, print-to-PDF output, and webhook delivery. Only then switch PayPal to production credentials.

## Required production environment variables

- PAYPAL_CLIENT_ID
- PAYPAL_CLIENT_SECRET
- PAYPAL_ENV=production
- PAYPAL_CURRENCY=USD
- FULFILLMENT_SIGNING_SECRET
- PAYPAL_WEBHOOK_ID

Never commit secrets to GitHub.

## Important launch blockers

- Connect/deploy the Netlify site.
- Configure PayPal sandbox credentials first and complete an end-to-end test purchase.
- Replace the placeholder support email and finalize legal text.
- Configure and test the PayPal webhook before relying on it for production reconciliation.
- Do not advertise Apple Pay or Google Pay as guaranteed options; PayPal eligibility varies by buyer, currency, device, and merchant configuration.

