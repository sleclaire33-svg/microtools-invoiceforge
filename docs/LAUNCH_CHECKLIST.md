# Micro Tools Studio launch checklist

Checked 25 October 2026. The revised Lemon Squeezy catalog is published. Test payments and live zero-dollar file delivery passed; real paid settlement/refund and main-site deployment verification remain separate checks.

## Completed

- Gmail activated for sean@microtoolsstudio.com; recovery email sleclaire33@gmail.com verified.
- Public MX points only to smtp.google.com. SPF and Google DKIM published. Actual messages delivered in both directions; return message passed SPF and DKIM.
- Existing Lemon Squeezy account/store recovered using the personal Google sign-in. No duplicate account created.
- Store support email changed to the business mailbox. Revised logo, favicon, store introduction, preview/support links, cream background and green headings/links published. Empty header and subscription form hidden.
- Five revised products published with cover images and v3 ZIPs. Prices, Software category and attachments verified after saving.
- Each product includes contents, audience, limitations, setup requirements, license scope, preview and support details.
- Each product has confirmation/receipt instructions to download, extract and open START_HERE.html, with support and backup guidance.
- Release ZIP integrity, file counts and hashes checked on 25 October.
- Live Lemon Squeezy Orders page showed no customer orders before testing.
- On 25 October, the existing $1 Test Product correctly rejected the insufficient-funds test card, then accepted the success test card. Test order #4956972 shows Paid in both merchant and buyer views; receipt and seller notification arrived in the personal inbox. No real funds charged. This does not validate the five new kit checkouts or actual ZIP delivery.

## Published catalog

| Product | USD, one-time | Lemon Squeezy product ID |
|---|---:|---|
| InvoiceForge Complete Kit | 19 | 1470398 |
| Agency OS Workflow Kit | 39 | 1470404 |
| CertPai Renewal Kit | 15 | 1470417 |
| SiteIntellect Website Review Kit | 19 | 1470420 |
| ClaimProof Warranty Records Kit | 9 | 1470422 |

All five are published with current covers and v3 files. The four obsolete offers are now Draft (unpublished), including the $750 Agency OS offer. No products or historical files were deleted.

## Remaining launch gates

1. DONE 25 October: tax information shows Submitted; PayPal is connected and selected as the default payout method after the owner completed setup. This verifies the saved configuration, not receipt of a future payout.
2. DONE: keep sleclaire33@gmail.com as the Lemon Squeezy sign-in email, per owner decision. Customer-facing support stays sean@microtoolsstudio.com. Do not retry account migration.
3. Add monitoring DMARC in the owner's local Cloudflare session: TXT `_dmarc`, value `v=DMARC1; p=none; rua=mailto:sean@microtoolsstudio.com`. Verify publicly after saving. Last check found no DMARC. Do not blindly disable Cloudflare Email Routing: it can delete managed SPF/DKIM records even after edits.
4. DONE: all five test-mode purchases passed, with matching confirmations, receipt emails and file attachments. Orders #4956973–4956977 in test mode. InvoiceForge test download correctly reported that downloads are disabled in test mode.
5. Approve a concrete low-value live purchase and refund procedure before charging any real payment method. Verify product, final price/tax, receipt, order and actual ZIP delivery. No live purchase test has completed.
6. DONE: new catalog published, all four obsolete listings unpublished. Storefront verified to show only the five current kits. Legacy files and products retained; historical entitlement access was not exercised because no earlier paid customer orders were observed.
7. IMPLEMENTED, deployment verification pending: explicit per-product live Lemon Squeezy links, format confirmation, tax/receipt guidance and purchase recovery instructions. Hosted checkout does not enable direct PayPal production. Existing direct order recovery is preserved. All 36 automated tests pass.
8. Direct PayPal remains a separate legacy/test path. No production credentials, webhook or live gate were changed. Lemon Squeezy is the current kit payment/delivery path; PayPal remains the selected merchant payout method.
9. Recheck mobile/desktop navigation, checkout mapping, receipt links, terms/refunds/privacy, support and download recovery after the live switch.
10. Release the prepared campaign after payment and delivery pass. Measure visits, checkout starts, sales, refunds and support effort before increasing spend.

## Verification boundaries

- On 24 October, project checks reported 33 passing tests, 20 matching public pages and four verified brand assets. InvoiceForge and Agency OS PayPal sandbox purchase/download flows passed then. These do not prove live Lemon Squeezy delivery.
- Google Sheets calculation checks passed; native Excel and Numbers checks remain pending and are disclosed in the product listings.
- No revenue, compliance or claim-outcome guarantees should be made.
- Hosting is Vercel at https://www.microtoolsstudio.com/. Earlier Netlify migration notes are historical.

## Live delivery verification — 25 October 2026

Private 100% QA discount restricted to the five kits and five total redemptions. All five redemptions completed; discount returned to Draft afterward. No card charged. These are QA orders with $0 revenue, not customer sales or evidence of paid settlement. Live and test order numbers overlap, so always specify the mode.

| Kit | Test order | Live $0 QA order | Download bytes | Result |
|---|---|---|---:|---|
| InvoiceForge | 4956973 | 4956971 | 57547 | Exact release match; ZIP integrity passed |
| Agency OS | 4956974 | 4956972 | 41619 | Exact release match; ZIP integrity passed |
| CertPai | 4956975 | 4956973 | 39282 | Exact release match; ZIP integrity passed |
| SiteIntellect | 4956976 | 4956974 | 40932 | Exact release match; ZIP integrity passed |
| ClaimProof | 4956977 | 4956975 | 42230 | Exact release match; ZIP integrity passed |

All five live receipts arrived in the signed-in owner's personal inbox and contain START_HERE.html instructions, order access, and the business support email. InvoiceForge's first browser transfer returned a missing file path; one retry downloaded the exact release successfully. Other four transfers passed directly.

Main-site source changes include checkout routing and support/privacy/payment copy. Tests: 36 passed, build completed, diff whitespace check passed. Vercel connector reported missing team authorization. Automatic approval review rejected a direct push to main because it could trigger production deployment. Source is being prepared on release/lemonsqueezy-checkout-20261025 for review; main-site publication still needs explicit approval and deployment verification. The shell Git push to the review branch also lacked credentials; use the connected GitHub service for that branch, never bypass the main-branch approval.
