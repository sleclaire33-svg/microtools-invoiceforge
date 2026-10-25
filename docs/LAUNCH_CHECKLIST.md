# Micro Tools Studio launch checklist

Checked 25 October 2026. The revised Lemon Squeezy catalog is published. Test payments and live zero-dollar file delivery passed; real paid settlement/refund remain separate checks.

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
7. PUBLISHED through PR #21 on 25 October: explicit per-product live Lemon Squeezy links, format confirmation, tax/receipt guidance and purchase recovery instructions. Hosted checkout does not enable direct PayPal production. Existing direct order recovery is preserved. All 36 automated tests pass.
8. Direct PayPal remains a separate legacy/test path. No production credentials, webhook or live gate were changed. Lemon Squeezy is the current kit payment/delivery path; PayPal remains the selected merchant payout method.
9. DONE for desktop purchase mapping and recovery: all five production routes verified. Local responsive checks were performed earlier; a fresh physical mobile-device check remains unverified.
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

## Publication update

Owner renewed Vercel access and requested continuation. PR #21 merged to main as 4205ae10bc74195a5b68198329ae7a649e860df4. Production deployment dpl_8aiVhrSFrzJ422GcSAcrERtiXxzR is READY and assigned to www.microtoolsstudio.com and microtoolsstudio.com. The homepage now reports digital kits available. InvoiceForge and CertPai live purchase routes checked in the browser. Follow-up copy cleanup corrects old 24-hour/no-email language and clarifies payment methods. All five product pages were followed through order review to the matching live Lemon Squeezy checkout: InvoiceForge $19, CertPai $15, SiteIntellect $19, ClaimProof $9, Agency OS $39. No test-mode banner appeared. Purchase recovery opened the secure email sign-in page. Production error/fatal log checks found no matching entries. Follow-up copy release PR #22 deployed successfully as 978a8107c93259f5e3694a871920cc2c89413e04 (Vercel dpl_BhpsTXVbL8nXu4iF6Ha2LStGbjoY). Final support navigation and purchase-label cleanup is included with this checkpoint.


## Final verification pass — 25 October 2026

- Main-site release PR #23 is deployed as d63ad590b4fb894bf67fe83f18e5d25b42ce1832 (Vercel dpl_FyCzZxHbA73HXDEMjmzmpTKbxho3). Support opens the full catalog and product purchase labels are explicit.
- Static audit: 20 public HTML pages, 659 local resource/navigation references, no missing files or fragment targets.
- All five XLSX companions opened and exported in LibreOffice Calc without formula errors in the resulting values. Source/customer files unchanged. This is not an Excel/Numbers test or full visual certification.
- 30 additional Artifact Tool input/boundary assertions passed across all five companions: payment balance/overpayment/duplicates; renewal date bands and missing/invalid dates; evidence matching; manual QA findings; project deposit/scope/assets prerequisites. See WORKBOOK_VERIFICATION_20261025.json. Temporary in-memory changes only.
- Public DNS rechecked: MX only smtp.google.com; SPF contains Google and Cloudflare; Google DKIM key exists. _dmarc returned NXDOMAIN. Cloudflare access is still needed to publish the monitoring record above.
- Recent Vercel production error/fatal query (15-minute window) returned no matching entries. A larger query exceeded plan retention; this is not proof of continuous monitoring.
- Lemon Squeezy merchant session expired while opening the sandbox refund workflow. Secure sign-in refresh is needed before that test. No refund or real charge was performed.
- Native Excel/Numbers, real paid settlement/refund, actual merchant payout, physical-device review, campaign publication and customer demand remain unverified. Do not mark these done based on simulated or $0 orders.

### Remaining account actions

1. Refresh the existing Lemon Squeezy sign-in securely; retain the existing store/account and personal sign-in email.
2. In Cloudflare publish exactly one TXT record at _dmarc: `v=DMARC1; p=none; rua=mailto:sean@microtoolsstudio.com`. Recheck public DNS afterward. This monitoring policy does not reject customer mail.
3. Agree on a specific paid-test amount/tax limit and buyer payment method before charging real funds. Test a current product, confirm receipt/file, issue the approved refund, and verify its final state. Do not call a $0 order a paid test.
4. Open representative files in native Excel and Numbers if claiming support for those apps. Retain current compatibility disclosures until verified.
5. Publish only approved campaign posts/accounts. Keep spend at zero until the owner authorizes a budget; measure actual paid customer purchases separately from QA orders.
