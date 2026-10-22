// Run with an existing locally prepared customer-package directory. Never commits the key.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const source=process.argv[2];if(!source)throw Error('Pass the prepared release directory.');
const keyPath=path.join(__dirname,'../.env.downloads.local');
let key;if(fs.existsSync(keyPath)){const match=fs.readFileSync(keyPath,'utf8').match(/^MTS_DOWNLOAD_KEY=([a-f0-9]{64})$/m);if(!match)throw Error('Invalid local release key');key=Buffer.from(match[1],'hex');}else{key=crypto.randomBytes(32);fs.writeFileSync(keyPath,'MTS_DOWNLOAD_KEY='+key.toString('hex')+'\n',{mode:0o600});}
const targets={invoiceforge_complete:'InvoiceForge',certpai_complete:'CertPai',siteintellect_complete:'SiteIntellect',claimproof_complete:'ClaimProof'};const manifest={};fs.mkdirSync(path.join(__dirname,'../private-downloads'),{recursive:true});
for(const [id,prefix]of Object.entries(targets)){const filename=prefix+'_Complete_Kit_v3.zip';const data=fs.readFileSync(path.join(source,filename));const iv=crypto.randomBytes(12);const cipher=crypto.createCipheriv('aes-256-gcm',key,iv);const encrypted=Buffer.concat([cipher.update(data),cipher.final()]);const encryptedFile=id+'.bin';fs.writeFileSync(path.join(__dirname,'../private-downloads',encryptedFile),encrypted);manifest[id]={filename,bytes:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex'),version:'3.0',encryptedFile,iv:iv.toString('hex'),tag:cipher.getAuthTag().toString('hex')};}
fs.writeFileSync(path.join(__dirname,'../api/_releases.json'),JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync(path.join(__dirname,'../api/_release.json'),JSON.stringify(manifest.invoiceforge_complete,null,2)+'\n');
console.log('Packaged '+Object.keys(manifest).length+' encrypted releases. Key kept only in the ignored local configuration file.');
