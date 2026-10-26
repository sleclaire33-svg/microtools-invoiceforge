import { handleWebhook } from '../lib/lemon-orders.mjs';

// Web Request preserves the exact signed bytes, without JSON body middleware.
export default { fetch: request => handleWebhook(request) };
