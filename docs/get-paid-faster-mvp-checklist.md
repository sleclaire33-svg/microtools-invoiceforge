# Get-Paid-Faster MVP: Pre-launch Checklist

This checklist reflects the product direction in the get-paid-faster strategy. It distinguishes code that has been added from tasks that require production verification.

## Implemented in the MVP branch

- [x] Reposition homepage around invoices and payment follow-up.
- [x] Add a dedicated payment follow-up page.
- [x] Generate reminder copy for due-soon, due-today, overdue, and final-follow-up stages.
- [x] Offer friendly, professional, and firm-but-polite tones.
- [x] Keep a user-managed invoice list in browser local storage.
- [x] Let users mark records paid or overdue, edit, delete, and draft reminders.
- [x] Export and import a JSON backup.
- [x] Explain that records are local to the browser, can be lost, and are not uploaded to the service.
- [x] Make clear that reminders are drafted only and are not automatically emailed or verified against payment records.

## Required validation before merge/release

- [ ] Run HTML and JavaScript syntax checks and test the page on desktop and mobile.
- [ ] Test add/edit/delete, status changes, reminder text for every stage/tone, copy behavior, export/import, and empty/invalid data handling.
- [ ] Verify local storage quota/error behavior and browser privacy limitations.
- [ ] Check keyboard navigation, visible focus, form labels, screen-reader status updates, and color contrast.
- [ ] Verify that homepage links and navigation work.
- [ ] Verify the production API config and API routes. The prior production 404 must be resolved independently of deploy-preview behavior; a forced rewrite was added to the API redirects, but production verification is still required.
- [ ] Complete a full PayPal Sandbox purchase, capture, signed delivery, webhook, and failure/retry test before accepting real money.
- [ ] Confirm legal pages, support contact, refund handling, and privacy wording accurately describe local storage and the actual product. Legal copy has been updated in this branch; review the final wording before launch.
- [ ] Do not introduce subscription billing until repeated use and willingness to pay have been validated.

## Pricing and offers

- Keep the current paid resources clearly described as one-time static resources until their contents and fulfillment are deliberately updated.
- Do not sell the current $29 Lifetime Pro as lifetime access to future software features.
- Test a recurring plan only after users repeatedly use the tracker/reminder workflow and the paid plan provides ongoing value.
