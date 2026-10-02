
/* ---------- corkboard: texture, tilt and pins ---------- */
(function(){
  /* cork texture drawn once on a canvas and tiled as the board background */
  try{
    const c=document.createElement("canvas");c.width=c.height=360;const x=c.getContext("2d");
    x.fillStyle="#bb8a5b";x.fillRect(0,0,360,360);
    let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
    const tones=["#a8774a","#c99a69","#9b6a3f","#d3a674","#8f5f36","#b5844f","#e0b484"];
    for(let i=0;i<5200;i++){x.fillStyle=tones[(rnd()*tones.length)|0];x.globalAlpha=.35+rnd()*.5;
      const r=.6+rnd()*2.4;x.beginPath();x.ellipse(rnd()*360,rnd()*360,r,r*(.5+rnd()*.8),rnd()*Math.PI,0,Math.PI*2);x.fill();}
    x.globalAlpha=.18;for(let i=0;i<260;i++){x.fillStyle=rnd()>.5?"#6f4523":"#f0c896";x.fillRect(rnd()*360,rnd()*360,1+rnd()*2,1+rnd()*2);}
    document.body.style.setProperty("--cork",`url(${c.toDataURL("image/png")})`);
    document.documentElement.style.setProperty("--cork",`url(${c.toDataURL("image/png")})`);
  }catch(_){}
  /* each note hangs a little crooked: a fixed tilt per element, so the board looks the same on every visit */
  const tilt=(sel,max)=>document.querySelectorAll(sel).forEach((el,i)=>{const big=el.offsetWidth>620;const m=big?Math.min(max,.6):max;
    const r=((Math.sin(i*12.9898+sel.length*78.233)*43758.5453)%1);el.style.setProperty("--rot",(r*m).toFixed(2)+"deg");});
  tilt(".card",2);tilt(".hook",1.6);tilt(".step",1.2);tilt(".stat",2.2);tilt(".panel",.9);tilt(".chartbox",.5);tilt(".arc li",2);tilt(".tm",.3);
  /* push pins on the map's topic discs */
  const NS="http://www.w3.org/2000/svg",cols=["#c62828","#1f5fa8","#d9a20b","#3d7a2a"];
  document.querySelectorAll("#map .node:not(.sat)").forEach((g,i)=>{const core=g.querySelector("circle.core");if(!core)return;const r=+core.getAttribute("r");
    const pin=document.createElementNS(NS,"g");pin.setAttribute("class","pinhead");
    pin.innerHTML=`<circle cx="0" cy="${-r+10}" r="8" fill="${cols[i%4]}"/><circle cx="-2.5" cy="${-r+7.5}" r="2.4" fill="rgba(255,255,255,.85)"/>`;g.appendChild(pin);});
})();
