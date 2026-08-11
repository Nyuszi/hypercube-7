/**
 * Nested Q_n hypercube projection + palettes.
 * Port of gen_hypercube.py for live browser rendering.
 */

/** Maximum drawable dimension (Q₀ … Q_MAX_N). */
export const MAX_N = 12;
export const NEST_DIM = 3;
/** Szalkai nests at the 3rd dimension (cube = square inside square); higher dims offset. */
export const SZALKAI_NEST_DIM = 2;
export const MARGIN = 26;

/** Clamp n into the supported range. */
export function clampN(n) {
  return Math.max(0, Math.min(MAX_N, Number(n) | 0));
}

/** Pad / trim a settings array to MAX_N slots. */
export function padDimArray(arr, fill) {
  const out = Array.isArray(arr) ? arr.slice(0, MAX_N) : [];
  while (out.length < MAX_N) {
    out.push(typeof fill === "function" ? fill(out.length) : fill);
  }
  return out;
}

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
    short: "Szalkai Hₙ construction",
  },
  petrie: {
    id: "petrie",
    label: "Petrie",
    short: "Petrie projection",
  },
};

/** Default (angle deg, length) for dimensions 0…MAX_N-1 (nested view). */
export const DEFAULT_BASIS_POLAR = [
  [8.0, 72.0],
  [98.0, 52.0],
  [148.0, 104.0], // dim 3 = 2 × dim 2
  [0.0, 1.0],
  [6.0, 300.0],
  [78.0, 230.0],
  [108.0, 470.0],
  [24.0, 620.0],
  [140.0, 800.0],
  [52.0, 1000.0],
  [96.0, 1250.0],
  [168.0, 1550.0],
];

/**
 * Szalkai = nested square for the 3rd dim (H₃), then parallel offsets for dim ≥ 4 (H₄…).
 * User-facing face is a square; dim 2 grows upward like Szalkai’s H₂ figure.
 */
export const SZALKAI_BASIS_POLAR = [
  [0.0, 72.0],     // dim 1 — right
  [-90.0, 72.0],   // dim 2 — up
  [0.0, 1.0],      // dim 3 — nest (scale); length unused
  [-30.0, 144.0],  // dim 4 — ~30° up-right bridge (Szalkai H₄)
  [6.0, 300.0],
  [78.0, 230.0],
  [108.0, 470.0],
  [24.0, 620.0],
  [140.0, 800.0],
  [52.0, 1000.0],
  [96.0, 1250.0],
  [168.0, 1550.0],
];

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
  "Dim 8 — offset",
  "Dim 9 — offset",
  "Dim 10 — offset",
  "Dim 11 — offset",
  "Dim 12 — offset",
];

/** Szalkai labels: dim 3 nests the face; dim 4+ are parallel copies. */
export const SZALKAI_DIM_LABELS = [
  "Dim 1 — right",
  "Dim 2 — up",
  "Dim 3 — nest (inner square)",
  "Dim 4 — H₃ offset",
  "Dim 5 — shelf offset",
  "Dim 6 — layer offset",
  "Dim 7 — long bridge",
  "Dim 8 — offset",
  "Dim 9 — offset",
  "Dim 10 — offset",
  "Dim 11 — offset",
  "Dim 12 — offset",
];

