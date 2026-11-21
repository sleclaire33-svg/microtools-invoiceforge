'use strict';
const FreeToolsCore=(()=>{
 function bounded(v,min,max,label){if(String(v).trim()===''||!Number.isFinite(Number(v))||Number(v)<min||Number(v)>max)throw Error('Enter '+label+' between '+min+' and '+max+'.');return Number(v);}
 // Calculate nonnegative decimal amounts as rational BigInts, not binary floats.
 function decimal(v){
  const s=String(v).trim(),m=s.match(/^\+?(\d*\.?\d+)(?:e([+-]?\d+))?$/i);
  if(!m||s.length>400)throw Error('Enter a valid decimal amount.');
  const parts=m[1].split('.'),scale=(parts[1]||'').length-Number(m[2]||0);
  if(Math.abs(scale)>400)throw Error('Enter a decimal amount within supported precision.');
  const n=BigInt(parts.join(''));return scale>=0?[n,10n**BigInt(scale)]:[n*10n**BigInt(-scale),1n];
 }
 function roundRatio(n,d){return (2n*n+d)/(2n*d);}
 function safeCents(n){
  if(n<0n||n>BigInt(Number.MAX_SAFE_INTEGER))throw Error('Quote amount exceeds the safe currency limit.');
  return Number(n);
 }
 function quote(items,discount,tax){
  let cents=0n;const lineCents=[];
  for(const r of items){
   bounded(r.qty,0,1000000,'quantity');bounded(r.rate||0,0,1000000000,'rate');
   const [qn,qd]=decimal(r.qty),[rn,rd]=decimal(r.rate||0);
   const line=roundRatio(qn*rn*100n,qd*rd);lineCents.push(safeCents(line));cents+=line;safeCents(cents);
  }
  bounded(discount||0,0,Number(cents)/100,'a discount');
  const t=bounded(tax||0,0,100,'a charge percentage');
  const [dn,dd]=decimal(discount||0),[tn,td]=decimal(tax||0);
  const dc=roundRatio(dn*100n,dd),base=cents-dc;
  const total=base+roundRatio(base*tn,td*100n);
  return{lineCents,subtotal:safeCents(cents)/100,discount:safeCents(dc)/100,tax:t,total:safeCents(total)/100};
 }
 function rate(r){const take=bounded(r.take,0,1000000000,'take-home target'),expenses=bounded(r.expenses,0,1000000000,'expenses'),buffer=bounded(r.buffer,0,1000000000,'buffer'),tax=bounded(r.tax,0,90,'tax reserve')/100,fees=bounded(r.fees,0,30,'fees')/100,hours=bounded(r.hours,1,100,'weekly hours'),billable=bounded(r.billable,1,100,'billable share')/100,weeks=bounded(r.weeks,1,52,'working weeks'),monthlyHours=hours*billable*weeks/12,revenue=(take+expenses+buffer)/(1-tax)/(1-fees);return{monthlyHours,revenue,hourly:revenue/monthlyHours};}
 return{quote,rate};
})();
if(typeof module!=='undefined')module.exports=FreeToolsCore;
