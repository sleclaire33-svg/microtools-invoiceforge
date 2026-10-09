const $=id=>document.getElementById(id);
const PRODUCTS={
  template_pack:{slot:"paypal-pack",venmoSlot:"venmo-pack",payLaterSlot:"paylater-pack",cardSlot:"card-pack"},
  lifetime_pro:{slot:"paypal-lifetime",venmoSlot:"venmo-lifetime",payLaterSlot:"paylater-lifetime",cardSlot:"card-lifetime"}
};

function makeQR(){
  const value=$("qrText").value.trim(),result=$("qrResult");
  result.replaceChildren();
  if(!value){result.textContent="Enter text or a URL.";return}
  const image=document.createElement("img");
  image.alt="QR code";
  image.width=180;
  image.height=180;
  image.loading="lazy";
  image.src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data="+encodeURIComponent(value);
  image.onerror=()=>{result.textContent="The QR service could not be reached. Please try again."};
  result.append(image);
  const message=document.createElement("div");
  message.textContent="QR code generated.";
  result.append(message);
}

function calcPct(){
  const amountInput=$("pctA").value,percentInput=$("pctB").value;
  if(amountInput.trim()===""||percentInput.trim()===""){
    $("pctResult").textContent="Enter both an amount and a percentage.";
    return;
  }
  const amount=Number(amountInput),percent=Number(percentInput);
  if(!Number.isFinite(amount)||!Number.isFinite(percent)){
    $("pctResult").textContent="Enter valid numbers.";
    return;
  }
  $("pctResult").textContent=percent+"% of "+amount+" = "+(amount*percent/100).toFixed(2);
}

$("counter").addEventListener("input",event=>{
  const value=event.target.value,trimmed=value.trim();
  $("countResult").textContent=value.length+" characters · "+(trimmed?trimmed.split(/\s+/).length:0)+" words";
});

function moneySymbol(currency){
  return ({USD:"$",EUR:"€",GBP:"£",JPY:"¥",CAD:"C$",AUD:"A$",SGD:"S$",THB:"฿"}[currency]||currency+" ");
}

function previewInvoice(){
  const from=$("fromName").value.trim()||"Your Business";
  const client=$("clientName").value.trim()||"Client";
  const invoiceNo=$("invoiceNo").value.trim()||"INV-1001";
  const item=$("itemName").value.trim()||"Service";
  const quantityRaw=$("itemQty").value;
  const priceRaw=$("itemPrice").value;
  const taxRaw=$("tax").value;
  const discountRaw=$("discount").value;
  const quantity=quantityRaw.trim()===""?1:Math.max(0,Number(quantityRaw)||0);
  const price=priceRaw.trim()===""?0:Math.max(0,Number(priceRaw)||0);
  const taxRate=taxRaw.trim()===""?0:Math.max(0,Number(taxRaw)||0);
  const discountRate=discountRaw.trim()===""?0:Math.min(100,Math.max(0,Number(discountRaw)||0));
  const enteredCurrency=$("currency").value.trim().toUpperCase();
  const currency=/^[A-Z]{3}$/.test(enteredCurrency)?enteredCurrency:"USD";
  const symbol=moneySymbol(currency);
  const subtotal=quantity*price;
  const discount=subtotal*discountRate/100;
  const taxable=Math.max(0,subtotal-discount);
  const tax=taxable*taxRate/100;
  const total=taxable+tax;
  const format=value=>value.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});

  $("pFrom").textContent=from;
  $("pClient").textContent="Bill to: "+client;
  $("pClientEmail").textContent=$("clientEmail").value.trim()?"Email: "+$("clientEmail").value.trim():"";
  $("pDates").textContent=($("invoiceDate").value?"Invoice date: "+$("invoiceDate").value:"")+($("invoiceDate").value&&$("dueDate").value?" · ":"")+($("dueDate").value?"Due: "+$("dueDate").value:"");
  $("pNo").textContent=invoiceNo;
  $("pItem").textContent=item+" × "+quantity;
  $("pTotal").textContent=symbol+format(subtotal);
  $("pDiscount").textContent="-"+symbol+format(discount);
  $("pTax").textContent=symbol+format(tax);
  $("pGrand").textContent=symbol+format(total);
  $("pNotes").textContent=$("notes").value.trim();
}

$("year").textContent=new Date().getFullYear();
const invoiceInputIds=["fromName","fromEmail","clientName","clientEmail","invoiceNo","invoiceDate","dueDate","itemName","itemQty","itemPrice","tax","discount","currency","notes"];
invoiceInputIds.forEach(id=>{
  const element=$(id);
  if(element)element.addEventListener("input",previewInvoice);
});
previewInvoice();

