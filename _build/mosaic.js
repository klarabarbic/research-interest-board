
/* ---------- mosaic: a treemap that always fills its frame ---------- */
const fmtN=v=>v>=1e6?(v/1e6).toFixed(v>=1e7?0:1)+"M":v>=1e3?(v/1e3).toFixed(v>=1e4?0:1)+"k":String(Math.round(v));
function tileHTML(it){
  const tags=(it.tags||[]).map(([c,l])=>`<span class="tag ${c}">${esc(l)}</span>`).join(" ");
  const tc=((it.tags||[]).find(t=>["law","ai","priv","warn"].includes(t[0]))||[])[0];
  return `<li class="item tile" ${it.cat?`data-cat="${it.cat}"`:""} ${tc?`style="--c:var(--${tc})"`:""}>${coverHTML(it.src)}<div class="tile-body"><div class="d">${esc(it.d)} ${tags}</div><p>${it.h}</p>${srcHTML(it.src||[],it.vs)}</div></li>`;
}
/* squarified treemap (Bruls, Huizing & van Wijk 2000): areas proportional to weights, no gaps */
function squarify(ws,W,H){
  const total=ws.reduce((a,b)=>a+b,0),items=ws.map((w,i)=>({i,a:w/total*W*H})).sort((p,q)=>q.a-p.a);
  const out=[];let x=0,y=0,w=W,h=H,row=[];
  const worst=(r,len)=>{const s=r.reduce((a,b)=>a+b.a,0),mx=Math.max(...r.map(o=>o.a)),mn=Math.min(...r.map(o=>o.a));return Math.max(len*len*mx/(s*s),(s*s)/(len*len*mn));};
  const place=r=>{const s=r.reduce((a,b)=>a+b.a,0);
    if(w>=h){const cw=s/h;let cy=y;r.forEach(o=>{const ch=o.a/cw;out[o.i]={x,y:cy,w:cw,h:ch};cy+=ch});x+=cw;w-=cw;}
    else{const rh=s/w;let cx=x;r.forEach(o=>{const cw=o.a/rh;out[o.i]={x:cx,y,w:cw,h:rh};cx+=cw});y+=rh;h-=rh;}};
  items.forEach(o=>{const len=Math.min(w,h);if(!row.length||worst([...row,o],len)<=worst(row,len))row.push(o);else{place(row);row=[o];}});
  if(row.length)place(row);
  return out;
}
const MOSAICS=new Set();
function layoutMosaic(ul,opts){
  if(opts)ul._opts=opts;opts=ul._opts||{};
  ul.classList.add("board");
  if(!ul.parentNode.classList.contains("mosaic-vp")){
    const wrap=document.createElement("div");wrap.className="mosaic";
    const vp=document.createElement("div");vp.className="mosaic-vp";vp.tabIndex=0;vp.setAttribute("aria-label","Mosaic. Drag or scroll to explore.");
    ul.parentNode.insertBefore(wrap,ul);vp.appendChild(ul);wrap.appendChild(vp);
    wrap.insertAdjacentHTML("afterbegin",`<span class="drag-hint">✥ Drag to explore</span>`);
    wrap.insertAdjacentHTML("beforeend",`<div class="mosaic-bar"><span>${esc(opts.legend||"Drag, scroll or swipe to see every story")}</span><button type="button" data-recenter>Recenter</button></div>`);
    dragify(vp);
    wrap.querySelector("[data-recenter]").addEventListener("click",()=>vp.scrollTo({left:0,top:0,behavior:"smooth"}));
    MOSAICS.add(ul);
    if("ResizeObserver" in window)new ResizeObserver(()=>positionTiles(ul)).observe(vp);
  }
  positionTiles(ul);
}
function positionTiles(ul){
  const vp=ul.parentNode,vw=vp.clientWidth;if(!vw)return;
  const opts=ul._opts||{},tiles=[...ul.children].filter(t=>!t.hidden);if(!tiles.length){ul.style.height="0px";return;}
  const ws=tiles.map(t=>opts.weight?opts.weight(t):1);
  const H=Math.min(opts.height||560,Math.max(360,innerHeight*.72));
  const minA=opts.minArea||52000, wmin=Math.min(...ws), sum=ws.reduce((a,b)=>a+b,0);
  const W=Math.max(vw,Math.ceil(minA*sum/(H*wmin)));
  ul.style.width=W+"px";ul.style.height=H+"px";
  const rects=squarify(ws,W,H), G=6;
  tiles.forEach((t,k)=>{const r=rects[k];
    Object.assign(t.style,{left:(r.x+G/2)+"px",top:(r.y+G/2)+"px",width:(r.w-G)+"px",height:(r.h-G)+"px"});
    const s=Math.sqrt(r.w*r.h);t.classList.remove("t1","t2","t3","t4","t5");
    t.classList.add(s<200?"t1":s<250?"t2":s<320?"t3":s<400?"t4":"t5");});
}
function relayoutIn(root){MOSAICS.forEach(ul=>{if(root.contains(ul))positionTiles(ul)})}
function dragify(vp){
  let sx,sy,sl,st,down=false,moved=false;
  vp.addEventListener("pointerdown",e=>{if(e.pointerType!=="mouse"||e.button!==0)return;down=true;moved=false;sx=e.clientX;sy=e.clientY;sl=vp.scrollLeft;st=vp.scrollTop;});
  window.addEventListener("pointermove",e=>{if(!down)return;const dx=e.clientX-sx,dy=e.clientY-sy;
    if(!moved&&Math.hypot(dx,dy)>5){moved=true;vp.classList.add("grabbing");vp.closest(".mosaic").classList.add("touched");}
    if(moved){vp.scrollLeft=sl-dx;}});
  window.addEventListener("pointerup",()=>{if(!down)return;down=false;setTimeout(()=>vp.classList.remove("grabbing"),0);});
  vp.addEventListener("click",e=>{if(moved){e.preventDefault();e.stopPropagation();moved=false;}},true);
  vp.addEventListener("scroll",()=>vp.closest(".mosaic").classList.add("touched"),{once:true});
  vp.addEventListener("dragstart",e=>e.preventDefault());
  vp.addEventListener("wheel",e=>{
    const dx=e.shiftKey&&!e.deltaX?e.deltaY:e.deltaX;
    if(Math.abs(dx)<=Math.abs(e.shiftKey?0:e.deltaY))return;            /* mostly vertical: let the page scroll */
    const max=vp.scrollWidth-vp.clientWidth;
    if((dx<0&&vp.scrollLeft<=0)||(dx>0&&vp.scrollLeft>=max-1))return;   /* at an edge: don't trap the gesture */
    e.preventDefault();vp.scrollLeft+=dx;vp.closest(".mosaic").classList.add("touched");
  },{passive:false});
}
