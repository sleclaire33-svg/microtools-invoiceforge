'use strict';
(()=>{
 const $=id=>document.getElementById(id);let receipt;
 try{receipt=JSON.parse(sessionStorage.getItem('invoiceforge.receipt'));}catch{return;}
 if(!receipt||receipt.status!=='COMPLETED'||typeof receipt.downloadUrl!=='string'||!receipt.downloadUrl.startsWith('/api/download?'))return;
 $('confirmation-empty').hidden=true;$('confirmation-success').hidden=false;
 $('receipt-product').textContent=receipt.name;$('receipt-order').textContent=receipt.orderId;$('receipt-capture').textContent=receipt.captureId;
 $('confirmation-detail').textContent=receipt.environment==='sandbox'?'Sandbox test completed. No real payment was taken. This download is for verifying delivery.':'Payment confirmed. Download your files and save your order details.';
 $('download-kit').href=receipt.downloadUrl;
 if(receipt.format!=='zip'){$('download-kit').textContent='Open your purchased resource →';document.querySelector('.onboarding-steps').hidden=true;}
 const expiry=new Date(Number(receipt.expires)*1000);$('expiry-note').textContent='Your access link expires '+expiry.toLocaleString()+'. Save your files and order details now.';
 if(expiry<Date.now()){$('download-kit').textContent='Link expired — get download help';$('download-kit').href='support.html';}
 $('receipt-help').href='mailto:sean@microtoolsstudio.com?subject='+encodeURIComponent('Micro Tools Studio order '+receipt.orderId);
 $('save-receipt').addEventListener('click',()=>{const text=['Micro Tools Studio order details','Product: '+receipt.name,'Amount: '+receipt.currency+' '+receipt.amount,'Order: '+receipt.orderId,'Payment reference: '+receipt.captureId,'Mode: '+receipt.environment,'Access expires: '+expiry.toISOString(),'Download: '+new URL(receipt.downloadUrl,location.origin).href,'Support: sean@microtoolsstudio.com','Keep this file private. It includes your time-limited access link.'].join('\n');const url=URL.createObjectURL(new Blob([text],{type:'text/plain'}));const a=document.createElement('a');a.href=url;a.download='Micro_Tools_Order_'+receipt.orderId+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
})();