async function api(path,body){
  const response=await fetch(path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw Error(data.error||"Request failed. Please try again.");
  return data;
}

function showPaid(result){
  const status=$("payStatus");
  status.replaceChildren();
  status.append(document.createTextNode("Payment complete. Order "+result.orderId+". "));
  const link=document.createElement("a");
  link.href=result.downloadUrl;
  link.textContent="Access your purchase";
  link.rel="noopener";
  status.append(link);
  status.setAttribute("role","status");
}

function setCheckoutStatus(message){
  $("payStatus").textContent=message;
  $("payStatus").setAttribute("role","status");
}

function setAllCheckoutSlots(message){
  for(const slots of Object.values(PRODUCTS)){
    for(const key of ["slot","venmoSlot","cardSlot","payLaterSlot"]){
      const element=$(slots[key]);
      if(element)element.textContent=message;
    }
  }
}

async function setupPayPal(){
  try{
    const response=await fetch("/api/config",{headers:{"Accept":"application/json"}});
    if(!response.ok)throw Error("Checkout configuration could not be loaded.");
    const config=await response.json();
    if(!config.checkoutReady){
      setAllCheckoutSlots("Checkout setup incomplete");
      setCheckoutStatus("Checkout is not ready yet. Payment credentials and the secure fulfillment setting must be completed before purchases can be accepted.");
      return;
    }
    if(config.environment!=="production"){
      setCheckoutStatus("Sandbox test checkout is configured. Purchases are simulated and no real payments will be taken.");
    }else{
      setCheckoutStatus("Checkout options depend on your location, currency, device, and PayPal eligibility.");
    }
    const script=document.createElement("script");
    script.async=true;
    script.src=config.environment==="production"?"https://www.paypal.com/web-sdk/v6/core":"https://www.sandbox.paypal.com/web-sdk/v6/core";
    script.onload=()=>initPayPal(config);
    script.onerror=()=>setCheckoutStatus("PayPal checkout could not load. Please try again later.");
    document.head.append(script);
  }catch(error){
    console.error(error);
    setAllCheckoutSlots("Checkout temporarily unavailable");
    setCheckoutStatus("Checkout setup is temporarily unavailable.");
  }
}

async function initPayPal(config){
  try{
    const sdk=await window.paypal.createInstance({
      clientId:config.paypalClientId,
      components:["paypal-payments","venmo-payments","googlepay-payments","applepay-payments","paypal-guest-payments"],
      pageType:"checkout",
      locale:navigator.language||"en-US"
    });
    const methods=await sdk.findEligibleMethods({currencyCode:config.currency});
    for(const [product,slots] of Object.entries(PRODUCTS)){
      const createOrder=()=>api("/api/create-order",{product}).then(order=>({orderId:order.orderId}));
      const onApprove=async({orderId})=>{
        setCheckoutStatus("Confirming payment and preparing your purchase…");
        try{
          const result=await api("/api/capture-order",{orderId,product});
          showPaid(result);
        }catch(error){
          console.error(error);
          setCheckoutStatus("Your payment may have been approved, but confirmation is still pending. PayPal order ID: "+orderId+". Please contact sleclaire33@gmail.com before trying again.");
          throw error;
        }
      };
      const onCancel=()=>setCheckoutStatus("Payment cancelled. No purchase was completed.");
      const onError=error=>{
        console.error(error);
        setCheckoutStatus("Payment could not be completed. Please try again or contact sleclaire33@gmail.com if the issue continues.");
      };

      if(methods.isEligible("paypal")){
        const button=document.createElement("paypal-button");
        button.type="pay";
        $(slots.slot).replaceChildren(button);
        const session=await sdk.createPayPalOneTimePaymentSession({onApprove,onCancel,onError});
        button.addEventListener("click",async()=>{
          try{setCheckoutStatus("Opening secure PayPal checkout…");await session.start({presentationMode:"auto"},createOrder())}
          catch(error){console.error(error);setCheckoutStatus(error.message||"PayPal checkout could not start.")}
        });
      }else $(slots.slot).textContent="PayPal is not available for this transaction.";

      if(methods.isEligible("venmo")){
        const button=document.createElement("venmo-button");
        button.type="pay";
        $(slots.venmoSlot).replaceChildren(button);
        const session=await sdk.createVenmoOneTimePaymentSession({onApprove,onCancel,onError});
        button.addEventListener("click",async()=>{
          try{setCheckoutStatus("Opening secure Venmo checkout…");await session.start({presentationMode:"auto"},createOrder())}
          catch(error){console.error(error);setCheckoutStatus(error.message||"Venmo checkout could not start.")}
        });
      }else $(slots.venmoSlot).replaceChildren();

      if(methods.isEligible("card")){
        const button=document.createElement("paypal-basic-card-button");
        button.type="pay";
        $(slots.cardSlot).replaceChildren(button);
        const session=await sdk.createPayPalGuestOneTimePaymentSession({onApprove,onComplete:()=>{},onCancel,onError});
        button.addEventListener("click",async()=>{
          try{setCheckoutStatus("Opening secure card checkout…");await session.start({presentationMode:"auto"},createOrder())}
          catch(error){console.error(error);setCheckoutStatus(error.message||"Card checkout could not start.")}
        });
      }else $(slots.cardSlot).replaceChildren();

      if(methods.isEligible("paylater")){
        const details=methods.getDetails("paylater");
        const button=document.createElement("paypal-pay-later-button");
        button.type="pay";
        if(details?.productCode)button.productCode=details.productCode;
        if(details?.countryCode)button.countryCode=details.countryCode;
        $(slots.payLaterSlot).replaceChildren(button);
        const session=await sdk.createPayLaterOneTimePaymentSession({onApprove,onCancel,onError});
        button.addEventListener("click",async()=>{
          try{setCheckoutStatus("Opening secure Pay Later checkout…");await session.start({presentationMode:"auto"},createOrder())}
          catch(error){console.error(error);setCheckoutStatus(error.message||"Pay Later checkout could not start.")}
        });
      }else $(slots.payLaterSlot).replaceChildren();
    }
    if(config.environment==="production")setCheckoutStatus("Checkout options are shown based on your location, currency, device, and PayPal eligibility.");
  }catch(error){
    console.error(error);
    setCheckoutStatus("PayPal checkout could not be initialized. No payment has been taken.");
  }
}

setupPayPal();
