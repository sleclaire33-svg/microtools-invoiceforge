# Micro Tools Studio — Product Portfolio Roadmap

## North-star strategy
Build Micro Tools Studio as the umbrella brand, with InvoiceForge as the first product. Prioritize practical, browser-first tools that share a reusable design and can be sold individually or in honest, coherent bundles. Keep operating costs low and avoid adding paid infrastructure until validated demand requires it.

## Work sequence

### Stage 1 — Stabilize and validate the current product
- [ ] Fix and verify the root homepage route on the Netlify production URL.
- [ ] Feature the Quote & Scope Builder, Freelance Rate Calculator, and Client Kickoff Builder on the homepage.
- [ ] Verify all tools work on mobile and desktop and provide clear copy/print feedback.
- [ ] Complete PayPal Sandbox checkout, cancellation/error, fulfillment, signed-link expiry, and webhook tests.
- [ ] Do not enable live payments until the user explicitly approves and the test checklist passes.
- [ ] Make product limits, digital delivery, refund terms, and support contact clear.

### Stage 2 — Create a reusable app and portfolio framework
- [ ] Standardize tool cards, tool page layout, navigation, accessibility, responsive styling, and error states.
- [ ] Establish a consistent niche landing-page and bundle-page template.
- [ ] Add related-tool links and bundle cross-links without intrusive upselling.
- [ ] Reuse shared utilities and server-side payment/fulfillment logic; never trust client-submitted prices.
- [ ] Keep each tool useful without an account where feasible.

### Stage 3 — Build the first companion apps
Priority order:
1. Project Profitability Calculator — estimate revenue, costs, time, and margin.
2. Retainer Pricing Planner — model monthly capacity, included hours, overage rates, and margin.
3. Service Estimate Builder — estimate labor/materials, markup, tax assumptions, and customer-facing totals.

Each app must be tested, clearly labeled as an estimate/planning aid where appropriate, and reviewed for calculation correctness before launch.

### Stage 4 — Assemble the first paid bundle
- [ ] Create a Freelancer Business Toolkit landing page.
- [ ] Bundle only features and resources that are already working and available.
- [ ] Show exact contents, previews, limitations, one-time price, delivery method, and support/refund information.
- [ ] Test the entire Sandbox purchase-to-delivery path before any live release.
- [ ] Test pricing with real customer feedback; do not assume revenue projections are forecasts.

### Stage 5 — Measure and grow
Track page visits, tool starts/completions, clicks to bundle pages, checkout starts, successful purchases, refunds/support issues, and customer feedback. Improve conversion and usefulness before significant advertising spend. Prepare organic content and small controlled campaigns only after checkout and delivery are verified.

### Stage 6 — Expand into adjacent niches
After the freelancer workflow is validated, prioritize:
- Service businesses: Job Cost & Profit Calculator, Appointment Preparation Checklist, Customer Follow-up Message Builder.
- Creators and solo marketers: Content Calendar Builder, Campaign Brief Builder, Sponsorship Rate Planner.
- Online sellers: Product Pricing & Margin Calculator, Digital Product Launch Checklist, Bundle Pricing Calculator.

Each niche should have a coherent set of free tools, paid resources, a landing page, and a bundle. Expand based on observed usage and demand rather than the number of apps built.

## Commercial guardrails
- Proposed test-price ranges are hypotheses, not proven optimal prices.
- Illustrative revenue calculations are not forecasts or guarantees.
- Do not sell planned features as if they already exist.
- Avoid subscriptions until ongoing recurring value exists.
- Do not expose credentials or secrets in client code, commits, logs, or support requests.
- Keep PayPal in Sandbox until explicit authorization to go live.
- Avoid new recurring infrastructure costs unless they solve a demonstrated need.

## Immediate next actions
1. Verify the live homepage and deployment behavior.
2. Validate Sandbox checkout and delivery.
3. Verify the homepage featured-tools section is live and each link opens the intended tool.
4. Begin Project Profitability Calculator only after launch blockers and test coverage are addressed.
