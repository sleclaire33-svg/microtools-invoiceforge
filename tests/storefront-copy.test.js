const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const read = name => fs.readFileSync(require('node:path').join(__dirname, '..', name), 'utf8');
const kits = {invoiceforge:19, certpai:15, siteintellect:19, claimproof:9, agencyos:39};

test('home and catalog offer every current kit at its existing review route', () => {
  for (const name of ['index.html', 'kits.html']) {
    const html = read(name);
    for (const [kit, price] of Object.entries(kits)) {
      assert.match(html, new RegExp(`href="checkout.html\\?product=${kit}_complete"[^>]*>Review \\$${price} kit`));
      assert.ok(html.includes(`href="preview.html?product=${kit}"`));
      assert.ok(html.includes(`href="${kit}.html"`));
    }
  }
});

test('homepage demo uses complete existing controls and labels the fictional example', () => {
  const html = read('index.html');
  for (const id of ['demo-next','demo-balance','demo-badge','demo-title','demo-copy']) {
    assert.equal((html.match(new RegExp(`id="${id}"`, 'g')) || []).length, 1);
  }
  assert.match(html, /Fictional example/);
  assert.match(html, /not a payment form/);
  assert.match(html, /free follow-up tool saves records in your browser and includes backup\/import/);
});

test('paid comparison preserves free capabilities and provider-specific recovery', () => {
  const html = read('invoiceforge.html');
  assert.match(html, /own records, editable reminders and JSON backup\/import/);
  assert.match(html, /100 prepared spreadsheet rows/);
  assert.match(html, /For a Lemon Squeezy purchase/);
  assert.match(html, /For an older direct PayPal order/);
  assert.match(html, /native Excel and Numbers checks remain pending/);
});

test('earlier samples retain useful writing but do not advertise retired offers', () => {
  const html = read('samples.html');
  assert.match(html, /retired packages are no longer sold/);
  assert.match(html, /Friendly payment reminder/);
  assert.match(html, /XLSX payment tracker/);
  assert.doesNotMatch(html, /\$14\.99|\$29|no downloadable ZIP|Not included today|time-limited access link/);
});

test('changed storefront source and deployed copies stay synchronized', () => {
  for (const name of ['index.html','kits.html','invoiceforge.html','samples.html','checkout.html','checkout.js','launch.css']) {
    assert.equal(read(name), read(`public/${name}`));
  }
});

test('homepage invoice example supports repeated completion and restart', () => {
  const nodes = new Map();
  const element = () => ({textContent:'',events:{},addEventListener(name,fn){this.events[name]=fn;},classList:{toggle(){}}});
  for (const id of ['demo-next','demo-balance','demo-badge','demo-title','demo-copy']) nodes.set(id,element());
  const context = {
    document:{
      querySelector:selector => selector==='#demo-next'?nodes.get('demo-next'):null,
      querySelectorAll:selector => selector==='.demo-progress span'?[element(),element(),element()]:[],
      getElementById:id=>nodes.get(id),
      createElement:element,
      head:{append(){}}
    },
    location:{pathname:'/',hash:''}
  };
  require('node:vm').runInNewContext(read('store.js'),context);
  for (let repeat=0;repeat<2;repeat++) {
    nodes.get('demo-next').events.click();
    assert.equal(nodes.get('demo-balance').textContent,'$9.99');
    assert.equal(nodes.get('demo-badge').textContent,'Part-paid');
    nodes.get('demo-next').events.click();
    assert.equal(nodes.get('demo-balance').textContent,'$0.00');
    assert.equal(nodes.get('demo-badge').textContent,'Paid');
    nodes.get('demo-next').events.click();
    assert.equal(nodes.get('demo-balance').textContent,'$19.99');
    assert.equal(nodes.get('demo-badge').textContent,'Due today');
  }
});

test('catalog filters repeatedly narrow and restore all five products', () => {
  const kinds=['all','payments','renewals','websites','evidence','agency'];
  const make = kind => ({dataset:{kitFilter:kind,kitTask:kind},hidden:false,events:{},pressed:'false',addEventListener(name,fn){this.events[name]=fn;},setAttribute(name,value){this.pressed=value;},classList:{toggle(){}}});
  const buttons=kinds.map(make),cards=kinds.slice(1).map(make),status={};
  const context={document:{querySelector(){return null;},querySelectorAll:s=>s==='[data-kit-filter]'?buttons:s==='[data-kit-task]'?cards:[],getElementById:id=>id==='kit-filter-status'?status:null,createElement:()=>({}),head:{append(){}}},location:{pathname:'/',hash:''}};
  require('node:vm').runInNewContext(read('store.js'),context);
  for(const button of buttons.slice(1)) {
    button.events.click();
    assert.equal(cards.filter(card=>!card.hidden).length,1);
    assert.equal(cards.find(card=>!card.hidden).dataset.kitTask,button.dataset.kitFilter);
    assert.equal(button.pressed,'true');
    buttons[0].events.click();
    assert.equal(cards.filter(card=>!card.hidden).length,5);
    assert.equal(button.pressed,'false');
  }
});
