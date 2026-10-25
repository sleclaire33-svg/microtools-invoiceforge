# Micro Tools Studio

Micro Tools Studio is the umbrella storefront for five downloadable workflow kits at https://www.microtoolsstudio.com/. Current purchases use live Lemon Squeezy hosted checkout and file delivery. The direct PayPal implementation is retained as a separate sandbox/legacy path.

## Published catalog

| Product key | Product | USD, one time |
| --- | --- | ---: |
| invoiceforge_complete | InvoiceForge Complete Kit | 19.00 |
| certpai_complete | CertPai Renewal Kit | 15.00 |
| siteintellect_complete | SiteIntellect Website Review Kit | 19.00 |
| claimproof_complete | ClaimProof Warranty Records Kit | 9.00 |
| agencyos_complete | Agency OS Workflow Kit | 39.00 |

Each kit includes a standalone browser workspace, XLSX companion, editable records and START_HERE.html. Four kits include a fillable PDF; Agency OS instead includes HTML/text playbooks. InvoiceForge includes twelve client communication templates. Browser workspaces support up to 1,000 records with JSON backup/import; spreadsheet companions have 100 prepared rows. The formats do not synchronize. Native Excel and Numbers compatibility remains unverified and is disclosed before purchase.

## Current payment and delivery route

`api/_hosted-checkouts.js` contains the five public, product-specific Lemon Squeezy URLs. `api/config.js` exposes hosted checkout availability separately from direct PayPal readiness. The website validates the destination and requires format confirmation before redirecting. Lemon Squeezy displays available buyer payment methods, final totals and taxes, handles payment, delivers the uploaded ZIP, and provides receipt/order access. No Lemon Squeezy API key or custom fulfillment webhook is needed for this hosted route.

The existing Lemon Squeezy sign-in stays on the owner's personal account. Customer support uses sean@microtoolsstudio.com. Tax details were submitted and PayPal was verified as the selected merchant payout method. That is configuration evidence, not proof of an actual payout. See [migration notes](docs/LEMON_SQUEEZY_MIGRATION.md).

The four obsolete offers were unpublished, not deleted. Do not remove historical files or entitlements when updating products.

## Local development and deployment

- `npm run dev`: local static/API preview on port 4173.
- `npm run build`: synchronize root HTML/CSS/JS and assets into `public/`.
- `npm test`: 36 API, checkout, delivery and product-calculation checks.
- Root pages are the source; `public/` is the deployed static output. Existing robots.txt and sitemap.xml are in `public/`.
- Vercel project: microtools-invoiceforge. Production deploys from GitHub main to microtoolsstudio.com and www.microtoolsstudio.com.
- Netlify adapters are historical compatibility code, not the current production host.
- Do not commit `public/__qa/`, environment secrets or paid plaintext ZIPs.

Customer release sources are preserved in Micro_Tools_Studio_v3_Complete_Release.zip. Paid files are deliberately outside the public website repository.

## Retained direct PayPal implementation

Existing pending-order recovery remains supported. Its signed download links last 24 hours. Encrypted files in `private-downloads/` and the protected key belong to this separate implementation; they are not needed to deliver current Lemon Squeezy purchases.

Keep `PAYPAL_ENV=sandbox`. Do not change production credentials or enable `CHECKOUT_LIVE_ENABLED` as part of routine Lemon Squeezy maintenance. Direct production checkout needs its own approved credentials, webhook and verification. Its webhook currently logs verified events; it is not a durable accounting ledger or customer email system. See `.env.example` for variable names. Never transmit secrets into chat or source control.

## Verification

The current evidence and remaining steps are in [docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md). All five live product routes, sandbox purchases, actual $0 live ZIP deliveries and receipt emails passed. Those QA orders do not establish paid settlement, refunds, payouts or customer demand.

Google Sheets calculation checks passed previously. Additional 25 October checks opened all five XLSX files in LibreOffice without formula errors and passed 30 input/boundary assertions in Artifact Tool using temporary in-memory changes. Neither test substitutes for native Excel/Numbers verification. Customer files were not replaced by test copies.

Campaign materials are prepared but have not been posted. No customer sales, profitable acquisition channel, trademark clearance or legal compliance determination is claimed.

## Brand and legal setup

- Working public brand: **Micro Tools Studio**.
- Product name: **InvoiceForge** (write as “Invoice Forge” in explanatory copy when helpful; keep existing technical identifiers and URLs unchanged for launch).
- Operating plan: start as a sole proprietor to minimize startup costs, subject to confirming applicable Washington licensing, trade-name, local, and tax requirements.
- Name screening is preliminary, not legal clearance. Do not claim trademark availability or register/file a trademark until federal, Washington, marketplace, and common-law searches have been reviewed.
- Do not use “Micro Tools Studio” as a verified legal entity name. A sole proprietor’s legal identity and any required trade-name registration are separate.


No payment or hosting secret should be pasted into chat or committed to GitHub.
