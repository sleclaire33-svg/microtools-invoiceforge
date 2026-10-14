(function(){
"use strict";
const $=id=>document.getElementById(id);
const KEY="invoiceforge_followup_v1";
let records=[];
let selected=null;
const money=(amount,currency)=>{const value=Number(amount);return (currency||"USD").toUpperCase()+" "+(Number.isFinite(value)?value.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}):"0.00")};
function safeLoad(){try{const value=JSON.parse(localStorage.getItem(KEY)||"[]");records=Array.isArray(value)?value.filter(x=>x&&typeof x==="object"&&x.id):[]}catch(e){records=[];}}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(records));return true}catch(e){alert("Could not save in this browser. Storage may be unavailable or full. Export your data or remove some records.");return false;}}
function escapeText(value){return String(value||"");}
function statusLabel(value){return ({upcoming:"Due soon",due:"Due today",overdue:"Overdue",paid:"Paid"})[value]||"Due soon";}
function dateLabel(value){if(!value)return "No due date";const d=new Date(value+"T12:00:00");return Number.isNaN(d.getTime())?value:d.toLocaleDateString();}
function formRecord(){return {id:$("recordId").value||("inv_"+Date.now()+"_"+Math.random().toString(36).slice(2,8)),client:$("client").value.trim(),invoiceNo:$("invoiceNo").value.trim(),amount:Number($("amount").value),currency:$("currency").value.trim().toUpperCase(),dueDate:$("dueDate").value,status:$("status").value,sender:$("sender").value.trim(),context:$("context").value.trim(),updatedAt:new Date().toISOString()};}
function resetForm(){ $("invoiceForm").reset();$("recordId").value="";$("currency").value="USD";$("formHeading").textContent="Add an invoice to follow up"; }
function fillForm(r){$("recordId").value=r.id;$("client").value=r.client||"";$("invoiceNo").value=r.invoiceNo||"";$("amount").value=r.amount??"";$("currency").value=r.currency||"USD";$("dueDate").value=r.dueDate||"";$("status").value=r.status||"upcoming";$("sender").value=r.sender||"";$("context").value=r.context||"";$("formHeading").textContent="Edit invoice";$("draftStage").value=r.status==="paid"?"upcoming":r.status||"upcoming";$("recordSelect").value=r.id;selected=r;}
function render(){
 const list=$("invoiceList"),select=$("recordSelect");
 list.replaceChildren();select.replaceChildren();
 const placeholder=document.createElement("option");placeholder.value="";placeholder.textContent=records.length?"Choose a saved invoice":"No saved invoices yet";select.append(placeholder);
 records.forEach(r=>{const opt=document.createElement("option");opt.value=r.id;opt.textContent=r.invoiceNo+" — "+r.client+" ("+statusLabel(r.status)+")";select.append(opt);
 const card=document.createElement("article");card.className="followup-item";
 const head=document.createElement("div");head.className="followup-item-head";
 const title=document.createElement("div");const h=document.createElement("h3");h.textContent=r.invoiceNo+" · "+r.client;const meta=document.createElement("div");meta.className="followup-meta";meta.textContent=money(r.amount,r.currency)+" · Due: "+dateLabel(r.dueDate);title.append(h,meta);
 const pill=document.createElement("span");pill.className="status-pill";pill.textContent=statusLabel(r.status);head.append(title,pill);card.append(head);
 const actions=document.createElement("div");actions.className="followup-item-actions";
 const make=(label,fn)=>{const b=document.createElement("button");b.type="button";b.textContent=label;b.addEventListener("click",fn);actions.append(b);};
 make("Edit",()=>fillForm(r));
 make("Draft reminder",()=>{fillForm(r);$("draftStage").value=r.status==="paid"?"upcoming":r.status;$("tone").value="friendly";generate();$("reminderOutput").scrollIntoView({behavior:"smooth",block:"center"});});
 make("Mark paid",()=>{r.status="paid";r.updatedAt=new Date().toISOString();persist();render();});
 make("Mark overdue",()=>{r.status="overdue";r.updatedAt=new Date().toISOString();persist();render();});
 make("Delete",()=>{if(confirm("Delete "+r.invoiceNo+" from this browser?")){records=records.filter(x=>x.id!==r.id);if(selected&&selected.id===r.id)selected=null;persist();render();}});
 card.append(actions);list.append(card);
 });
 if(!records.length){const empty=document.createElement("div");empty.className="followup-empty";empty.textContent="No invoices saved yet. Add an invoice above to get started.";list.append(empty);}
}
function stageText(stage,tone){
 const text={
 upcoming:{friendly:"Just a quick note that invoice [INVOICE] for [AMOUNT] is coming due on [DUE]. Please let me know if you need anything from me.",professional:"This is a reminder that invoice [INVOICE] for [AMOUNT] is due on [DUE]. Please let me know if any further information is required.",firm:"Please note that invoice [INVOICE] for [AMOUNT] is due on [DUE]. Kindly arrange payment by the due date or let me know promptly if there is an issue."},
 due:{friendly:"A friendly reminder that invoice [INVOICE] for [AMOUNT] is due today. If payment is already arranged, thank you.",professional:"Invoice [INVOICE] for [AMOUNT] is due today ([DUE]). Please confirm when payment has been arranged.",firm:"Invoice [INVOICE] for [AMOUNT] is due today. Please arrange payment in line with our agreed terms or contact me if there is a problem."},
 overdue:{friendly:"I’m following up on invoice [INVOICE] for [AMOUNT], which was due on [DUE]. If you have already paid, thank you; otherwise, could you share an expected payment date?",professional:"Our records indicate invoice [INVOICE] for [AMOUNT] was due on [DUE] and remains outstanding. Please advise when payment will be made.",firm:"Invoice [INVOICE] for [AMOUNT] was due on [DUE] and appears to remain unpaid. Please arrange payment or contact me promptly to discuss the status."},
 final:{friendly:"I wanted to check in once more about invoice [INVOICE] for [AMOUNT], due on [DUE]. Please let me know the payment status or if there is anything we should discuss.",professional:"This is a further follow-up regarding outstanding invoice [INVOICE] for [AMOUNT], due on [DUE]. Please confirm the expected payment date or contact me to discuss any issue.",firm:"I am following up again on invoice [INVOICE] for [AMOUNT], due on [DUE]. Please respond with the payment status and expected resolution date. If you believe this notice is incorrect, let me know so we can reconcile our records."}
 };
 return text[stage]?.[tone]||text.overdue.professional;
}
function generate(){
 let r=records.find(x=>x.id===$("recordSelect").value)||selected;
 if(!r){const data=formRecord();if(!data.client||!data.invoiceNo||!Number.isFinite(data.amount)||$("amount").value===""){ $("reminderOutput").textContent="Please enter a client, invoice number and amount, then save the invoice or complete the form.";return;}r=data;}
 if(r.status==="paid"){ $("reminderOutput").textContent="This invoice is marked paid. Confirm receipt before sending a reminder, or change its status if that is incorrect.";return;}
 const stage=$("draftStage").value,tone=$("tone").value;
 const amount=money(r.amount,r.currency),due=dateLabel(r.dueDate);
 const greeting=tone==="friendly"?"Hi "+(r.client||"[CLIENT NAME]")+",":tone==="firm"?"Hello "+(r.client||"[CLIENT NAME]")+",":"Hello "+(r.client||"[CLIENT NAME]")+",";
 const close=tone==="friendly"?"Thanks for your help.":tone==="firm"?"Thank you for your prompt attention.":"Thank you for your attention.";
 let body=stageText(stage,tone).replaceAll("[INVOICE]",r.invoiceNo||"[INVOICE NUMBER]").replaceAll("[AMOUNT]",amount).replaceAll("[DUE]",due);
 if(r.context)body+="\n\n"+r.context;
 body=body.replace(/\bI’m\b/g,"I'm");
 $("reminderOutput").textContent="Subject: "+(stage==="upcoming"?"Upcoming payment":stage==="due"?"Payment due today":stage==="final"?"Follow-up required":"Payment reminder")+": invoice "+(r.invoiceNo||"[INVOICE NUMBER]")+"\n\n"+greeting+"\n\n"+body+"\n\n"+close+"\n"+(r.sender||"[YOUR NAME / BUSINESS]");
 selected=r;
}
$("invoiceForm").addEventListener("submit",e=>{e.preventDefault();const r=formRecord();if(!r.client||!r.invoiceNo||!Number.isFinite(r.amount)||$("amount").value==="")return;const idx=records.findIndex(x=>x.id===r.id);if(idx>=0)records[idx]=r;else records.unshift(r);if(persist()){selected=r;render();$("recordSelect").value=r.id;$("draftStage").value=r.status==="paid"?"upcoming":r.status;generate();resetForm();$("recordSelect").value=r.id;}});
$("resetForm").addEventListener("click",resetForm);
$("recordSelect").addEventListener("change",()=>{selected=records.find(x=>x.id===$("recordSelect").value)||null;if(selected){$("draftStage").value=selected.status==="paid"?"upcoming":selected.status; }});
$("generateReminder").addEventListener("click",generate);
$("tone").addEventListener("change",()=>{if($("reminderOutput").textContent!=="Complete the form or select a saved invoice, then choose “Generate reminder”.")generate();});
$("draftStage").addEventListener("change",()=>{if($("recordSelect").value)generate();});
$("copyReminder").addEventListener("click",async()=>{const text=$("reminderOutput").textContent;if(!text||text.startsWith("Complete the form")){$("copyStatus").textContent="Generate a reminder first.";return;}try{await navigator.clipboard.writeText(text);$("copyStatus").textContent="Reminder copied to clipboard.";}catch(e){const area=document.createElement("textarea");area.value=text;area.style.position="fixed";area.style.opacity="0";document.body.append(area);area.select();const ok=document.execCommand("copy");area.remove();$("copyStatus").textContent=ok?"Reminder copied to clipboard.":"Copy was blocked. Select the reminder text and copy it manually."; }});
$("exportData").addEventListener("click",()=>{const blob=new Blob([JSON.stringify({format:"invoiceforge-followup-v1",exportedAt:new Date().toISOString(),records},null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="invoiceforge-followup-backup.json";a.click();URL.revokeObjectURL(url);});
$("importData").addEventListener("click",()=>$("importFile").click());
$("importFile").addEventListener("change",async e=>{const file=e.target.files&&e.target.files[0];if(!file)return;try{const data=JSON.parse(await file.text());const incoming=Array.isArray(data)?data:data.records;if(!Array.isArray(incoming))throw Error("Invalid backup");const valid=incoming.filter(r=>r&&typeof r.id==="string"&&typeof r.client==="string"&&typeof r.invoiceNo==="string"&&Number.isFinite(Number(r.amount))&&["upcoming","due","overdue","paid"].includes(r.status));if(!confirm("Import "+valid.length+" valid records? Existing records with the same ID will be replaced."))return;for(const r of valid){const i=records.findIndex(x=>x.id===r.id);if(i>=0)records[i]=r;else records.push(r);}if(persist()){render();alert("Backup imported.");}}catch(err){alert("Could not import this backup. Please choose a valid InvoiceForge JSON backup.");}finally{e.target.value="";}});
$("clearData").addEventListener("click",()=>{if(confirm("Delete all InvoiceForge follow-up records stored in this browser? Export a backup first if you may need them.")){records=[];selected=null;persist();render();resetForm();$("reminderOutput").textContent="Complete the form or select a saved invoice, then choose “Generate reminder”."; $("copyStatus").textContent="";}});
safeLoad();render();
})();
