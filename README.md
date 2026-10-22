# Micro Tools Studio

Micro Tools Studio is the umbrella storefront for five focused downloadable workflow kits. The revised presentation is published at https://www.microtoolsstudio.com/. The deployed checkout is in sandbox; the five complete kits remain unavailable until secure delivery is configured and the buyer flow is verified.

## Current complete kits

| Product key | Product | Price (USD, one time) |
| --- | --- | --- |
| invoiceforge_complete | InvoiceForge Complete Kit | 19.00 |
| certpai_complete | CertPai Complete Kit | 15.00 |
| siteintellect_complete | SiteIntellect Complete Kit | 19.00 |
| claimproof_complete | ClaimProof Complete Kit | 9.00 |
| agencyos_complete | Agency OS Workflow Kit | 39.00 |

Each ZIP includes a standalone browser workspace, an XLSX tracker, a fillable PDF, editable text and a quick-start guide. InvoiceForge also includes twelve client communication templates. Browser workspaces support up to 1,000 records and JSON backup/import; spreadsheet companions have 100 prepared rows. The formats do not synchronize. Core calculations were checked in native Google Sheets for all five spreadsheet companions. Native Excel and Numbers compatibility remains unverified. Agency OS uses HTML/text playbooks instead of a fillable PDF and includes linked project/change records and saved onboarding drafts.

Legacy HTML-resource product keys and prices remain supported for existing links. New storefront pages promote the complete kits. Do not represent a legacy lifetime-access label as a future software entitlement.

## Local work

- `npm run dev` starts the local static/API preview on port 4173.
- `npm run build` synchronizes root pages, CSS, JS and assets into public/.
- `npm test` runs the 33 API, delivery and product-calculation checks.
- Root pages are the source for edits; public/ is the deployed static output.
- Do not commit public/__qa/ or environment secrets.

The offline workspace builder and original companion files are preserved in the owner's Micro_Tools_Studio_v3_Complete_Release.zip. Paid plaintext files are deliberately outside this repository.

## Payment and delivery behavior

PayPal v6 eligibility determines the displayed PayPal, card, Venmo and Pay Later methods. Eligibility depends on merchant, buyer and device; there is no claim that every buyer sees every method. Apple Pay and Google Pay are not implemented in this release.

The server owns product prices. New ZIP orders use a signed order token. Capture verifies product, exact USD amount and completed payment before returning a signed download link lasting 24 hours. The checkout saves a pending order in session storage and offers a status check before another payment attempt. A completed order can save its details locally. Customer email delivery and a persistent account portal are not configured.

Releases are AES-256-GCM encrypted in private-downloads/. The server checks byte count and SHA-256 before allowing a kit purchase. `scripts/package-encrypted-downloads.js /absolute/path/to/release-zips` packages the five customer ZIPs and writes manifests. Its key is generated in ignored .env.downloads.local; store the value only in protected host environment settings. Never place paid plaintext ZIPs in public/.

## Environment and hosting

See .env.example for variable names. PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, FULFILLMENT_SIGNING_SECRET and MTS_DOWNLOAD_KEY are needed for complete-kit checkout. Use PAYPAL_ENV=sandbox and PAYPAL_CURRENCY=USD. The optional INVOICEFORGE_COMPLETE_BASE64 migration value only supports InvoiceForge and is not the preferred release mechanism.

Production order creation requires PAYPAL_WEBHOOK_ID and explicit CHECKOUT_LIVE_ENABLED=true. Never enable live payments merely because a deployment passed. Webhook verification currently logs verified events; it does not provide durable order storage or automatic email recovery.

Vercel uses vercel.json and public/. Netlify uses netlify.toml and API adapters in netlify/functions/. Both package encrypted release files as server-only assets. The live domain and Git-based deployment were verified on 22 October 2026. Automatic approval review blocked transmitting MTS_DOWNLOAD_KEY to the production Vercel project. Configuration is not confirmed; explicit permission for this named key and destination is required before attempting it again. Do not bypass the block.

## Validation and remaining gates

All 33 local tests pass. Five actual encrypted releases were decrypted and matched to their manifests. ZIP integrity and local static references passed. Hands-on Chromium checks covered the storefront, free invoice calculator, the four workspace examples, backup exports, InvoiceForge backup restore and 390px responsive layouts.

Before live sales:
1. Confirm the selling route. Lemon Squeezy is the preferred hosted delivery candidate for lower maintenance; its legacy listings are not yet updated or integrated with the five kits.
2. Configure protected release delivery in the chosen route.
3. Complete an actual buyer sandbox purchase, download, cancellation/retry and refund check. Automated fixtures do not replace this check.
4. Confirm account-specific merchant, payout and tax setup; automatic tax calculation is not implemented in direct PayPal checkout.
5. Obtain the owner's explicit live-payment approval.

No real payment was taken. Social materials are drafts and have not been posted. No sales, customer validation or profitable acquisition channel is claimed.

## Brand and legal setup

- Working public brand: **Micro Tools Studio**.
- Product name: **InvoiceForge** (write as “Invoice Forge” in explanatory copy when helpful; keep existing technical identifiers and URLs unchanged for launch).
- Operating plan: start as a sole proprietor to minimize startup costs, subject to confirming applicable Washington licensing, trade-name, local, and tax requirements.
- Name screening is preliminary, not legal clearance. Do not claim trademark availability or register/file a trademark until federal, Washington, marketplace, and common-law searches have been reviewed.
- Do not use “Micro Tools Studio” as a verified legal entity name. A sole proprietor’s legal identity and any required trade-name registration are separate.


No payment or hosting secret should be pasted into chat or committed to GitHub.
