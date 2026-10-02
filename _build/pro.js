
/* ================= PRO LAYER ================= */
/* ---------- my take ---------- */
const MYTAKE={
  law:"This is where my core question lives: can we trust AI to interpret and be used in law? And if it fails, whose liability is it: the developers, the institution using it, or the model itself?",
  meaning:"Take “reasonable doubt.” It is purposely left to interpretation. Can we define it precisely enough to code it, or translate it into a next-token distribution? And if we could, would we lose something essential in the translation?",
  privacy:"Who gets access to the sensitive data a legal AI model processes, and who is to blame if privacy is violated? For me this is one of the hardest parts of the liability question.",
  month:"September 2026 is what made my question urgent: a mathematical breakthrough, an AI agent breaking into a government system, and a voluntary safety pact, all within a few weeks.",
  pulse:"AI's share of the news more than doubled in three years. The attention is real. My question is whether trust has kept pace.",
  next:"Even my own questions are vague, and I can't answer them today. In three years, I hope to be able to answer some of them.",
  landmarks:"The headlines show how quickly capability moved. The legal and governance questions moved much more slowly, and that gap is what I want to study.",
  watch:"I chose these clips to show the problem from both sides: the people building AI, and the courts and lawyers already living with it."
};

/* ---------- time machine ---------- */
const MON3={jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};
const MLAB=i=>{const m=(9+i)%12,y=2023+Math.floor((9+i)/12);return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m]+" "+y;};
function monthIdx(txt){if(!txt)return null;const s=txt.toLowerCase();
  const mm=s.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/),yy=s.match(/\b(19|20)\d{2}\b/);
  if(!mm&&!yy)return null;const y=yy?+yy[0]:2026,m=mm?MON3[mm[1]]:0;const i=(y-2023)*12+m-9;return i<0?-1:Math.min(i,35);}
const TAGGED=[...document.querySelectorAll("li.item, .card, .prow")].filter(el=>!el.closest(".srclist"));
TAGGED.forEach(el=>{const d=el.querySelector(".d, .who, .len, h4");const mi=monthIdx(d&&d.textContent);el.dataset.mi=mi===null?-1:mi;});
let CUT=35;
(function(){
  const svg=$("#tmSpark");const W=1000,H=46,mx=Math.max(...MONTHLY.map(r=>r[2]));
  const pts=MONTHLY.map((r,i)=>[i/35*W,H-2-r[2]/mx*(H-6)]);
  svg.innerHTML=`<polygon points="0,${H} ${pts.map(p=>p.map(v=>v.toFixed(1)).join(",")).join(" ")} ${W},${H}" fill="var(--ai)" opacity=".14"/><polyline points="${pts.map(p=>p.map(v=>v.toFixed(1)).join(",")).join(" ")}" fill="none" stroke="var(--ai)" stroke-width="2" vector-effect="non-scaling-stroke"/><rect id="tmFuture" y="0" height="${H}" fill="var(--bg)" opacity=".72"/><line id="tmCursor" y1="0" y2="${H}" stroke="var(--ink)" stroke-width="1.5" vector-effect="non-scaling-stroke"/>`;
})();
function applyCut(c){CUT=c;
  TAGGED.forEach(el=>{if(!el.closest("#now"))el.classList.toggle("t-out",+el.dataset.mi>c)});
  if(window.MAPDOTS)MAPDOTS.DOTS.forEach((d,k)=>MAPDOTS.dotEls[k].classList.toggle("out",d.el.classList.contains("t-out")));
  relayoutIn(document.body);
  const seen=new Set();TAGGED.forEach(el=>{if(!el.classList.contains("t-out")&&!el.closest("#now")){const a=el.querySelector(".src a");seen.add(a?a.href:el.textContent.slice(0,60));}});
  $("#tmDate").textContent=MLAB(c);$("#tmCount").textContent=`${seen.size} sources on the board by then`;
  const x=c/35*1000;$("#tmCursor").setAttribute("x1",x);$("#tmCursor").setAttribute("x2",x);$("#tmFuture").setAttribute("x",x);$("#tmFuture").setAttribute("width",1000-x);
  $("#tmAll").hidden=c===35;$("#tmRange").value=c;
  const cr=$("#sheetCrumb .tmnote");if(cr)cr.textContent=c<35?`⏱ showing up to ${MLAB(c)}`:"";
}
let tmTimer=null;
$("#tmRange").addEventListener("input",e=>{stopPlay();applyCut(+e.target.value)});
$("#tmAll").addEventListener("click",()=>{stopPlay();applyCut(35)});
function stopPlay(){if(tmTimer){clearInterval(tmTimer);tmTimer=null;$("#tmPlay").textContent="▶ Replay three years";}}
$("#tmPlay").addEventListener("click",()=>{if(tmTimer){stopPlay();return}let c=0;applyCut(0);$("#tmPlay").textContent="❚❚ Pause";
  tmTimer=setInterval(()=>{c++;applyCut(c);if(c>=35)stopPlay();},320);});
