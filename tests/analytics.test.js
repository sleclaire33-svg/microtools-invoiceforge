const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const source=fs.readFileSync(require.resolve('../analytics.js'),'utf8');
test('loading analytics twice emits only one visit beacon',()=>{
 const images=[];
 const context={URL,URLSearchParams,Set,location:new URL('https://www.microtoolsstudio.com/client-kickoff-checklist.html'),navigator:{},sessionStorage:{getItem:()=>null},document:{referrer:'',querySelector:()=>images[0]||null,createElement:()=>({setAttribute(){}}),body:{append:i=>images.push(i)}}};
 vm.runInNewContext(source,context);vm.runInNewContext(source,context);
 assert.equal(images.length,1);
});
function run(url,options={}){
 const images=[],saved=options.saved||new Map();
 const context={URL,URLSearchParams,Set,location:new URL(url),navigator:options.navigator||{},sessionStorage:{getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)},document:{referrer:options.referrer||'',createElement:()=>({setAttribute(){}}),body:{append:i=>images.push(i)}}};
 vm.runInNewContext(source,context);return {images,saved};
}
test('visit measurement strips private query, fragment and full referrer details',()=>{
 const {images}=run('https://www.microtoolsstudio.com/invoiceforge.html?email=private@example.com#invoice-secret',{referrer:'https://mail.example.com/customer/private?token=SECRET'});
 assert.equal(images.length,1);const p=new URL(images[0].src).searchParams;
 assert.equal(p.get('u'),'https://www.microtoolsstudio.com/invoiceforge.html');assert.equal(p.get('ref'),'https://mail.example.com/');
 assert.doesNotMatch(images[0].src,/SECRET|private|invoice-secret/);assert.equal(images[0].referrerPolicy,'no-referrer');
});
test('checkout, local work tools and non-production hosts never send visits',()=>{
 for(const url of ['https://www.microtoolsstudio.com/checkout.html','https://www.microtoolsstudio.com/invoice.html','https://www.microtoolsstudio.com/confirmation.html','https://preview.vercel.app/','http://localhost:4173/'])assert.equal(run(url).images.length,0,url);
});
test('QA exclusion persists for the tab and privacy signals prevent collection',()=>{
 const qa=run('https://www.microtoolsstudio.com/?qa=1');assert.equal(qa.images.length,0);assert.equal(run('https://www.microtoolsstudio.com/kits.html',{saved:qa.saved}).images.length,0);
 for(const navigator of [{globalPrivacyControl:true},{doNotTrack:'1'}])assert.equal(run('https://www.microtoolsstudio.com/',{navigator}).images.length,0);
});

test('practical guide visits remain public-path-only and honor privacy controls',()=>{
 for(const name of ['guides','partial-payment-follow-up','client-kickoff-checklist','renewal-review-checklist','website-fix-retest-checklist','warranty-evidence-checklist']){
  const url='https://www.microtoolsstudio.com/'+name+'.html';
  const images=run(url+'?private=SECRET#PRIVATE').images;assert.equal(images.length,1);assert.equal(new URL(images[0].src).searchParams.get('u'),url);
  assert.equal(run(url+'?qa=1').images.length,0);assert.equal(run(url,{navigator:{globalPrivacyControl:true}}).images.length,0);
 }
});
