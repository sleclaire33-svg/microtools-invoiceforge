// Preserve existing purchase keys and prices; all checkout handlers share this catalogue.
const PRODUCTS = Object.freeze(Object.assign(Object.create(null), {
  invoiceforge_complete: Object.freeze({amount: '29.00', description: 'InvoiceForge Complete Kit', format: 'zip', inclusions: Object.freeze(["Browser payment workspace, follow-ups, backup and export", "100-row XLSX payment tracker", "Eight-page fillable workbook", "Editable records and 12 client templates", "Visual quick-start guide"])}),
  certpai_complete: Object.freeze({amount: '19.00', description: 'Cert Pai Complete Kit', format: 'zip', inclusions: Object.freeze(["Standalone browser workspace with backup and export", "Browser renewal workspace with date bands", "Source verification kept separate from renewal timing", "100-row XLSX renewal tracker", "Eight-page fillable workbook and editable messages", "Visual quick-start guide"])}),
  siteintellect_complete: Object.freeze({amount: '29.00', description: 'Site Intellect Complete Kit', format: 'zip', inclusions: Object.freeze(["Standalone browser workspace with backup and export", "Browser finding log with retest requirements", "CSV and plain-text handoff report export", "XLSX tracker with 20 starting checks", "Eight-page fillable workbook and editable messages", "Visual quick-start guide"])}),
  claimproof_complete: Object.freeze({amount: '15.00', description: 'Claim Proof Complete Kit', format: 'zip', inclusions: Object.freeze(["Standalone browser workspace with backup and export", "Browser evidence register and submission selector", "Attachment index generated from selected records", "100-row XLSX register with cross-checked index", "Eight-page fillable workbook and editable messages", "Visual quick-start guide"])}),
  template_pack: Object.freeze({amount: '14.99', description: 'InvoiceForge Get-Paid-Faster Starter Kit'}),
  lifetime_pro: Object.freeze({amount: '29.00', description: 'InvoiceForge Workflow Resource Bundle'}),
  late_payment_kit: Object.freeze({amount: '9.99', description: 'Late-Payment Follow-Up Kit'}),
  proposal_toolkit: Object.freeze({amount: '14.99', description: 'Freelance Proposal Toolkit'}),
  cashflow_planner: Object.freeze({amount: '12.99', description: 'Small-Business Cash-Flow Planner'})
}));
module.exports = PRODUCTS;
