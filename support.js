'use strict';
(() => {
 const form=document.getElementById('support-form');
 if(!form)return;
 const $=id=>document.getElementById(id);
 const request=()=>{
  const product=$('support-product').value;
  const order=$('support-order').value.trim();
  const subject='Micro Tools Studio support — '+product;
  const body='Product: '+product+'\nOrder number: '+(order||'Not available')+'\n\n'+$('support-message').value.trim();
  return {subject,body,text:'To: sean@microtoolsstudio.com\nSubject: '+subject+'\n\n'+body};
 };
 const showCopy=r=>{$('support-copy-panel').hidden=false;$('support-copy-text').value=r.text;};
 form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const r=request();showCopy(r);
  location.href='mailto:sean@microtoolsstudio.com?subject='+encodeURIComponent(r.subject)+'&body='+encodeURIComponent(r.body);
  $('support-status').textContent='Your email app should open with a draft. If it does not, use Copy request for webmail. Nothing has been sent automatically.';
 });
 $('copy-support-request').addEventListener('click',async()=>{
  if(!form.reportValidity())return;
  const r=request();showCopy(r);
  try{
   await navigator.clipboard.writeText(r.text);
   $('support-status').textContent='Copied. Paste the request into your email service and send it to sean@microtoolsstudio.com.';
  }catch{
   $('support-copy-text').focus();$('support-copy-text').select();
   $('support-status').textContent='Automatic copying is unavailable. Copy the selected request below, then paste it into your email service.';
  }
 });
 for(const event of ['input','change'])form.addEventListener(event,()=>{
  if(!$('support-copy-panel').hidden)showCopy(request());
  $('support-status').textContent='';
 });
})();
