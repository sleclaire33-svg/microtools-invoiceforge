const $=id=>document.getElementById(id);
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

$("counter")?.addEventListener("input",event=>{
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
  const email=$("fromEmail").value.trim();
  let sender=$("pFromEmail"); if(!sender){sender=document.createElement("p");sender.id="pFromEmail";$("pFrom").after(sender);} sender.textContent=email;
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


const invoiceInputIds=["fromName","fromEmail","clientName","clientEmail","invoiceNo","invoiceDate","dueDate","itemName","itemQty","itemPrice","tax","discount","currency","notes"];
invoiceInputIds.forEach(id=>{
  const element=$(id);
  if(element)element.addEventListener("input",previewInvoice);
});
const itemPreset=$("itemPreset");
if(itemPreset){
  itemPreset.addEventListener("change",()=>{
    if(itemPreset.value!=="Other / custom"){
      $("itemName").value=itemPreset.value;
    }else{
      $("itemName").value="";
      $("itemName").focus();
    }
    previewInvoice();
  });
}
previewInvoice();

const exampleButton=$("loadInvoiceExample");
if(exampleButton){
  exampleButton.addEventListener("click",()=>{
    const example={
      fromName:"Northstar Design Studio",fromEmail:"billing@example.com",
      clientName:"Jordan Lee",clientEmail:"jordan@example.com",
      invoiceNo:"INV-1042",invoiceDate:new Date().toISOString().slice(0,10),
      dueDate:"",itemPreset:"Design work",itemName:"Design consultation",
      itemQty:"1",itemPrice:"19.99",tax:"0",discount:"0",currency:"USD",
      notes:"Payment due within 14 days. Thank you for your business."
    };
    Object.entries(example).forEach(([id,value])=>{const el=$(id);if(el)el.value=value;});
    previewInvoice();
    $("invoicePreview").scrollIntoView({behavior:"smooth",block:"center"});
  });
}

