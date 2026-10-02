
/* ---------- corkboard v2: generated materials ---------- */
(function(){
  let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  const root=document.documentElement,set=(k,c)=>{try{const u=`url(${c.toDataURL("image/png")})`;root.style.setProperty(k,u);document.body.style.setProperty(k,u)}catch(_){}};
  const mk=(w,h)=>{const c=document.createElement("canvas");c.width=w;c.height=h;return [c,c.getContext("2d")]};
  /* draw at x,y and at the wrapped copies so the tile repeats seamlessly */
  const wrapDraw=(W,H,x,y,r,fn)=>{for(const dx of [0,-W,W])for(const dy of [0,-H,H]){const X=x+dx,Y=y+dy;if(X>-r&&X<W+r&&Y>-r&&Y<H+r)fn(X,Y)}};
  try{
    /* CORK: base, soft blotches, thousands of shaded granules, pores, then pixel grain */
    const N=512,[c,x]=mk(N,N);
    x.fillStyle="#a8744a";x.fillRect(0,0,N,N);
    for(let i=0;i<70;i++){const px=rnd()*N,py=rnd()*N,r=30+rnd()*90,lt=rnd()>.5;
      wrapDraw(N,N,px,py,r,(X,Y)=>{const g=x.createRadialGradient(X,Y,0,X,Y,r);g.addColorStop(0,lt?"rgba(214,168,112,.22)":"rgba(110,66,32,.20)");g.addColorStop(1,"rgba(0,0,0,0)");x.fillStyle=g;x.fillRect(X-r,Y-r,2*r,2*r)})}
    const cols=[[196,146,92],[176,124,74],[212,164,108],[150,100,58],[188,138,86],[226,184,128],[134,88,50]];
    for(let i=0;i<16000;i++){const px=rnd()*N,py=rnd()*N,r=.7+Math.pow(rnd(),2.2)*4.2,[R,G,B]=cols[(rnd()*cols.length)|0],rot=rnd()*Math.PI,sq=.45+rnd()*.55;
      wrapDraw(N,N,px,py,r+2,(X,Y)=>{
        x.fillStyle=`rgba(60,32,12,${.18+rnd()*.2})`;x.beginPath();x.ellipse(X+r*.35,Y+r*.35,r,r*sq,rot,0,Math.PI*2);x.fill();
        x.fillStyle=`rgba(${R},${G},${B},${.55+rnd()*.4})`;x.beginPath();x.ellipse(X,Y,r,r*sq,rot,0,Math.PI*2);x.fill();
        if(r>1.6){x.fillStyle=`rgba(255,236,200,${.12+rnd()*.15})`;x.beginPath();x.ellipse(X-r*.3,Y-r*.3,r*.45,r*.45*sq,rot,0,Math.PI*2);x.fill();}})}
    for(let i=0;i<900;i++){const px=rnd()*N,py=rnd()*N,r=.5+rnd()*1.4;x.fillStyle=`rgba(45,22,8,${.35+rnd()*.4})`;x.beginPath();x.arc(px,py,r,0,Math.PI*2);x.fill();}
    const im=x.getImageData(0,0,N,N),d=im.data;for(let i=0;i<d.length;i+=4){const n=(rnd()-.5)*26;d[i]+=n;d[i+1]+=n*.9;d[i+2]+=n*.7;}x.putImageData(im,0,0);
    set("--cork",c);
  }catch(_){}
  try{
    /* PAPER: transparent fibre layer (fine speckle, short fibres, faint mottling) laid over each paper colour */
    const P=300,[c,x]=mk(P,P);
    for(let i=0;i<26;i++){const px=rnd()*P,py=rnd()*P,r=20+rnd()*60;wrapDraw(P,P,px,py,r,(X,Y)=>{const g=x.createRadialGradient(X,Y,0,X,Y,r);g.addColorStop(0,`rgba(150,115,60,${.035+rnd()*.035})`);g.addColorStop(1,"rgba(0,0,0,0)");x.fillStyle=g;x.fillRect(X-r,Y-r,2*r,2*r)})}
    for(let i=0;i<5200;i++){x.fillStyle=rnd()>.5?`rgba(90,65,30,${.05+rnd()*.07})`:`rgba(255,255,255,${.1+rnd()*.15})`;x.fillRect(rnd()*P,rnd()*P,1,1);}
    x.lineCap="round";for(let i=0;i<260;i++){const px=rnd()*P,py=rnd()*P,l=3+rnd()*11,a=rnd()*Math.PI;
      x.strokeStyle=`rgba(110,85,50,${.05+rnd()*.08})`;x.lineWidth=.5+rnd()*.5;x.beginPath();x.moveTo(px,py);x.quadraticCurveTo(px+Math.cos(a)*l*.5+rnd()*2,py+Math.sin(a)*l*.5+rnd()*2,px+Math.cos(a)*l,py+Math.sin(a)*l);x.stroke();}
    set("--papertex",c);
  }catch(_){}
  try{
    /* WOOD for the frame: warm base with long irregular grain lines */
    const W=240,[c,x]=mk(W,W);const g=x.createLinearGradient(0,0,0,W);g.addColorStop(0,"#6e4524");g.addColorStop(.5,"#5a381c");g.addColorStop(1,"#6b4322");x.fillStyle=g;x.fillRect(0,0,W,W);
    for(let i=0;i<140;i++){let y=rnd()*W;x.strokeStyle=rnd()>.6?`rgba(140,95,55,${.2+rnd()*.25})`:`rgba(35,18,6,${.2+rnd()*.3})`;x.lineWidth=.5+rnd()*1.8;x.beginPath();x.moveTo(0,y);
      for(let px=0;px<=W;px+=12){y+=(rnd()-.5)*1.6;x.lineTo(px,y);}x.stroke();}
    for(let k=0;k<3;k++){const kx=rnd()*W,ky=rnd()*W;for(let r=2;r<14;r+=2.5){x.strokeStyle="rgba(30,15,5,.35)";x.lineWidth=.8;x.beginPath();x.ellipse(kx,ky,r*1.8,r,0,0,Math.PI*2);x.stroke();}}
    const u=`url(${c.toDataURL("image/png")})`;document.body.style.borderImage=`${u} 40 round`;
  }catch(_){}
  /* ink filter for the map: slightly uneven, hand-drawn strokes */
  const svg=document.getElementById("map");
  if(svg){const NS="http://www.w3.org/2000/svg",defs=document.createElementNS(NS,"defs");
    defs.innerHTML=`<filter id="inkRough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G"/></filter>`;
    svg.insertBefore(defs,svg.firstChild);}
})();
