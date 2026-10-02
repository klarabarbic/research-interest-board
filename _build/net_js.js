/* ---------- first screen: trending feed ---------- */
const FEED=[
 {d:"28–29 Sep",k:["ai","AI & safety"],h:"OpenAI cancels the release of GPT-6.1 “Astra” after it failed internal safety tests",src:[["Al Jazeera","https://www.aljazeera.com/economy/2026/9/29/openai-scraps-release-of-latest-ai-model-over-safety-concerns"],["CNBC","https://www.cnbc.com/2026/09/28/openai-abandons-plan-to-release-upcoming-model-as-safety-concerns-escalate.html"]],t:"month"},
 {d:"29–30 Sep",k:["law","Copyright"],h:"Third Circuit affirms Thomson Reuters v. ROSS, the first federal appeals ruling on fair use in AI training",src:[["IPWatchdog","https://ipwatchdog.com/2026/09/30/third-circuit-affirms-revised-fair-use-ruling-against-ross-ai-legal-research-platform-in-sealed-opinion/"]],t:"law"},
 {d:"29 Sep",k:["ai","Policy"],h:"President Trump says top AI leaders signed a voluntary, “morally binding” superintelligence accord",src:[["CNBC","https://www.cnbc.com/2026/09/29/tech-white-house-ai-lunch-trump.html"],["ABC News","https://abcnews.com/Politics/top-ai-leaders-meet-trump-white-house-amid/story?id=136832988"]],vs:1,t:"month"},
 {d:"29 Sep",k:["ai","Industry"],h:"Anthropic's leaked IPO prospectus shows a $42B loss for 2025 and a target valuation above $2T",src:[["Fortune","https://fortune.com/2026/09/29/anthropic-leaked-ipo-prospectus-losses-growth-ai-end-humanity/"]],t:"month"},
 {d:"26 Sep",k:["ai","AI & safety"],h:"OpenAI pauses training after its agents probed US government websites in unexpected ways",src:[["AP via WTOP","https://wtop.com/national/2026/09/openai-pauses-training-of-latest-models-after-agents-probed-us-government-sites-in-unexpected-ways/"]],t:"month"},
 {d:"25 Sep",k:["priv","Privacy"],h:"Ireland's data protection regulator publishes its AI Insights Report, covering about 180 AI products",src:[["Irish DPC","https://www.dataprotection.ie/en/news-media/latest-news/data-protection-commission-publishes-ai-insights-report"]],t:"privacy"},
 {d:"25 Sep",k:["law","Courts"],h:"DC Circuit (2–1) lets the Pentagon keep its “supply chain risk” label on Anthropic for now",src:[["ABC News","https://abcnews.com/Business/anthropic-appeals-court-declines-block-pentagon-blacklisting/story?id=136755690"]],t:"month"},
 {d:"23 Sep",k:["ai","Policy"],h:"Sam Altman and Dario Amodei ask the UN Security Council for international AI safety standards",src:[["CNN","https://edition.cnn.com/2026/09/23/tech/altman-amodei-ai-safety-un-security-council"]],vs:1,t:"month"},
 {d:"21–22 Sep",k:["law","Litigation"],h:"British Columbia sues OpenAI and Sam Altman over the Tumbler Ridge school shooting",src:[["Al Jazeera","https://www.aljazeera.com/news/2026/9/22/canadas-bc-sues-openai-over-chatgpt-role-in-tumbler-ridge-school-shooting"],["CBC","https://www.cbc.ca/news/canada/british-columbia/bc-government-announce-update-openai-legal-action-9.7352395"]],t:"month"}
];
$("#feed").innerHTML=FEED.map((f,i)=>`<li class="${i?"":"lead"}"><div class="meta"><span>${f.d}</span><span class="tag ${f.k[0]}">${esc(f.k[1])}</span></div><p>${f.h}</p>${srcHTML(f.src,f.vs)}</li>`).join("");

