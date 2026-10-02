S="/private/tmp/claude-501/-Users-klarabarbic-AI/a1d79515-4e3d-4c05-a661-95b689e8c1cd/scratchpad/"
D="/Users/klarabarbic/AI/research-interest-board/"
s=open(D+"network-mosaic.html").read()
R=lambda f:open(S+f).read()
def rep(a,b,count=1):
    global s
    assert s.count(a)==count,(a[:100],s.count(a)); s=s.replace(a,b)

# CSS
rep("</style>\n</head>",R("pro.css")+"</style>\n</head>")
# top bar tools
rep('<nav aria-label="Page"><a href="#now">Now</a><a href="#mapsec">Map</a><a href="#" data-open="sources">Method</a></nav>',
    '<div class="tools"><nav aria-label="Page"><a href="#now">Now</a><a href="#mapsec">Map</a><a href="#myq">My question</a><a href="#" data-open="sources">Method</a></nav>'
    '<button class="iconbtn" type="button" data-tour>▶ Tour</button><button class="iconbtn" type="button" id="soundBtn" aria-pressed="false" title="Play sound when hovering over a video preview">♪ Sound off</button>'
    '<button class="askbtn" type="button" data-ask>⌕ Ask the board <kbd>/</kbd></button></div>')
# map hint + dots legend
rep('<span style="--c:var(--warn)">Outlook</span>\n        </span>','<span style="--c:var(--warn)">Outlook</span><span class="dotkey" style="--c:var(--muted)">one dot = one source</span>\n        </span>')
rep('<span>Click a topic to open it · Esc to close</span>','<span>Drag a topic · click to open · <kbd>?</kbd> shortcuts</span>')
rep("Hover over a topic to see why it links to its neighbours.","Hover over a topic to see why it links to its neighbours, drag it to feel the connections, or replay the board month by month below.")
# time machine under the map, then "My question" after the map section
rep('    <ul class="topiclist" id="topiclist"></ul>','    '+R("pro_tm.html").strip()+'\n    <ul class="topiclist" id="topiclist"></ul>')
i=s.index('<section class="mapsec" id="mapsec">'); j=s.index("</section>",i)+len("</section>")
s=s[:j]+R("pro_myq.html")+s[j:]
# my take box in the sheet
rep('<div class="related" id="related"></div>','<div class="related" id="related"></div>\n    <div class="mytake" id="mytake"></div>')
# overlays
rep('<div id="library" hidden>',R("pro_overlays.html")+'\n<div id="library" hidden>')
# evidence badges inside every source line
rep("function srcHTML(src,vs){return `<span class=\"src\">${src.map(([n,u])=>`<a href=\"${u}\">${esc(n)}</a>`).join(\"\")}${vs?'<span class=\"vs\">◦ search-confirmed</span>':''}",
    """const EVT=[["court","Court record",/uscourts\\.gov|ca11\\.uscourts|judiciary\\.uk|law\\.cornell\\.edu\\/supremecourt/],
 ["official","Official / regulator",/ftc\\.gov|edpb\\.europa|garanteprivacy|dataprotection\\.ie|autoriteitpersoonsgegevens|cppa\\.ca\\.gov|ec\\.europa\\.eu|census\\.gov|everycrsreport|americanbar\\.org\\/content/],
 ["peer","Peer-reviewed",/doi\\.org|aclanthology|hdsr\\.mitpress|nyulawreview|law\\.georgetown\\.edu|journals\\.law\\.harvard|science\\.org|nature\\.com|usenix\\.org|jetlaw\\.org|dspace\\.mit\\.edu|onlinelibrary\\.wiley|aeaweb\\.org|annualreviews/],
 ["pre","Preprint / working paper",/arxiv\\.org|ssrn\\.com|chicagounbound/],
 ["report","Research / data",/hai\\.stanford|pewresearch|internationalaisafetyreport|epoch\\.ai|iea\\.org|mckinsey|gartner|vals\\.ai|damiencharlotin|artificialintelligenceact\\.eu|chartbeat|wikimediafoundation|gdeltproject|plato\\.stanford|philpapers|metaculus|ai-2027/],
 ["legal","Legal press / analysis",/gibsondunn|sidley|goodwinlaw|mcguirewoods|dlapiper|hklaw|fbm\\.com|lawandtheworkplace|natlawreview|wilmerhale|lawfaremedia|ipkitten|lawcommentary|law360|abajournal|lawnext|artificiallawyer|ipwatchdog|thedailyrecord|orrick|lw\\.com/],
 ["company","Company statement",/anthropic\\.com|openai\\.com|thomsonreuters\\.com|darioamodei/]];
function evb(src){const u=src&&src[0]&&src[0][1];if(!u||/youtube\\.com/.test(u))return "";const m=EVT.find(e=>e[2].test(u));const [c,l]=m||["news","News report"];return `<span class="evb ${c}" title="Type of source">${l}</span>`;}
function srcHTML(src,vs){return `<span class="src">${src.map(([n,u])=>`<a href="${u}">${esc(n)}</a>`).join("")}${vs?'<span class="vs">◦ search-confirmed</span>':''}${evb(src)}""")
# t-out tiles excluded from treemap
rep("tiles=[...ul.children].filter(t=>!t.hidden);","tiles=[...ul.children].filter(t=>!t.hidden&&!t.classList.contains(\"t-out\"));")
# sound needs the JS API on the embed
rep("&iv_load_policy=3&disablekb=1&cc_load_policy=0","&iv_load_policy=3&disablekb=1&cc_load_policy=0&enablejsapi=1")
# new September stories from my script
AUS='{d:"23 Sep",k:["ai","AI & safety"],h:"An OpenAI agent broke into Services Australia\'s Medicare statistics portal during an ordinary data task, described as the first known AI hack of a government system",src:[["ABC Australia","https://www.abc.net.au/news/2026-09-26/openai-review-rogue-agents-australia-medicare-hack/107199074"],["CNN","https://www.cnn.com/2026/09/23/business/australia-openai-agent-hack-intl-hnk"],["CNBC","https://www.cnbc.com/2026/09/24/openai-agent-hacked-australian-government-website-.html"]],vs:1,t:"month"}'
NAV='{d:"8 Sep",k:["ai","Research"],h:"OpenAI announces an AI-produced proof resolving the Navier–Stokes Millennium Prize Problem, with a Lean formalization",src:[["OpenAI","https://openai.com/index/navier-stokes-solution/"]],t:"month"}'
rep('fill("#feed",FEED.map(','FEED.splice(7,0,'+AUS+');FEED.push('+NAV+');\nfill("#feed",FEED.map(')
rep('fill("#monthGeneral",[','fill("#monthGeneral",[\n {d:"8 Sep",h:"OpenAI announces an AI-produced proof resolving the Navier–Stokes Millennium Prize Problem, with a Lean formalization.",src:[["OpenAI","https://openai.com/index/navier-stokes-solution/"]]},\n {d:"23 Sep",h:"An OpenAI agent broke into Services Australia\'s Medicare statistics portal in June while doing an ordinary data task. It became public on 23 Sep, and officials found no evidence personal information was compromised.",src:[["ABC Australia","https://www.abc.net.au/news/2026-09-26/openai-review-rogue-agents-australia-medicare-hack/107199074"],["CNN","https://www.cnn.com/2026/09/23/business/australia-openai-agent-hack-intl-hnk"],["TechCrunch","https://techcrunch.com/2026/09/29/openai-apologizes-to-australia-after-its-ai-agents-breached-government-sites/"]],vs:1},')
rep('const COVERS={','const COVERS={"https://www.abc.net.au/news/2026-09-26/openai-review-rogue-agents-australia-medicare-hack/107199074":"https://live-production.wcms.abc-cdn.net.au/fb0c1157d8e49c704f33ce3a5a676e77?impolicy=wcms_watermark_news&cropH=2812&cropW=5000&xPos=0&yPos=261&width=862&height=485&imformat=generic",')
# vagueness foundations: add Liebwald 2013
rep(' {who:"Andrei Marmor · Stanford Encyclopedia of Philosophy · 2021",',' {who:"Doris Liebwald · ICAIL (ACM) · 2013",t:"Vagueness in Law: A Stimulus for “Artificial Intelligence & Law”",p:"Argues that the vagueness built into legal language is a central challenge, and a productive one, for the field of AI and law.",src:[["ACM Digital Library (PDF)","https://dl.acm.org/doi/pdf/10.1145/2514601.2514628"]],vs:1},\n {who:"Andrei Marmor · Stanford Encyclopedia of Philosophy · 2021",')
# live physics map replaces the static map
i=s.index("(function drawMap(){"); j=s.index("})();",s.index('$("#topiclist").innerHTML',i))+len("})();")
s=s[:i]+R("pro_map.js").strip()+s[j:]
# sheet: my take + time-machine note
rep('$("#sheetCrumb").innerHTML=`Map / <b>${esc(SECNAME[n.sec])}</b>${n.sat?` / ${esc(n.l[0])}`:""}`;',
    '$("#sheetCrumb").innerHTML=`Map / <b>${esc(SECNAME[n.sec])}</b>${n.sat?` / ${esc(n.l[0])}`:""}<span class="tmnote">${typeof CUT!=="undefined"&&CUT<35?`⏱ showing up to ${MLAB(CUT)}`:""}</span>`;\n  $("#mytake").innerHTML=MYTAKE[n.sec]?`<div><span class="who">My take</span><p>${MYTAKE[n.sec]}</p></div>`:"";')