applyCut(35);

/* ---------- ask the board (retrieval over the board's own sources) ---------- */
const STOP=new Set("a an the and or of to in on for with by at from is are was were be been it its this that these those what which who whom how why when where do does did can could should would will about into over than as if not no yes vs via i me my we our you your they them their he she his her".split(" "));
const stem=w=>w.length>4?w.replace(/(ies)$/,"y").replace(/(ing|edly|ed|es|s)$/,""):w;
const toks=s=>(s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").match(/[a-z0-9]+/g)||[]).filter(w=>!STOP.has(w)&&w.length>1).map(stem);
const SYN={privacy:["data","gdpr","personal","confidential"],court:["judge","judicial","courts","circuit"],judge:["court","judicial"],vague:["vagueness","ambiguity","ambiguous","meaning"],vagueness:["vague","ambiguity","interpretation"],reasonable:["vague","meaning","interpretation"],liable:["liability","responsible","accountability","sanction"],liability:["liable","responsible","accountability"],fake:["fabricated","hallucinated","hallucination","citation"],hallucination:["fake","fabricated","citation"],copyright:["fair","training","authors"],anonymous:["anonymization","anonymized","identifiable","reidentification","de-identification"],llm:["model","chatgpt","gpt"],ai:["artificial","intelligence"]};
const DOCS=[...TAGGED,...document.querySelectorAll("#myq .hook, #myq .step")].map((el,i)=>{
  const secEl=el.closest("section.ex, section.myq, header.now");const sec=secEl?secEl.id:"";
  const titleEl=el.querySelector("p, h4");const title=(titleEl?titleEl.textContent:el.textContent).trim();
  const body=el.textContent;el.dataset.doc=i;
  return {el,sec,title,date:(el.querySelector(".d, .who, .len, .n")||{}).textContent||"",tset:new Set(toks(title)),bset:new Set(toks(body))};});
const DF=new Map();DOCS.forEach(d=>d.bset.forEach(t=>DF.set(t,(DF.get(t)||0)+1)));
const SECLABEL={...SECNAME,now:"Trending now",myq:"My question"};
function match(set,q){if(set.has(q))return 1;if(q.length>=4){for(const t of set){if(t.startsWith(q)||(t.length>=5&&q.startsWith(t)))return .8;}}return 0;}
function ask(qs){
  const base=toks(qs);if(!base.length)return null;
  const terms=[...new Set(base.flatMap(q=>[q,...(SYN[q]||[]).map(stem)]))];
  const N=DOCS.length;
  const res=DOCS.map(d=>{let s=0,hit=0;base.forEach(q=>{const group=[q,...(SYN[q]||[]).map(stem)];let best=0;
      group.forEach((g,gi)=>{const idf=Math.log(1+N/((DF.get(g)||0)+1));const w=gi?0.55:1;best=Math.max(best,w*idf*(match(d.bset,g)+1.5*match(d.tset,g)));});
      if(best>0)hit++;s+=best;});
    s*=Math.pow(hit/base.length,1.5);if(d.el.classList.contains("t-out"))s*=.6;return {d,s};}).filter(r=>r.s>0).sort((a,b)=>b.s-a.s);
  /* de-duplicate the same story shown in two places */
  const seen=new Set(),out=[];res.forEach(r=>{const k=r.d.title.slice(0,70);if(!seen.has(k)){seen.add(k);out.push(r)}});
  return {terms,all:out,top:out.slice(0,8)};
}
function hiTitle(t,terms){let h=esc(t);terms.filter(x=>x.length>2).forEach(x=>{h=h.replace(new RegExp(`\\b(${x.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}[a-z]*)`,"gi"),"<mark>$1</mark>")});return h;}
function renderAsk(){const q=$("#askQ").value.trim(),out=$("#askOut");
  if(!q){out.innerHTML=`<div class="ask-empty">Type a question, or try one of the examples above.</div>`;return}
  const r=ask(q);if(!r||!r.all.length){out.innerHTML=`<div class="ask-empty">Nothing on the board matches “${esc(q)}”. Try different words, such as a case name, a court, or a topic.</div>`;return}
  const by={};r.all.forEach(x=>{const k=SECLABEL[x.d.sec]||"Other";by[k]=(by[k]||0)+1});
  const grp=Object.entries(by).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k,v])=>`${esc(k)} (${v})`).join(", ");
  out.innerHTML=`<div class="ask-sum"><b>${r.all.length} source${r.all.length>1?"s":""}</b> on the board match. Mostly in ${grp}. Top ${r.top.length}:</div>`+
    r.top.map(x=>{const src=x.d.el.querySelector(".src");return `<div class="ask-r"><div class="top"><span>${esc(x.d.date.trim())}</span><button class="jump" type="button" data-goto="${x.d.el.dataset.doc}" style="--c:var(--ai)">${esc(SECLABEL[x.d.sec]||"Open")}</button></div><p>${hiTitle(x.d.title,r.terms)}</p>${src?src.outerHTML:""}</div>`}).join("");
}
function openAsk(prefill){const a=$("#ask");a.hidden=false;const i=$("#askQ");if(prefill!=null)i.value=prefill;renderAsk();setTimeout(()=>i.focus(),20);}
function closeAsk(){$("#ask").hidden=true;}
$("#askQ").addEventListener("input",renderAsk);
$("#askChips").addEventListener("click",e=>{const b=e.target.closest("button");if(b){$("#askQ").value=b.textContent;renderAsk();$("#askQ").focus();}});
$("#ask").addEventListener("click",e=>{if(e.target.closest("[data-askclose]"))closeAsk();
  const g=e.target.closest("[data-goto]");if(!g)return;const d=DOCS[+g.dataset.goto];closeAsk();
  if(d.el.classList.contains("t-out"))applyCut(35);
  if(SECNAME[d.sec]){openTopic(d.sec);setTimeout(()=>{d.el.scrollIntoView({block:"center",behavior:"smooth"});d.el.classList.remove("flash");void d.el.offsetWidth;d.el.classList.add("flash");},200);}
  else{closeTopic();d.el.scrollIntoView({block:"center",behavior:"smooth"});d.el.classList.add("flash");}});
