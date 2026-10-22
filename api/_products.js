// Preserve existing purchase keys and prices; all checkout handlers share this catalogue.
const PRODUCTS = Object.freeze(Object.assign(Object.create(null), {
  template_pack: Object.freeze({amount: '14.99', description: 'InvoiceForge Get-Paid-Faster Starter Kit'}),
  lifetime_pro: Object.freeze({amount: '29.00', description: 'InvoiceForge Workflow Resource Bundle'}),
  late_payment_kit: Object.freeze({amount: '9.99', description: 'Late-Payment Follow-Up Kit'}),
  proposal_toolkit: Object.freeze({amount: '14.99', description: 'Freelance Proposal Toolkit'}),
  cashflow_planner: Object.freeze({amount: '12.99', description: 'Small-Business Cash-Flow Planner'})
}));
module.exports = PRODUCTS;
