const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const HOSTED=require('../api/_hosted-checkouts');
const PRODUCTS=require('../api/_products');

async function checkout(product,override={}){
 const nodes=new Map(),assigned=[],scripts=[];
 const element=()=>({hidden:false,checked:false,children:[],events:{},classList:{add(){},remove(){}},nextElementSibling:{},addEventListener(k,fn){this.events[k]=fn;},replaceChildren(...v){this.children=v;},append(...v){this.children.push(...v);},focus(){this.focused=true;},setAttribute(){},querySelectorAll(){return [];}});
 const get=id=>{if(!nodes.has(id))nodes.set(id,element());return nodes.get(id);};
 const products=Object.fromEntries(Object.entries(HOSTED).map(([key,url])=>[key,{name:PRODUCTS[key].description,amount:PRODUCTS[key].amount,currency:'USD',format:'zip',inclusions:['Quick-start guide'],ready:false,hostedCheckout:url}]));
 if(products[product])Object.assign(products[product],override);
 const context={URL,URLSearchParams,Intl,Object,Error,Promise,document:{getElementById:get,querySelector:get,createElement:element,head:{append(s){scripts.push(s);}}},location:{search:'?product='+encodeURIComponent(product),assign(v){assigned.push(v);}},sessionStorage:{getItem(){return null;}},window:{},fetch:async()=>({ok:true,json:async()=>({environment:'sandbox',checkoutReady:false,products})})};
 vm.runInNewContext(fs.readFileSync(require.resolve('../checkout.js'),'utf8'),context);
 await new Promise(resolve=>setImmediate(resolve));
 return {get,assigned,scripts};
}

test('every current kit routes to its own live checkout after format confirmation, without loading PayPal',async()=>{
 for(const [key,url] of Object.entries(HOSTED)){
  const h=await checkout(key),button=h.get('payment-options').children[0];
  assert.ok(button,key);assert.equal(h.get('checkout-controls').hidden,false);
  button.events.click();assert.deepEqual(h.assigned,[]);assert.equal(h.get('format-confirm').focused,true);
  h.get('format-confirm').checked=true;button.events.click();assert.deepEqual(h.assigned,[url]);assert.deepEqual(h.scripts,[]);
 }
});
test('untrusted hosted URLs and discount-bearing links fail closed',async()=>{
 for(const url of ['https://example.com/checkout/buy/94a2579e-8318-4226-8e7d-ae617203db7d',HOSTED.invoiceforge_complete+'?discount=PRIVATE']){
  const h=await checkout('invoiceforge_complete',{hostedCheckout:url});assert.equal(h.get('checkout-controls').hidden,true);assert.equal(h.get('payment-options').children.length,0);assert.match(h.get('payment-status').textContent,/could not be verified/);
 }
});
test('unknown products cannot fall through to a different product checkout',async()=>{
 const h=await checkout('not-a-product');assert.equal(h.get('checkout-controls').hidden,true);assert.equal(h.get('payment-options').children.length,0);assert.equal(h.get('order-name').textContent,'Product not found');
});
