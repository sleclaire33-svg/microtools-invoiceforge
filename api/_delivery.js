const crypto=require('node:crypto'),fs=require('node:fs'),path=require('node:path');
const releases=require('./_releases.json');const release=require('./_release.json');
const cache=new Map();
function kitBytes(product='invoiceforge_complete'){
 // Optional single-kit payload remains supported for deployment migration.
 if(product==='invoiceforge_complete'&&process.env.INVOICEFORGE_COMPLETE_BASE64){const bytes=Buffer.from(process.env.INVOICEFORGE_COMPLETE_BASE64,'base64');return bytes.length===release.bytes&&crypto.createHash('sha256').update(bytes).digest('hex')===release.sha256?bytes:null;}
 const item=releases[product],key=process.env.MTS_DOWNLOAD_KEY||'';
 if(!item||!/^[a-f0-9]{64}$/.test(key))return null;
 const cacheKey=product+':'+crypto.createHash('sha256').update(key).digest('hex');if(cache.has(cacheKey))return cache.get(cacheKey);
 try{const candidates=[path.join(process.cwd(),'private-downloads',item.encryptedFile),path.join(__dirname,'../private-downloads',item.encryptedFile)];const source=candidates.find(file=>fs.existsSync(file));if(!source)return null;const encrypted=fs.readFileSync(source);const decipher=crypto.createDecipheriv('aes-256-gcm',Buffer.from(key,'hex'),Buffer.from(item.iv,'hex'));decipher.setAuthTag(Buffer.from(item.tag,'hex'));const bytes=Buffer.concat([decipher.update(encrypted),decipher.final()]);if(bytes.length!==item.bytes||crypto.createHash('sha256').update(bytes).digest('hex')!==item.sha256)return null;cache.set(cacheKey,bytes);return bytes;}catch{return null;}
}
function deliveryReady(product){const item=require('./_products')[product];return Boolean(item)&&(item.format==='zip'?Boolean(kitBytes(product)):true);}
function paymentReady(){const env=process.env.PAYPAL_ENV==='production'?'production':'sandbox';return Boolean(process.env.PAYPAL_CLIENT_ID&&process.env.PAYPAL_CLIENT_SECRET&&process.env.FULFILLMENT_SIGNING_SECRET&&(env!=='production'||(process.env.PAYPAL_WEBHOOK_ID&&process.env.CHECKOUT_LIVE_ENABLED==='true')));}
function orderToken(orderId,product,expires){const secret=process.env.FULFILLMENT_SIGNING_SECRET;if(!secret)throw Error('Delivery configuration missing');return crypto.createHmac('sha256',secret).update('order:'+orderId+':'+product+':'+expires).digest('hex');}
function verifyOrderToken(orderId,product,expires,token){if(!Number.isSafeInteger(Number(expires))||Number(expires)<Math.floor(Date.now()/1000)||typeof token!=='string'||!/^[a-f0-9]{64}$/.test(token))return false;try{return crypto.timingSafeEqual(Buffer.from(orderToken(orderId,product,expires)),Buffer.from(token));}catch{return false;}}
module.exports={kitBytes,deliveryReady,paymentReady,orderToken,verifyOrderToken};
