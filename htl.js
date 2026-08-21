/* HTL SDK v1.0 - 1 ligne, heartbeat fantome */
(function(){
var s=document.currentScript;
var c=(s&&s.getAttribute('data-client'))||'public';
window.HTL={client:c,version:'1.0',ready:false,level:0};
function load(u,cb){var e=document.createElement('script');e.src=u;e.onload=cb;document.head.appendChild(e);}
var API='https://wrilwtbjuzbmjncqlvgu.supabase.co/functions/v1/smart-api';
var AK='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyaWx3dGJqdXpibWpuY3Fsdmd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNzA0NzUsImV4cCI6MjEwMjY0NjQ3NX0.kXhA4gKddA9UAJR_Pa-86n4Okr58JMtt98HsktQtN08';
function beat(did){if(!window.HTLPhantom)return;var b=HTLPhantom.bits();if(b<2.5)return;
fetch(API,{method:'POST',headers:{'Content-Type':'application/json',apikey:AK,Authorization:'Bearer '+AK},body:JSON.stringify({did:did,silent:true,entropy:b,client_id:c})}).then(function(r){return r.json();}).then(function(j){if(j&&j.level)window.HTL.level=j.level;}).catch(function(){});}
function idb(cb){var q=indexedDB.open('htl-wallet',1);q.onupgradeneeded=function(){q.result.createObjectStore('kv');};q.onsuccess=function(){var st=q.result.transaction('kv','readonly').objectStore('kv');var g=st.get('wallet');g.onsuccess=function(){cb(g.result||null);};};}
load('https://htl-foundry.github.io/htl-core/apps/htl-test/lib/motion.js',function(){
load('https://htl-foundry.github.io/htl-core/apps/htl-test/lib/phantom.js',function(){
window.HTL.ready=true;
idb(function(w){if(!w)return;setInterval(function(){beat(w.did);},20000);});
});});
})();
