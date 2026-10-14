# InvoiceForge Product Strategy: Get Paid Faster

**Status:** Product direction for pre-launch planning  
**Primary objective:** Build a simple product with a credible reason to return each month.  
**Operating constraint:** Keep support, infrastructure, and maintenance costs low.

## Positioning

InvoiceForge helps freelancers, consultants, contractors, and small service businesses create clear invoices and follow up professionally on unpaid work. The product helps users make follow-up more consistent; it does not guarantee that clients will pay sooner.

**Core promise:** Send clearer invoices. Follow up confidently. Spend less time chasing payment.

## Product principles

1. Prioritize the unpaid-invoice workflow over unrelated general-purpose utilities.
2. Keep invoice creation free as an acquisition path.
3. Favor browser-based, local-first features before adding accounts, databases, email delivery, or payment collection on behalf of users.
4. Do not imply that invoices are emailed, stored in the cloud, or that customers' clients can pay through InvoiceForge unless those features are actually implemented and tested.
5. Prove repeated use and willingness to pay before building a complex receivables platform.
6. PayPal remains the merchant settlement requirement, while eligible alternative checkout methods can be offered to InvoiceForge buyers.

## Pre-launch roadmap

### P0 — Launch safety and clarity

- Verify the production website, API routes, PayPal environment, order creation, capture, signed delivery, webhook behavior, and refund/support process.
- Do not accept real payments until end-to-end sandbox tests pass and production credentials/configuration are verified.
- Ensure checkout clearly distinguishes sandbox from production and never presents a sandbox purchase as a real purchase.
- Update site copy so the actual current limits are prominent: the invoice builder does not send invoices, collect client payments, or sync documents to the cloud.
- Fix the product story and offer mismatch before buying traffic.

### P1 — Build a useful get-paid-faster MVP with minimal infrastructure

- Keep the invoice builder free and improve invoice clarity: item/service, due date, payment instructions, invoice number, currency, and print/PDF output.
- Add a lightweight payment follow-up planner: choose due/overdue status and tone, then produce a ready-to-copy reminder.
- Provide a configurable follow-up sequence (upcoming due date, due date, overdue, final polite follow-up) with clear guidance to follow the user's agreement and local law.
- Add a simple invoice status / next-follow-up tracker saved in the user's browser only, with explicit privacy wording, export/print capability, and a warning that browser data may be lost if cleared or the device changes.
- Use local-first storage rather than an account/database at launch. Do not describe it as cloud backup or cross-device sync.
- Provide free samples and one complete useful free follow-up workflow to demonstrate value.

### P2 — Validate retention and willingness to pay

- Track privacy-conscious aggregate product events only after consent and a documented privacy approach; do not collect invoice/client contents.
- Interview early users and measure repeat visits, reminder-tool usage, and conversion.
- Test a paid plan only after users repeatedly use the tracker/reminder workflow and request ongoing value.
- Consider monthly and annual plans for a continuously maintained toolkit. Illustrative test prices: $5/month and $49/year; validate willingness to pay before making these permanent.
- Offer recurring value through saved reusable workflows, multiple client/invoice tracking, customizable reminder sequences, and regularly improved templates—not a paywall around a one-time static document.

### P3 — Only after demand is proven

- Optional accounts and encrypted cloud sync.
- Email sending or scheduled reminders, with deliverability, consent, unsubscribe, and abuse controls.
- Payment-link integrations or payment reconciliation.
- Integrations with accounting tools.
- Do not build these for the first launch: they add infrastructure, privacy, support, and reliability obligations.

## Existing features: retain, reposition, or defer

- **Free invoice builder:** retain. It is an acquisition tool, but is not differentiated enough to be the paid product on its own.
- **Purchase-type dropdown, quantity, unit price, tax, discount, currency, due date, and PDF printing:** retain and make payment terms/instructions clearer.
- **QR generator, percentage calculator, and text counter:** keep free if they are inexpensive to maintain, but move them below the invoice/payment workflow. They are not the main reason to subscribe.
- **Samples page:** retain and add a complete payment-follow-up sample flow.
- **Template Pack ($14.99 one-time):** rename/rebuild as a focused “Get-Paid-Faster Starter Kit” with a reminder sequence, payment request templates, payment-terms checklist, and simple tracker template. Keep it as an optional one-time purchase only if it offers real convenience; don't make it the primary recurring-revenue offer.
- **Lifetime Pro ($29 one-time):** stop positioning this as the main growth product. Lifetime access conflicts with a product whose ongoing value and maintenance should support recurring revenue. Before launch, either remove it from the primary offer lineup or clearly limit it to a one-time static resource bundle. Do not sell unlimited future software features for $29.
- **Current HTML resource delivery:** acceptable for validating demand, but not compelling as the long-term paid software experience. Do not imply native Word/Excel files are included when they are not.

## Recommended offer structure

1. **Free:** invoice creation, PDF printing, and a basic payment-reminder generator.
2. **Starter Kit — one-time purchase:** polished reminder scripts, a follow-up sequence, payment-terms checklist, and a spreadsheet-ready tracker template.
3. **InvoiceForge Plus — subscription, introduced after validation:** local-first invoice/follow-up tracking, reusable reminder workflows, multiple client records, export/backup, and ongoing improvements. Start with a modest price test rather than treating suggested prices as established market facts.

Avoid a subscription before the product provides recurring utility. A recurring payment for a static bundle is a weak proposition and likely to cause cancellations or dissatisfaction.

## Pre-launch decision gates

- **Gate A: Reliability.** Real production API paths work; sandbox payment and fulfillment pass end-to-end; support and refund process are clear.
- **Gate B: Honest offer.** Product names, prices, formats, access limits, and capabilities match the actual implementation.
- **Gate C: Useful core loop.** A user can create an invoice, identify its payment terms, choose a follow-up stage, and copy an appropriate message without confusion.
- **Gate D: Demand.** Early users return to use the reminder/tracker workflow before recurring billing is launched.

## Success measures

- Activation: visitor creates or prints an invoice or reminder.
- Core value: user completes a payment follow-up workflow.
- Retention: users return to update status or prepare another follow-up.
- Monetization: starter-kit conversion, then subscription conversion and cancellation reasons.
- Reliability: checkout success, fulfillment success, and support incidents.

The first launch should optimize for a trustworthy, useful, repeatable workflow—not for the largest possible feature count.
