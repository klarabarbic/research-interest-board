S="/private/tmp/claude-501/-Users-klarabarbic-AI/a1d79515-4e3d-4c05-a661-95b689e8c1cd/scratchpad/"
D="/Users/klarabarbic/AI/research-interest-board/"
s=open(D+"network-pro.html").read()
css=open(S+"cork.css").read()+open(S+"cork2.css").read()
js=open(S+"cork.js").read()+open(S+"cork2.js").read()
fonts='<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Special+Elite&family=Caveat:wght@500;700&family=Courier+Prime:wght@400;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap">'
a='<link rel="preconnect" href="https://fonts.googleapis.com">'
assert s.count(a)==1; s=s.replace(a,a+"\n"+fonts)
assert s.count("</style>\n</head>")==1; s=s.replace("</style>\n</head>",css+"</style>\n</head>")
k=s.rindex("</script>"); s=s[:k]+js+s[k:]
open(D+"corkboard.html","w").write(s); print("ok")
