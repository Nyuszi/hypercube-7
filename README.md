# Hypercube Q₇ — Interactive Viewer

A browser-based tuner for the **7-dimensional hypercube graph** (and lower Qₙ).  
All rendering runs **locally in the visitor’s browser** — nothing is computed on a server.

## Open locally

```bash
python3 -m http.server 8731
```

Then visit [http://127.0.0.1:8731/](http://127.0.0.1:8731/).

## Features

- Nested (cuboid-in-cuboid) 4th dimension + shelf layout for higher dims
- Math panel: definition of \(Q_n\), live vertex/edge/degree counts, binary labels
- Dark & bright palettes, per-dimension lengths / angles / colors
- Live zoom, pan, fit
- Animated dimension changes (grow / collapse axes with auto-fit)
- PNG screenshot (1× / 2× / 3×) and SVG export
- Shareable URL hash + local presets

## Offline CLI

```bash
python3 gen_hypercube.py -p neon -o hypercube.svg
```
