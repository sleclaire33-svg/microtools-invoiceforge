# Lemon Squeezy checkout migration — current status

Updated 25 October 2026. The earlier two-offer migration plan is superseded.

The five current kits use verified public Lemon Squeezy checkout links in `api/_hosted-checkouts.js`. Their v3 ZIPs are attached to the published live products. Lemon Squeezy handles payment, receipt emails and file delivery; no custom Lemon Squeezy API key or fulfillment webhook is required by this integration. Direct PayPal remains separate for legacy/test workflows, with its production safeguards unchanged.

| Product | USD, one-time |
|---|---:|
| InvoiceForge Complete Kit | 19 |
| Agency OS Workflow Kit | 39 |
| CertPai Renewal Kit | 15 |
| SiteIntellect Website Review Kit | 19 |
| ClaimProof Warranty Records Kit | 9 |

All five test purchases passed. All five separate live $0 QA orders delivered exact matching ZIPs and receipt emails. The private five-use QA discount is now Draft. No real card was charged; paid settlement and refund processing remain unverified. See `LAUNCH_CHECKLIST.md` for order IDs and verification boundaries.

Customers recover purchases at https://app.lemonsqueezy.com/my-orders using their purchase email. No product or historical file was deleted when the four obsolete listings were unpublished.

Main-site integration published through PR #21, production commit 4205ae10bc74195a5b68198329ae7a649e860df4. Vercel deployment dpl_8aiVhrSFrzJ422GcSAcrERtiXxzR reached READY and was assigned to both microtoolsstudio.com domains. Follow-up copy cleanup removes obsolete delivery wording.
