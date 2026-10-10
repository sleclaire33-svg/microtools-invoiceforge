const test=require("node:test");
const assert=require("node:assert/strict");
const crypto=require("node:crypto");

function response(){
  return {
    statusCode:200,
    headers:{},
    body:undefined,
    status(code){this.statusCode=code;return this},
    json(value){this.body=value;return this},
    send(value){this.body=value;return this},
    setHeader(key,value){this.headers[key]=value}
  };
}

test("config never exposes server secrets and reports incomplete checkout",()=>{
  const handler=require("../api/config");
  const old={...process.env};
  try{
    process.env.PAYPAL_CLIENT_ID="public-client-id";
    process.env.PAYPAL_CLIENT_SECRET="";
    process.env.FULFILLMENT_SIGNING_SECRET="";
    process.env.PAYPAL_ENV="sandbox";
    const res=response();
    handler({method:"GET"},res);
    assert.equal(res.statusCode,200);
    assert.equal(res.body.paypalClientId,"public-client-id");
    assert.equal(res.body.checkoutReady,false);
    assert.equal(res.body.environment,"sandbox");
    assert.equal(Object.hasOwn(res.body,"paypalClientSecret"),false);
  }finally{
    for(const key of ["PAYPAL_CLIENT_ID","PAYPAL_CLIENT_SECRET","FULFILLMENT_SIGNING_SECRET","PAYPAL_ENV"]){
      if(old[key]===undefined)delete process.env[key];else process.env[key]=old[key];
    }
  }
});

test("config rejects unsupported methods",()=>{
  const handler=require("../api/config");
  const res=response();
  handler({method:"POST"},res);
  assert.equal(res.statusCode,405);
});

test("order creation rejects unknown products before calling PayPal",async()=>{
  const handler=require("../api/create-order");
  const res=response();
  await handler({method:"POST",body:{product:"not-a-product"}},res);
  assert.equal(res.statusCode,400);
  assert.equal(res.body.error,"Unknown product.");
});

test("capture rejects malformed order requests before calling PayPal",async()=>{
  const handler=require("../api/capture-order");
  const res=response();
  await handler({method:"POST",body:{product:"template_pack",orderId:"bad"}},res);
  assert.equal(res.statusCode,400);
  assert.equal(res.body.error,"Invalid checkout request.");
});

test("download accepts a correctly signed, unexpired fulfillment link",async()=>{
  const handler=require("../api/download");
  const previous=process.env.FULFILLMENT_SIGNING_SECRET;
  const secret="unit-test-only-secret-not-for-production";
  process.env.FULFILLMENT_SIGNING_SECRET=secret;
  try{
    const product="template_pack";
    const exp=Math.floor(Date.now()/1000)+600;
    const sig=crypto.createHmac("sha256",secret).update(product+"."+exp).digest("hex");
    const res=response();
    await handler({method:"GET",query:{product,exp:String(exp),sig}},res);
    assert.equal(res.statusCode,200);
    assert.match(res.headers["Content-Type"],/text\/html/i);
    assert.match(res.body,/InvoiceForge Template Pack/);
  }finally{
    if(previous===undefined)delete process.env.FULFILLMENT_SIGNING_SECRET;
    else process.env.FULFILLMENT_SIGNING_SECRET=previous;
  }
});


