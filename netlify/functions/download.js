const handler=require('../../api/download');
exports.handler=async(event)=>{
 let out={statusCode:200,body:'',headers:{}};
 const res={status(c){out.statusCode=c;return this},send(v){out.body=v;return this},setHeader(k,v){out.headers[k]=v}};
 await handler({method:event.httpMethod,headers:event.headers||{},body:{},query:event.queryStringParameters||{}},res);
 const binary=Buffer.isBuffer(out.body);
 return{statusCode:out.statusCode,headers:out.headers,body:binary?out.body.toString('base64'):String(out.body),isBase64Encoded:binary};
};