document.querySelectorAll("[data-ask]").forEach(b=>b.addEventListener("click",()=>openAsk()));

/* ---------- sound on hover for video previews ---------- */
let SOUND=false;
const ytCmd=(f,func,args)=>{try{f.contentWindow.postMessage(JSON.stringify({event:"command",func,args:args||[]}),"*")}catch(_){}};
$("#soundBtn").addEventListener("click",e=>{SOUND=!SOUND;e.currentTarget.setAttribute("aria-pressed",SOUND);e.currentTarget.textContent=SOUND?"♪ Sound on":"♪ Sound off";
  if(!SOUND)document.querySelectorAll(".vid iframe").forEach(f=>ytCmd(f,"mute"));});
document.addEventListener("mouseover",e=>{const t=e.target.closest(".tile.vid");if(!t||!SOUND)return;const f=t.querySelector("iframe");if(f&&!t._sound){t._sound=1;ytCmd(f,"unMute");ytCmd(f,"setVolume",[35]);}});
document.addEventListener("mouseout",e=>{const t=e.target.closest(".tile.vid");if(!t||t.contains(e.relatedTarget))return;const f=t.querySelector("iframe");if(f&&t._sound){t._sound=0;ytCmd(f,"mute");}});

/* ---------- guided tour ---------- */
const TOUR=[
 {sel:"#now h1",t:"Welcome",x:"This is my research interest board on AI in legal systems. Every claim on it links to its source."},
 {sel:"#now .mosaic",t:"Trending now",x:"The latest September 2026 stories. Drag sideways to see them all, and hover over a tile to enlarge it."},
 {sel:".mapwrap",t:"How my interests connect",x:"Each circle is a topic and each small dot is one source. Drag a topic to feel the links stretch, hover to see why topics connect, and click to open one."},
 {sel:"#tm",t:"Time machine",x:"Replay three years: drag the slider to see the board as it stood in any month."},
 {sel:"#myq h2",t:"My question",x:"Can we trust AI to interpret and be used in law? The whole board is built around this question."},
 {sel:"#myq .flow",t:"Three harder questions",x:"Verification, boundaries, and liability and privacy. Each one links into the evidence on the board."},
 {open:"law",sel:"#law .callout",t:"AI in legal systems",x:"Fake citations, court rules, copyright and regulation, as a mosaic you can filter by theme."},
 {open:"meaning",sel:"#evidence",t:"Vagueness & interpretation",x:"What research says about whether LLMs can read vague law, and how that changed from 2023 to 2026."},
 {open:"privacy",sel:"#privacy .thesis",t:"Data privacy",x:"Where AI meets confidentiality, evidence and the law's meaning of “anonymous,” with Harvard Data Science Review sources."},
 {open:"watch",sel:"#watch .mosaic",t:"Videos",x:"Credited clips sized by YouTube views. Muted previews play while a tile is on screen."},
 {close:true,sel:".askbtn",t:"Ask the board",x:"Press / at any time to search every source on the board. That's the tour."}
];
let TI=-1,ringRAF=null;
function placeRing(){const s=TOUR[TI];if(!s)return;const el=document.querySelector(s.sel);const ring=$("#tourRing");
  if(!el){ring.hidden=true;return}const r=el.getBoundingClientRect();ring.hidden=false;
  Object.assign(ring.style,{left:(r.left-8)+"px",top:(r.top-8)+"px",width:(r.width+16)+"px",height:(r.height+16)+"px"});
  ringRAF=requestAnimationFrame(placeRing);}
