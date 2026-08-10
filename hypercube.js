/**
 * Nested Q_n hypercube projection + palettes.
 * Port of gen_hypercube.py for live browser rendering.
 */

export const NEST_DIM = 3;
export const MARGIN = 26;

/** Drawing modes (2D layouts of the same Qₙ graph). */
export const PROJECTIONS = {
  nested: {
    id: "nested",
    label: "Nested",
    short: "Nested / Schlegel",
  },
  szalkai: {
    id: "szalkai",
    label: "Szalkai",
    short: "Szalkai rectangle",
  },
  petrie: {
    id: "petrie",
    label: "Petrie",
    short: "Petrie projection",
  },
};

/** Default (angle deg, length) for dimensions 0–6 (nested view). */
export const DEFAULT_BASIS_POLAR = [
  [8.0, 72.0],
  [98.0, 52.0],
  [148.0, 58.0],
  [0.0, 1.0],
  [6.0, 300.0],
  [78.0, 230.0],
  [108.0, 470.0],
];

/**
 * Length defaults for Szalkai’s parallel “copy & offset” layout
 * (square-faced cubes packed into a rectangle; last dim diagonal).
 */
export const SZALKAI_LENGTHS = [26, 26, 16, 90, 90, 140, 180];

/** Equal edge length for a true Petrie (Coxeter-plane) projection. */
export const PETRIE_EDGE = 48;

export const DEFAULT_NEST_SCALE = 0.42;

export const DIM_LABELS = [
  "Dim 1 — cuboid width",
  "Dim 2 — cuboid height",
  "Dim 3 — cuboid depth",
  "Dim 4 — nest (inner cuboid)",
  "Dim 5 — shelf offset",
  "Dim 6 — layer offset",
  "Dim 7 — long bridge",
];

