import json,re,datetime as dt
S="/private/tmp/claude-501/-Users-klarabarbic-AI/a1d79515-4e3d-4c05-a661-95b689e8c1cd/scratchpad/"
D="/Users/klarabarbic/AI/research-interest-board/"
s=open(D+"network-lab.html").read()
raw=json.load(open(S+"impact.json"))
END=dt.date(2026,9,30)
import importlib.util
spec=importlib.util.spec_from_file_location("imp",S+"impact_q.py"); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
IMP={}
for u,r in raw.items():
    q,start,days=m.Q[u]
    s0=dt.date.fromisoformat(start); e=min(s0+dt.timedelta(days=days),END+dt.timedelta(days=1))
    nd=(e-s0).days
    if r["total"]>0: IMP[u]={"v":round(r["total"]/nd,1),"total":r["total"],"q":q,"days":nd,"start":s0.strftime("%-d %b %Y")}
views=json.load(open(S+"views.json"))
def rep(a,b,count=1):
    global s
    assert s.count(a)==count,(a[:90],s.count(a)); s=s.replace(a,b)
rep("</style>\n</head>",open(S+"mosaic.css").read()+"</style>\n</head>")
fill_old='function fill(id,arr){const el=$(id),g=el.classList.contains("gallery");el.innerHTML=arr.map(it=>itemHTML(it,g)).join("")}'
rep(fill_old,"const VIEWS="+json.dumps(views,separators=(',',':'))+";\n"+open(S+"mosaic.js").read()+
 'function fill(id,arr){const el=$(id),g=el.classList.contains("gallery");el.innerHTML=arr.map(it=>g?tileHTML(it):itemHTML(it,false)).join("");if(g)layoutMosaic(el)}')
# feed
rep('<ul class="feed" id="feed"></ul>','<ul class="items gallery" id="feed"></ul>')
i=s.index('$("#feed").innerHTML=FEED.map('); j=s.index("\n",i)
s=s[:i]+'fill("#feed",FEED.map(f=>({d:f.d,h:f.h,src:f.src,vs:f.vs,tags:[[f.k[0],f.k[1]]]})));'+s[j:]
# default tile colour per list
s=s.replace("#lawList,#monthLegal{--c:var(--law)} #landmarkList,#monthGeneral{--c:var(--ai)}","#lawList,#monthLegal{--c:var(--law)} #landmarkList,#monthGeneral,#feed{--c:var(--ai)}")
# videos
i=s.index("const V=(t,ch,chu,id,date,len,desc,c)=>"); j=s.index("\n",i)
s=s[:i]+'const V=(t,ch,chu,id,date,len,desc,c)=>`<li class="item tile vid" data-v="${VIEWS[id]||""}" style="--c:${c}" title="${esc(desc.replace(/<[^>]+>/g,""))}"><a class="thumb" href="https://www.youtube.com/watch?v=${id}" aria-label="Watch ${esc(t)} on YouTube"><span></span></a><div class="tile-body"><div class="d">${date} · ${len}</div><p>${t}</p><span class="credit">Video by <a href="${chu}">${ch}</a> · <a href="https://www.youtube.com/watch?v=${id}">Watch on YouTube ↗</a></span>${VIEWS[id]?`<span class="imp">${fmtN(VIEWS[id])} views</span>`:""}</div></li>`;'+s[j:]
rep('<h3 class="mt">Landmark AI news</h3><div class="grid g3" id="vNews"></div>','<ul class="items gallery" id="vAll"></ul>\n    <h3 class="mt">Landmark AI news</h3><div class="grid g3" id="vNews"></div>')
k=s.index("/* video previews:")
s=s[:k]+'["#vNews","#vLaw","#vLang"].forEach(q=>[...$(q).children].forEach(t=>$("#vAll").appendChild(t)));\nlayoutMosaic($("#vAll"),{legend:"Tile area grows with YouTube views (log scale), checked 1 Oct 2026",weight:t=>Math.pow(Math.log10(+t.dataset.v||10),1.5),minArea:32000,height:680});\n$("#lawChips").addEventListener("click",()=>setTimeout(()=>positionTiles($("#lawList")),0));\n'+s[k:]
rep('$("#sheetBody").appendChild(sec);current=sec;','$("#sheetBody").appendChild(sec);current=sec;relayoutIn(sec);requestAnimationFrame(()=>relayoutIn(sec));')
s=s.replace("function relayoutIn(root){","let _rz;addEventListener(\"resize\",()=>{clearTimeout(_rz);_rz=setTimeout(()=>relayoutIn(document.body),150)});\nfunction relayoutIn(root){",1)
rep('  const px=$("#panelx");px.scrollTop=0;px.focus({preventScroll:true});','  const px=$("#panelx");px.scrollTop=0;px.focus({preventScroll:true});relayoutIn(sec);')
open(D+"network-mosaic.html","w").write(s)
print("ok")
