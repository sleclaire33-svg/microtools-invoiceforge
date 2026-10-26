'use strict';
// Minimal Metricool visit beacon, based on its published be.js transport.
// Only public storefront paths are sent; never send query strings, fragments,
// form values, checkout data, downloaded workspace data or full referrer URLs.
(() => {
 const hosts=new Set(['microtoolsstudio.com','www.microtoolsstudio.com']);
 const pages=new Set(['/','/index.html','/kits.html','/preview.html','/invoiceforge.html','/agencyos.html','/certpai.html','/siteintellect.html','/claimproof.html','/start.html','/guides.html','/partial-payment-follow-up.html','/client-kickoff-checklist.html','/renewal-review-checklist.html','/website-fix-retest-checklist.html','/warranty-evidence-checklist.html']);
 if(!hosts.has(location.hostname)||location.protocol!=='https:')return;
 try{
  if(new URLSearchParams(location.search).get('qa')==='1')sessionStorage.setItem('mts-analytics-opt-out','1');
  if(sessionStorage.getItem('mts-analytics-opt-out')==='1')return;
 }catch{return;} // Do not collect when the QA exclusion cannot be checked.
 if(navigator.globalPrivacyControl===true||navigator.doNotTrack==='1'||!pages.has(location.pathname))return;
 const params=new URLSearchParams({hash:'a2e2d47972f9642cf97b94b755df2a5e',u:'https://www.microtoolsstudio.com'+location.pathname});
 if(document.referrer){try{const ref=new URL(document.referrer);if(ref.protocol==='https:'||ref.protocol==='http:')params.set('ref',ref.origin+'/');}catch{}}
 const beacon=document.createElement('img');
 beacon.alt='';beacon.width=1;beacon.height=1;beacon.hidden=true;
 beacon.referrerPolicy='no-referrer';beacon.setAttribute('data-mts-analytics','visit');
 beacon.src='https://tracker.metricool.com/c3po.jpg?'+params.toString();
 document.body.append(beacon);
})();
