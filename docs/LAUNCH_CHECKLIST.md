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

Use only PayPal Sandbox buyer credentials and test products. Do not use a live buyer account or live payment credentials for this test.

- [ ] Config endpoint reports `environment: sandbox` and `checkoutReady: true`.
- [ ] Checkout initializes without JavaScript console errors.
- [ ] Each paid product creates a PayPal Sandbox order at the expected fixed server-side price.
- [ ] Buyer cancellation returns to the page and no purchase is reported as complete.
- [ ] A successful Sandbox approval is captured server-side.
- [ ] Capture rejects a mismatched product, amount, or currency.
- [ ] Successful capture produces a signed, time-limited download URL and the correct resource opens.
- [ ] Expired or tampered download signatures are rejected.
- [ ] Failed capture and temporary service errors show clear messages and do not falsely report success.
- [ ] A duplicate/retry after capture does not falsely charge or report failure when the order is already completed.
- [ ] A test webhook is verified against the configured Sandbox webhook ID; invalid signatures are rejected.
- [ ] Support email and order-ID guidance work.

## 4. Content and trust

- [ ] Product descriptions match the files actually delivered.
- [ ] One-time prices, exact bundle contents, delivery method, refund terms, privacy policy, terms, and support contact are visible.
- [ ] No planned app or unbuilt feature is presented as available.
- [ ] No tax/legal/accounting guarantee or accessibility-compliance guarantee is made.
- [ ] No secrets appear in browser assets, repository files, logs, or public documentation.

## 5. Production gate — requires explicit owner approval

Do not switch `PAYPAL_ENV` to `production` or add production credentials until:
- All Sandbox checks above pass.
- Production PayPal webhook is created and its webhook ID is configured in Netlify.
- Production credentials and fulfillment signing secret are checked in Netlify without sharing them in chat.
- Production product descriptions, refund terms, delivery, and support flow are reviewed.
- The owner explicitly authorizes the live-payment switch.
- A low-risk live transaction and refund procedure are planned and approved.

## Known verification boundary

Repository/static checks can verify source structure, duplicate IDs, local links, and JavaScript syntax. They cannot prove the current Netlify deployment, PayPal account settings, live webhook configuration, or a successful Sandbox transaction. Those require the deployed site and PayPal Sandbox test.