export const PALETTES = {
  neon: {
    group: "dark",
    label: "Neon",
    background: "#05060a",
    edges: [
      "#00e5ff", "#3df5c4", "#7cff5c", "#ffe14d", "#ff8a3d", "#ff3d84", "#b56cff",
      "#5ce1ff", "#c4ff6a", "#ff6ad5", "#6a8cff", "#ffc16a",
    ],
    vertex: "#ffffff",
    vertexStroke: "none",
  },
  tokyo: {
    group: "dark",
    label: "Tokyo",
    background: "#11121a",
    edges: [
      "#7dcfff", "#7aa2f7", "#bb9af7", "#73daca", "#9ece6a", "#e0af68", "#f7768e",
      "#89b4fa", "#f9e2af", "#cba6f7", "#a6e3a1", "#fab387",
    ],
    vertex: "#c0caf5",
    vertexStroke: "none",
  },
  dracula: {
    group: "dark",
    label: "Dracula",
    background: "#12141c",
    edges: [
      "#8be9fd", "#50fa7b", "#f1fa8c", "#ffb86c", "#ff79c6", "#bd93f9", "#ff5555",
      "#8be9fd", "#ffb86c", "#50fa7b", "#ff79c6", "#f1fa8c",
    ],
    vertex: "#f8f8f2",
    vertexStroke: "none",
  },
  nord: {
    group: "dark",
    label: "Nord",
    background: "#161a22",
    edges: [
      "#8fbcbb", "#88c0d0", "#81a1c1", "#a3be8c", "#ebcb8b", "#d08770", "#bf616a",
      "#5e81ac", "#b48ead", "#a3be8c", "#88c0d0", "#d08770",
    ],
    vertex: "#eceff4",
    vertexStroke: "none",
  },
  aurora: {
    group: "dark",
    label: "Aurora",
    background: "#04090f",
    edges: [
      "#9bffe4", "#3fe0b0", "#1fb6c9", "#3f7fe0", "#7a5cf0", "#c15ce0", "#ff8ecb",
      "#5cffb0", "#5c9fff", "#d05cff", "#ffb05c", "#8ecbff",
    ],
    vertex: "#e8fff8",
    vertexStroke: "none",
  },
  ember: {
    group: "dark",
    label: "Ember",
    background: "#0b0705",
    edges: [
      "#fff1b8", "#ffd166", "#ffa53d", "#ff7a2f", "#ff4f45", "#e02f6b", "#a3308f",
      "#ffc14d", "#ff6b4a", "#e04a8f", "#c44a2f", "#ffd98a",
    ],
    vertex: "#fff4dd",
    vertexStroke: "none",
  },
  ice: {
    group: "dark",
    label: "Ice",
    background: "#060a12",
    edges: [
      "#eaf7ff", "#a8e4ff", "#6cc6ff", "#4a9eff", "#6f7dff", "#9a6cff", "#cf6cff",
      "#7dd3fc", "#a78bfa", "#38bdf8", "#c084fc", "#67e8f9",
    ],
    vertex: "#ffffff",
    vertexStroke: "none",
  },
  gold: {
    group: "dark",
    label: "Gold",
    background: "#0a0806",
    edges: [
      "#fffbe8", "#f7e6b0", "#e9cd83", "#d9ae55", "#c28e35", "#a06d22", "#7a4f16",
      "#f0d78c", "#c9a227", "#a67c2a", "#d4b06a", "#8a6a28",
    ],
    vertex: "#fff6d8",
    vertexStroke: "none",
  },
  spectrum: {
    group: "dark",
    label: "Spectrum",
    background: "#000000",
    edges: [
      "#ff2d55", "#ff9500", "#ffe000", "#3ddc63", "#00d4d8", "#2f7bff", "#a45cff",
      "#ff5e3a", "#20c997", "#5c7cfa", "#f06595", "#fcc419",
    ],
    vertex: "#ffffff",
    vertexStroke: "none",
  },
  reference: {
    group: "bright",
    label: "Reference",
    background: "#ffffff",
    edges: [
      "#2b2b2b", "#2b2b2b", "#2b2b2b", "#8d24b8", "#1a7f27", "#1c3fc4", "#cf2233",
      "#e67e22", "#16a085", "#7f8c8d", "#8e44ad", "#c0392b",
    ],
    vertex: "#f2ddd6",
    vertexStroke: "#4a3330",
  },
  paper: {
    group: "bright",
    label: "Paper",
    background: "#f7f1e8",
    edges: [
      "#1a1a1a", "#3d3d3d", "#5c4a3a", "#8b3a2a", "#2a5c4a", "#2a3a6b", "#6b2a5c",
      "#8b6914", "#3a5c8b", "#5c2a3a", "#2a6b5c", "#6b5c2a",
    ],
    vertex: "#2a2118",
    vertexStroke: "none",
  },
  daylight: {
    group: "bright",
    label: "Daylight",
    background: "#f4f7fb",
    edges: [
      "#0b3d91", "#0a7a6e", "#1a8f2a", "#c9a227", "#d35400", "#c0392b", "#6c3483",
      "#1abc9c", "#2980b9", "#e74c3c", "#8e44ad", "#f39c12",
    ],
    vertex: "#1a2332",
    vertexStroke: "none",
  },
  pastel: {
    group: "bright",
    label: "Pastel",
    background: "#faf6f0",
    edges: [
      "#7eb8c9", "#8fbf88", "#e8c07a", "#e09a7a", "#d48aa8", "#a894c9", "#7a9ec9",
      "#c9a87e", "#8ac9b8", "#c98a9e", "#9ec97a", "#8a8ac9",
    ],
    vertex: "#5a5048",
    vertexStroke: "none",
  },
  citrus: {
    group: "bright",
    label: "Citrus",
    background: "#fffbeb",
    edges: [
      "#f59e0b", "#84cc16", "#14b8a6", "#0ea5e9", "#e11d48", "#a855f7", "#f97316",
      "#65a30d", "#0891b2", "#db2777", "#7c3aed", "#ea580c",
    ],
    vertex: "#292524",
    vertexStroke: "none",
  },
  ink: {
    group: "bright",
    label: "Ink",
    background: "#ffffff",
    edges: [
      "#111111", "#e11d48", "#ea580c", "#ca8a04", "#16a34a", "#2563eb", "#7c3aed",
      "#0f766e", "#be123c", "#c2410c", "#4d7c0f", "#1d4ed8",
    ],
    vertex: "#111111",
    vertexStroke: "none",
  },
  coral: {
    group: "bright",
    label: "Coral",
    background: "#fff5f3",
    edges: [
      "#e85d4c", "#2a9d8f", "#264653", "#e9c46a", "#f4a261", "#9b5de5", "#1d3557",
      "#e76f51", "#2a9d8f", "#e9c46a", "#457b9d", "#f4a261",
    ],
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
    visible: Array(MAX_N).fill(true),
    edgeColors: null, // null = use palette; else per-dim overrides
    pngScale: 2,
  };
}

