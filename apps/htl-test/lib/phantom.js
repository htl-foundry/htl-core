/* HTL Protocole Fantome v0.6 - attestation silencieuse */
(function(){
var ev=[],level=0,degraded=false;
function stamp(t){ev.push(t);if(ev.length>400)ev.shift();}
window.addEventListener('touchstart',function(e){stamp(e.timeStamp);},{passive:true});
window.addEventListener('touchmove',function(e){stamp(e.timeStamp);},{passive:true});
window.addEventListener('keydown',function(e){stamp(e.timeStamp);});
window.addEventListener('pointermove',function(e){stamp(e.timeStamp);},{passive:true});
function bits(){var d=[];for(var i=1;i<ev.length;i++)d.push(ev[i]-ev[i-1]);
if(d.length<10)return 0;var b={},h=0;
for(var i=0;i<d.length;i++){var k=Math.floor(d[i]/25);b[k]=(b[k]||0)+1;}
for(var k in b){var p=b[k]/d.length;h-=p*Math.log2(p);}
return h;}
function idb(){return new Promise(function(res,rej){var q=indexedDB.open('htl-wallet',1);
q.onupgradeneeded=function(){q.result.createObjectStore('kv');};
q.onsuccess=function(){res(q.result.transaction('kv','readwrite').objectStore('kv'));};
q.onerror=function(){rej(q.error);};});}
function b64url(b){var s='';for(var i=0;i<b.length;i++)s+=String.fromCharCode(b[i]);
return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
var STATUS=null;
function ui(t){if(STATUS)STATUS.textContent=t;}
async function boot(){
var d=document.createElement('div');d.id='phantom';
d.style.cssText='margin:10px 0;padding:10px;border:1px solid #1e2a36;border-radius:8px;color:#8b98a5;font-family:monospace;font-size:12px';
var c=document.getElementById('count');
if(c&&c.parentNode)c.parentNode.insertBefore(d,c.nextSibling);
STATUS=d;
ui('FANTOME : recherche du portefeuille...');
var w=null;
try{var s=await idb();w=await new Promise(function(r){var q=s.get('wallet');q.onsuccess=function(){r(q.result||null);};q.onerror=function(){r(null);};});}catch(e){}
if(!w){ui('FANTOME NIVEAU 0 : forge d abord une identite (tape 40 caracteres).');return;}
var impAlg=w.algo==='Ed25519'?{name:'Ed25519'}:{name:'ECDSA',namedCurve:'P-256'};
var signAlg=w.algo==='Ed25519'?{name:'Ed25519'}:{name:'ECDSA',hash:'SHA-256'};
var k=await crypto.subtle.importKey('raw',new Uint8Array(w.dev),{name:'AES-GCM'},false,['decrypt']);
var pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:new Uint8Array(w.priv.iv)},k,new Uint8Array(w.priv.ct));
var pk=await crypto.subtle.importKey('jwk',JSON.parse(new TextDecoder().decode(pt)),impAlg,false,['sign']);
level=1;
ui('FANTOME NIVEAU 1 : portefeuille detecte, ecoute silencieuse active.');
window.HTLPhantom={level:function(){return level;},bits:bits,sign:function(m){return crypto.subtle.sign(signAlg,pk,new TextEncoder().encode(m));}};
setInterval(async function(){
var b=bits();
if(b>2.5&&ev.length>30){
if(level<2)level=2;
degraded=false;
var att={did:w.did,ts:Date.now(),bits:Math.round(b*10000)/10000,lvl:level};
var sig=await window.HTLPhantom.sign(JSON.stringify(att));
var fp=b64url(new Uint8Array(sig).slice(0,8));
if(w.score>=900&&level===2)level=3;
ui('FANTOME NIVEAU '+level+' : attestation '+fp+' - '+b.toFixed(2)+' bits');
}else{
if(level>1)level=1;
degraded=true;
ui('FANTOME : SESSION DEGRADEE - entropie '+b.toFixed(2)+' bits. Touchez l ecran naturellement.');
}
},10000);
}
boot();
})();
