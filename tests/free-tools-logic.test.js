const test=require('node:test'),assert=require('node:assert/strict'),F=require('../scripts/free-tools-core');
test('quote totals round each line and charges to cents and reject invalid inputs',()=>{assert.equal(F.quote([{qty:3,rate:19.99}],10,10).total,54.97);assert.throws(()=>F.quote([{qty:-1,rate:50}],0,0));assert.throws(()=>F.quote([{qty:1,rate:50}],51,0));});
test('rate estimator rejects zero capacity and impossible utilization',()=>{const r={take:4000,expenses:500,buffer:250,tax:25,fees:3,hours:30,billable:60,weeks:46};const c=F.rate(r);assert.equal(c.monthlyHours,69);assert.ok(Math.abs(c.revenue-6529.20962199)<0.0001);assert.throws(()=>F.rate({...r,hours:0}));assert.throws(()=>F.rate({...r,billable:101}));assert.throws(()=>F.rate({...r,weeks:53}));});

test('quote decimal half-cent regression uses canonical line cents',()=>{
 const q=F.quote([{qty:'1.5',rate:'45.15'}],0,0);
 assert.deepEqual(q.lineCents,[6773]);assert.equal(q.subtotal,67.73);assert.equal(q.total,67.73);
});
test('rounded lines sum rather than rounding combined raw amounts',()=>{
 const q=F.quote([{qty:'0.5',rate:'0.01'},{qty:'0.5',rate:'0.01'}],0,0);
 assert.deepEqual(q.lineCents,[1,1]);assert.equal(q.subtotal,.02);assert.equal(q.total,.02);
});
test('discount then percentage charge retain half-up cent semantics',()=>{
 const q=F.quote([{qty:'1.5',rate:'45.15'}],'10','10');
 assert.equal(q.discount,10);assert.equal(q.total,63.50);
 assert.equal(F.quote([{qty:1,rate:'1.005'}],0,0).total,1.01);
 assert.equal(F.quote([{qty:1,rate:1}],'.005',0).discount,.01);
 assert.equal(F.quote([{qty:1,rate:1}],0,'.5').total,1.01);
 assert.equal(F.quote([{qty:'1.5e0',rate:'4.515e1'}],0,0).total,67.73);
});
test('quote rejects unsafe individual, aggregate, and charged totals',()=>{
 assert.throws(()=>F.quote([{qty:1e6,rate:1e9}],0,0),/safe currency/);
 assert.throws(()=>F.quote([{qty:50000,rate:1e9},{qty:50000,rate:1e9}],0,0),/safe currency/);
 assert.throws(()=>F.quote([{qty:50000,rate:1e9}],0,100),/safe currency/);
});

test('quote preview uses canonical cents and print hides promotional navigation',()=>{
 const fs=require('node:fs'),path=require('node:path');
 const html=fs.readFileSync(path.join(__dirname,'../tools.html'),'utf8');
 const nodes={};for(const id of ['q-business','q-client','q-project','q-number','q-valid','q-discount','q-tax','q-scope','q-exclusions','q-timeline','q-terms','q-total','q-output'])nodes[id]={value:''};
 Object.assign(nodes['q-business'],{value:'QA'});nodes['q-client'].value='Client';nodes['q-project'].value='Project';
 const row={querySelectorAll:()=>[{value:'Test line'},{value:'1.5'},{value:'45.15'}]};
 const code=html.slice(html.indexOf('function quoteTotal()'),html.indexOf("$('q-add').onclick"));
 const text=new Function('$','document','FreeToolsCore','money','let quotePreviewActive=false;'+code+';return buildQuote();')(id=>nodes[id],{querySelectorAll:()=>[row]},F,n=>'$'+Number(n).toFixed(2));
 assert.match(text,/Test line — 1.5 × \$45.15 = \$67.73/);
 assert.match(text,/Subtotal: \$67.73/);assert.match(text,/TOTAL: \$67.73/);
 assert.equal(nodes['q-total'].textContent,'$67.73');assert.equal(nodes['q-output'].textContent,text);
 assert.match(html,/@media print\{\.free-tool-rail,\.site-nav,\.product-nav,/);
 assert.equal(fs.readFileSync(path.join(__dirname,'../free-tools-core.js'),'utf8'),fs.readFileSync(path.join(__dirname,'../scripts/free-tools-core.js'),'utf8'));
});
