# Service enquiries on microtoolsstudio.com

Add a Services page alongside the existing five downloadable products. This change accepts enquiries through an email draft only. It does not submit forms, create invoices, accept payments, or promise delivery slots.

## Proposed customer flow

1. Customer chooses Agency AI Records, Catalog Clarity, or Accessible Course Docs.
2. The enquiry button opens the customer's email application with a service-specific subject and non-sensitive scoping prompts. The customer decides whether to send it.
3. Micro Tools Studio confirms fit, authorized inputs, deliverables, price, tax treatment, schedule, acceptance, revisions and cancellation/refund terms in writing.
4. Once the existing PayPal merchant account and required billing checks are verified, issue a direct PayPal commercial invoice for the accepted service.
5. Match the actual payment to the invoice and project, deliver the agreed work, preserve acceptance evidence, and reconcile fees/refunds/expenses in private records.

Lemon Squeezy stays available for the existing eligible digital products. Its product policy prohibits services. Do not add these services to the existing Lemon Squeezy hosted-checkout map or digital-download fulfillment route.

## Hosting

The connected Vercel project `microtools-invoiceforge` lists both microtoolsstudio.com and www.microtoolsstudio.com. Keep the existing deployment route. A Cloudflare-hosted static site could use the same public service pages and PayPal-hosted invoice/payment links; hosting migration is unnecessary for this enquiry launch.

Root HTML/CSS files are source. `public/` contains matching deployed copies. This draft adds only service content and a homepage link/section. It does not change API handlers, credentials, DNS, digital-product prices, customer entitlements or payment-enablement flags.

## Before accepting paid work

- Reconfirm the existing verified PayPal merchant identity and that it is the same account selected for Lemon Squeezy payouts. Do not infer its receiving address from the website support email. Keep the evidence private.
- Keep the existing direct-checkout implementation in sandbox. PayPal invoice verification and any later direct API checkout activation are separate tasks. No production credentials or switches are changed by this draft.
- Test the supported invoice, receipt and refund process; verify the live destination independently of sandbox test identities.
- Confirm monitored support mail, the operating legal seller details, jurisdiction-specific registration and tax requirements, permitted customer-data handling and written service terms.
- For Accessible Course Docs, obtain a qualified reviewer, a written quote and agreed manual/assistive-technology testing. Its proposed prices depend on that review scope. Do not imply conformance or certification before testing.
- Confirm capacity and actual unit economics before accepting a delivery date or monthly upkeep commitment.

The proposed prices are validation hypotheses. No customer demand, revenue, legal clearance or specialist appointment is asserted.

## Validation

- New page links, IDs and email destinations checked against the existing source tree.
- Root and public copies compared byte-for-byte.
- No payment links, checkout API calls or external form submissions introduced.
- Existing payment tests are unchanged; the repository's CI should run on the draft PR. Browser and production verification remain separate from static checks.

## Primary sources checked 26 October 2026

- https://docs.lemonsqueezy.com/help/getting-started/prohibited-products
- https://developer.paypal.com/payment-links-buttons/overview
- https://www.paypal.com/us/business/accept-payments/invoice
- https://developers.cloudflare.com/pages/functions/pricing/