export const PALETTES = {
  neon: {
    group: "dark",
    label: "Neon",
    background: "#05060a",
    edges: ["#00e5ff", "#3df5c4", "#7cff5c", "#ffe14d", "#ff8a3d", "#ff3d84", "#b56cff"],
    vertex: "#ffffff",
    vertexStroke: "none",
  },
  tokyo: {
    group: "dark",
    label: "Tokyo",
    background: "#11121a",
    edges: ["#7dcfff", "#7aa2f7", "#bb9af7", "#73daca", "#9ece6a", "#e0af68", "#f7768e"],
    vertex: "#c0caf5",
    vertexStroke: "none",
  },
  dracula: {
    group: "dark",
    label: "Dracula",
    background: "#12141c",
    edges: ["#8be9fd", "#50fa7b", "#f1fa8c", "#ffb86c", "#ff79c6", "#bd93f9", "#ff5555"],
    vertex: "#f8f8f2",
    vertexStroke: "none",
  },
  nord: {
    group: "dark",
    label: "Nord",
    background: "#161a22",
    edges: ["#8fbcbb", "#88c0d0", "#81a1c1", "#a3be8c", "#ebcb8b", "#d08770", "#bf616a"],
    vertex: "#eceff4",
    vertexStroke: "none",
  },
  aurora: {
    group: "dark",
    label: "Aurora",
    background: "#04090f",
    edges: ["#9bffe4", "#3fe0b0", "#1fb6c9", "#3f7fe0", "#7a5cf0", "#c15ce0", "#ff8ecb"],
    vertex: "#e8fff8",
    vertexStroke: "none",
  },
  ember: {
    group: "dark",
    label: "Ember",
    background: "#0b0705",
    edges: ["#fff1b8", "#ffd166", "#ffa53d", "#ff7a2f", "#ff4f45", "#e02f6b", "#a3308f"],
    vertex: "#fff4dd",
    vertexStroke: "none",
  },
  ice: {
    group: "dark",
    label: "Ice",
    background: "#060a12",
    edges: ["#eaf7ff", "#a8e4ff", "#6cc6ff", "#4a9eff", "#6f7dff", "#9a6cff", "#cf6cff"],
    vertex: "#ffffff",
    vertexStroke: "none",
  },
  gold: {
    group: "dark",
    label: "Gold",
    background: "#0a0806",
    edges: ["#fffbe8", "#f7e6b0", "#e9cd83", "#d9ae55", "#c28e35", "#a06d22", "#7a4f16"],
    vertex: "#fff6d8",
    vertexStroke: "none",
  },
  spectrum: {
    group: "dark",
    label: "Spectrum",
    background: "#000000",
    edges: ["#ff2d55", "#ff9500", "#ffe000", "#3ddc63", "#00d4d8", "#2f7bff", "#a45cff"],
    vertex: "#ffffff",
    vertexStroke: "none",
  },
  reference: {
    group: "bright",
    label: "Reference",
    background: "#ffffff",
    edges: ["#2b2b2b", "#2b2b2b", "#2b2b2b", "#8d24b8", "#1a7f27", "#1c3fc4", "#cf2233"],
    vertex: "#f2ddd6",
    vertexStroke: "#4a3330",
  },
  paper: {
    group: "bright",
    label: "Paper",
    background: "#f7f1e8",
    edges: ["#1a1a1a", "#3d3d3d", "#5c4a3a", "#8b3a2a", "#2a5c4a", "#2a3a6b", "#6b2a5c"],
    vertex: "#2a2118",
    vertexStroke: "none",
  },
  daylight: {
    group: "bright",
    label: "Daylight",
    background: "#f4f7fb",
    edges: ["#0b3d91", "#0a7a6e", "#1a8f2a", "#c9a227", "#d35400", "#c0392b", "#6c3483"],
    vertex: "#1a2332",
    vertexStroke: "none",
  },
  pastel: {
    group: "bright",
    label: "Pastel",
    background: "#faf6f0",
    edges: ["#7eb8c9", "#8fbf88", "#e8c07a", "#e09a7a", "#d48aa8", "#a894c9", "#7a9ec9"],
    vertex: "#5a5048",
    vertexStroke: "none",
  },
  citrus: {
    group: "bright",
    label: "Citrus",
    background: "#fffbeb",
    edges: ["#f59e0b", "#84cc16", "#14b8a6", "#0ea5e9", "#e11d48", "#a855f7", "#f97316"],
    vertex: "#292524",
    vertexStroke: "none",
  },
  ink: {
    group: "bright",
    label: "Ink",
    background: "#ffffff",
    edges: ["#111111", "#e11d48", "#ea580c", "#ca8a04", "#16a34a", "#2563eb", "#7c3aed"],
    vertex: "#111111",
    vertexStroke: "none",
  },
  coral: {
    group: "bright",
    label: "Coral",
    background: "#fff5f3",
    edges: ["#e85d4c", "#2a9d8f", "#264653", "#e9c46a", "#f4a261", "#9b5de5", "#1d3557"],
    vertex: "#2b1d1a",
    vertexStroke: "none",
  },
};

/** Prefer a bright palette when the OS/browser is in light mode. */
export function systemDefaultPalette() {
  try {
    if (
      typeof matchMedia === "function" &&
      matchMedia("(prefers-color-scheme: light)").matches
    ) {
      return "paper";
    }
  } catch {
    /* ignore */
  }
  return "neon";
}

export function defaultSettings() {
  return {
    palette: systemDefaultPalette(),
    projection: "nested",
    n: 7,
    nestScale: DEFAULT_NEST_SCALE,
    stretchX: 1.45,
    strokeWidth: 0.9,
    vertexRadius: 1.5,
    showVertices: true,
    showLabels: false,
    glow: 0,
    lengths: DEFAULT_BASIS_POLAR.map(([, len]) => len),
    angles: DEFAULT_BASIS_POLAR.map(([deg]) => deg),
    visible: [true, true, true, true, true, true, true],
    edgeColors: null, // null = use palette; else length-7 array
    pngScale: 2,
  };
}

