const{paypal}=require('./_paypal');const crypto=require('node:crypto');const PRODUCTS=require('./_products');
const{deliveryReady,paymentReady,orderToken}=require('./_delivery');
module.exports=async(req,res)=>{
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 res.setHeader('Cache-Control','no-store');
 const product=req.body?.product,item=typeof product==='string'&&PRODUCTS[product];
 if(!item)return res.status(400).json({error:'Unknown product.'});
 if(!paymentReady()||(process.env.PAYPAL_CURRENCY||'USD')!=='USD'||!deliveryReady(product))return res.status(503).json({error:'This product is not available for purchase yet. Please try the free tools or contact support.'});
 try{
  const r=await paypal('/v2/checkout/orders',{method:'POST',headers:{'PayPal-Request-Id':product+'-'+crypto.randomUUID()},body:JSON.stringify({intent:'CAPTURE',purchase_units:[{description:item.description,custom_id:product,amount:{currency_code:'USD',value:item.amount}}]})});
  if(!r.ok||!r.data.id)return res.status(502).json({error:'PayPal could not start checkout. No payment was captured.'});
  const expires=Math.floor(Date.now()/1000)+86400;
  res.status(200).json({orderId:r.data.id,expires,checkoutToken:orderToken(r.data.id,product,expires)});
 }catch{res.status(502).json({error:'Checkout is temporarily unavailable. Please try again later.'});}
};
