const handler=require("../../api/capture-order");
exports.handler=async(event)=>{
  const headers=Object.fromEntries(Object.entries(event.headers||{}).map(([k,v])=>[k.toLowerCase(),v]));
  let body={};
  if(event.body){
    try{body=JSON.parse(event.isBase64Encoded?Buffer.from(event.body,"base64").toString("utf8"):event.body)}catch{body={}}
  }
  const query=event.queryStringParameters||{};
  const req={method:event.httpMethod,headers,body,query};
  let statusCode=200, responseBody="", responseHeaders={};
  const res={
    status(code){statusCode=code;return this},
    json(value){responseBody=JSON.stringify(value);return this},
    send(value){responseBody=String(value);return this},
    setHeader(key,value){responseHeaders[key]=value}
  };
  await handler(req,res);
  return {statusCode,headers:{"Content-Type":"application/json; charset=utf-8",...responseHeaders},body:responseBody};
};