(function spark(){
  const W=420,H=70,p=4,x=d=>p+(d-1)/29*(W-2*p),y=v=>H-p-v/5.6*(H-2*p);
  let segs=[],seg=[];SEPT.forEach((r,i)=>{const d=+r[0];if(i&&d!==+SEPT[i-1][0]+1){segs.push(seg);seg=[]}seg.push([x(d),y(r[2])])});segs.push(seg);
  let g=`<line x1="${p}" x2="${W-p}" y1="${H-p}" y2="${H-p}" stroke="var(--rule)"/>`;
  segs.forEach(s=>{const pts=s.map(q=>q.join(",")).join(" ");
    g+=`<polygon points="${s[0][0]},${H-p} ${pts} ${s[s.length-1][0]},${H-p}" fill="var(--ai)" opacity=".1"/><polyline points="${pts}" fill="none" stroke="var(--ai)" stroke-width="2" stroke-linejoin="round"/>`;});
  g+=`<circle cx="${x(24)}" cy="${y(4.94)}" r="4" fill="var(--ai)"/>`;
  $("#spark").innerHTML=g;
})();

/* ---------- topic map ---------- */
const NODES=[
 {id:"law",l:["AI in","legal systems"],s:"my core question",x:500,y:320,r:70,c:"var(--law)",sec:"law"},
 {id:"news",l:["AI in","the news"],s:"3 years charted",x:215,y:165,r:52,c:"var(--ai)",sec:"pulse"},
 {id:"landmarks",l:["Landmark","headlines"],s:"2023–2026",x:118,y:372,r:42,c:"var(--ai)",sec:"landmarks"},
 {id:"month",l:["September","2026"],s:"the past month",x:285,y:520,r:46,c:"var(--ai)",sec:"month"},
 {id:"meaning",l:["Vagueness &","interpretation"],s:"law · language · LLMs",x:790,y:168,r:60,c:"var(--lang)",sec:"meaning"},
 {id:"privacy",l:["Data","privacy"],s:"HDSR + my course",x:790,y:468,r:58,c:"var(--priv)",sec:"privacy"},
 {id:"watch",l:["Video","clips"],s:"credited",x:520,y:578,r:38,c:"var(--muted)",sec:"watch"},
 {id:"next",l:["What's","next"],s:"forecasts",x:500,y:92,r:44,c:"var(--warn)",sec:"next"},
 // satellites
 {id:"s-sanc",sat:"law",l:["Sanctions"],x:428,y:200,c:"var(--law)",sec:"law",act:{filter:"Sanctions"}},
 {id:"s-judg",sat:"law",l:["Judges"],x:572,y:200,c:"var(--law)",sec:"law",act:{filter:"Judges"}},
 {id:"s-copy",sat:"law",l:["Copyright"],x:640,y:322,c:"var(--law)",sec:"law",act:{filter:"Copyright"}},
 {id:"s-reg",sat:"law",l:["Regulation"],x:368,y:372,c:"var(--law)",sec:"law",act:{filter:"Regulation"}},
 {id:"s-ind",sat:"law",l:["Legal-AI industry"],x:470,y:452,c:"var(--law)",sec:"law",act:{filter:"Industry"}},
 {id:"s-found",sat:"meaning",l:["Foundations"],x:905,y:72,c:"var(--lang)",sec:"meaning",act:{to:"#foundations"}},
 {id:"s-llm",sat:"meaning",l:["LLMs as interpreters"],x:925,y:228,c:"var(--lang)",sec:"meaning",act:{to:"#papers"}},
 {id:"s-evid",sat:"meaning",l:["The evidence"],x:680,y:58,c:"var(--lang)",sec:"meaning",act:{to:"#evidence"}},
 {id:"s-conf",sat:"privacy",l:["Confidentiality"],x:665,y:585,c:"var(--priv)",sec:"privacy",act:{to:"#pCourts"}},
 {id:"s-regu",sat:"privacy",l:["Regulators"],x:930,y:385,c:"var(--priv)",sec:"privacy",act:{to:"#pReg"}},
 {id:"s-anon",sat:"privacy",l:["Legally “anonymous”"],x:918,y:535,c:"var(--priv)",sec:"privacy",act:{to:"#pAnon"}},
 {id:"s-leak",sat:"privacy",l:["What models leak"],x:815,y:605,c:"var(--priv)",sec:"privacy",act:{to:"#pLeak"}},
 {id:"s-hdsr",sat:"privacy",l:["HDSR shelf"],x:690,y:400,c:"var(--priv)",sec:"privacy",act:{to:"#pHdsr"}},
 {id:"s-chart",sat:"news",l:["Coverage chart"],x:95,y:95,c:"var(--ai)",sec:"pulse",act:{to:"#chart"}},
 {id:"s-cal",sat:"next",l:["Legal calendar"],x:330,y:52,c:"var(--warn)",sec:"next",act:{to:"#cal"}}
];
const EDGES=[
 ["law","news","AI-and-law share of news grew 3.2×"],
 ["law","month","10 legal stories in September"],
 ["law","meaning","Judges ask LLMs what words mean"],
 ["law","privacy","Chat logs in discovery, privilege"],
 ["meaning","privacy","The law's vague word “anonymous”"],
 ["law","next","Court rules & AI Act deadlines ahead"],
 ["law","landmarks","$1.5B settlement made headlines"],
 ["law","watch","Courtroom clips"],
 ["news","landmarks","Spikes line up with big stories"],
 ["news","month","Record 4.94% share on 24 Sep"],
 ["news","next","Forecasts of AI's growth"],
 ["month","privacy","Irish DPC AI report, 25 Sep"],
 ["watch","meaning","How LLMs handle meaning"],
 ["watch","month","News clips"]
];
NODES.filter(n=>n.sat).forEach(n=>EDGES.push([n.sat,n.id,null]));
const byId=Object.fromEntries(NODES.map(n=>[n.id,n]));
const NS="http://www.w3.org/2000/svg";
function curve(a,b){const mx=(a.x+b.x)/2,my=(a.y+b.y)/2,dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1,k=len*.12;
  const cx=mx-dy/len*k,cy=my+dx/len*k;return {d:`M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}`,lx:(mx+cx)/2,ly:(my+cy)/2};}
