module.exports=(req,res)=>{
  if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
  const environment=process.env.PAYPAL_ENV==="production"?"production":"sandbox";
  const webhookConfigured=Boolean(process.env.PAYPAL_WEBHOOK_ID);
  const checkoutReady=Boolean(process.env.PAYPAL_CLIENT_ID&&process.env.PAYPAL_CLIENT_SECRET&&process.env.FULFILLMENT_SIGNING_SECRET&&(environment!=="production"||webhookConfigured));
  return res.status(200).json({
    currency:process.env.PAYPAL_CURRENCY||"USD",
    environment,
    checkoutReady,
    webhookConfigured
  });
};
