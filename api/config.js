const PRODUCTS=require('./_products');
const HOSTED=require('./_hosted-checkouts');
const {deliveryReady,paymentReady}=require('./_delivery');
module.exports=(req,res)=>{
 if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
 res.setHeader('Cache-Control','no-store');
 const environment=process.env.PAYPAL_ENV==='production'?'production':'sandbox';
 const currency=process.env.PAYPAL_CURRENCY||'USD';
 const ready=paymentReady()&&currency==='USD';
 const products=Object.fromEntries(Object.entries(PRODUCTS).map(([key,item])=>[key,{name:item.description,amount:item.amount,currency:'USD',format:item.format||'html',inclusions:item.inclusions||null,ready:ready&&deliveryReady(key),hostedCheckout:HOSTED[key]||null}]));
 return res.status(200).json({paypalClientId:process.env.PAYPAL_CLIENT_ID||'',currency,environment,checkoutReady:ready,webhookConfigured:Boolean(process.env.PAYPAL_WEBHOOK_ID),products});
};
