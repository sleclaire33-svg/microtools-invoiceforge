# InvoiceForge launch checklist

This checklist intentionally keeps payment credentials out of GitHub. Enter all secrets directly in Netlify's project configuration.

## Current deployment

- Site: https://invoiceforge.netlify.app/
- Repository: https://github.com/sleclaire33-svg/microtools-invoiceforge
- Deploy branch: `main`
- Netlify publish directory: `public`
- Payment currency: USD
- Current environment should remain `sandbox` until the complete test flow passes.

## Netlify environment variables

Open **Netlify → microtools-invoiceforge → Project configuration → Environment variables**.

Set these values for the **Production** deploy context. Make sure runtime functions can read them (scope includes **Functions**, or use **All scopes**):

| Variable | Required value |
| --- | --- |
| `PAYPAL_CLIENT_ID` | PayPal **Sandbox** app client ID while testing |
| `PAYPAL_CLIENT_SECRET` | Matching PayPal **Sandbox** app secret |
| `PAYPAL_ENV` | `sandbox` during testing |
| `PAYPAL_CURRENCY` | `USD` |
| `FULFILLMENT_SIGNING_SECRET` | A randomly generated secret of at least 32 bytes; store it in a password manager |
| `PAYPAL_WEBHOOK_ID` | Webhook ID created in the same PayPal environment |

Never put any secret in this repository, a public issue, a screenshot, or a chat message. The client ID is designed to be public; the client secret and fulfillment signing secret are not.

After changing environment variables, trigger a fresh Netlify deploy so the Functions runtime uses the updated values.

## Sandbox end-to-end test

1. In PayPal Developer Dashboard, select **Sandbox** and create/use a sandbox business account plus a sandbox personal buyer account.
2. Ensure the sandbox app's client ID and secret match the Netlify Production-context values above.
3. Create a webhook for `https://invoiceforge.netlify.app/api/webhook`; save its webhook ID as `PAYPAL_WEBHOOK_ID`.
4. Subscribe at minimum to capture-completed, capture-denied, and capture-refunded events available for the app.
5. Confirm `https://invoiceforge.netlify.app/api/config` reports `checkoutReady: true`, `environment: "sandbox"`, and `webhookConfigured: true`. It must never return a server secret.
6. Use a sandbox buyer to purchase the $14.99 Template Pack.
7. Verify the order is captured in the sandbox business account and the returned purchase link opens the template page.
8. Repeat for the $29 Lifetime Pro.
9. Verify cancellation does not show a successful purchase; a forged or expired download URL returns HTTP 403.
10. Review Netlify function logs and GitHub Actions. Resolve any errors before switching environments.

Sandbox transactions are simulated; they do not deposit real money.

## Production launch

Do this only after all sandbox tests pass and the PayPal business account is eligible for the required payment methods:

1. Create/select the **Live** PayPal app and set the matching live client ID and secret in Netlify's Production context.
2. Register a Live webhook for `https://invoiceforge.netlify.app/api/webhook` and replace `PAYPAL_WEBHOOK_ID` with the Live webhook ID.
3. Set `PAYPAL_ENV=production`, retain `PAYPAL_CURRENCY=USD`, and retain the strong fulfillment signing secret.
4. Redeploy and confirm the config endpoint reports `environment: "production"` and `checkoutReady: true`.
5. Test with a small real transaction, verify capture and download, then refund the test purchase if appropriate.
6. Confirm the real payment appears in the intended PayPal account and that the webhook is verified.
7. Only then announce the paid products publicly.

## Items that still require the owner

- Supply and configure the secret values inside Netlify. The assistant must not receive or invent account credentials.
- Complete PayPal sandbox/live account onboarding and merchant eligibility checks.
- Choose and clear the final brand name before buying a custom domain or replacing the current public identity.
- Provide the legal business identity/jurisdiction if it must appear in the site's legal disclosures.
- Review the live site on mobile and desktop, including the actual checkout flow.

## Known launch boundaries

- Checkout and fulfillment do not yet provide customer accounts, saved purchase history, or a database-backed order ledger.
- The webhook currently verifies incoming PayPal webhook signatures and logs verified events; it is not a full accounting/reconciliation dashboard.
- Apple Pay and Google Pay require their own wallet setup and eligibility flow; they should not be advertised as guaranteed until tested for the live merchant account.
- Revenue is not guaranteed. Launch readiness means the purchase path is verified, not that sales or passive income are assured.
