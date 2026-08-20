/* HTL SDK - HumanTrust Layer - 1 ligne, zero friction */
(function(){
var s=document.currentScript;
var c=(s&&s.getAttribute('data-client'))||'public';
window.HTL={client:c,version:'0.9-preview',ready:false,level:function(){return window.HTLPhantom?HTLPhantom.level():0;}};
function load(u){var e=document.createElement('script');e.src=u;e.onload=function(){window.HTL.ready=true;};document.head.appendChild(e);}
load('https://htl-foundry.github.io/htl-core/apps/htl-test/lib/motion.js');
load('https://htl-foundry.github.io/htl-core/apps/htl-test/lib/phantom.js');
})();