/** Length / angle presets when switching projection (keeps palette & style). */
export function applyProjectionDefaults(settings, projection) {
  const s = settings;
  s.projection = PROJECTIONS[projection] ? projection : "nested";
  if (s.projection === "szalkai") {
    s.lengths = SZALKAI_LENGTHS.slice();
  } else if (s.projection === "petrie") {
    s.lengths = Array(7).fill(PETRIE_EDGE);
  } else {
    s.lengths = DEFAULT_BASIS_POLAR.map(([, len]) => len);
    s.angles = DEFAULT_BASIS_POLAR.map(([deg]) => deg);
    s.nestScale = DEFAULT_NEST_SCALE;
    s.stretchX = 1.45;
  }
  return s;
}

/** Relative luminance of a #rrggbb (or #rgb) color; used for label contrast. */
export function luminance(hex) {
  let h = String(hex || "#000000").replace("#", "");
  if (h.length === 3) {
    h = h.split("").map((c) => c + c).join("");
  }
  const toLin = (v) => {
    const s = parseInt(h.slice(v, v + 2), 16) / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * toLin(0) + 0.7152 * toLin(2) + 0.0722 * toLin(4);
}

export function labelColorForBackground(bg) {
  return luminance(bg) > 0.55 ? "#1a1a1a" : "#e8ecf2";
}

export function referencePreset() {
  const s = defaultSettings();
  s.projection = "nested";
  s.palette = "reference";
  s.stretchX = 1.2;
  s.nestScale = 0.42;
  s.glow = 0;
  s.lengths = [72, 52, 58, 1, 300, 230, 470];
  s.angles = [8, 98, 148, 0, 6, 78, 108];
  return s;
}

export function resolvePalette(settings) {
  const base = PALETTES[settings.palette] || PALETTES.neon;
  const edges = settings.edgeColors
    ? settings.edgeColors.slice(0, settings.n)
    : base.edges.slice(0, settings.n);
  return {
    background: base.background,
    edges,
    vertex: base.vertex,
    vertexStroke: base.vertexStroke,
    group: base.group,
    label: base.label,
  };
}

export function basisVectors(angles, lengths, n, stretchX = 1) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const rad = (angles[i] * Math.PI) / 180;
    const len = lengths[i];
    out.push([Math.cos(rad) * len * stretchX, Math.sin(rad) * len]);
  }
  return out;
}

/** Pure parallel projection: vertex = sum of basis vectors for bits set. */
export function linearPositions(basis) {
  const n = basis.length;
  const positions = [];
  for (let v = 0; v < 1 << n; v++) {
    let x = 0;
    let y = 0;
    for (let i = 0; i < n; i++) {
      if ((v >> i) & 1) {
        x += basis[i][0];
        y += basis[i][1];
      }
    }
    positions.push([x, y]);
  }
  return positions;
}

/**
 * Petrie / Coxeter-plane projection: basis vectors at angles k·π/angleN so the
 * Petrie polygon is a regular 2n-gon when angleN === n. During dimension morphs,
 * angleN may be a fractional blend between old and new n so axes rotate smoothly.
 */
export function petrieBasisVectors(lengths, n, angleN = n) {
  const denom = Math.max(Number(angleN) || n || 1, 1e-6);
  const basis = [];
  for (let i = 0; i < n; i++) {
    const len = Number.isFinite(lengths[i]) ? Math.max(0, lengths[i]) : PETRIE_EDGE;
    const a = (Math.PI * i) / denom;
    basis.push([Math.cos(a) * len, Math.sin(a) * len]);
  }
  return basis;
}

function basisBBox(basis) {
  let xPos = 0;
  let xNeg = 0;
  let yPos = 0;
  let yNeg = 0;
  for (const [x, y] of basis) {
    if (x > 0) xPos += x;
    else xNeg += x;
    if (y > 0) yPos += y;
    else yNeg += y;
  }
  return { w: xPos - xNeg, h: yPos - yNeg };
}

