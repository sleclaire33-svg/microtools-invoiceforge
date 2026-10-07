const handler=require("../../api/config");
exports.handler=async(event)=>{
 let out={statusCode:200,body:""};
 const res={status(c){out.statusCode=c;return this},json(v){out.body=JSON.stringify(v);return this}};
 await handler({method:event.httpMethod,headers:event.headers||{},body:{},query:event.queryStringParameters||{}},res);
 return {statusCode:out.statusCode,headers:{"Content-Type":"application/json"},body:out.body};
};