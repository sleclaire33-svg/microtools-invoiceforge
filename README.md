# MicroTools Hub + InvoiceForge

Hosted-first Vercel app with browser tools and PayPal Checkout.

## Products
- Free tools
- Template Pack — $14.99
- Lifetime Pro — $29

## Required Vercel environment variables
PAYPAL_CLIENT_ID
PAYPAL_CLIENT_SECRET
PAYPAL_ENV=sandbox or production
PAYPAL_CURRENCY=USD
PAYPAL_WEBHOOK_ID
FULFILLMENT_SIGNING_SECRET

Never commit PayPal secrets or the fulfillment signing secret.

## Current fulfillment
Successful PayPal captures return a time-limited signed delivery URL. The Template Pack is delivered as a browser-based printable template document; customers can use Print → Save as PDF. Before public launch, test this flow end-to-end in PayPal Sandbox and replace the draft legal/contact information.

## Deployment
Vercel should use Node.js 22.x for the API functions.