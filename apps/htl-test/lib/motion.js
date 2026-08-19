/* HTL Motion Facet - v0.5 Forteresse */
(function(){
var samples=[],touch=[];
window.addEventListener('devicemotion',function(e){
var a=e.accelerationIncludingGravity;if(!a||a.x==null)return;
var m=Math.sqrt(a.x*a.x+a.y*a.y+a.z*a.z);
samples.push(m);if(samples.length>200)samples.shift();
});
document.addEventListener('touchstart',function(e){
for(var i=0;i<e.changedTouches.length;i++){var t=e.changedTouches[i];
if(t.force!=null)touch.push(t.force);
if(t.radiusX!=null)touch.push(t.radiusX/10);
}},{passive:true});
function ent(arr,bin){if(arr.length<10)return 0;var b={},h=0;
for(var i=0;i<arr.length;i++){var k=Math.floor(arr[i]/bin);b[k]=(b[k]||0)+1;}
for(var k in b){var p=b[k]/arr.length;h-=p*Math.log2(p);}return h;}
function deltas(){var d=[];for(var i=1;i<samples.length;i++)d.push(Math.abs(samples[i]-samples[i-1]));return d;}
window.HTLMotion={bits:function(){return Math.min(6,ent(deltas(),0.02)+ent(touch,0.05));},live:function(){return samples.length;}};
var d=document.createElement('div');d.className='small mono';d.id='mot';d.textContent='Facette 3-4 : capteurs en ecoute...';
var c=document.getElementById('count');if(c&&c.parentNode)c.parentNode.insertBefore(d,c.nextSibling);
setInterval(function(){var m=document.getElementById('mot');if(m)m.textContent='Facette 3-4 : '+HTLMotion.live()+' mesures, entropie '+HTLMotion.bits().toFixed(2)+' bits';},1000);
})();
