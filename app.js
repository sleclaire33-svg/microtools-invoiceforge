const $=id=>document.getElementById(id);
const PRODUCTS={template_pack:{slot:"paypal-pack",venmoSlot:"venmo-pack",payLaterSlot:"paylater-pack",cardSlot:"card-pack"},lifetime_pro:{slot:"paypal-lifetime",venmoSlot:"venmo-lifetime",payLaterSlot:"paylater-lifetime",cardSlot:"card-lifetime"}};
function makeQR(){
  const t=$("qrText").value.trim(),r=$("qrResult");
  r.replaceChildren();
  if(!t){r.textContent="Enter text or a URL.";return}
  const img=document.createElement("img");img.alt="QR code";img.width=180;img.height=180;img.loading="lazy";img.src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data="+encodeURIComponent(t);
  r.append(img);const p=document.createElement("div");p.textContent="QR generated.";r.append(p)
}
function calcPct(){const a=Number($("pctA").value),b=Number($("pctB").value);$("pctResult").textContent=Number.isFinite(a)&&Number.isFinite(b)?b+"% of "+a+" = "+(a*b/100).toFixed(2):"Enter both values."}
$("counter").addEventListener("input",e=>{const r=e.target.value,t=r.trim();$("countResult").textContent=r.length+" characters · "+(t?t.split(/\s+/).length:0)+" words"});
function moneySymbol(currency){return ({USD:"$",EUR:"€",GBP:"£",JPY:"¥",CAD:"C$",AUD:"A$",SGD:"S$",THB:"฿"}[currency]||currency+" ")}
function previewInvoice(){
  const f=$("fromName").value||"Your Business",c=$("clientName").value||"Client",n=$("invoiceNo").value||"INV-1001",i=$("itemName").value||"Service";
  const q=Math.max(0,Number($("itemQty").value)||1),p=Math.max(0,Number($("itemPrice").value)||0),t=Math.max(0,Number($("tax").value)||0),d=Math.min(100,Math.max(0,Number($("discount").value)||0));
  const currency=($("currency").value||"USD").trim().toUpperCase().slice(0,3)||"USD",symbol=moneySymbol(currency),subtotal=q*p,discount=subtotal*d/100,taxable=Math.max(0,subtotal-discount),tax=taxable*t/100,total=taxable+tax;
  $("pFrom").textContent=f;$("pClient").textContent="Bill to: "+c;$("pClientEmail").textContent=$("clientEmail").value?"Email: "+$("clientEmail").value:"";
  const date=$("invoiceDate").value,due=$("dueDate").value;$("pDates").textContent=(date?"Invoice date: "+date:"")+(date&&due?" · ":"")+(due?"Due: "+due:"");
  $("pNo").textContent=n;$("pItem").textContent=i+" × "+q;$("pTotal").textContent=symbol+subtotal.toFixed(2);$("pDiscount").textContent="-"+symbol+discount.toFixed(2);$("pTax").textContent=symbol+tax.toFixed(2);$("pGrand").textContent=symbol+total.toFixed(2);$("pNotes").textContent=$("notes").value||""
}
$("year").textContent=new Date().getFullYear();
async function api(path,body){const r=await fetch(path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}),d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||"Request failed");return d}
function showPaid(r){$("payStatus").textContent="Payment complete. Order "+r.orderId;const link=document.createElement("a");link.href=r.downloadUrl;link.target="_blank";link.rel="noopener";link.textContent=" Access your purchase";$("payStatus").appendChild(link)}
async function setupPayPal(){
  try{
    const cfg=await fetch("/api/config").then(r=>r.json());
    if(!cfg.paypalClientId){$("payStatus").textContent="Checkout will appear after the hosting credentials are configured.";return}
    const s=document.createElement("script");s.async=true;s.src=(cfg.environment==="production"?"https://www.paypal.com/web-sdk/v6/core":"https://www.sandbox.paypal.com/web-sdk/v6/core");s.onload=()=>initPayPal(cfg);document.head.appendChild(s)
  }catch(e){console.error(e);$("payStatus").textContent="Checkout setup is temporarily unavailable."}
}
async function initPayPal(cfg){
  try{
    const sdk=await window.paypal.createInstance({clientId:cfg.paypalClientId,components:["paypal-payments","venmo-payments","googlepay-payments","applepay-payments","paypal-guest-payments"],pageType:"checkout",locale:navigator.language||"en-US"});
    const methods=await sdk.findEligibleMethods({currencyCode:cfg.currency});
    for(const [product,p] of Object.entries(PRODUCTS)){
      const createOrder=()=>api("/api/create-order",{product}).then(o=>({orderId:o.orderId}));
      const onApprove=async({orderId})=>{const r=await api("/api/capture-order",{orderId,product});showPaid(r)};
      if(methods.isEligible("paypal")){
        const b=document.createElement("paypal-button");b.type="pay";$(p.slot).replaceChildren(b);
        const session=sdk.createPayPalOneTimePaymentSession({onApprove,onCancel:()=>{$("payStatus").textContent="Payment cancelled."},onError:()=>{$("payStatus").textContent="Payment could not be completed."}});
        b.addEventListener("click",async()=>{try{await session.start({presentationMode:"auto"},createOrder())}catch(e){console.error(e);$("payStatus").textContent=e.message}})
      }else $(p.slot).textContent="PayPal is not available for this transaction.";
      if(methods.isEligible("venmo")){
        const b=document.createElement("venmo-button");b.type="pay";$(p.venmoSlot).replaceChildren(b);
        const session=sdk.createVenmoOneTimePaymentSession({onApprove,onCancel:()=>{$("payStatus").textContent="Payment cancelled."},onError:()=>{$("payStatus").textContent="Payment could not be completed."}});
        b.addEventListener("click",async()=>{try{await session.start({presentationMode:"auto"},createOrder())}catch(e){console.error(e);$("payStatus").textContent=e.message}})
      }else $(p.venmoSlot).textContent="";
      if(methods.isEligible("card")){
        const b=document.createElement("paypal-basic-card-button");b.type="pay";$(p.cardSlot).replaceChildren(b);
        const session=await sdk.createPayPalGuestOneTimePaymentSession({onApprove,onComplete:()=>{},onCancel:()=>{$("payStatus").textContent="Payment cancelled."},onError:()=>{$("payStatus").textContent="Card payment could not be completed."}});
        b.addEventListener("click",async()=>{try{await session.start({presentationMode:"auto"},createOrder())}catch(e){console.error(e);$("payStatus").textContent=e.message}})
      }else $(p.cardSlot).textContent="";
      if(methods.isEligible("paylater")){
        const details=methods.getDetails("paylater"),b=document.createElement("paypal-pay-later-button");b.type="pay";if(details?.productCode)b.productCode=details.productCode;if(details?.countryCode)b.countryCode=details.countryCode;$(p.payLaterSlot).replaceChildren(b);
        const session=sdk.createPayLaterOneTimePaymentSession({onApprove,onCancel:()=>{$("payStatus").textContent="Payment cancelled."},onError:()=>{$("payStatus").textContent="Payment could not be completed."}});
        b.addEventListener("click",async()=>{try{await session.start({presentationMode:"auto"},createOrder())}catch(e){console.error(e);$("payStatus").textContent=e.message}})
      }else $(p.payLaterSlot).textContent="";
    }
    const extras=[];if(methods.isEligible("googlepay"))extras.push("Google Pay");if(methods.isEligible("applepay"))extras.push("Apple Pay");if(methods.isEligible("card"))extras.push("credit/debit cards");
    if(extras.length)$("payStatus").textContent="Checkout options are shown based on your location, currency, device, and PayPal eligibility.";
  }catch(e){console.error(e);$("payStatus").textContent="PayPal checkout could not be initialized."}
}
setupPayPal();