/** Length / angle presets when switching projection (keeps palette & style). */
export function applyProjectionDefaults(settings, projection) {
  const s = settings;
  s.projection = PROJECTIONS[projection] ? projection : "nested";
  if (s.projection === "szalkai") {
    s.lengths = SZALKAI_BASIS_POLAR.map(([, len]) => len);
    s.angles = SZALKAI_BASIS_POLAR.map(([deg]) => deg);
    s.stretchX = 1;
    s.nestScale = DEFAULT_NEST_SCALE;
  } else if (s.projection === "petrie") {
    s.lengths = Array(MAX_N).fill(PETRIE_EDGE);
    s.angles = padDimArray(s.angles, (i) => (180 * i) / Math.max(s.n, 1));
  } else {
    s.lengths = DEFAULT_BASIS_POLAR.map(([, len]) => len);
    s.angles = DEFAULT_BASIS_POLAR.map(([deg]) => deg);
    s.nestScale = DEFAULT_NEST_SCALE;
    s.stretchX = 1.45;
  }
  s.visible = padDimArray(s.visible, true);
  return s;
}

/**
 * Szalkai: orthogonal face — dim 1 right (0°), dim 2 up (−90° in SVG).
 * Side lengths left free during n-morphs; UI keeps them equal when editing.
 */
export function szalkaiFaceSettings(settings) {
  const lengths = settings.lengths.slice();
  const angles = settings.angles.slice();
  lengths[0] = Number.isFinite(lengths[0]) ? Math.max(0, lengths[0]) : 72;
  lengths[1] = Number.isFinite(lengths[1]) ? Math.max(0, lengths[1]) : lengths[0];
  angles[0] = 0;
  angles[1] = -90;
  return { lengths, angles, stretchX: 1 };
}

/** Nest-bit index for the active projection. */
export function nestDimForProjection(projection) {
  return projection === "szalkai" ? SZALKAI_NEST_DIM : NEST_DIM;
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
  const s = applyProjectionDefaults(defaultSettings(), "szalkai");
  s.palette = "reference";
  s.glow = 0;
  return s;
}

