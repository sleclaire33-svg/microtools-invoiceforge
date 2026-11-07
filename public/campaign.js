'use strict';
// Only our published, non-personal campaign labels may leave this site.
(function(root){
 const creatives=['if-balance-a','if-balance-b','ao-kickoff','cp-renewal','si-retest','cl-evidence'];
 const channels=['ig','li','yt','pin'];
 const partnerCampaigns=['ao-kickoff-tab-text-a','ao-kickoff-tab-text-b','ao-kickoff-ft-resource','ao-kickoff-wdn-resource'];
 const allowed=new Set([...creatives.flatMap(c=>channels.map(n=>c+'-'+n)),...partnerCampaigns]);
 const key='mts-campaign-v1',ttl=24*60*60*1000;
 function enabled(env){return ['www.microtoolsstudio.com','microtoolsstudio.com'].includes(env.location.hostname)&&env.location.protocol==='https:'&&!env.navigator.globalPrivacyControl&&env.navigator.doNotTrack!=='1';}
 function current(env){try{if(!enabled(env)){env.sessionStorage.removeItem(key);return null;}const q=new URLSearchParams(env.location.search);if(q.get('qa')==='1')env.sessionStorage.setItem('mts-analytics-opt-out','1');if(env.sessionStorage.getItem('mts-analytics-opt-out')==='1'){env.sessionStorage.removeItem(key);return null;}const candidate=q.get('campaign');if(candidate!==null){if(!allowed.has(candidate)){env.sessionStorage.removeItem(key);return null;}env.sessionStorage.setItem(key,JSON.stringify({id:candidate,at:Date.now()}));}const value=JSON.parse(env.sessionStorage.getItem(key)||'null');return value&&allowed.has(value.id)&&Number.isFinite(value.at)&&value.at<=Date.now()&&Date.now()-value.at<ttl?value.id:null;}catch{return null;}}
 function decorate(href,env){const u=new URL(href);if(u.origin!=='https://microtoolsai.lemonsqueezy.com'||!/^\/checkout\/buy\/[a-f0-9-]{36}$/.test(u.pathname)||u.search||u.hash)return href;const id=current(env);if(id)u.searchParams.set('checkout[custom][campaign_id]',id);return u.href;}
 if(typeof module!=='undefined'&&module.exports)module.exports={current,decorate};
 if(root&&root.location){current(root);root.MTSCampaign={decorate:href=>decorate(href,root)};}
})(typeof window!=='undefined'?window:null);
