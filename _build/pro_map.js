(function drawMap(){
  const svg=$("#map"),wrapEl=svg.closest(".mapwrap");
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  NODES.forEach((n,i)=>{n.ax=n.x;n.ay=n.y;n.vx=0;n.vy=0;n.i=i;n.depth=n.sat?1.5:(n.id==="law"?0.35:0.9);n.hit=n.sat?14:n.r+10;
    if(n.sat){const p=byId[n.sat];n.ox=n.x-p.x;n.oy=n.y-p.y;}});
  /* story dots: one per source, orbiting its topic */
  const SECNODE={landmarks:"landmarks",month:"month",law:"law",meaning:"meaning",privacy:"privacy",watch:"watch",next:"next"};
  const DOTS=[];
  Object.entries(SECNODE).forEach(([sec,nid])=>{const el=document.getElementById(sec);if(!el)return;
    const its=[...el.querySelectorAll("li.item, .card, .prow")].filter(x=>!x.closest(".srclist"));
    its.forEach((it,k)=>{const n=byId[nid];DOTS.push({n,el:it,ang:k/its.length*Math.PI*2+(n.i*.7),rad:n.r+(n.r>=60?30:22)+(k%3)*8,sp:(k%2?1:-1)*(.00006+((k*7)%5)*.00001)});});});
  let g="";
  EDGES.forEach(([a,b,l],i)=>{g+=`<path class="edge ${l?"":"sat"}" data-e="${i}" data-a="${a}" data-b="${b}"/>`;});
  g+=`<g id="dotsL">`+DOTS.map((d,k)=>`<circle class="sdot" data-k="${k}" data-n="${d.n.id}" r="2.7" fill="${d.n.c}"/>`).join("")+`</g>`;
  EDGES.forEach(([a,b,l],i)=>{if(!l)return;const w=l.length*7.3+16;
    g+=`<g class="elab" data-e="${i}"><rect class="elabel-bg" data-e="${i}" x="${-w/2}" y="-12" width="${w}" height="22" rx="11" stroke="var(--rule)"/><text class="elabel" data-e="${i}" x="0" y="4" text-anchor="middle">${esc(l)}</text></g>`;});
  NODES.forEach(n=>{
    if(n.sat){
      const p=byId[n.sat],ang=Math.atan2(n.y-p.y,n.x-p.x),right=Math.cos(ang)>=-.2;
      let tx=Math.abs(Math.cos(ang))<.35?0:(right?14:-14), ty=Math.abs(Math.cos(ang))<.35?(Math.sin(ang)>0?24:-14):4;
      if(n.side==="b"){tx=0;ty=26}
      const anchor=tx===0?"middle":(right?"start":"end");
      g+=`<g class="node sat" tabindex="0" role="button" aria-label="Open ${esc(n.l[0])}" data-n="${n.id}" style="--c:${n.c}">
        <circle class="halo" r="14"/><circle class="dotc" r="6"/><text x="${tx}" y="${ty}" style="text-anchor:${anchor}">${esc(n.l[0])}</text></g>`;
    } else {
      const fs=n.r>=60?19:n.r>=50?17:15.5;
      g+=`<g class="node" tabindex="0" role="button" aria-label="Open ${esc(n.l.join(" "))}" data-n="${n.id}" style="--c:${n.c}">
        <circle class="halo" r="${n.r+12}"/><circle class="core" r="${n.r}"/>
        <text y="${-(n.l.length>1?fs*0.35:-fs*0.1)}" font-size="${fs}" font-weight="700">${esc(n.l[0])}</text>
        ${n.l[1]?`<text y="${fs*0.8}" font-size="${fs}" font-weight="700">${esc(n.l[1])}</text>`:""}
        <text class="sub" y="${n.r+28}">${esc(n.s)}</text></g>`;
    }
  });
  svg.innerHTML=g;
  const nodeEls=Object.fromEntries([...svg.querySelectorAll(".node")].map(e=>[e.dataset.n,e]));
  const edgeEls=[...svg.querySelectorAll("path.edge")],labEls=Object.fromEntries([...svg.querySelectorAll(".elab")].map(e=>[e.dataset.e,e]));
  const dotEls=[...svg.querySelectorAll(".sdot")];
  window.MAPDOTS={DOTS,dotEls};
  let mx=0,my=0,drag=null,visible=true,t0=performance.now();
  function step(now){
    const t=now-t0;
    NODES.forEach(n=>{
      if(n===drag)return;
      let tx,ty;
      if(n.sat){const p=byId[n.sat];tx=p.x+n.ox;ty=p.y+n.oy;}
      else{tx=n.ax;ty=n.ay;}
      if(!reduce){tx+=Math.sin(t*.00045+n.i*1.7)*3+mx*n.depth*16;ty+=Math.cos(t*.0004+n.i*1.3)*3+my*n.depth*12;}
      n.vx=(n.vx+(tx-n.x)*.07)*.8;n.vy=(n.vy+(ty-n.y)*.07)*.8;
    });
    /* soft repulsion between main topics so a dragged node pushes neighbours */
    const mains=NODES.filter(n=>!n.sat);
    for(let a=0;a<mains.length;a++)for(let b=a+1;b<mains.length;b++){const A=mains[a],B=mains[b];
      const dx=B.x-A.x,dy=B.y-A.y,d=Math.hypot(dx,dy)||1,min=A.r+B.r+34;
      if(d<min){const f=(min-d)*.04;const ux=dx/d,uy=dy/d;if(A!==drag){A.vx-=ux*f;A.vy-=uy*f}if(B!==drag){B.vx+=ux*f;B.vy+=uy*f}}}
    NODES.forEach(n=>{if(n!==drag){n.x+=n.vx;n.y+=n.vy;}nodeEls[n.id].setAttribute("transform",`translate(${n.x.toFixed(1)},${n.y.toFixed(1)})`);});
    EDGES.forEach(([a,b,l],i)=>{const c=curve(byId[a],byId[b]);edgeEls[i].setAttribute("d",c.d);if(l)labEls[i].setAttribute("transform",`translate(${c.lx.toFixed(1)},${c.ly.toFixed(1)})`);});
    DOTS.forEach((d,k)=>{const a=d.ang+(reduce?0:t*d.sp);dotEls[k].setAttribute("cx",(d.n.x+Math.cos(a)*d.rad).toFixed(1));dotEls[k].setAttribute("cy",(d.n.y+Math.sin(a)*d.rad).toFixed(1));});
  }
  function loop(now){step(now);if(visible&&(!reduce||drag))requestAnimationFrame(loop);}
  step(performance.now());
  if("IntersectionObserver" in window)new IntersectionObserver(es=>{const v=es[0].isIntersecting;if(v&&!visible){visible=true;requestAnimationFrame(loop)}else visible=v;}).observe(svg);
  if(!reduce)requestAnimationFrame(loop);
  const toSvg=e=>{const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse());};
  wrapEl.addEventListener("pointermove",e=>{const r=wrapEl.getBoundingClientRect();mx=((e.clientX-r.left)/r.width-.5)*2;my=((e.clientY-r.top)/r.height-.5)*2;
    wrapEl.style.setProperty("--mx",(e.clientX-r.left)+"px");wrapEl.style.setProperty("--my",(e.clientY-r.top)+"px");});
  wrapEl.addEventListener("pointerleave",()=>{mx=0;my=0;});
  let downAt=null,moved=false;
  svg.querySelectorAll(".node").forEach(el=>{const id=el.dataset.n,n=byId[id];
    el.addEventListener("pointerdown",e=>{if(e.button!==0)return;downAt=toSvg(e);moved=false;drag=n;el.setPointerCapture(e.pointerId);el.classList.add("dragging");if(reduce)requestAnimationFrame(loop);});
    el.addEventListener("pointermove",e=>{if(drag!==n)return;const p=toSvg(e);if(!moved&&Math.hypot(p.x-downAt.x,p.y-downAt.y)>4)moved=true;if(moved){n.x=p.x;n.y=p.y;n.vx=n.vy=0;}});
    const end=()=>{if(drag===n){drag=null;el.classList.remove("dragging");}};
    el.addEventListener("pointerup",end);el.addEventListener("pointercancel",end);
    el.addEventListener("click",e=>{if(moved){e.preventDefault();moved=false;return}openTopic(id)});
    el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openTopic(id)}});
  });
  const hl=id=>{svg.classList.add("dim");const keep=new Set([id]);
    EDGES.forEach(([a,b],i)=>{if(a===id||b===id){keep.add(a);keep.add(b);svg.querySelectorAll(`[data-e="${i}"]`).forEach(e=>e.classList.add("hl"))}});
    svg.querySelectorAll(".node").forEach(e=>e.classList.toggle("hl",keep.has(e.dataset.n)));
    dotEls.forEach(d=>d.classList.toggle("hl",keep.has(d.dataset.n)));};
  const clear=()=>{if(drag)return;svg.classList.remove("dim");svg.querySelectorAll(".hl").forEach(e=>e.classList.remove("hl"));};
  svg.querySelectorAll(".node").forEach(el=>{const id=el.dataset.n;
    el.addEventListener("mouseenter",()=>hl(id));el.addEventListener("mouseleave",clear);
    el.addEventListener("focus",()=>hl(id));el.addEventListener("blur",clear);});
  $("#topiclist").innerHTML=NODES.filter(n=>!n.sat).map(n=>`<li><button data-open-node="${n.id}" style="--c:${n.c}">${esc(n.l.join(" "))}</button></li>`).join("");
})();
