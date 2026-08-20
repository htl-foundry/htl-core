/* HTL v0.7 */(function(){
window.HTLFallback={run:function(cb){
var c=['#e63946','#457b9d','#2a9d8f','#e9c46a'];
var d=document.createElement('div');d.id='htl-fb';
d.style.cssText='position:fixed;inset:0;background:#000c;z-index:999;display:flex;flex-direction:column;align-items:center;justify-content:center';
d.innerHTML='<h2 style="color:#fff">Mode Secours : reproduisez la sequence</h2>';
var grid=document.createElement('div');grid.style.cssText='display:flex;gap:10px;margin:20px';
c.forEach(function(col){var b=document.createElement('button');
b.style.cssText='width:60px;height:60px;background:'+col+';border:none;border-radius:8px';
b.onclick=function(){cb(col);};grid.appendChild(b);});
d.appendChild(grid);document.body.appendChild(d);}};
})();
