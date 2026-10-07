const handler=require("../../api/webhook");
exports.handler=async(event)=>{
 let out={statusCode:200,body:""};
 let body={}; try{body=event.body?JSON.parse(event.body):{}}catch{}
 const res={status(c){out.statusCode=c;return this},json(v){out.body=JSON.stringify(v);return this},send(v){out.body=String(v);return this}};
 await handler({method:event.httpMethod,headers:event.headers||{},body,query:event.queryStringParameters||{}},res);
 return {statusCode:out.statusCode,headers:{"Content-Type":"application/json"},body:out.body};
};