test("captured order fulfillment URL is accepted by the download verifier",async()=>{
  const captureHandler=require("../api/capture-order");
  const downloadHandler=require("../api/download");
  const keys=["PAYPAL_CLIENT_ID","PAYPAL_CLIENT_SECRET","PAYPAL_ENV","PAYPAL_CURRENCY","FULFILLMENT_SIGNING_SECRET"];
  const previous=Object.fromEntries(keys.map(key=>[key,process.env[key]]));
  const originalFetch=global.fetch;
  const secret="unit-test-only-secret-not-for-production";
  Object.assign(process.env,{
    PAYPAL_CLIENT_ID:"sandbox-client-id",
    PAYPAL_CLIENT_SECRET:"sandbox-client-secret",
    PAYPAL_ENV:"sandbox",
    PAYPAL_CURRENCY:"USD",
    FULFILLMENT_SIGNING_SECRET:secret
  });
  global.fetch=async(url,options={})=>{
    if(String(url).endsWith("/v1/oauth2/token"))return{ok:true,status:200,json:async()=>({access_token:"test-access-token"})};
    if(String(url).includes("/v2/checkout/orders/TESTORDER1234"))return{ok:true,status:200,json:async()=>({
      id:"TESTORDER1234",
      status:"COMPLETED",
      purchase_units:[{
        custom_id:"template_pack",
        amount:{currency_code:"USD",value:"14.99"},
        payments:{captures:[{id:"CAPTURE123",status:"COMPLETED"}]}
      }]
    })};
    throw Error("Unexpected test PayPal request: "+url);
  };
  try{
    const captureRes=response();
    await captureHandler({method:"POST",body:{orderId:"TESTORDER1234",product:"template_pack"}},captureRes);
    assert.equal(captureRes.statusCode,200);
    assert.equal(captureRes.body.status,"COMPLETED");
    const downloadUrl=new URL(captureRes.body.downloadUrl,"https://example.test");
    const downloadRes=response();
    await downloadHandler({method:"GET",query:Object.fromEntries(downloadUrl.searchParams.entries())},downloadRes);
    assert.equal(downloadRes.statusCode,200);
    assert.match(downloadRes.body,/InvoiceForge Template Pack/);
  }finally{
    global.fetch=originalFetch;
    for(const key of keys){
      if(previous[key]===undefined)delete process.env[key];else process.env[key]=previous[key];
    }
  }
});

test("download rejects expired or forged fulfillment links",async()=>{
  const handler=require("../api/download");
  const previous=process.env.FULFILLMENT_SIGNING_SECRET;
  process.env.FULFILLMENT_SIGNING_SECRET="unit-test-only-secret-not-for-production";
  try{
    const wrongMethod=response();
    await handler({method:"POST",query:{product:"template_pack",exp:String(Math.floor(Date.now()/1000)+600),sig:"0".repeat(64)}},wrongMethod);
    assert.equal(wrongMethod.statusCode,405);
    const expired=response();
    await handler({method:"GET",query:{product:"template_pack",exp:"1",sig:"0".repeat(64)}},expired);
    assert.equal(expired.statusCode,403);
    const forged=response();
    await handler({method:"GET",query:{product:"template_pack",exp:String(Math.floor(Date.now()/1000)+600),sig:"0".repeat(64)}},forged);
    assert.equal(forged.statusCode,403);
  }finally{
    if(previous===undefined)delete process.env.FULFILLMENT_SIGNING_SECRET;
    else process.env.FULFILLMENT_SIGNING_SECRET=previous;
  }
});


test("paid downloads deliver substantial product-specific content",async()=>{
  const handler=require("../api/download");
  const previous=process.env.FULFILLMENT_SIGNING_SECRET;
  const secret="unit-test-only-secret-not-for-production";
  process.env.FULFILLMENT_SIGNING_SECRET=secret;
  try{
    for(const [product,expected] of [
      ["template_pack",/12 editable client communication and admin templates/],
      ["lifetime_pro",/Quote-to-cash tracker/]
    ]){
      const exp=Math.floor(Date.now()/1000)+600;
      const sig=crypto.createHmac("sha256",secret).update(product+"."+exp).digest("hex");
      const res=response();
      await handler({method:"GET",query:{product,exp:String(exp),sig}},res);
      assert.equal(res.statusCode,200);
      assert.match(res.body,expected);
      assert.match(res.body,/Print \/ Save as PDF/);
      assert.match(res.body,/noindex,nofollow/);
    }
  }finally{
    if(previous===undefined)delete process.env.FULFILLMENT_SIGNING_SECRET;
    else process.env.FULFILLMENT_SIGNING_SECRET=previous;
  }
});
