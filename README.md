# Hypercube Q₇ — Interactive Viewer

A browser-based tuner for the **hypercube graph** \(Q_n\) (dimensions 0–12; default \(Q_7\)).  
All rendering runs **locally in the visitor’s browser** — nothing is computed on a server.

## Open locally

```bash
python3 -m http.server 8731
```

Then visit [http://127.0.0.1:8731/](http://127.0.0.1:8731/).

## Features

- View modes: **Nested** (Schlegel), **Szalkai** (nested with square user-facing face), **Petrie** (Coxeter-plane / regular \(2n\)-gon)
- Math panel: definition of \(Q_n\), live vertex/edge/degree counts, binary labels
- About / credits with sources (deep-link `#about`)
- Dark & bright palettes, per-dimension lengths / colors (angles in Nested)
- Live zoom, pan, fit
- Animated dimension changes (grow / collapse axes with auto-fit)
- PNG screenshot (1× / 2× / 3×) and SVG export
- Shareable URL hash + local presets
- English / Hungarian UI

## Offline CLI

```bash
python3 gen_hypercube.py -p neon -o hypercube.svg
```
