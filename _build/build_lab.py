S="/private/tmp/claude-501/-Users-klarabarbic-AI/a1d79515-4e3d-4c05-a661-95b689e8c1cd/scratchpad"
D="/Users/klarabarbic/AI/research-interest-board/"
s=open(D+"network.html").read()
css=open(S+"/lab.css").read()+"""
figure.cover{margin:0}
#lawList,#monthLegal{--c:var(--law)} #landmarkList,#monthGeneral{--c:var(--ai)}
"""
covers=open(S+"/covers.js").read()
def rep(a,b,count=1):
    global s
    assert s.count(a)==count,(a[:80],s.count(a)); s=s.replace(a,b)
rep("</style>\n</head>", css+"</style>\n</head>")
for i in ["landmarkList","monthGeneral","monthLegal","lawList"]:
    rep(f'<ul class="items" id="{i}">',f'<ul class="items gallery" id="{i}">')
rep("function itemHTML(it){", covers+"""function coverHTML(src){if(!src||!src[0])return "";const [n,u]=src[0],img=COVERS[u];
  return `<figure class="cover${img?"":" noimg"}" data-src="${esc(n.replace(/&amp;/g,"&"))}">${img?`<img src="${img}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.parentNode.classList.add('noimg')">`:""}<figcaption>Image: ${n}</figcaption></figure>`;}
function itemHTML(it,gal){""")
rep('return `<li class="item" ${it.cat?`data-cat="${it.cat}"`:""}><div class="d">','return `<li class="item" ${it.cat?`data-cat="${it.cat}"`:""}>${gal?coverHTML(it.src):""}<div class="d">')
rep('function fill(id,arr){$(id).innerHTML=arr.map(itemHTML).join("")}','function fill(id,arr){const el=$(id),g=el.classList.contains("gallery");el.innerHTML=arr.map(it=>itemHTML(it,g)).join("")}')
rep('$("#feed").innerHTML=FEED.map((f,i)=>`<li class="${i?"":"lead"}"><div class="meta"><span>${f.d}</span><span class="tag ${f.k[0]}">${esc(f.k[1])}</span></div><p>${f.h}</p>${srcHTML(f.src,f.vs)}</li>`).join("");',
    '$("#feed").innerHTML=FEED.map((f,i)=>`<li class="${i?"":"lead"}"><div class="fcard" style="--c:var(--${f.k[0]})">${coverHTML(f.src)}<div><div class="meta"><span>${f.d}</span><span class="tag ${f.k[0]}">${esc(f.k[1])}</span></div><p>${f.h}</p>${srcHTML(f.src,f.vs)}</div></div></li>`).join("");')
i=s.index('$("#vLang").innerHTML=['); j=s.index('].join("");',i)+len('].join("");')
s=s[:j]+"""
/* video previews: official YouTube thumbnail, then a muted embedded preview while the card is on screen */
const VSTART={qrvK_KuIeJk:180,I19ezZcyB6w:45,XDE9DjpcSdI:300,WEBiebbeNCA:420,"aAPpQC-3EyE":180,GL5ZSWQUbeM:90,oqSYljRYDEM:300,wiNHGXyVY58:15,"7KqrfwGeCko":40,MvBdRF3zw5k:600,rfxgovgpWcM:15,"qRaq-3BZfNg":300,eMlx5fFNoYc:240,"6iO8TtCs_Cw":30,LPZh9BOjkQs:90,"gG5R-TdfXhw":180};
document.querySelectorAll(".vid .thumb").forEach(a=>{const id=new URL(a.href).searchParams.get("v");a.dataset.vid=id;
  a.insertAdjacentHTML("afterbegin",`<img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy" referrerpolicy="no-referrer"><span class="live-badge">Muted preview</span>`);});
const reduceMotion=matchMedia("(prefers-reduced-motion: reduce)").matches;
function playPrev(a){if(a.querySelector("iframe"))return;const id=a.dataset.vid,st=VSTART[id]||30;
  const f=document.createElement("iframe");f.title="Muted preview";f.allow="autoplay; encrypted-media; picture-in-picture";f.tabIndex=-1;f.setAttribute("aria-hidden","true");
  f.src=`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&start=${st}&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&disablekb=1`;
  f.addEventListener("load",()=>setTimeout(()=>a.classList.add("playing"),900));a.appendChild(f);}
function stopPrev(a){const f=a.querySelector("iframe");if(f)f.remove();a.classList.remove("playing");}
let vio=null;
if(!reduceMotion&&"IntersectionObserver" in window){
  vio=new IntersectionObserver(es=>es.forEach(e=>{const a=e.target;if(e.isIntersecting&&!a.closest("#library"))playPrev(a);else stopPrev(a);}),{threshold:.6});
  document.querySelectorAll(".vid .thumb").forEach(a=>vio.observe(a));
}
"""+s[j:]
rep('  const px=$("#panelx");px.scrollTop=0;px.focus({preventScroll:true});',
    '  const px=$("#panelx");px.scrollTop=0;px.focus({preventScroll:true});\n  if(vio)sec.querySelectorAll(".vid .thumb").forEach(a=>{vio.unobserve(a);vio.observe(a)});')
rep('  if(current){$("#library").appendChild(current);current=null}',
    '  if(current){current.querySelectorAll(".vid .thumb").forEach(stopPrev);$("#library").appendChild(current);current=null}')
rep('  if(current&&current!==sec)$("#library").appendChild(current);',
    '  if(current&&current!==sec){current.querySelectorAll(".vid .thumb").forEach(stopPrev);$("#library").appendChild(current);}')
open(D+"network-lab.html","w").write(s)
print("ok")
