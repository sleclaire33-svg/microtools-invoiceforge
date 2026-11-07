const test=require('node:test'),assert=require('node:assert/strict'),C=require('../campaign'),H=require('../api/_hosted-checkouts');
function env(search='',nav={},map=new Map()){return{location:new URL('https://www.microtoolsstudio.com/'+search),navigator:nav,sessionStorage:{getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)}};}
test('named partner campaigns survive page navigation and reach the hosted checkout',()=>{
 for(const id of ['ao-kickoff-tab-text-a','ao-kickoff-tab-text-b','ao-kickoff-ft-resource','ao-kickoff-wdn-resource']){
  const saved=new Map();assert.equal(C.current(env('?campaign='+id,{},saved)),id);
  const link=new URL(C.decorate(H.agencyos_complete,env('',{},saved)));
  assert.equal(link.searchParams.get('checkout[custom][campaign_id]'),id);
  assert.equal(C.current(env('?qa=1',{},saved)),null);
  assert.equal(C.decorate(H.agencyos_complete,env('',{},saved)),H.agencyos_complete);
 }
 assert.equal(C.current(env('?campaign=ao-kickoff-tab-text-private')),null);
});
test('campaign survives navigation and only decorates approved checkout',()=>{const m=new Map(),e=env('?campaign=if-balance-a-ig',{},m);assert.equal(C.current(e),'if-balance-a-ig');const link=new URL(C.decorate(H.invoiceforge_complete,env('',{},m)));assert.equal(link.searchParams.get('checkout[custom][campaign_id]'),'if-balance-a-ig');assert.equal(C.decorate('https://example.com/',e),'https://example.com/');});
test('unknown labels and sensitive arbitrary text are never retained',()=>{for(const value of ['private@example.com','unknown','if-balance-a-ig-secret'])assert.equal(C.current(env('?campaign='+encodeURIComponent(value))),null);});
test('privacy signals, QA and storage errors disable campaign attribution',()=>{for(const n of [{globalPrivacyControl:true},{doNotTrack:'1'}])assert.equal(C.current(env('?campaign=ao-kickoff-li',n)),null);assert.equal(C.current(env('?qa=1&campaign=ao-kickoff-li')),null);const e=env('?campaign=ao-kickoff-li');e.sessionStorage.getItem=()=>{throw Error('blocked')};assert.equal(C.decorate(H.agencyos_complete,e),H.agencyos_complete);});
test('expired or future campaigns are ignored and checkout parameters are preserved',()=>{for(const at of [Date.now()-86400001,Date.now()+10000]){const m=new Map([['mts-campaign-v1',JSON.stringify({id:'ao-kickoff-li',at})]]);assert.equal(C.current(env('',{},m)),null);}const url=H.agencyos_complete+'?existing=1';assert.equal(C.decorate(url,env('?campaign=ao-kickoff-li')),url);});
