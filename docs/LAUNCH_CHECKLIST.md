# InvoiceForge Launch Checklist

**Current release status:** Not approved for live payments. Keep PayPal in Sandbox until all required tests pass and the owner explicitly approves production activation.

## 1. Deployment and homepage

- [ ] Netlify deployment succeeds from the current `main` branch.
- [ ] `https://microtools-invoiceforge.netlify.app/` opens the homepage (root redirect was added; verify after deploy).
- [ ] `/index.html`, `/tools.html`, `/follow-up.html`, `/samples.html`, `/privacy.html`, `/terms.html`, and `/refunds.html` load.
- [ ] Homepage cards open the correct Quote & Scope, Rate Calculator, and Kickoff tabs.
- [ ] Desktop and mobile layouts are readable and controls are keyboard accessible.

## 2. Browser tools

- [ ] Invoice builder updates live while typing.
- [ ] Purchase-type selector updates the item description; “Other / custom” permits custom text.
- [ ] Quantity, unit price, discount, tax, and currency preview are checked against known examples.
- [ ] Print / Save PDF produces a legible invoice without navigation or form controls.
- [ ] Follow-up tracker add/edit/delete/export/import behavior is checked; users understand data is browser-local.
- [ ] QR generator explains that the entered text/URL is sent to an external QR service.
- [ ] Quote, rate, and kickoff tools produce sensible output for valid, empty, and invalid inputs.

## 3. Sandbox checkout and delivery

Use only Lemon Squeezy Test mode and test products. Do not use live payment credentials or real card details for testing.

- [ ] Test-mode products and checkout URLs are configured and match the expected product/variant IDs.
- [ ] Hosted checkout opens and completes without JavaScript console errors.
- [ ] Each paid product opens the correct Lemon Squeezy Test-mode checkout at the configured price.
- [ ] Buyer cancellation returns to the page and no purchase is reported as complete.
- [ ] A successful Test-mode purchase appears as paid in the Lemon Squeezy dashboard.
- [ ] Capture rejects a mismatched product, amount, or currency.
- [ ] The customer receives the correct receipt and access to the correct product file.
- [ ] Webhook signature validation rejects tampered payloads.
- [ ] Failed capture and temporary service errors show clear messages and do not falsely report success.
- [ ] A duplicate/retry after capture does not falsely charge or report failure when the order is already completed.
- [ ] Test-mode webhooks are verified against the configured signing secret; invalid signatures are rejected.
- [ ] Support email and order-ID guidance work.

## 4. Content and trust

- [ ] Product descriptions match the files actually delivered.
- [ ] One-time prices, exact bundle contents, delivery method, refund terms, privacy policy, terms, and support contact are visible.
- [ ] No planned app or unbuilt feature is presented as available.
- [ ] No tax/legal/accounting guarantee or accessibility-compliance guarantee is made.
- [ ] No secrets appear in browser assets, repository files, logs, or public documentation.

## 5. Production gate — requires explicit owner approval

Do not switch Lemon Squeezy to Live mode or add live credentials until:
- All Sandbox checks above pass.
- Live-mode Lemon Squeezy webhook is created and its signing secret is configured in Netlify.
- Live-mode API key and webhook signing secret are configured in Netlify without sharing them in chat.
- Production product descriptions, refund terms, delivery, and support flow are reviewed.
- The owner explicitly authorizes the live-payment switch.
- A low-risk live transaction and refund procedure are planned and approved.

## Known verification boundary

Repository/static checks can verify source structure, duplicate IDs, local links, and JavaScript syntax. They cannot prove the current Netlify deployment, Lemon Squeezy account settings, live webhook configuration, or a successful Test-mode transaction. Those require the deployed site and PayPal Sandbox test.