function showStep(i){TI=Math.max(0,Math.min(TOUR.length-1,i));const s=TOUR[TI];
  if(s.open)openTopic(s.open);if(s.close)closeTopic();
  setTimeout(()=>{const el=document.querySelector(s.sel);if(el)el.scrollIntoView({block:"center",behavior:"smooth"});},s.open?250:0);
  $("#tourStep").textContent=`Tour · ${TI+1} of ${TOUR.length}`;$("#tourTitle").textContent=s.t;$("#tourText").textContent=s.x;
  $("#tourBar").style.width=((TI+1)/TOUR.length*100)+"%";$("#tourBack").disabled=TI===0;$("#tourNext").textContent=TI===TOUR.length-1?"Finish":"Next";
  cancelAnimationFrame(ringRAF);placeRing();}
function startTour(){closeAsk();$("#tour").hidden=false;showStep(0);$("#tourNext").focus();}
function endTour(){$("#tour").hidden=true;$("#tourRing").hidden=true;cancelAnimationFrame(ringRAF);TI=-1;}
$("#tourNext").addEventListener("click",()=>{if(TI>=TOUR.length-1)endTour();else showStep(TI+1)});
$("#tourBack").addEventListener("click",()=>showStep(TI-1));
$("#tourEnd").addEventListener("click",endTour);
document.querySelectorAll("[data-tour]").forEach(b=>b.addEventListener("click",startTour));

/* ---------- keyboard ---------- */
const ORDER=["law","news","landmarks","month","meaning","privacy","watch","next"];
document.addEventListener("keydown",e=>{
  const typing=/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)||document.activeElement.isContentEditable;
  if(e.key==="Escape"){if(!$("#ask").hidden){closeAsk();return}if(!$("#helpk").hidden){$("#helpk").hidden=true;return}if(!$("#tour").hidden){endTour();return}closeTopic();return}
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openAsk();return}
  if(typing||e.metaKey||e.ctrlKey||e.altKey)return;
  if(e.key==="/"){e.preventDefault();openAsk();return}
  if(e.key==="?"){$("#helpk").hidden=!$("#helpk").hidden;return}
  if(e.key==="t"||e.key==="T"){startTour();return}
  if((e.key==="m"||e.key==="M")){closeTopic();return}
  if(!$("#tour").hidden&&(e.key==="ArrowRight"||e.key==="ArrowLeft")){showStep(TI+(e.key==="ArrowRight"?1:-1));return}
  if(!$("#sheet").hidden&&(e.key==="ArrowRight"||e.key==="ArrowLeft")){
    const cur=NODES.find(n=>!n.sat&&current&&n.sec===current.id);const i=cur?ORDER.indexOf(cur.id):0;
    const nx=ORDER[(i+(e.key==="ArrowRight"?1:ORDER.length-1))%ORDER.length];openTopic(nx);}
});
