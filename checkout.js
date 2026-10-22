'use strict';
(()=>{
 const $=id=>document.getElementById(id);
 const query=new URLSearchParams(location.search);
 const product=query.get('product')||'invoiceforge_complete';
 const pendingKey='invoiceforge.pending.'+product;
 let config,item,pending=null,busy=false,approved=false,sessions=[];
 const storage={get(k){try{return JSON.parse(sessionStorage.getItem(k));}catch{return null}},set(k,v){try{sessionStorage.setItem(k,JSON.stringify(v));return true;}catch{return false;}},remove(k){try{sessionStorage.removeItem(k);}catch{}}};
 function status(message){$('payment-status').textContent=message;}
 function showPending(){if(!pending?.orderId)return;$('pending-order').hidden=false;$('pending-order-id').textContent='Order number: '+pending.orderId;$('retry-confirmation').disabled=busy;}
 function setBusy(value){busy=value;$('payment-options').setAttribute('aria-disabled',String(value));$('retry-confirmation').disabled=value;for(const e of $('payment-options').querySelectorAll('button,paypal-button,venmo-button,paylater-button,paypal-basic-card-button'))e.disabled=value;}
 async function api(path,body){const response=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const data=await response.json().catch(()=>({}));if(!response.ok){const error=Error(data.error||'The request could not be completed. Please check again.');error.canRestart=data.canRestart===true;throw error;}return data;}
 function finish(result){
  if(result.status!=='COMPLETED'||result.product!==product||typeof result.downloadUrl!=='string'||!result.downloadUrl.startsWith('/api/download?'))throw Error('The purchase could not be verified. Contact support with your order number.');
  const saved=storage.set('invoiceforge.receipt',{...result,name:item.name,amount:item.amount,currency:item.currency,format:item.format});storage.remove(pendingKey);pending=null;
  if(saved){location.assign('thank-you.html');return;}
  $('checkout-controls').hidden=true;$('pending-order').hidden=true;status('Payment verified. Order '+result.orderId+'. Save this order number and download your files now.');const link=document.createElement('a');link.href=result.downloadUrl;link.className='button primary';link.textContent='Download your purchase';$('payment-status').append(document.createElement('br'),link);
 }
 async function confirm(orderId){
  if(!pending||pending.orderId!==orderId)throw Error('The order in this browser does not match. Contact support before paying again.');
  setBusy(true);status('Confirming payment and preparing your download…');
  try{const result=await api('/api/capture-order',{product,...pending});finish(result);}
  catch(e){if(e.canRestart){pending=null;storage.remove(pendingKey);$('pending-order').hidden=true;status('This order has not been paid. You can choose a payment method to start again.');}else{status(e.message);showPending();}throw e;}
  finally{setBusy(false);}
 }
 async function beginOrder(){
  if(pending?.orderId){showPending();throw Error('You already have an order to check. Use “Check payment status” before starting another payment.');}
  const order=await api('/api/create-order',{product});pending={orderId:order.orderId,expires:order.expires,checkoutToken:order.checkoutToken};storage.set(pendingKey,pending);return{orderId:order.orderId};
 }
 const callbacks={onApprove:async({orderId})=>{approved=true;await confirm(orderId);},onCancel:()=>{if(!approved){pending=null;storage.remove(pendingKey);$('pending-order').hidden=true;status('Checkout cancelled. No payment was completed.');}setBusy(false);},onError:()=>{status(pending?'Payment confirmation needs checking. Keep your order number and check status before paying again.':'Checkout could not be completed. Please try again later.');showPending();setBusy(false);}};
 function bind(button,session){button.addEventListener('click',async()=>{if(busy)return;if(!$('format-confirm').checked){status('Please confirm the file format before continuing.');$('format-confirm').focus();return;}if(pending){showPending();status('Check your existing order before starting a new payment.');return;}setBusy(true);approved=false;status(config.environment==='sandbox'?'Opening sandbox checkout. This is a test; no real payment will be taken.':'Opening secure checkout…');try{await session.start({presentationMode:'auto'},beginOrder());}catch(e){status(e.message||'Checkout could not finish. Please check status.');showPending();}finally{setBusy(false);}});}
 function addButton(tag){const button=document.createElement(tag);button.type='pay';const host=document.createElement('div');if(tag==='paypal-basic-card-button'){const container=document.createElement('paypal-basic-card-container');container.append(button);host.append(container);}else host.append(button);$('payment-options').append(host);return button;}
 async function initialize(){
  $('retry-checkout').hidden=true;$('checkout-notice').textContent='Checking checkout availability…';$('payment-options').replaceChildren();$('checkout-controls').hidden=true;
  try{
   const response=await fetch('/api/config',{headers:{Accept:'application/json'},cache:'no-store'});if(!response.ok)throw Error('Checkout is temporarily unavailable. Please try again later.');config=await response.json();
   item=Object.hasOwn(config.products||{},product)?config.products[product]:null;
   if(!item){$('order-name').textContent='Product not found';$('order-price').textContent='—';$('order-inclusions').replaceChildren();throw Error('This product link is not available. Return to the kit page to choose a product.');}
   document.title=item.name+' checkout · Micro Tools Studio';const pages={"certpai_complete": "certpai.html", "siteintellect_complete": "siteintellect.html", "claimproof_complete": "claimproof.html", "invoiceforge_complete": "index.html#pricing"};document.querySelector('.back-link').href=pages[product]||'index.html#pricing';$('order-name').textContent=item.name;$('order-price').textContent=new Intl.NumberFormat('en-US',{style:'currency',currency:item.currency}).format(Number(item.amount));$('order-currency').textContent=item.currency+' · one-time';
   if(item.inclusions){$('order-inclusions').replaceChildren(...item.inclusions.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));}
   if(item.format!=='zip'){$('order-format').textContent='Browser resource page · copy text or print/save PDF';$('order-inclusions').innerHTML='<li>Product-specific templates and guidance</li><li>Copy the text into your own documents</li><li>Print or save the resource as PDF</li>';$('format-confirm').nextElementSibling.textContent='I understand this is a digital resource page to copy or print/save as PDF. It does not include a spreadsheet download.';}
   if(config.environment!=='production'){$('checkout-notice').classList.add('warning');$('checkout-notice').textContent='Sandbox test checkout · No real payments. This store is not open for live purchases yet.';}
   else{$('checkout-notice').classList.remove('warning');$('checkout-notice').textContent='Secure checkout · Download after verified payment.';}
   if(!item.ready||!config.checkoutReady){$('checkout-notice').textContent=config.environment!=='production'?'Launch preparation is in progress. This kit is not accepting payments yet. You can explore the free tools and previews.':'This kit is temporarily unavailable for purchase. Please try the free tools or contact support.';$('retry-checkout').hidden=false;return;}
   $('checkout-controls').hidden=false;pending=storage.get(pendingKey);if(pending)showPending();
   if(!window.paypal){await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=config.environment==='production'?'https://www.paypal.com/web-sdk/v6/core':'https://www.sandbox.paypal.com/web-sdk/v6/core';script.async=true;script.onload=resolve;script.onerror=()=>reject(Error('The payment service could not load. Please try again later.'));document.head.append(script);});}
   const sdk=await window.paypal.createInstance({clientId:config.paypalClientId,components:['paypal-payments','venmo-payments','paypal-guest-payments'],pageType:'checkout',locale:navigator.language||'en-US'});
   const methods=await sdk.findEligibleMethods({currencyCode:item.currency,amount:item.amount});sessions=[];
   const configs=[['paypal','paypal-button','createPayPalOneTimePaymentSession'],['card','paypal-basic-card-button','createPayPalGuestOneTimePaymentSession'],['venmo','venmo-button','createVenmoOneTimePaymentSession'],['paylater','paylater-button','createPayLaterOneTimePaymentSession']];
   for(const [method,tag,fn]of configs){if(methods.isEligible(method)&&typeof sdk[fn]==='function'){const options={...callbacks};if(method==='card')options.onComplete=()=>{};const session=await sdk[fn](options);sessions.push(session);const button=addButton(tag);if(method==='paylater'){const details=methods.getDetails(method);if(details?.productCode)button.productCode=details.productCode;if(details?.countryCode)button.countryCode=details.countryCode;}bind(button,session);}}
   if(!sessions.length)status('No eligible payment methods are available for this transaction. Please contact support.');
   // Resume redirects in browsers where a popup was not available.
   for(const session of sessions){if(typeof session.hasReturned==='function'&&session.hasReturned()){await session.resume();break;}}
  }catch(e){status(e.message||'Checkout is temporarily unavailable.');$('retry-checkout').hidden=false;}
 }
 $('retry-confirmation').addEventListener('click',()=>{if(!busy&&pending)confirm(pending.orderId).catch(()=>{});});
 $('retry-checkout').addEventListener('click',initialize);
 initialize();
})();
