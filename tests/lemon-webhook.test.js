const test = require('node:test');
const assert = require('node:assert/strict');
const { createHmac } = require('node:crypto');
const env = { LEMON_SQUEEZY_SIGNING_SECRET:'local-test-only', LEMON_SQUEEZY_STORE_ID:'123', VITE_SUPABASE_URL:'https://abcdefghijklmnopqrst.supabase.co', SUPABASE_SERVICE_ROLE_KEY:'local-test-key' };
function event(overrides = {}, custom = {campaign_id:'if-balance-a-ig'}) {
  return { meta:{event_name:'order_created',custom_data:custom},data:{type:'orders',id:'123456',attributes:{
    store_id:123,first_order_item:{product_id:1470398},test_mode:false,status:'paid',currency:'USD',total:1900,tax:0,refunded_amount:0,
    created_at:'2026-10-26T00:00:00.000Z',updated_at:'2026-10-26T00:00:00.000Z',
    user_name:'DO NOT STORE',user_email:'private@example.test',urls:{receipt:'https://example.test/private-receipt'},...overrides
  }}};
}
function request(payload, signature) {
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return new Request('https://example.test/api/lemon-webhook',{method:'POST',body,headers:{'content-type':'application/json','x-signature':signature ?? createHmac('sha256',env.LEMON_SQUEEZY_SIGNING_SECRET).update(body).digest('hex')}});
}
test('signed order persists only the minimal approved fields and waits for durable storage', async () => {
  const {handleWebhook} = await import('../lib/lemon-orders.mjs'); let calls=0;
  const response = await handleWebhook(request(event()),env,async(url,options)=>{
    calls++; assert.equal(url,`${env.VITE_SUPABASE_URL}/rest/v1/rpc/mts_record_order`);
    assert.equal(options.redirect,'error'); assert.ok(options.signal);
    const row=JSON.parse(options.body).p_order;
    assert.equal(row.order_id,'123456');assert.equal(row.campaign_id,'if-balance-a-ig');
    assert.equal(row.total_minor,1900); assert.equal(row.test_mode,false);
    for(const forbidden of ['private@example','DO NOT STORE','receipt','user_name','user_email','custom_data']) assert.equal(options.body.includes(forbidden),false);
    return new Response(null,{status:204});
  });
  assert.equal(calls,1);assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'no-store');
});
test('exact raw bytes are required; malformed, missing and changed signatures cannot write', async () => {
  const {handleWebhook}=await import('../lib/lemon-orders.mjs'); let calls=0;
  const fetcher=async()=>{calls++;return new Response();};
  for(const signature of ['', 'x', '0'.repeat(64)]) assert.equal((await handleWebhook(request(event(),signature),env,fetcher)).status,401);
  const compact=JSON.stringify(event()),sig=createHmac('sha256',env.LEMON_SQUEEZY_SIGNING_SECRET).update(compact).digest('hex');
  assert.equal((await handleWebhook(request(compact+' ',sig),env,fetcher)).status,401);
  assert.equal((await handleWebhook(request('{broken'),env,fetcher)).status,400);
  assert.equal(calls,0);
});
test('test flags, QA orders, unknown labels and foreign stores are handled explicitly', async()=>{
  const {normalizeOrder}=await import('../lib/lemon-orders.mjs');
  const qa=event();qa.data.id='4956971';assert.equal(normalizeOrder(qa,'123').is_qa,true);
  assert.equal(normalizeOrder(event({test_mode:true}),'123').test_mode,true);
  const simulated=event();simulated.meta.test_mode=true;assert.equal(normalizeOrder(simulated,'123').test_mode,true);
  assert.equal(normalizeOrder(event({}, {campaign_id:'private@example.test'}),'123').campaign_id,null);
  assert.throws(()=>normalizeOrder(event({store_id:456}),'123'));
  assert.throws(()=>normalizeOrder(event({test_mode:null}),'123'));
  assert.equal(normalizeOrder(event({first_order_item:{product_id:999}}),'123'),null);
});
test('refund validation supports partial and legacy full refunds without corrupting cents',async()=>{
  const {normalizeOrder}=await import('../lib/lemon-orders.mjs');
  const partial=event({status:'partial_refund',refunded_amount:600});partial.meta.event_name='order_refunded';
  assert.equal(normalizeOrder(partial,'123').refunded_minor,600);
  assert.equal(normalizeOrder(event({status:'refunded',refunded_amount:null}),'123').refunded_minor,1900);
  assert.equal(normalizeOrder(event({total:1859.76,tax:359.775,currency:'EUR'}),'123').tax_minor,359.775);
  for(const overrides of [{refunded_amount:9999},{total:-1},{status:'partial_refund',refunded_amount:null},{status:'refunded',refunded_amount:0},{total:'1900'},{currency:['USD']},{updated_at:'yesterday'},{updated_at:'2025-01-01T00:00:00Z'}]) assert.throws(()=>normalizeOrder(event(overrides),'123'));
});
test('storage errors and network timeouts request provider retry instead of acknowledging a lost order',async()=>{
  const {handleWebhook}=await import('../lib/lemon-orders.mjs');
  for(const fetcher of [async()=>new Response(null,{status:500}),async()=>{throw Error('timeout');}]) assert.equal((await handleWebhook(request(event()),env,fetcher)).status,503);
});
test('bad configuration, oversized bodies and non-POST methods never reach the database',async()=>{
  const {handleWebhook}=await import('../lib/lemon-orders.mjs');let calls=0;
  const fetcher=async()=>{calls++;return new Response();};
  for(const change of [{VITE_SUPABASE_URL:env.VITE_SUPABASE_URL+'\n[link]'},{VITE_SUPABASE_URL:'https://evil.example'},{SUPABASE_SERVICE_ROLE_KEY:''},{LEMON_SQUEEZY_STORE_ID:'bad'}]) assert.equal((await handleWebhook(request(event()),{...env,...change},fetcher)).status,503);
  assert.equal((await handleWebhook(request('a'.repeat(262145)),env,fetcher)).status,413);
  const req=request(event());req.headers.set('content-length','999999');assert.equal((await handleWebhook(req,env,fetcher)).status,413);
  const response=await handleWebhook(new Request('https://example.test'),env,fetcher);assert.equal(response.status,405);assert.equal(response.headers.get('allow'),'POST');
  assert.equal(calls,0);
});
test('unrelated signed events are acknowledged without writing',async()=>{
  const {handleWebhook}=await import('../lib/lemon-orders.mjs');const e=event();e.meta.event_name='subscription_created';
  const response=await handleWebhook(request(e),env,async()=>{throw Error('should not write');});
  assert.deepEqual(await response.json(),{received:true,ignored:true});
});
test('Vercel Web handler forwards the actual Request with the original bytes',async()=>{
  const {default:route}=await import('../api/lemon-webhook.mjs');
  const response=await route.fetch(new Request('https://example.test',{method:'GET'}));assert.equal(response.status,405);
});
