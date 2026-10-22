'use strict';
const FreeToolsCore=(()=>{
 function bounded(v,min,max,label){if(String(v).trim()===''||!Number.isFinite(Number(v))||Number(v)<min||Number(v)>max)throw Error('Enter '+label+' between '+min+' and '+max+'.');return Number(v);}
 function quote(items,discount,tax){let cents=0;for(const r of items){const q=bounded(r.qty,0,1000000,'quantity'),rate=bounded(r.rate||0,0,1000000000,'rate');cents+=Math.round(q*rate*100);}const d=bounded(discount||0,0,cents/100,'a discount'),t=bounded(tax||0,0,100,'a charge percentage');const dc=Math.round(d*100),base=cents-dc;return{subtotal:cents/100,discount:dc/100,tax:t,total:(base+Math.round(base*t/100))/100};}
 function rate(r){const take=bounded(r.take,0,1000000000,'take-home target'),expenses=bounded(r.expenses,0,1000000000,'expenses'),buffer=bounded(r.buffer,0,1000000000,'buffer'),tax=bounded(r.tax,0,90,'tax reserve')/100,fees=bounded(r.fees,0,30,'fees')/100,hours=bounded(r.hours,1,100,'weekly hours'),billable=bounded(r.billable,1,100,'billable share')/100,weeks=bounded(r.weeks,1,52,'working weeks'),monthlyHours=hours*billable*weeks/12,revenue=(take+expenses+buffer)/(1-tax)/(1-fees);return{monthlyHours,revenue,hourly:revenue/monthlyHours};}
 return{quote,rate};
})();
if(typeof module!=='undefined')module.exports=FreeToolsCore;
