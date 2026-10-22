const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..');const dest=path.join(root,'public');fs.mkdirSync(dest,{recursive:true});
for(const file of fs.readdirSync(root)){if(/\.(html|css|js)$/.test(file))fs.copyFileSync(path.join(root,file),path.join(dest,file));}
fs.cpSync(path.join(root,'assets'),path.join(dest,'assets'),{recursive:true});
console.log('Static pages and preview assets synchronized to public/.');
