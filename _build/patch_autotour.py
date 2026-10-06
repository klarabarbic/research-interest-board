# Adds an automatic, skippable guided tour to the dark main page (index.html / network-pro.html).
import sys
D="/Users/klarabarbic/AI/research-interest-board/"
for f in ["network-pro.html","index.html"]:
    s=open(D+f).read()
    if "tourPause" in s: print(f,"already patched"); continue
    def rep(a,b):
        global s
        assert s.count(a)==1,(f,a[:90],s.count(a)); s=s.replace(a,b)
    rep('''  <div class="st" id="tourStep"></div>
  <h4 id="tourTitle"></h4>
  <p id="tourText"></p>
  <div class="row"><button class="btn" type="button" id="tourBack">Back</button><span class="bar"><i id="tourBar"></i></span><button class="btn" type="button" id="tourNext" aria-pressed="true">Next</button><button class="iconbtn" type="button" id="tourEnd">End</button></div>''',
    '''  <div class="tour-top"><span class="st" id="tourStep"></span><button class="tour-skip" type="button" id="tourEnd">Skip tour ✕</button></div>
  <h4 id="tourTitle"></h4>
  <p id="tourText"></p>
  <div class="tick" aria-hidden="true"><i id="tourTick"></i></div>
  <div class="row"><button class="btn" type="button" id="tourBack">Back</button><button class="iconbtn" type="button" id="tourPause" aria-pressed="false">❚❚ Pause</button><span class="bar"><i id="tourBar"></i></span><button class="btn" type="button" id="tourNext" aria-pressed="true">Next</button></div>''')
    rep("</style>\n</head>",""".tour-top{display:flex;justify-content:space-between;align-items:center;gap:12px}
.tour-skip{font-family:var(--f-mono);font-size:12px;color:var(--ink);background:color-mix(in srgb,var(--surface) 80%,transparent);border:1px solid var(--rule);border-radius:999px;padding:5px 12px;cursor:pointer}
.tour-skip:hover{border-color:var(--law);color:var(--law)}
.tour .tick{height:2px;background:var(--soft);border-radius:2px;margin-top:12px;overflow:hidden}
.tour .tick i{display:block;height:100%;width:0;background:var(--ai);box-shadow:0 0 8px var(--ai)}
#tourPause[aria-pressed="true"]{color:var(--ink);border-color:var(--ai)}
</style>
</head>""")
    rep("let TI=-1,ringRAF=null;","let TI=-1,ringRAF=null,tourTimer=null,tourPaused=false;const STEPMS=7000;")
    rep("  cancelAnimationFrame(ringRAF);placeRing();}","""  cancelAnimationFrame(ringRAF);placeRing();scheduleStep();}
/* automatic advance: each step stays ~7 s; Pause, Back, Next and Skip are always available */
function scheduleStep(){clearTimeout(tourTimer);const t=$("#tourTick");t.style.transition="none";t.style.width="0";void t.offsetWidth;
  if(tourPaused||TI<0)return;t.style.transition=`width ${STEPMS}ms linear`;t.style.width="100%";
  tourTimer=setTimeout(()=>{if(TI>=TOUR.length-1)endTour();else showStep(TI+1)},STEPMS);}
function pauseTour(p){tourPaused=p;const b=$("#tourPause");b.setAttribute("aria-pressed",p);b.textContent=p?"▶ Play":"❚❚ Pause";
  if(p){clearTimeout(tourTimer);const t=$("#tourTick");const w=getComputedStyle(t).width;t.style.transition="none";t.style.width=w;}else scheduleStep();}""")
    rep('function startTour(){closeAsk();$("#tour").hidden=false;showStep(0);$("#tourNext").focus();}',
        'function startTour(auto){closeAsk();$("#tour").hidden=false;tourPaused=false;pauseTour(matchMedia("(prefers-reduced-motion: reduce)").matches);showStep(0);if(!auto)$("#tourNext").focus();}')
    rep('function endTour(){$("#tour").hidden=true;$("#tourRing").hidden=true;cancelAnimationFrame(ringRAF);TI=-1;}',
        'function endTour(){clearTimeout(tourTimer);$("#tour").hidden=true;$("#tourRing").hidden=true;cancelAnimationFrame(ringRAF);TI=-1;try{localStorage.setItem("tourSeen","1")}catch(_){}}\n$("#tourPause").addEventListener("click",()=>pauseTour(!tourPaused));')
    rep('function openAsk(prefill){','function openAsk(prefill){if(typeof TI!=="undefined"&&TI>=0)pauseTour(true);')
    rep('fromHash();window.addEventListener("hashchange",fromHash);','''fromHash();window.addEventListener("hashchange",fromHash);
/* first visit: start the tour automatically; anyone can skip it, and it won't auto-start again for them */
(function(){if(location.hash)return;let seen=false;try{seen=localStorage.getItem("tourSeen")==="1"}catch(_){}
  if(!seen)setTimeout(()=>{if($("#sheet").hidden&&$("#ask").hidden&&$("#tour").hidden)startTour(true)},1400);})();''')
    open(D+f,"w").write(s); print(f,"patched")
