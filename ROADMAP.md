# Micro Tools Studio — Product Portfolio Roadmap

## North-star strategy
Build Micro Tools Studio as the umbrella brand, with InvoiceForge as the first product. Prioritize practical, browser-first tools that share a reusable design and can be sold individually or in honest, coherent bundles. Keep operating costs low and avoid adding paid infrastructure until validated demand requires it.

## Work sequence

### Stage 1 — Stabilize and validate the current product
- [ ] Fix and verify the root homepage route on the Netlify production URL.
- [ ] Feature the Quote & Scope Builder, Freelance Rate Calculator, and Client Kickoff Builder on the homepage.
- [ ] Verify all tools work on mobile and desktop and provide clear copy/print feedback.
- [ ] Complete Lemon Squeezy Test-mode checkout, cancellation/error, receipt/file delivery, webhook-signature, duplicate-event, and refund tests.
- [ ] Do not enable live payments until the user explicitly approves and the test checklist passes.
- [ ] Make product limits, digital delivery, refund terms, and support contact clear.

### Stage 2 — Create a reusable app and portfolio framework
- [ ] Standardize tool cards, tool page layout, navigation, accessibility, responsive styling, and error states.
- [ ] Establish a consistent niche landing-page and bundle-page template.
- [ ] Add related-tool links and bundle cross-links without intrusive upselling.
- [ ] Reuse shared utilities and server-side payment/fulfillment logic; never trust client-submitted prices.
- [ ] Keep each tool useful without an account where feasible.

### Stage 3 — Build the five refined companion products
Detailed MVP requirements and acceptance checks are in [`docs/FIVE_COMPANION_PRODUCTS.md`](docs/FIVE_COMPANION_PRODUCTS.md).

Priority order after InvoiceForge passes its launch gates:
1. Client Website QA & Accessibility Report Builder — directly complements the existing freelancer tools.
2. AI & Software Subscription Cost Optimizer — calculations and editable comparisons with minimal integration burden.
3. Tutor Lesson Follow-Up & Progress Report Builder — turns one lesson record into several editable outputs.
4. New-Hire Onboarding Plan Builder — generates editable onboarding timelines and checklists.
5. Rental Turnover & Inspection Report Builder — produces room-by-room reports with optional photos and cost estimates.

Build one at a time, test it, and validate demand before proceeding. These are product candidates, not revenue forecasts. Project Profitability Calculator, Retainer Pricing Planner, and Service Estimate Builder remain additional freelancer/service-business candidates for later prioritization.

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
- Keep Lemon Squeezy in Test mode until explicit authorization to go live.
- Avoid new recurring infrastructure costs unless they solve a demonstrated need.

## Immediate next actions
1. Verify the live homepage and deployment behavior; root-route issue remains unverified.
2. Integrate Lemon Squeezy hosted checkout, then complete Test-mode purchase, receipt/file delivery, webhook, and refund tests.
3. Verify the homepage featured-tools section is live and each link opens the intended tool.
4. Complete security, mobile, accessibility, legal/support, and product-delivery checks.
5. Start the Website QA & Accessibility Report Builder as the first companion product only after the launch gates pass.