export function resolvePalette(settings) {
  const base = PALETTES[settings.palette] || PALETTES.neon;
  const n = clampN(settings.n);
  const src = settings.edgeColors || base.edges;
  const edges = [];
  for (let i = 0; i < n; i++) {
    edges.push(src[i] || base.edges[i % base.edges.length] || "#888888");
  }
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

/**
 * Nested / Schlegel projection.
 *
 * nestDim = 3 (Nested view): 3D cuboid with face nesting; dim-3 depth stays 1:1;
 *   outer = nest-bit 0, inner = nest-bit 1.
 * nestDim = 2 (Szalkai): square face nests inward (H₃); dims ≥ 4 are parallel offsets (H₄).
 */
export function projectedPositions(
  basis,
  nestDim = NEST_DIM,
  nestScale = DEFAULT_NEST_SCALE,
) {
  const n = basis.length;
  // Nested: cube = dims 0..2. Szalkai: face = dims 0..1 (nest bit is dim 2).
  const cubeDims = Math.min(nestDim, n);
  const matchDepth = nestDim >= 3 && n > nestDim && cubeDims >= 3;

  const positions = [];
  for (let v = 0; v < 1 << n; v++) {
    // Outer = nest-bit 0 (0…); inner = nest-bit 1 (1…) — Szalkai H₃ convention.
    const nested = n > nestDim && ((v >> nestDim) & 1) === 1;
    let x = 0;
    let y = 0;

    if (!nested) {
      for (let i = 0; i < cubeDims; i++) {
        if ((v >> i) & 1) {
          x += basis[i][0];
          y += basis[i][1];
        }
      }
    } else if (!matchDepth) {
      // Uniform nest of the face/cube (Szalkai H₃, or classic 3-cube nest).
      const center = [0, 0];
      for (let i = 0; i < cubeDims; i++) {
        center[0] += basis[i][0] * 0.5;
        center[1] += basis[i][1] * 0.5;
      }
      for (let i = 0; i < cubeDims; i++) {
        if ((v >> i) & 1) {
          x += basis[i][0];
          y += basis[i][1];
        }
      }
      x = center[0] + nestScale * (x - center[0]);
      y = center[1] + nestScale * (y - center[1]);
    } else {
      // Nested view: nest the face; keep dim-3 depth equal to the outer cube (1:1).
      for (let i = 0; i < Math.min(2, cubeDims); i++) {
        if ((v >> i) & 1) {
          x += basis[i][0] * nestScale;
          y += basis[i][1] * nestScale;
        }
        x += basis[i][0] * 0.5 * (1 - nestScale);
        y += basis[i][1] * 0.5 * (1 - nestScale);
      }
      if ((v >> 2) & 1) {
        x += basis[2][0];
        y += basis[2][1];
      }
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
  let angles = settings.angles;
  let lengths = settings.lengths;
  let stretchX = settings.stretchX;
  if (proj === "szalkai") {
    ({ lengths, angles, stretchX } = szalkaiFaceSettings(settings));
  }
  const basis = basisVectors(angles, lengths, n, stretchX);
  return projectedPositions(
    basis,
    nestDimForProjection(proj),
    settings.nestScale,
  );
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
 * @param {{ highlightDim?: number|null, asString?: boolean, labelMorph?: { fromN: number, toN: number, t: number }|null }} options
 */
export function buildHypercubeSvg(settings, options = {}) {
  const { highlightDim = null, asString = false, labelMorph = null } = options;
  const n = clampN(settings.n);
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
  const hitR = Math.max(
    n === 0 ? 8 : 7,
    (settings.vertexRadius || 0) * 2.2,
  );
  // Invisible hit targets so hover works even when vertices are tiny / hidden,
  // and despite the stage pan cursor + CSS transform (native <title> fails there).
  if (!asString) {
    const hg = document.createElementNS(NS, "g");
    hg.setAttribute("class", "vertex-hits");
    hg.setAttribute("fill", "transparent");
    hg.setAttribute("stroke", "none");
    for (let v = 0; v < pos.length; v++) {
      const [x, y] = pos[v];
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", x.toFixed(2));
      c.setAttribute("cy", y.toFixed(2));
      c.setAttribute("r", String(hitR));
      c.setAttribute("data-vertex", String(v));
      c.setAttribute("data-label", toBinaryLabel(v, n));
      hg.appendChild(c);
    }
    svg.appendChild(hg);
  }

  if (drawVerts) {
    const vg = document.createElementNS(NS, "g");
    vg.setAttribute("class", "vertex-dots");
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
      c.setAttribute("pointer-events", "none");
      vg.appendChild(c);
    }
    svg.appendChild(vg);
  }

  if (settings.showLabels) {
    const lg = document.createElementNS(NS, "g");
    lg.setAttribute("class", "vertex-labels");
    lg.setAttribute("pointer-events", "none");
    const labelFill = labelColorForBackground(palette.background);
    const fontSize = Math.max(3.2, Math.min(8.5, 15 - n * 1.1));
    lg.setAttribute("fill", labelFill);
    lg.setAttribute("font-family", "IBM Plex Mono, ui-monospace, monospace");
    lg.setAttribute("font-size", String(fontSize));
    lg.setAttribute("text-anchor", "middle");
    lg.setAttribute("dominant-baseline", "hanging");
    lg.setAttribute("opacity", "0.92");
    const morph =
      labelMorph &&
      Number.isFinite(labelMorph.t) &&
      labelMorph.fromN !== labelMorph.toN
        ? labelMorph
        : null;

    for (let v = 0; v < pos.length; v++) {
      const [x, y] = pos[v];
      const t = document.createElementNS(NS, "text");
      t.setAttribute("x", x.toFixed(2));
      t.setAttribute("y", (y + settings.vertexRadius + 1.2).toFixed(2));
      if (morph) {
        const glyphs = morphBinaryGlyphs(
          v,
          morph.fromN,
          morph.toN,
          morph.t,
        );
        t.setAttribute("text-anchor", "middle");
        let rowOpacity = 1;
        if (morph.toN > morph.fromN && morph.fromN > 0 && v >= 1 << morph.fromN) {
          rowOpacity = 0.15 + 0.85 * morph.t;
        } else if (
          morph.toN < morph.fromN &&
          (morph.toN > 0 ? v >> morph.toN : v) !== 0
        ) {
          rowOpacity = Math.max(0, 1 - morph.t);
        }
        t.setAttribute("opacity", String(rowOpacity));
        for (const g of glyphs) {
          if (g.opacity < 0.02) continue;
          const span = document.createElementNS(NS, "tspan");
          span.textContent = g.ch;
          span.setAttribute(
            "opacity",
            String(Math.max(0, Math.min(1, g.opacity))),
          );
          span.setAttribute("font-size", (fontSize * (g.scale || 1)).toFixed(2));
          if (g.kind === "in") span.setAttribute("class", "bit-in");
          if (g.kind === "out") span.setAttribute("class", "bit-out");
          t.appendChild(span);
        }
      } else {
        t.textContent = toBinaryLabel(v, n);
      }
      lg.appendChild(t);
    }
    svg.appendChild(lg);
  }

  if (asString) {
    return new XMLSerializer().serializeToString(svg);
  }
  return { svg, width, height, background: palette.background };
}

/**
 * Binary address of a vertex.
 * Written MSB→LSB left to right: leftmost bit = dimension n, rightmost = dimension 1.
 * Example n=4: 0001 = dim1, 0010 = dim2, 0100 = dim3, 1000 = dim4.
 */
export function toBinaryLabel(v, n) {
  if (n <= 0) return "∅";
  return v.toString(2).padStart(n, "0");
}

/**
 * Glyphs for animating label morphs when n changes (e.g. 0 → 00, 1 → 01).
 * Leading bits are the newest dimension (prepended on the left).
 * @returns {{ ch: string, opacity: number, scale: number, kind: string }[]}
 */
export function morphBinaryGlyphs(v, fromN, toN, t) {
  const e = Math.min(1, Math.max(0, Number(t) || 0));
  const a = Math.max(0, fromN | 0);
  const b = Math.max(0, toN | 0);

  if (a === b) {
    const s = toBinaryLabel(v, b);
    return [...s].map((ch) => ({ ch, opacity: 1, scale: 1, kind: "keep" }));
  }

  // Growing: new high bits fade/scale in on the left; survivors keep old bits.
  if (b > a) {
    const final = toBinaryLabel(v, b);
    const added = b - a;
    const onOriginal = a === 0 ? v === 0 : v < 1 << a;
    const glyphs = [];

    if (a === 0 && e < 0.55) {
      // ∅ dissolves into the first bit.
      const voidFade = 1 - e / 0.55;
      glyphs.push({
        ch: "∅",
        opacity: voidFade,
        scale: 0.85 + 0.15 * voidFade,
        kind: "out",
      });
    }

    for (let i = 0; i < final.length; i++) {
      const isNew = i < added;
      let opacity = 1;
      let scale = 1;
      let kind = "keep";
      if (a === 0) {
        const birth = Math.max(0, (e - 0.2) / 0.8);
        opacity = birth;
        scale = 0.4 + 0.6 * birth;
        kind = "in";
      } else if (onOriginal) {
        if (isNew) {
          opacity = e;
          scale = 0.3 + 0.7 * e;
          kind = "in";
        }
      } else {
        opacity = 0.12 + 0.88 * e;
        scale = 0.45 + 0.55 * e;
        kind = "in";
      }
      glyphs.push({ ch: final[i], opacity, scale, kind });
    }
    return glyphs;
  }

  // Shrinking: high bits peel off; copies with those bits set fade away.
  const start = toBinaryLabel(v, a);
  const removed = a - b;
  const high = b > 0 ? v >> b : v;
  const disappearing = high !== 0;
  if (disappearing) {
    return [...start].map((ch) => ({
      ch,
      opacity: Math.max(0, 1 - e),
      scale: 1 - 0.35 * e,
      kind: "out",
    }));
  }
  return [...start].map((ch, i) => {
    const leaving = i < removed;
    return {
      ch,
      opacity: leaving ? Math.max(0, 1 - e) : 1,
      scale: leaving ? Math.max(0.25, 1 - 0.6 * e) : 1,
      kind: leaving ? "out" : "keep",
    };
  });
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
