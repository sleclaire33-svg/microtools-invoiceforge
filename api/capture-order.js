const{paypal}=require('./_paypal');const crypto=require('node:crypto');const PRODUCTS=require('./_products');
const{deliveryReady,verifyOrderToken}=require('./_delivery');
function fulfillment(product,captureId,orderId){const exp=Math.floor(Date.now()/1000)+86400;const sig=crypto.createHmac('sha256',process.env.FULFILLMENT_SIGNING_SECRET).update(product+'.'+exp).digest('hex');return{status:'COMPLETED',environment:process.env.PAYPAL_ENV==='production'?'production':'sandbox',orderId,product,captureId,expires:exp,downloadUrl:'/api/download?product='+encodeURIComponent(product)+'&exp='+exp+'&sig='+sig};}
function matches(order,product,item){const unit=order.purchase_units?.[0];return order.purchase_units?.length===1&&unit?.custom_id===product&&unit.amount?.value===item.amount&&unit.amount?.currency_code==='USD';}
function paidCapture(order,item){return order.purchase_units?.[0]?.payments?.captures?.find(c=>c.status==='COMPLETED'&&c.amount?.value===item.amount&&c.amount?.currency_code==='USD');}
module.exports=async(req,res)=>{
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 res.setHeader('Cache-Control','no-store');
 const{orderId,product,expires,checkoutToken}=req.body||{},item=typeof product==='string'&&PRODUCTS[product];
 if(!item||typeof orderId!=='string'||!/^[A-Z0-9-]{8,40}$/i.test(orderId))return res.status(400).json({error:'Invalid checkout request.'});
 if(item.format==='zip'&&!verifyOrderToken(orderId,product,expires,checkoutToken))return res.status(403).json({error:'This order needs to be checked by support. Keep your order number and do not pay again.'});
 if(!process.env.FULFILLMENT_SIGNING_SECRET||!deliveryReady(product))return res.status(503).json({error:'Download delivery is temporarily unavailable. Keep your order number and contact support before paying again.'});
 try{
  const o=await paypal('/v2/checkout/orders/'+encodeURIComponent(orderId));
  if(!o.ok)return res.status(502).json({error:'Unable to verify the PayPal order. Please check again before paying again.'});
  if(!matches(o.data,product,item))return res.status(400).json({error:'This PayPal order does not match the selected product.'});
  if(o.data.status==='COMPLETED'){
   const capture=paidCapture(o.data,item);
   if(!capture)return res.status(402).json({error:'Payment completion could not be verified.'});
   return res.status(200).json(fulfillment(product,capture.id,o.data.id));
  }
  if(o.data.status!=='APPROVED')return res.status(409).json({error:'Payment has not been approved. No download is available yet.',canRestart:['CREATED','VOIDED'].includes(o.data.status)});
  if(process.env.PAYPAL_ENV==='production'&&process.env.CHECKOUT_LIVE_ENABLED!=='true')return res.status(503).json({error:'Live payment capture is not enabled.'});
  const r=await paypal('/v2/checkout/orders/'+encodeURIComponent(orderId)+'/capture',{method:'POST',headers:{'PayPal-Request-Id':'capture-'+orderId}});
  // Re-fetch and revalidate on success and uncertain responses; never issue a download on an approval alone.
  const verified=await paypal('/v2/checkout/orders/'+encodeURIComponent(orderId));
  if(verified.ok&&verified.data.status==='COMPLETED'&&matches(verified.data,product,item)){
   const capture=paidCapture(verified.data,item);
   if(capture)return res.status(200).json(fulfillment(product,capture.id,verified.data.id));
  }
  return res.status(r.ok?402:502).json({error:'Payment confirmation is pending. Check status before paying again.'});
 }catch{return res.status(502).json({error:'Unable to confirm payment yet. Keep your order number and check again before paying again.'});}
};