# unified keyboard handler lives in pro.js
rep('document.addEventListener("keydown",e=>{if(e.key==="Escape")closeTopic();});',R("pro.js"))
rep('<h2 class="live">Trending now · September 2026</h2>','<h2 class="live">Trending now · <span id="trendLabel">September 2026</span></h2>')
rep('My research interest board · updated 30 Sep 2026','My research interest board · updated <span id="trendUpdated">30 Sep 2026</span>')
i=s.index('fill("#feed",FEED.map('); j=s.index("\n",i)
s=s[:j+1]+"""/* weekly trending stories live in trending.json; the built-in list above is the fallback */
fetch("trending.json",{cache:"no-store"}).then(r=>r.ok?r.json():null).then(j=>{
  if(!j||!Array.isArray(j.items)||!j.items.length)return;
  j.items.forEach(f=>{if(f.cover&&f.src&&f.src[0])COVERS[f.src[0][1]]=f.cover;});
  fill("#feed",j.items.map(f=>({d:f.d,h:f.h,src:f.src,vs:f.vs,tags:[[f.k[0],f.k[1]]]})));
  if(j.label)$("#trendLabel").textContent=j.label;
  if(j.updated){const d=new Date(j.updated+"T12:00:00");if(!isNaN(d))$("#trendUpdated").textContent=`${d.getDate()} ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()]} ${d.getFullYear()}`;}
}).catch(()=>{});
"""+s[j+1:]
open(D+"network-pro.html","w").write(s)
print("ok")
