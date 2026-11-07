import { createHmac, timingSafeEqual } from 'node:crypto';

const creatives = ['if-balance-a', 'if-balance-b', 'ao-kickoff', 'cp-renewal', 'si-retest', 'cl-evidence'];
const partnerCampaigns = ['ao-kickoff-tab-text-a', 'ao-kickoff-tab-text-b', 'ao-kickoff-ft-resource', 'ao-kickoff-wdn-resource'];
const campaigns = new Set([...creatives.flatMap(c => ['ig', 'li', 'yt', 'pin'].map(n => `${c}-${n}`)), ...partnerCampaigns]);
const products = new Set(['1470398', '1470404', '1470417', '1470420', '1470422']);
// Test products have their own provider IDs. Never accept them as live sales.
const testProducts = new Set(['1470500', '1470502', '1470504', '1470505', '1470506']);
// These are store-scoped order numbers, not JSON:API resource IDs.
const qaOrderNumbers = new Set(['4956971', '4956972', '4956973', '4956974', '4956975']);
const statuses = new Set(['pending', 'failed', 'paid', 'refunded', 'partial_refund', 'fraudulent']);
const MAX_BYTES = 256 * 1024;

export class WebhookError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
const invalid = () => { throw new WebhookError(400, 'Invalid order payload.'); };
function id(value) {
  if (!['string', 'number'].includes(typeof value) || (typeof value === 'number' && !Number.isSafeInteger(value))) invalid();
  if (!/^[1-9]\d{0,18}$/.test(String(value))) invalid();
  return String(value);
}
function amount(value) {
  // Some converted-currency payloads contain fractional minor units. Keep them;
  // never round different currencies together or call these amounts profit.
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1e12) invalid();
  return value;
}
function timestamp(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T[\d:.]+(?:Z|[+-]\d{2}:\d{2})$/.test(value) || !Number.isFinite(Date.parse(value))) invalid();
  return value;
}
export function normalizeOrder(event, storeId) {
  const name = event?.meta?.event_name;
  if (!['order_created', 'order_refunded'].includes(name)) return null;
  const data = event?.data, a = data?.attributes;
  if (data?.type !== 'orders' || !a || id(a.store_id) !== storeId) invalid();
  const orderId = id(data.id), productId = id(a.first_order_item?.product_id);
  if (typeof a.test_mode !== 'boolean' || !statuses.has(a.status) || typeof a.currency !== 'string' || !/^[A-Z]{3}$/.test(a.currency)) invalid();
  const testMode = a.test_mode || event.meta.test_mode === true;
  if (!products.has(productId) && !(testMode && testProducts.has(productId))) return null;
  const total = amount(a.total), tax = amount(a.tax);
  const refunded = a.refunded_amount == null
    ? (a.status === 'refunded' ? total : a.status === 'partial_refund' ? invalid() : 0)
    : amount(a.refunded_amount);
  if (tax > total || refunded > total) invalid();
  if (a.status === 'refunded' && refunded !== total) invalid();
  if (a.status === 'paid' && refunded !== 0) invalid();
  if (a.status === 'partial_refund' && !(refunded > 0 && refunded < total)) invalid();
  if (name === 'order_refunded' && !['refunded', 'partial_refund'].includes(a.status)) invalid();
  const createdAt = timestamp(a.created_at), updatedAt = timestamp(a.updated_at);
  if (Date.parse(updatedAt) < Date.parse(createdAt)) invalid();
  const campaign = event.meta?.custom_data?.campaign_id;
  return {
    order_id: orderId, store_id: storeId, first_product_id: productId,
    test_mode: testMode,
    is_qa: (storeId === '495697' && qaOrderNumbers.has(String(a.order_number))) || event.meta?.custom_data?.qa === '1',
    campaign_id: campaigns.has(campaign) ? campaign : null,
    currency: a.currency, status: a.status, total_minor: total,
    tax_minor: tax, refunded_minor: refunded,
    ordered_at: createdAt, source_updated_at: updatedAt
  };
}
export async function rawBytes(request) {
  const length = request.headers.get('content-length');
  if (length && (!/^\d+$/.test(length) || Number(length) > MAX_BYTES)) throw new WebhookError(413, 'Payload too large.');
  const reader = request.body?.getReader();
  if (!reader) throw new WebhookError(400, 'Missing body.');
  const chunks = []; let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) { await reader.cancel(); throw new WebhookError(413, 'Payload too large.'); }
      chunks.push(Buffer.from(value));
    }
  } finally { reader.releaseLock(); }
  return Buffer.concat(chunks);
}
export function validSignature(bytes, signature, secret) {
  if (typeof signature !== 'string' || !/^[a-f0-9]{64}$/i.test(signature)) return false;
  return timingSafeEqual(createHmac('sha256', secret).update(bytes).digest(), Buffer.from(signature, 'hex'));
}
export async function handleWebhook(request, env = process.env, fetcher = fetch) {
  const reply = (status, data) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store', ...(status === 405 ? { Allow: 'POST' } : {}) } });
  if (request.method !== 'POST') return reply(405, { error: 'Method not allowed.' });
  const secret = env.LEMON_SQUEEZY_SIGNING_SECRET;
  const storeId = env.LEMON_SQUEEZY_STORE_ID?.trim();
  const url = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  // An exact HTTPS origin prevents accidental credential transmission to a bad URL.
  if (!secret || !key || !/^[1-9]\d{0,18}$/.test(storeId || '') || !/^https:\/\/[a-z0-9]{20}\.supabase\.co$/.test(url || '')) {
    console.error('Lemon webhook configuration is incomplete.');
    return reply(503, { error: 'Webhook unavailable.' });
  }
  try {
    const bytes = await rawBytes(request);
    if (!validSignature(bytes, request.headers.get('x-signature'), secret)) return reply(401, { error: 'Invalid signature.' });
    let event;
    try { event = JSON.parse(bytes.toString('utf8')); } catch { throw new WebhookError(400, 'Invalid JSON.'); }
    const row = normalizeOrder(event, storeId);
    if (!row) return reply(200, { received: true, ignored: true });
    const result = await fetcher(`${url}/rest/v1/rpc/mts_record_order`, {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(8000),
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_order: row })
    });
    if (!result.ok) {
      // Do not log payloads, customer details, secrets or database response bodies.
      console.error('Lemon order persistence failed.', result.status);
      return reply(503, { error: 'Order storage unavailable; retry required.' });
    }
    return reply(200, { received: true });
  } catch (error) {
    if (error instanceof WebhookError) return reply(error.status, { error: error.message });
    console.error('Lemon webhook processing failed.');
    return reply(503, { error: 'Webhook unavailable; retry required.' });
  }
}
