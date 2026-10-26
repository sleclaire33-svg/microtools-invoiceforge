# Native-device acceptance — pending device access

These checks have NOT been run on a physical phone, Microsoft Excel or Apple Numbers. Automated workbook checks, LibreOffice and browser viewport checks do not substitute for them. Keep current desktop/laptop recommendations and compatibility limitations.

## Phone: approximately five minutes

1. In the phone’s normal browser open https://www.microtoolsstudio.com/?qa=1 . Record phone model, OS and browser version.
2. Open All products, then each product. Confirm names, prices and purchase controls are readable without sideways scrolling or hidden content.
3. Open InvoiceForge preview. Change the example receipts and check that the remaining balance changes. Rotate the phone; check controls and labels remain accessible.
4. Open its order-review page. Try continuing without the format checkbox: a readable prompt should appear. Check it and continue to Lemon Squeezy. Confirm InvoiceForge Complete Kit and $19 USD before applicable tax. Stop before payment; no real-card self-purchase is needed.
5. Use the existing QA receipt to download the purchased ZIP. Confirm it saves and can be extracted in Files. Do not assume downloaded HTML workspaces function in a phone file preview; desktop/laptop remains recommended.
6. Open Support, select another product and verify that the catalog opens. Confirm the support email draft is addressed to sean@microtoolsstudio.com; do not send a test containing customer data.

Record pass/fail for each step and a screenshot for any failure. A mobile website pass does not certify downloaded workspaces for mobile use.

## Excel and Numbers: run separately in each installed app

Use fresh copies from the actual current v4 customer release ZIPs. Record app version and operating system. Never overwrite the release originals. Older v3 test-mode attachments are not proof of the live release's compatibility.

Files: InvoiceForge_Working_Tool_v2.xlsx; Agency_OS_Project_Workflow_v2.xlsx; CertPai_Working_Tool_v2.xlsx; SiteIntellect_Working_Tool_v2.xlsx; ClaimProof_Working_Tool_v2.xlsx.

For EACH file: open without a repair warning; inspect input labels and instructions; check dropdowns and date/currency formatting; edit an example input; verify recalculation; save a copy; close/reopen; verify the value persists; preview a print/PDF export for clipping. In Numbers also record any import or unsupported-feature warnings and export an XLSX copy for reopening.

Specific checks:
- InvoiceForge: record a fictional invoice of 120 and received payment of 50: remaining balance should be 70. Change received to 100: remaining should be 20. Record an overpayment: ensure it is identified rather than silently becoming an amount to chase.
- Agency OS: fictional project fee 1000, required deposit 50%, received 200: remaining deposit should be 300. Check that missing scope/assets still prevent a ready-for-kickoff status.
- CertPai: use the workbook’s review date. Try expiry yesterday, today and 30/31 days ahead; verify date bands against the workbook’s documented rules. A blank date must not imply verification or a safe renewal status.
- SiteIntellect: enter an open finding, then record retest evidence and update its status; confirm the summary follows the status and does not certify automated testing.
- ClaimProof: add an evidence reference, then remove/mismatch it; confirm missing evidence is flagged. The file must not imply a submitted or approved claim.

Status matrix: all five files in Excel = UNVERIFIED; all five in Numbers = UNVERIFIED. Only change a cell to PASS after an observed native-app result. If an app is unavailable, retain UNVERIFIED and do not advertise confirmed compatibility.