(function drawMap(){
  const svg=$("#map");let g="";
  EDGES.forEach(([a,b,l],i)=>{const c=curve(byId[a],byId[b]);g+=`<path class="edge ${l?"":"sat"}" data-e="${i}" data-a="${a}" data-b="${b}" d="${c.d}"/>`;});
  EDGES.forEach(([a,b,l],i)=>{if(!l)return;const c=curve(byId[a],byId[b]);const w=l.length*7.3+16;
    g+=`<rect class="elabel-bg" data-e="${i}" x="${c.lx-w/2}" y="${c.ly-12}" width="${w}" height="22" rx="11" stroke="var(--rule)"/><text class="elabel" data-e="${i}" x="${c.lx}" y="${c.ly+4}" text-anchor="middle">${esc(l)}</text>`;});
  NODES.forEach((n,i)=>{
    const dur=7+((i*37)%50)/10, dx=((i*13)%7)-3, dy=((i*29)%7)-3;
    if(n.sat){
      const p=byId[n.sat],ang=Math.atan2(n.y-p.y,n.x-p.x),right=Math.cos(ang)>=-.2;
      const tx=Math.abs(Math.cos(ang))<.35?0:(right?14:-14), ty=Math.abs(Math.cos(ang))<.35?(Math.sin(ang)>0?24:-14):4;
      const anchor=tx===0?"middle":(right?"start":"end");
      g+=`<g class="node sat float" tabindex="0" role="button" aria-label="Open ${esc(n.l[0])}" data-n="${n.id}" style="--c:${n.c};--dur:${dur}s;--dx:${dx}px;--dy:${dy}px">
        <circle class="halo" cx="${n.x}" cy="${n.y}" r="14"/><circle class="dotc" cx="${n.x}" cy="${n.y}" r="6"/>
        <text x="${n.x+tx}" y="${n.y+ty}" style="text-anchor:${anchor}">${esc(n.l[0])}</text></g>`;
    } else {
      const fs=n.r>=60?19:n.r>=50?17:15.5;
      g+=`<g class="node float" tabindex="0" role="button" aria-label="Open ${esc(n.l.join(" "))}" data-n="${n.id}" style="--c:${n.c};--dur:${dur}s;--dx:${dx}px;--dy:${dy}px">
        <circle class="halo" cx="${n.x}" cy="${n.y}" r="${n.r+12}"/><circle class="core" cx="${n.x}" cy="${n.y}" r="${n.r}"/>
        <text x="${n.x}" y="${n.y-(n.l.length>1?fs*0.35:-fs*0.1)}" font-size="${fs}" font-weight="700">${esc(n.l[0])}</text>
        ${n.l[1]?`<text x="${n.x}" y="${n.y+fs*0.8}" font-size="${fs}" font-weight="700">${esc(n.l[1])}</text>`:""}
        <text class="sub" x="${n.x}" y="${n.y+n.r+28}">${esc(n.s)}</text></g>`;
    }
  });
  svg.innerHTML=g;
  const hl=id=>{svg.classList.add("dim");const keep=new Set([id]);
    EDGES.forEach(([a,b],i)=>{if(a===id||b===id){keep.add(a);keep.add(b);svg.querySelectorAll(`[data-e="${i}"]`).forEach(e=>e.classList.add("hl"))}});
    svg.querySelectorAll(".node").forEach(e=>e.classList.toggle("hl",keep.has(e.dataset.n)));};
  const clear=()=>{svg.classList.remove("dim");svg.querySelectorAll(".hl").forEach(e=>e.classList.remove("hl"));};
  svg.querySelectorAll(".node").forEach(el=>{const id=el.dataset.n;
    el.addEventListener("mouseenter",()=>hl(id));el.addEventListener("mouseleave",clear);
    el.addEventListener("focus",()=>hl(id));el.addEventListener("blur",clear);
    el.addEventListener("click",()=>openTopic(id));
    el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openTopic(id)}});});
  $("#topiclist").innerHTML=NODES.filter(n=>!n.sat).map(n=>`<li><button data-open-node="${n.id}" style="--c:${n.c}">${esc(n.l.join(" "))}</button></li>`).join("");
})();

