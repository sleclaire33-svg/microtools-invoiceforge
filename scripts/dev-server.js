// Local preview only. It never injects production credentials or fake payment success.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../public');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.svg':'image/svg+xml','.xml':'application/xml','.txt':'text/plain'};
http.createServer(async(req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname.startsWith('/api/')){
  const name=url.pathname.slice(5);if(!['config','create-order','capture-order','download'].includes(name)){res.writeHead(404);return res.end('Not found');}
  let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>10000){res.writeHead(413);return res.end('Too large');}}
  let body={};try{body=raw?JSON.parse(raw):{};}catch{res.writeHead(400);return res.end('Invalid JSON');}
  const response={status(c){res.statusCode=c;return this},json(v){res.setHeader('Content-Type','application/json');res.end(JSON.stringify(v));return this},send(v){res.end(v);return this},setHeader(k,v){res.setHeader(k,v)}};
  return require('../api/'+name)({method:req.method,body,query:Object.fromEntries(url.searchParams),headers:req.headers},response);
 }
 const name=decodeURIComponent(url.pathname)==='/'?'/index.html':decodeURIComponent(url.pathname);const file=path.resolve(root,'.'+name);
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end('Not found');}
 res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));
}).listen(Number(process.env.PORT)||4173,'0.0.0.0',()=>console.log('InvoiceForge local preview ready'));
