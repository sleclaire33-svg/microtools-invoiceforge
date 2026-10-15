# Micro Tools Studio + InvoiceForge — Launch Checklist

## Current status

The application is built as a browser-first static site with serverless payment adapters. The Netlify project is connected to GitHub and has been deployed previously; the latest merged changes still need production URL verification. PayPal remains the settlement backbone; eligible checkout methods are determined by PayPal and buyer context.

### 11 launch tasks

1. **Payment architecture** — DONE  
   Server-side product pricing, PayPal order creation, server verification, capture, and signed fulfillment URLs are implemented.

2. **PayPal checkout options** — IN PROGRESS  
   PayPal v6 is wired for PayPal, eligible Venmo, guest card checkout, and eligible Pay Later. Apple Pay / Google Pay are loaded for eligibility work but require their own wallet-specific integration/setup before being advertised as standalone buttons.

3. **Payment security** — DONE / TEST REQUIRED  
   Browser input is not trusted for price. Product/amount/currency are rechecked before capture. Capture retries safely recognize an already-completed PayPal order.

4. **Digital fulfillment** — IN PROGRESS  
   Purchases receive expiring signed fulfillment URLs. The Get-Paid-Faster Starter Kit delivers 12 copy-ready client communication and admin templates. The Workflow Resource Bundle delivers a broader toolkit: invoice workflow, invoice QA checklist, quote-to-cash tracker, scope/quote templates, onboarding and handoff resources, payment follow-up guidance, and admin routines. Signed links expire after 24 hours; delivery pages are marked noindex. Confirm the delivered pages in a sandbox purchase before launch.

5. **Webhook/reconciliation** — IN PROGRESS  
   PayPal webhook signature verification is present. Production launch should configure the webhook ID and test completed-capture events; persistent reconciliation is optional for the first low-volume release.

6. **Netlify deployment path** — DEPLOYED; RE-VERIFY AFTER MERGE  
   The repository is connected to the Netlify project `microtools-invoiceforge`, which has a working project hostname. The latest hostname and fulfillment URL fixes are merged; confirm the production deploy and endpoints before launch.

7. **Vercel fallback** — NOT REQUIRED FOR CURRENT LAUNCH  
   Continue with Netlify; do not spend launch time repairing Vercel unless a genuine Netlify blocker appears.

8. **Automated validation** — DONE  
   GitHub Actions checks JavaScript syntax and verifies the Netlify public copy stays synchronized with the root static files.

9. **Legal/contact pages** — PARTIALLY BLOCKED  
   Privacy, Terms, and Refund pages exist. The site displays `sean@microtoolsstudio.com`; mailbox monitoring still needs confirmation. Intended jurisdiction is Washington State, USA. The working public brand is **Micro Tools Studio** and the product is **InvoiceForge**. The low-cost plan is to operate initially as a sole proprietor, but the owner's legal identity, Washington business/trade-name licensing requirements, and applicable local/tax obligations must be confirmed before live sales. Do not imply the trade name or trademark is cleared merely because it is used on the site.

10. **SEO / trust / launch polish** — IN PROGRESS  
    Core title, description, responsive layout, legal navigation, and security headers are present. The working public brand is **Micro Tools Studio**, while the current product remains **InvoiceForge**. Canonical URLs, Open Graph URLs, robots.txt, and sitemap still use `microtools-invoiceforge.netlify.app`; keep this existing URL for launch and change only after a real custom domain is configured.

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

- Confirm the latest merged commit has finished deploying to Netlify and verify the production endpoints.
- Configure PayPal sandbox credentials first and complete an end-to-end test purchase.
- Confirm the displayed support mailbox is monitored and finalize legal text/business details.
- Configure and test the PayPal webhook before relying on it for production reconciliation.
- Do not advertise Apple Pay or Google Pay as guaranteed options; PayPal eligibility varies by buyer, currency, device, and merchant configuration.


## Low-cost Washington setup — do not treat as completed filings

- Working brand: Micro Tools Studio; current product: InvoiceForge.
- Intended initial structure: individual sole proprietor to minimize upfront cost; no LLC or corporation has been formed by this workflow.
- Before accepting live payments, determine whether a Washington Business License Application, trade-name registration ($5 per name, plus applicable application/processing fees), city endorsement, or other local license is required. Official guidance: https://dor.wa.gov/open-business and https://dor.wa.gov/manage-business/grow-business/register-trade-names.
- Search the exact and similar name in the Washington business/trademark systems and USPTO records, plus general web use. A preliminary web search found no obvious exact-match business result, but this is **not** comprehensive clearance and does not establish that the name is legally available. Official search guidance: https://www.uspto.gov/trademarks/search/comprehensive-clearance-search-similar-trademarks.
- Do not pay for a trademark application, new domain, LLC, or rebrand as a launch prerequisite. Keep the existing Netlify hostname and support address for the initial launch.
- Do not claim the legal owner name, trade-name registration, local license, mailbox monitoring, production payment setup, or live deployment has been verified unless evidence is obtained.
