const handler=require("../../api/webhook");
exports.handler=async(event)=>{
  let out={statusCode:200,body:""};
  let body={}; try{body=event.body?JSON.parse(event.isBase64Encoded?Buffer.from(event.body,"base64").toString("utf8"):event.body):{}}catch{}
  const headers=Object.fromEntries(Object.entries(event.headers||{}).map(([k,v])=>[k.toLowerCase(),v]));
  const res={status(c){out.statusCode=c;return this},json(v){out.body=JSON.stringify(v);return this},send(v){out.body=String(v);return this}};
  await handler({method:event.httpMethod,headers,body,query:event.queryStringParameters||{}},res);
  return {statusCode:out.statusCode,headers:{"Content-Type":"application/json; charset=utf-8"},body:out.body};
};
