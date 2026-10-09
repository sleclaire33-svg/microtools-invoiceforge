module.exports=(req,res)=>{
  if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
  const paypalClientId=process.env.PAYPAL_CLIENT_ID||"";
  const environment=process.env.PAYPAL_ENV==="production"?"production":"sandbox";
  const checkoutReady=Boolean(paypalClientId&&process.env.PAYPAL_CLIENT_SECRET&&process.env.FULFILLMENT_SIGNING_SECRET);
  return res.status(200).json({
    paypalClientId,
    currency:process.env.PAYPAL_CURRENCY||"USD",
    environment,
    checkoutReady,
    webhookConfigured:Boolean(process.env.PAYPAL_WEBHOOK_ID)
  });
};