/* ---------- topic sheet ---------- */
const SECNAME={pulse:"AI in the news",landmarks:"Landmark headlines",month:"September 2026",law:"AI in legal systems",meaning:"Vagueness & interpretation",privacy:"Data privacy",watch:"Video clips",next:"What's next",sources:"Method & sourcing"};
let current=null,lastFocus=null;
function neighbours(id){const s=new Set();EDGES.forEach(([a,b,l])=>{if(!l)return;if(a===id)s.add(b);if(b===id)s.add(a)});return [...s].map(k=>byId[k]);}
function openTopic(id){
  const n=byId[id]||{sec:id,l:[SECNAME[id]||id]};const main=n.sat?byId[n.sat]:n;
  const sec=document.getElementById(n.sec);if(!sec)return;
  if(current&&current!==sec)$("#library").appendChild(current);
  $("#sheetBody").appendChild(sec);current=sec;
  $("#sheetCrumb").innerHTML=`Map / <b>${esc(SECNAME[n.sec])}</b>${n.sat?` / ${esc(n.l[0])}`:""}`;
  const rel=byId[main.id]?neighbours(main.id):[];
  $("#related").innerHTML=rel.length?`<span>Connected:</span>`+rel.map(r=>`<button data-open-node="${r.id}" style="--c:${r.c}">${esc(r.l.join(" "))}</button>`).join(""):"";
  const sh=$("#sheet");if(sh.hidden){lastFocus=document.activeElement;sh.hidden=false;document.documentElement.classList.add("locked");}
  const px=$("#panelx");px.scrollTop=0;px.focus({preventScroll:true});
  if(sec.id==="law"){const c=(n.act&&n.act.filter)||"All";const b=$(`#lawChips .chip[data-c="${c}"]`);if(b)b.click();}
  if(n.act&&n.act.to){const t=document.querySelector(n.act.to);const box=t&&(t.closest(".panel,.chartbox")||t);
    if(box)setTimeout(()=>{px.scrollTo({top:box.getBoundingClientRect().top-px.getBoundingClientRect().top+px.scrollTop-70,behavior:"smooth"});box.classList.remove("flash");void box.offsetWidth;box.classList.add("flash");},120);}
  try{history.replaceState(null,"","#"+id)}catch(_){}
}
function closeTopic(){const sh=$("#sheet");if(sh.hidden)return;sh.hidden=true;document.documentElement.classList.remove("locked");
  if(current){$("#library").appendChild(current);current=null}
  try{history.replaceState(null,"","#mapsec")}catch(_){}
  if(lastFocus&&lastFocus.focus)lastFocus.focus({preventScroll:true});}
document.addEventListener("click",e=>{
  const o=e.target.closest("[data-open-node]");if(o){openTopic(o.dataset.openNode);return}
  const s=e.target.closest("[data-open]");if(s){e.preventDefault();openTopic(s.dataset.open);return}
  if(e.target.closest("[data-close]"))closeTopic();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeTopic();});
(function(){const h=location.hash.slice(1);if(h&&(byId[h]||SECNAME[h]))openTopic(h);})();
