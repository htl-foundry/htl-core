/* HTL SDK v1.1 - passeport cross-site + re-verification */
(function(){
var s=document.currentScript;
var c=(s&&s.getAttribute('data-client'))||'public';
window.HTL={client:c,version:'1.1',ready:false,level:0};
var API='https://wrilwtbjuzbmjncqlvgu.supabase.co/functions/v1/smart-api';
var AK='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyaWx3dGJqdXpibWpuY3Fsdmd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNzA0NzUsImV4cCI6MjEwMjY0NjQ3NX0.kXhA4gKddA9UAJR_Pa-86n4Okr58JMtt98HsktQtN08';
function load(u,cb){var e=document.createElement('script');e.src=u;e.onload=cb;document.head.appendChild(e);}
function save(k,v){try{localStorage.setItem(k,v);}catch(e){}}
function read(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function post(body,cb){fetch(API,{method:'POST',headers:{'Content-Type':'application/json',apikey:AK,Authorization:'Bearer '+AK},body:JSON.stringify(body)}).then(function(r){return r.json();}).then(cb).catch(function(){});}
function beat(){var tok=read('htl_token');var ent=window.HTLPhantom?HTLPhantom.bits():0;if(ent<2.5)return;
post({silent:true,entropy:ent,client_id:c,token:tok||undefined,did:window.HTLWalletDID||undefined},function(j){
if(!j||!j.ok)return;
if(j.token&&!tok)save('htl_token',j.token);
if(j.level)window.HTL.level=j.level;
if(j.challenge)challenge();});}
function challenge(){if(document.getElementById('htl-ch'))return;var d=document.createElement('div');d.id='htl-ch';
d.style.cssText='position:fixed;bottom:12px;left:12px;right:12px;z-index:99999;background:#fff;color:#111;border-radius:14px;padding:14px;font:14px sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.25)';
d.innerHTML='<b>Verification humaine rapide :</b> ecrivez une phrase courte.';
var t=document.createElement('textarea');t.style.cssText='width:100%;height:54px;margin-top:8px;border:1px solid #ccc;border-radius:8px';
d.appendChild(t);var evs=[];
t.addEventListener('keydown',function(e){evs.push(e.timeStamp);});
t.addEventListener('input',function(){
if(t.value.length>=20&&evs.length>=15){
var dl=[];for(var i=1;i<evs.length;i++)dl.push(evs[i]-evs[i-1]);
var bb={},h=0;for(var i=0;i<dl.length;i++){var k=Math.floor(dl[i]/25);bb[k]=(bb[k]||0)+1;}
for(var k in bb){var p=bb[k]/dl.length;h-=p*Math.log2(p);}
d.remove();
post({entropy:h,std:60,motion:0,client_id:c,token:read('htl_token')||undefined},function(j){if(j&&j.token)save('htl_token',j.token);if(j&&j.level)window.HTL.level=j.level;});
}});
document.body.appendChild(d);}
function idb(cb){var q=indexedDB.open('htl-wallet',1);q.onupgradeneeded=function(){q.result.createObjectStore('kv');};q.onsuccess=function(){var st=q.result.transaction('kv','readonly').objectStore('kv');var g=st.get('wallet');g.onsuccess=function(){cb(g.result||null);};};}
load('https://htl-foundry.github.io/htl-core/apps/htl-test/lib/motion.js',function(){
load('https://htl-foundry.github.io/htl-core/apps/htl-test/lib/phantom.js',function(){window.HTL.ready=true;
idb(function(w){if(w)window.HTLWalletDID=w.did;setInterval(beat,20000);});
});});})();
