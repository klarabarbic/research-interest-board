# Build sources

Pieces used to generate the board pages. Each `build_*.py` reads the previous page and writes the next:
`network.html` → `build_lab.py` → `network-lab.html` → `build_mosaic.py` → `network-mosaic.html` → `build_pro.py` → `network-pro.html` (copied to `index.html`).
The scripts expect their inputs in a scratch folder (`S`) and the site folder (`D`), so adjust those two paths at the top before re-running.
"Trending now" stories are not in the HTML; they load from `../trending.json`.