/**
 * Szalkai parallel layout (after Dr. István Szalkai’s cube-graph drawings):
 * square-faced unit cubes (dims 0–1 equal & orthogonal, dim 2 short depth),
 * then higher dims alternate horizontal / vertical shelf offsets sized from the
 * lower-dim bounding box. The last dimension (for n ≥ 6) is a long diagonal
 * so the two Qₙ₋₁ halves stay readable — matching the classic H₇ figure.
 */
export function szalkaiBasisVectors(lengths, n) {
  const basis = [];
  const len = (i, fallback) => {
    const v = lengths[i];
    return Number.isFinite(v) ? Math.max(0, v) : fallback;
  };

  // Perfect rectangle / square face for the unit cube.
  const side = len(0, 26);
  if (n >= 1) basis.push([side, 0]);
  if (n >= 2) basis.push([0, side]); // equal side — square face
  if (n >= 3) {
    const d = len(2, 16);
    basis.push([d * 0.62, d * 0.48]);
  }

  for (let i = 3; i < n; i++) {
    const { w, h } = basisBBox(basis);
    const ref = SZALKAI_LENGTHS[i] || 100;
    const gapFactor = len(i, ref) / ref;
    const pad = Math.max(10, side * 0.45);
    if (gapFactor <= 0) {
      basis.push([0, 0]);
      continue;
    }
    // Final dimension: long diagonal bridge (red edges in the reference H₇).
    if (i === n - 1 && n >= 6) {
      const span = (h + pad) * gapFactor;
      basis.push([span * 0.32, span]);
      continue;
    }
    if ((i - 3) % 2 === 0) {
      basis.push([(w + pad) * gapFactor, 0]);
    } else {
      basis.push([0, (h + pad) * gapFactor]);
    }
  }
  return basis;
}

export function projectedPositions(basis, nestDim = NEST_DIM, nestScale = DEFAULT_NEST_SCALE) {
  const n = basis.length;
  const cubeDims = Math.min(3, n);
  const center = [0, 0];
  for (let i = 0; i < cubeDims; i++) {
    center[0] += basis[i][0] * 0.5;
    center[1] += basis[i][1] * 0.5;
  }

  const positions = [];
  for (let v = 0; v < 1 << n; v++) {
    let x = 0;
    let y = 0;
    for (let i = 0; i < cubeDims; i++) {
      if ((v >> i) & 1) {
        x += basis[i][0];
        y += basis[i][1];
      }
    }
    if (n > nestDim && (v >> nestDim) & 1) {
      x = center[0] + nestScale * (x - center[0]);
      y = center[1] + nestScale * (y - center[1]);
    }
    for (let i = 0; i < n; i++) {
      if (i < cubeDims || i === nestDim) continue;
      if ((v >> i) & 1) {
        x += basis[i][0];
        y += basis[i][1];
      }
    }
    positions.push([x, y]);
  }
  return positions;
}

/** Resolve 2D vertex positions for the active projection. */
export function positionsForSettings(settings, n) {
  if (n <= 0) return [[0, 0]];
  const proj = PROJECTIONS[settings.projection] ? settings.projection : "nested";
  if (proj === "petrie") {
    const angleN =
      settings.petrieAngleN != null ? settings.petrieAngleN : n;
    return linearPositions(petrieBasisVectors(settings.lengths, n, angleN));
  }
  if (proj === "szalkai") {
    // Keep the unit-cube face square even if only one side slider moved.
    const lengths = settings.lengths.slice();
    const side = Number.isFinite(lengths[0]) ? Math.max(0, lengths[0]) : 26;
    lengths[0] = side;
    lengths[1] = side;
    return linearPositions(szalkaiBasisVectors(lengths, n));
  }
  const basis = basisVectors(
    settings.angles,
    settings.lengths,
    n,
    settings.stretchX,
  );
  return projectedPositions(basis, NEST_DIM, settings.nestScale);
}

export function edgesByDimension(n) {
  const groups = [];
  for (let i = 0; i < n; i++) {
    const edges = [];
    for (let v = 0; v < 1 << n; v++) {
      if (!((v >> i) & 1)) edges.push([v, v ^ (1 << i)]);
    }
    groups.push(edges);
  }
  return groups;
}

function meanEdgeLength(pos, edges) {
  if (!edges.length) return 0;
  let total = 0;
  for (const [a, b] of edges) {
    const dx = pos[a][0] - pos[b][0];
    const dy = pos[a][1] - pos[b][1];
    total += Math.hypot(dx, dy);
  }
  return total / edges.length;
}

/**
 * Build an SVG element (or string) for the current settings.
 * @param {object} settings
 * @param {{ highlightDim?: number|null, asString?: boolean }} options
 */
export function buildHypercubeSvg(settings, options = {}) {
  const { highlightDim = null, asString = false } = options;
  const n = Math.max(0, Math.min(7, settings.n | 0));
  const palette = resolvePalette({ ...settings, n });
  let pos = positionsForSettings(settings, n);

  const xs = pos.map((p) => p[0]);
  const ys = pos.map((p) => p[1]);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  // Q0 is a single point — give the canvas a stable square so Fit works.
  const spanX = Math.max(maxX - minX, n === 0 ? 40 : 0);
  const spanY = Math.max(maxY - minY, n === 0 ? 40 : 0);
  const width = spanX + 2 * MARGIN;
  const height = spanY + 2 * MARGIN;
  const ox = MARGIN + (spanX - (maxX - minX)) / 2;
  const oy = MARGIN + (spanY - (maxY - minY)) / 2;
  pos = pos.map(([x, y]) => [x - minX + ox, y - minY + oy]);

  const groups = edgesByDimension(n);
  const order = [...Array(n).keys()].sort(
    (a, b) => meanEdgeLength(pos, groups[b]) - meanEdgeLength(pos, groups[a]),
  );

  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("xmlns", NS);
  svg.setAttribute("width", width.toFixed(1));
  svg.setAttribute("height", height.toFixed(1));
  svg.setAttribute("viewBox", `0 0 ${width.toFixed(1)} ${height.toFixed(1)}`);

  const title = document.createElementNS(NS, "title");
  title.textContent = `Hypercube graph Q${n}`;
  svg.appendChild(title);

  if (settings.glow > 0) {
    const defs = document.createElementNS(NS, "defs");
    const filter = document.createElementNS(NS, "filter");
    filter.setAttribute("id", "glow");
    filter.setAttribute("x", "-20%");
    filter.setAttribute("y", "-20%");
    filter.setAttribute("width", "140%");
    filter.setAttribute("height", "140%");
    const blur = document.createElementNS(NS, "feGaussianBlur");
    blur.setAttribute("stdDeviation", String(settings.glow));
    blur.setAttribute("result", "b");
    const merge = document.createElementNS(NS, "feMerge");
    const n1 = document.createElementNS(NS, "feMergeNode");
    n1.setAttribute("in", "b");
    const n2 = document.createElementNS(NS, "feMergeNode");
    n2.setAttribute("in", "SourceGraphic");
    merge.appendChild(n1);
    merge.appendChild(n2);
    filter.appendChild(blur);
    filter.appendChild(merge);
    defs.appendChild(filter);
    svg.appendChild(defs);
  }

  const bg = document.createElementNS(NS, "rect");
  bg.setAttribute("width", width.toFixed(1));
  bg.setAttribute("height", height.toFixed(1));
  bg.setAttribute("fill", palette.background);
  svg.appendChild(bg);

  const edgesRoot = document.createElementNS(NS, "g");
  edgesRoot.setAttribute("stroke-width", String(settings.strokeWidth));
  edgesRoot.setAttribute("stroke-linecap", "round");
  edgesRoot.setAttribute("fill", "none");
  if (settings.glow > 0) edgesRoot.setAttribute("filter", "url(#glow)");

  for (const i of order) {
    if (settings.visible[i] === false) continue;
    const g = document.createElementNS(NS, "g");
    g.setAttribute("stroke", palette.edges[i]);
    g.setAttribute("data-dimension", String(i + 1));
    if (highlightDim != null && highlightDim !== i) {
      g.setAttribute("opacity", "0.12");
    } else if (highlightDim === i) {
      g.setAttribute("opacity", "1");
      g.setAttribute("stroke-width", String(settings.strokeWidth * 1.35));
    }
    for (const [a, b] of groups[i]) {
      const line = document.createElementNS(NS, "line");
      line.setAttribute("x1", pos[a][0].toFixed(2));
      line.setAttribute("y1", pos[a][1].toFixed(2));
      line.setAttribute("x2", pos[b][0].toFixed(2));
      line.setAttribute("y2", pos[b][1].toFixed(2));
      g.appendChild(line);
    }
    edgesRoot.appendChild(g);
  }
  svg.appendChild(edgesRoot);

  const drawVerts = n === 0 || (settings.showVertices && settings.vertexRadius > 0);
  if (drawVerts) {
    const vg = document.createElementNS(NS, "g");
    vg.setAttribute("fill", palette.vertex);
    if (palette.vertexStroke && palette.vertexStroke !== "none") {
      vg.setAttribute("stroke", palette.vertexStroke);
      vg.setAttribute("stroke-width", String(settings.strokeWidth * 0.8));
    }
    const r = n === 0
      ? Math.max(settings.vertexRadius || 0, 5)
      : settings.vertexRadius;
    for (let v = 0; v < pos.length; v++) {
      const [x, y] = pos[v];
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", x.toFixed(2));
      c.setAttribute("cy", y.toFixed(2));
      c.setAttribute("r", String(r));
      const tip = document.createElementNS(NS, "title");
      tip.textContent = toBinaryLabel(v, n);
      c.appendChild(tip);
      vg.appendChild(c);
    }
    svg.appendChild(vg);
  }

  if (settings.showLabels) {
    const lg = document.createElementNS(NS, "g");
    const labelFill = labelColorForBackground(palette.background);
    const fontSize = Math.max(3.2, Math.min(8.5, 15 - n * 1.1));
    lg.setAttribute("fill", labelFill);
    lg.setAttribute("font-family", "IBM Plex Mono, ui-monospace, monospace");
    lg.setAttribute("font-size", String(fontSize));
    lg.setAttribute("text-anchor", "middle");
    lg.setAttribute("dominant-baseline", "hanging");
    lg.setAttribute("opacity", "0.92");
    for (let v = 0; v < pos.length; v++) {
      const [x, y] = pos[v];
      const t = document.createElementNS(NS, "text");
      t.setAttribute("x", x.toFixed(2));
      t.setAttribute("y", (y + settings.vertexRadius + 1.2).toFixed(2));
      t.textContent = toBinaryLabel(v, n);
      lg.appendChild(t);
    }
    svg.appendChild(lg);
  }

  if (asString) {
    return new XMLSerializer().serializeToString(svg);
  }
  return { svg, width, height, background: palette.background };
}

/** Binary address of a vertex (bit 0 = least significant = dimension 1). */
export function toBinaryLabel(v, n) {
  if (n <= 0) return "∅";
  return v.toString(2).padStart(n, "0");
}

export function graphStats(n) {
  const dim = Math.max(0, n | 0);
  return {
    n: dim,
    vertices: 1 << dim,
    edges: dim === 0 ? 0 : dim * (1 << (dim - 1)),
    degree: dim,
  };
}

export function paletteGroups() {
  const dark = [];
  const bright = [];
  for (const [id, p] of Object.entries(PALETTES)) {
    (p.group === "bright" ? bright : dark).push({ id, ...p });
  }
  return { dark, bright };
}
