import {
  PALETTES,
  DIM_LABELS,
  NEST_DIM,
  defaultSettings,
  referencePreset,
  resolvePalette,
  buildHypercubeSvg,
  paletteGroups,
  graphStats,
} from "./hypercube.js";

const PRESET_KEY = "hypercube-presets-v1";

const state = {
  settings: defaultSettings(),
  highlightDim: null,
  view: { scale: 1, x: 0, y: 0 },
  panning: false,
  panStart: null,
  pointers: new Map(),
  pinch: null,
  raf: 0,
  hashTimer: 0,
  resizeTimer: 0,
  dimAnim: null, // animation frame id while morphing dimensions
};

const el = {
  stage: document.getElementById("stage"),
  stageInner: document.getElementById("stage-inner"),
  stageWrap: document.querySelector(".stage-wrap"),
  palette: document.getElementById("palette"),
  swatches: document.getElementById("palette-swatches"),
  brandN: document.getElementById("brand-n"),
  lengthSliders: document.getElementById("length-sliders"),
  angleSliders: document.getElementById("angle-sliders"),
  presetList: document.getElementById("preset-list"),
  presetName: document.getElementById("preset-name"),
  toast: document.getElementById("toast"),
  pngScale: document.getElementById("png-scale"),
};

function toast(msg) {
  el.toast.textContent = msg;
  el.toast.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.toast.classList.remove("show"), 1800);
}

function subscript(n) {
  const map = "₀₁₂₃₄₅₆₇₈₉";
  return String(n)
    .split("")
    .map((c) => map[c] || c)
    .join("");
}

/* —— Palette dropdown —— */
function fillPaletteSelect() {
  const { dark, bright } = paletteGroups();
  el.palette.innerHTML = "";
  const gDark = document.createElement("optgroup");
  gDark.label = "Dark";
  for (const p of dark) {
    const o = document.createElement("option");
    o.value = p.id;
    o.textContent = p.label;
    gDark.appendChild(o);
  }
  const gBright = document.createElement("optgroup");
  gBright.label = "Bright";
  for (const p of bright) {
    const o = document.createElement("option");
    o.value = p.id;
    o.textContent = p.label;
    gBright.appendChild(o);
  }
  el.palette.appendChild(gDark);
  el.palette.appendChild(gBright);
}

function updateSwatches() {
  const pal = resolvePalette(state.settings);
  el.swatches.innerHTML = "";
  const bg = document.createElement("i");
  bg.style.background = pal.background;
  bg.title = "Background";
  el.swatches.appendChild(bg);
  for (let i = 0; i < state.settings.n; i++) {
    const chip = document.createElement("i");
    chip.style.background = pal.edges[i];
    chip.title = DIM_LABELS[i];
    el.swatches.appendChild(chip);
  }
}

/* —— Dimension sliders —— */
function edgeColor(i) {
  return resolvePalette(state.settings).edges[i] || "#888";
}

function ensureEdgeColors() {
  if (!state.settings.edgeColors) {
    state.settings.edgeColors = resolvePalette({
      ...state.settings,
      edgeColors: null,
    }).edges.concat(
      PALETTES[state.settings.palette].edges.slice(state.settings.n),
    );
    // pad to 7
    while (state.settings.edgeColors.length < 7) {
      state.settings.edgeColors.push("#888888");
    }
  }
}

function buildDimControls() {
  el.lengthSliders.innerHTML = "";
  el.angleSliders.innerHTML = "";
  const n = state.settings.n;

  for (let i = 0; i < n; i++) {
    const isNest = i === NEST_DIM;

    // Length / nest row
    const block = document.createElement("div");
    block.className = "slider-block dim-row";
    block.dataset.dim = String(i);

    const head = document.createElement("div");
    head.className = "slider-head";

    const vis = document.createElement("input");
    vis.type = "checkbox";
    vis.checked = state.settings.visible[i] !== false;
    vis.title = "Show dimension";
    vis.addEventListener("change", () => {
      state.settings.visible[i] = vis.checked;
      scheduleRedraw();
      scheduleHash();
    });

    const chip = document.createElement("span");
    chip.className = "chip";
    chip.style.background = edgeColor(i);

    const color = document.createElement("input");
    color.type = "color";
    color.value = toColorInput(edgeColor(i));
    color.title = "Override color";
    color.addEventListener("input", () => {
      ensureEdgeColors();
      state.settings.edgeColors[i] = color.value;
      chip.style.background = color.value;
      scheduleRedraw();
      scheduleHash();
      updateSwatches();
    });

    const label = document.createElement("label");
    label.textContent = isNest ? DIM_LABELS[i] : DIM_LABELS[i].replace(/ —.*$/, "");
    label.htmlFor = isNest ? "nest-scale" : `len-${i}`;

    const num = document.createElement("input");
    num.type = "number";
    num.className = "num";

    head.append(vis, chip, color, label, num);
    block.appendChild(head);

    if (isNest) {
      num.id = "nest-inline-num";
      num.min = "0.15";
      num.max = "0.85";
      num.step = "0.01";
      num.value = state.settings.nestScale.toFixed(2);
      num.setAttribute("aria-label", "Nest scale value");
      num.addEventListener("change", () => {
        const nestRange = document.getElementById("nest-scale");
        const nestNum = document.getElementById("nest-scale-num");
        let v = clamp(Number(num.value), 0.15, 0.85);
        v = Math.round(v * 100) / 100;
        state.settings.nestScale = v;
        num.value = v.toFixed(2);
        if (nestRange) nestRange.value = String(v);
        if (nestNum) nestNum.value = v.toFixed(2);
        scheduleRedraw();
        scheduleHash();
      });
      const note = document.createElement("div");
      note.style.cssText = "font-size:11px;color:var(--muted);margin-top:2px";
      note.textContent = "Same as Nest scale above";
      block.appendChild(note);
    } else {
      const min = i < 3 ? 10 : 40;
      const max = i < 3 ? 200 : 800;
      const range = document.createElement("input");
      range.type = "range";
      range.id = `len-${i}`;
      range.min = String(min);
      range.max = String(max);
      range.step = "1";
      range.value = String(state.settings.lengths[i]);
      num.id = `len-${i}-num`;
      num.min = String(min);
      num.max = String(max);
      num.step = "1";
      num.value = String(Math.round(state.settings.lengths[i]));
      num.setAttribute("aria-label", `${DIM_LABELS[i]} length`);
      const syncLen = (raw) => {
        const v = Math.round(clamp(Number(raw), min, max));
        state.settings.lengths[i] = v;
        range.value = String(v);
        num.value = String(v);
        scheduleRedraw();
        scheduleHash();
      };
      range.addEventListener("input", () => syncLen(range.value));
      num.addEventListener("change", () => syncLen(num.value));
      block.appendChild(range);
    }

    const bindHover = (node) => {
      node.addEventListener("pointerenter", () => {
        state.highlightDim = i;
        block.classList.add("highlight-active");
        scheduleRedraw();
      });
      node.addEventListener("pointerleave", () => {
        state.highlightDim = null;
        block.classList.remove("highlight-active");
        scheduleRedraw();
      });
    };
    bindHover(block);

    el.lengthSliders.appendChild(block);

    // Angle
    const ablock = document.createElement("div");
    ablock.className = "slider-block dim-row";
    ablock.dataset.dim = String(i);
    const ahead = document.createElement("div");
    ahead.className = "slider-head";
    const alabel = document.createElement("label");
    alabel.textContent = `Angle ${i + 1}°`;
    alabel.htmlFor = `ang-${i}`;
    const anum = document.createElement("input");
    anum.type = "number";
    anum.className = "num";
    anum.id = `ang-${i}-num`;
    anum.min = "0";
    anum.max = "179.5";
    anum.step = "0.5";
    anum.value = state.settings.angles[i].toFixed(1);
    anum.disabled = isNest;
    anum.setAttribute("aria-label", `Angle ${i + 1}`);
    ahead.append(alabel, anum);
    const arange = document.createElement("input");
    arange.type = "range";
    arange.id = `ang-${i}`;
    arange.min = "0";
    arange.max = "179.5";
    arange.step = "0.5";
    arange.value = String(state.settings.angles[i]);
    arange.disabled = isNest;
    const syncAng = (raw) => {
      const v = Math.round(clamp(Number(raw), 0, 179.5) * 2) / 2;
      state.settings.angles[i] = v;
      arange.value = String(v);
      anum.value = v.toFixed(1);
      scheduleRedraw();
      scheduleHash();
    };
    arange.addEventListener("input", () => syncAng(arange.value));
    anum.addEventListener("change", () => syncAng(anum.value));
    ablock.append(ahead, arange);
    bindHover(ablock);
    el.angleSliders.appendChild(ablock);
  }
}

function toColorInput(hex) {
  if (!hex || hex === "none") return "#888888";
  if (hex.length === 4 && hex[0] === "#") {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return hex.slice(0, 7);
}

function clamp(v, min, max) {
  if (Number.isNaN(v)) return min;
  return Math.min(max, Math.max(min, v));
}

function setPair(rangeId, numId, value, fmt) {
  const range = document.getElementById(rangeId);
  const num = document.getElementById(numId);
  const shown = fmt(value);
  if (range) range.value = String(value);
  if (num) num.value = shown;
}

/* —— Sync form from settings —— */
function syncFormFromSettings() {
  const s = state.settings;
  el.palette.value = s.palette;
  el.pngScale.value = String(s.pngScale);
  setPair("n", "n-num", s.n, (v) => String(v));
  setPair("nest-scale", "nest-scale-num", s.nestScale, (v) => v.toFixed(2));
  setPair("stretch-x", "stretch-x-num", s.stretchX, (v) => v.toFixed(2));
  document.getElementById("show-vertices").checked = s.showVertices;
  document.getElementById("show-labels").checked = !!s.showLabels;
  setPair("vertex-radius", "vertex-radius-num", s.vertexRadius, (v) => v.toFixed(1));
  setPair("stroke-width", "stroke-width-num", s.strokeWidth, (v) => v.toFixed(2));
  setPair("glow", "glow-num", s.glow, (v) => v.toFixed(1));
  const pngMobile = document.getElementById("png-scale-mobile");
  if (pngMobile) pngMobile.value = String(s.pngScale);
  el.brandN.textContent = `Q${subscript(s.n)}`;
  buildDimControls();
  updateSwatches();
  updateMathPanel();
}

function updateMathPanel() {
  const n = state.settings.n;
  const { vertices, edges, degree } = graphStats(n);
  const qn = document.getElementById("math-qn");
  if (qn) qn.innerHTML = `Q<sub>${n}</sub>`;
  const v = document.getElementById("stat-vertices");
  const e = document.getElementById("stat-edges");
  const d = document.getElementById("stat-degree");
  if (v) v.textContent = String(vertices);
  if (e) e.textContent = String(edges);
  if (d) d.textContent = String(degree);
}

/* —— Redraw —— */
function scheduleRedraw() {
  if (state.raf) return;
  state.raf = requestAnimationFrame(() => {
    state.raf = 0;
    redraw();
  });
}

function redraw() {
  const { svg, background } = buildHypercubeSvg(state.settings, {
    highlightDim: state.highlightDim,
  });
  el.stageInner.replaceChildren(svg);
  el.stageWrap.style.background = background;
  applyViewTransform();
  updateMathPanel();
}

function applyViewTransform() {
  const { scale, x, y } = state.view;
  el.stageInner.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function computeFit(svg) {
  if (!svg) return null;
  const wrap = el.stage.getBoundingClientRect();
  if (wrap.width < 2 || wrap.height < 2) return null;
  const vb = svg.viewBox.baseVal;
  const sw = vb.width || Number(svg.getAttribute("width"));
  const sh = vb.height || Number(svg.getAttribute("height"));
  const pad = 28;
  const scale = Math.max(
    0.05,
    Math.min((wrap.width - pad) / sw, (wrap.height - pad) / sh, 4),
  );
  return {
    scale,
    x: (wrap.width - sw * scale) / 2,
    y: (wrap.height - sh * scale) / 2,
  };
}

function fitView() {
  const fit = computeFit(el.stageInner.querySelector("svg"));
  if (!fit) return;
  state.view = fit;
  applyViewTransform();
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function cancelDimAnim() {
  if (state.dimAnim != null) {
    cancelAnimationFrame(state.dimAnim);
    state.dimAnim = null;
  }
  el.stageInner.classList.remove("dim-animating");
}

/**
 * Morph geometry when n changes: new axes grow from 0 (zoom out),
 * removed axes collapse to 0 (zoom in). View is re-fit/centered every frame.
 */
function animateDimensionChange(newN) {
  newN = Math.max(3, Math.min(7, newN | 0));
  const oldN = state.settings.n;
  if (newN === oldN) return;

  cancelDimAnim();
  el.stageInner.classList.add("dim-animating");

  const duration = 520 + Math.abs(newN - oldN) * 90;
  const targetLengths = state.settings.lengths.map(Number);
  const targetNest = state.settings.nestScale;
  const maxN = Math.max(oldN, newN);

  // Snapshot start geometry (render at maxN so edges can appear/disappear).
  const startLengths = targetLengths.map((len, i) => {
    if (newN > oldN && i >= oldN && i !== NEST_DIM) return 0;
    if (newN < oldN && i >= newN && i !== NEST_DIM) return len;
    return len;
  });
  const endLengths = targetLengths.map((len, i) => {
    if (newN < oldN && i >= newN && i !== NEST_DIM) return 0;
    if (newN > oldN && i >= oldN && i !== NEST_DIM) return len;
    return len;
  });

  let startNest = targetNest;
  let endNest = targetNest;
  if (oldN <= NEST_DIM && newN > NEST_DIM) {
    startNest = 1; // outer = inner, then nest opens
    endNest = targetNest;
  } else if (oldN > NEST_DIM && newN <= NEST_DIM) {
    startNest = targetNest;
    endNest = 1; // collapse nest before dropping the dimension
  }

  state.settings.n = maxN;
  state.settings.lengths = startLengths.slice();
  state.settings.nestScale = startNest;
  el.brandN.textContent = `Q${subscript(newN)}`;
  setPair("n", "n-num", newN, (v) => String(v));
  buildDimControls();
  updateSwatches();
  redraw();
  const startView = { ...state.view };

  const t0 = performance.now();
  const tick = (now) => {
    const u = Math.min(1, (now - t0) / duration);
    const e = easeInOutCubic(u);

    for (let i = 0; i < 7; i++) {
      state.settings.lengths[i] = lerp(startLengths[i], endLengths[i], e);
    }
    state.settings.nestScale = lerp(startNest, endNest, e);
    state.settings.n = maxN;

    // Soft line fade: new/dying dims get opacity via highlight-style on groups
    state.highlightDim = null;
    redraw();

    // Emphasize changing dimension groups with opacity based on progress
    const svg = el.stageInner.querySelector("svg");
    if (svg) {
      svg.querySelectorAll("g[data-dimension]").forEach((g) => {
        const dim = Number(g.getAttribute("data-dimension")); // 1-based
        const i = dim - 1;
        if (newN > oldN && i >= oldN && i < newN) {
          g.style.opacity = String(0.15 + 0.85 * e);
        } else if (newN < oldN && i >= newN && i < oldN) {
          g.style.opacity = String(1 - 0.85 * e);
        } else {
          g.style.opacity = "";
        }
      });
    }

    const fit = computeFit(svg);
    if (fit) {
      // Blend from previous framing into the new fit so zoom eases with the morph
      state.view = {
        scale: lerp(startView.scale, fit.scale, e),
        x: lerp(startView.x, fit.x, e),
        y: lerp(startView.y, fit.y, e),
      };
      // Prefer live fit late in the animation so content stays centered as size changes
      if (e > 0.35) {
        state.view = {
          scale: lerp(state.view.scale, fit.scale, (e - 0.35) / 0.65),
          x: lerp(state.view.x, fit.x, (e - 0.35) / 0.65),
          y: lerp(state.view.y, fit.y, (e - 0.35) / 0.65),
        };
      }
      applyViewTransform();
    }

    if (u < 1) {
      state.dimAnim = requestAnimationFrame(tick);
      return;
    }

    // Settle on final discrete dimension
    state.settings.n = newN;
    state.settings.lengths = targetLengths.slice();
    state.settings.nestScale = targetNest;
    setPair("nest-scale", "nest-scale-num", targetNest, (v) => v.toFixed(2));
    cancelDimAnim();
    buildDimControls();
    updateSwatches();
    redraw();
    fitView();
    scheduleHash();
  };

  state.dimAnim = requestAnimationFrame(tick);
}

function zoomAt(mx, my, nextScale) {
  const old = state.view.scale;
  const next = Math.min(8, Math.max(0.05, nextScale));
  if (old <= 0) return;
  state.view.x = mx - (mx - state.view.x) * (next / old);
  state.view.y = my - (my - state.view.y) * (next / old);
  state.view.scale = next;
  applyViewTransform();
}

function pointerDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function pointerMidpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/* —— Zoom / pan (mouse wheel, drag, pinch) —— */
function setupStageInteractions() {
  el.stage.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const rect = el.stage.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.08 : 1 / 1.08;
      zoomAt(mx, my, state.view.scale * factor);
    },
    { passive: false },
  );

  el.stage.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    state.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try {
      el.stage.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }

    if (state.pointers.size === 2) {
      const [a, b] = [...state.pointers.values()];
      const rect = el.stage.getBoundingClientRect();
      const mid = pointerMidpoint(a, b);
      state.pinch = {
        dist: pointerDistance(a, b),
        scale: state.view.scale,
        mx: mid.x - rect.left,
        my: mid.y - rect.top,
      };
      state.panning = false;
      state.panStart = null;
      el.stage.classList.remove("panning");
      return;
    }

    state.panning = true;
    state.panStart = {
      x: e.clientX,
      y: e.clientY,
      vx: state.view.x,
      vy: state.view.y,
    };
    el.stage.classList.add("panning");
  });

  el.stage.addEventListener("pointermove", (e) => {
    if (!state.pointers.has(e.pointerId)) return;
    state.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (state.pointers.size >= 2 && state.pinch) {
      const [a, b] = [...state.pointers.values()];
      const dist = pointerDistance(a, b);
      if (state.pinch.dist > 0) {
        const rect = el.stage.getBoundingClientRect();
        const mid = pointerMidpoint(a, b);
        zoomAt(
          mid.x - rect.left,
          mid.y - rect.top,
          state.pinch.scale * (dist / state.pinch.dist),
        );
      }
      return;
    }

    if (!state.panning || !state.panStart) return;
    state.view.x = state.panStart.vx + (e.clientX - state.panStart.x);
    state.view.y = state.panStart.vy + (e.clientY - state.panStart.y);
    applyViewTransform();
  });

  const endPointer = (e) => {
    state.pointers.delete(e.pointerId);
    if (state.pointers.size < 2) state.pinch = null;
    if (state.pointers.size === 0) {
      state.panning = false;
      state.panStart = null;
      el.stage.classList.remove("panning");
    } else if (state.pointers.size === 1) {
      const remaining = [...state.pointers.values()][0];
      state.panning = true;
      state.panStart = {
        x: remaining.x,
        y: remaining.y,
        vx: state.view.x,
        vy: state.view.y,
      };
    }
  };
  el.stage.addEventListener("pointerup", endPointer);
  el.stage.addEventListener("pointercancel", endPointer);
  el.stage.addEventListener("lostpointercapture", endPointer);

  document.getElementById("btn-fit").addEventListener("click", fitView);
  document.getElementById("btn-zoom-in").addEventListener("click", () => {
    const rect = el.stage.getBoundingClientRect();
    zoomAt(rect.width / 2, rect.height / 2, state.view.scale * 1.15);
  });
  document.getElementById("btn-zoom-out").addEventListener("click", () => {
    const rect = el.stage.getBoundingClientRect();
    zoomAt(rect.width / 2, rect.height / 2, state.view.scale / 1.15);
  });
}

function setControlsOpen(open) {
  document.body.classList.toggle("controls-open", open);
  const btn = document.getElementById("btn-controls");
  const backdrop = document.getElementById("sidebar-backdrop");
  if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
  if (backdrop) backdrop.hidden = !open;
}

function setupMobileChrome() {
  const openBtn = document.getElementById("btn-controls");
  const closeBtn = document.getElementById("btn-controls-close");
  const backdrop = document.getElementById("sidebar-backdrop");
  openBtn?.addEventListener("click", () => setControlsOpen(true));
  closeBtn?.addEventListener("click", () => setControlsOpen(false));
  backdrop?.addEventListener("click", () => setControlsOpen(false));

  const syncPng = (from, to) => {
    from?.addEventListener("change", () => {
      state.settings.pngScale = Number(from.value);
      if (to) to.value = from.value;
      scheduleHash();
    });
  };
  const pngDesktop = document.getElementById("png-scale");
  const pngMobile = document.getElementById("png-scale-mobile");
  syncPng(pngDesktop, pngMobile);
  syncPng(pngMobile, pngDesktop);

  document.getElementById("btn-screenshot-mobile")?.addEventListener("click", () => exportPng());
  document.getElementById("btn-export-mobile")?.addEventListener("click", () => {
    exportSvg();
    setControlsOpen(false);
  });
  document.getElementById("btn-copy-link-mobile")?.addEventListener("click", () => copyShareLink());
  document.getElementById("btn-reset-mobile")?.addEventListener("click", () => {
    document.getElementById("btn-reset")?.click();
    setControlsOpen(false);
  });

  window.matchMedia("(max-width: 860px)").addEventListener("change", (e) => {
    if (!e.matches) setControlsOpen(false);
    requestAnimationFrame(fitView);
  });
}

function setupResizeFit() {
  const onResize = () => {
    clearTimeout(state.resizeTimer);
    state.resizeTimer = setTimeout(() => fitView(), 120);
  };
  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", () => {
    setTimeout(fitView, 200);
  });
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", onResize);
  }
}

/* —— Controls —— */
function setupControls() {
  el.palette.addEventListener("change", () => {
    state.settings.palette = el.palette.value;
    state.settings.edgeColors = null; // reset overrides when switching palette
    updateSwatches();
    buildDimControls();
    scheduleRedraw();
    scheduleHash();
  });

  const bindRangeNumber = (rangeId, numId, key, { min, max, step, fmt }) => {
    const range = document.getElementById(rangeId);
    const num = document.getElementById(numId);
    const apply = (raw, fromNum) => {
      if (state.dimAnim != null) return;
      let v = clamp(Number(raw), min, max);
      if (step >= 1) v = Math.round(v / step) * step;
      else {
        const decimals = String(step).includes(".")
          ? String(step).split(".")[1].length
          : 0;
        v = Math.round(v / step) * step;
        v = Number(v.toFixed(decimals));
      }
      state.settings[key] = v;
      range.value = String(v);
      num.value = fmt(v);
      if (key === "nestScale") {
        const inline = document.getElementById("nest-inline-num");
        if (inline) inline.value = fmt(v);
      }
      scheduleRedraw();
      scheduleHash();
      if (fromNum) num.blur();
    };
    range.addEventListener("input", () => apply(range.value, false));
    num.addEventListener("change", () => apply(num.value, true));
    num.addEventListener("keydown", (e) => {
      if (e.key === "Enter") apply(num.value, true);
    });
  };

  const applyN = (raw) => {
    const newN = Math.round(clamp(Number(raw), 3, 7));
    setPair("n", "n-num", newN, (v) => String(v));
    animateDimensionChange(newN);
  };
  document.getElementById("n").addEventListener("input", (e) => applyN(e.target.value));
  document.getElementById("n-num").addEventListener("change", (e) => applyN(e.target.value));
  document.getElementById("n-num").addEventListener("keydown", (e) => {
    if (e.key === "Enter") applyN(e.target.value);
  });

  bindRangeNumber("nest-scale", "nest-scale-num", "nestScale", {
    min: 0.15, max: 0.85, step: 0.01, fmt: (v) => v.toFixed(2),
  });
  bindRangeNumber("stretch-x", "stretch-x-num", "stretchX", {
    min: 0.6, max: 2.5, step: 0.01, fmt: (v) => v.toFixed(2),
  });
  bindRangeNumber("vertex-radius", "vertex-radius-num", "vertexRadius", {
    min: 0, max: 6, step: 0.1, fmt: (v) => v.toFixed(1),
  });
  bindRangeNumber("stroke-width", "stroke-width-num", "strokeWidth", {
    min: 0.2, max: 4, step: 0.05, fmt: (v) => v.toFixed(2),
  });
  bindRangeNumber("glow", "glow-num", "glow", {
    min: 0, max: 8, step: 0.1, fmt: (v) => v.toFixed(1),
  });

  document.getElementById("show-vertices").addEventListener("change", (e) => {
    state.settings.showVertices = e.target.checked;
    scheduleRedraw();
    scheduleHash();
  });

  document.getElementById("show-labels").addEventListener("change", (e) => {
    state.settings.showLabels = e.target.checked;
    scheduleRedraw();
    scheduleHash();
  });

  document.getElementById("btn-reset").addEventListener("click", () => {
    cancelDimAnim();
    state.settings = defaultSettings();
    syncFormFromSettings();
    redraw();
    fitView();
    scheduleHash();
    toast("Reset to defaults");
  });

  document.getElementById("btn-preset-ref").addEventListener("click", () => {
    cancelDimAnim();
    state.settings = referencePreset();
    syncFormFromSettings();
    redraw();
    fitView();
    scheduleHash();
    toast("Loaded reference-like preset");
  });

  document.getElementById("btn-preset-save").addEventListener("click", savePreset);
  document.getElementById("btn-screenshot").addEventListener("click", () => exportPng());
  document.getElementById("btn-export").addEventListener("click", exportSvg);
  document.getElementById("btn-copy-link").addEventListener("click", copyShareLink);
}

/* —— Presets (localStorage) —— */
function loadPresetStore() {
  try {
    return JSON.parse(localStorage.getItem(PRESET_KEY) || "[]");
  } catch {
    return [];
  }
}

function writePresetStore(list) {
  localStorage.setItem(PRESET_KEY, JSON.stringify(list));
}

function renderPresetList() {
  const list = loadPresetStore();
  el.presetList.innerHTML = "";
  if (!list.length) {
    const empty = document.createElement("div");
    empty.style.cssText = "font-size:12px;color:var(--muted)";
    empty.textContent = "No saved presets yet.";
    el.presetList.appendChild(empty);
    return;
  }
  for (const item of list) {
    const row = document.createElement("div");
    row.className = "preset-item";
    const name = document.createElement("span");
    name.textContent = item.name;
    const loadBtn = document.createElement("button");
    loadBtn.type = "button";
    loadBtn.className = "btn";
    loadBtn.textContent = "Load";
    loadBtn.addEventListener("click", () => {
      state.settings = { ...defaultSettings(), ...item.settings };
      // ensure arrays
      state.settings.lengths = [...item.settings.lengths];
      state.settings.angles = [...item.settings.angles];
      state.settings.visible = [...item.settings.visible];
      state.settings.edgeColors = item.settings.edgeColors
        ? [...item.settings.edgeColors]
        : null;
      syncFormFromSettings();
      scheduleRedraw();
      scheduleHash();
      requestAnimationFrame(fitView);
      toast(`Loaded “${item.name}”`);
    });
    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "btn";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => {
      writePresetStore(list.filter((p) => p.name !== item.name));
      renderPresetList();
      toast("Preset deleted");
    });
    row.append(name, loadBtn, delBtn);
    el.presetList.appendChild(row);
  }
}

function savePreset() {
  const name = (el.presetName.value || "").trim();
  if (!name) {
    toast("Enter a preset name");
    return;
  }
  const list = loadPresetStore().filter((p) => p.name !== name);
  list.unshift({
    name,
    settings: structuredClone(state.settings),
    savedAt: Date.now(),
  });
  writePresetStore(list.slice(0, 30));
  el.presetName.value = "";
  renderPresetList();
  toast(`Saved “${name}”`);
}

/* —— URL hash —— */
function serializeSettings() {
  const s = state.settings;
  return {
    p: s.palette,
    n: s.n,
    ns: s.nestScale,
    sx: s.stretchX,
    sw: s.strokeWidth,
    vr: s.vertexRadius,
    sv: s.showVertices ? 1 : 0,
    sl: s.showLabels ? 1 : 0,
    g: s.glow,
    L: s.lengths,
    A: s.angles,
    V: s.visible.map((v) => (v ? 1 : 0)),
    C: s.edgeColors,
    ps: s.pngScale,
  };
}

function applySerialized(data) {
  const s = defaultSettings();
  if (data.p && PALETTES[data.p]) s.palette = data.p;
  if (data.n) s.n = Math.max(3, Math.min(7, Number(data.n)));
  if (data.ns != null) s.nestScale = Number(data.ns);
  if (data.sx != null) s.stretchX = Number(data.sx);
  if (data.sw != null) s.strokeWidth = Number(data.sw);
  if (data.vr != null) s.vertexRadius = Number(data.vr);
  if (data.sv != null) s.showVertices = Boolean(data.sv);
  if (data.sl != null) s.showLabels = Boolean(data.sl);
  if (data.g != null) s.glow = Number(data.g);
  if (Array.isArray(data.L) && data.L.length === 7) s.lengths = data.L.map(Number);
  if (Array.isArray(data.A) && data.A.length === 7) s.angles = data.A.map(Number);
  if (Array.isArray(data.V) && data.V.length === 7) s.visible = data.V.map(Boolean);
  if (Array.isArray(data.C) && data.C.length >= s.n) s.edgeColors = data.C;
  if (data.ps) s.pngScale = Number(data.ps);
  state.settings = s;
}

function scheduleHash() {
  clearTimeout(state.hashTimer);
  state.hashTimer = setTimeout(() => {
    const json = JSON.stringify(serializeSettings());
    const hash = btoa(unescape(encodeURIComponent(json)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    history.replaceState(null, "", `#${hash}`);
  }, 250);
}

function loadFromHash() {
  const raw = location.hash.replace(/^#/, "");
  if (!raw) return false;
  try {
    const b64 = raw.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64 + "===".slice((b64.length + 3) % 4);
    const json = decodeURIComponent(escape(atob(pad)));
    applySerialized(JSON.parse(json));
    return true;
  } catch {
    return false;
  }
}

async function copyShareLink() {
  scheduleHash();
  await new Promise((r) => setTimeout(r, 280));
  try {
    await navigator.clipboard.writeText(location.href);
    toast("Link copied");
  } catch {
    toast("Copy failed — URL is in the address bar");
  }
}

/* —— Export —— */
function downloadBlob(blob, filename) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function exportSvg() {
  const { svg } = buildHypercubeSvg(state.settings, { highlightDim: null });
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    new XMLSerializer().serializeToString(svg);
  const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
  const name = `hypercube-q${state.settings.n}-${state.settings.palette}.svg`;
  downloadBlob(blob, name);
  toast("SVG exported");
}

function exportPng() {
  const scale = state.settings.pngScale || 2;
  const { svg, width, height } = buildHypercubeSvg(state.settings, {
    highlightDim: null,
  });
  const xml = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(width * scale);
    canvas.height = Math.ceil(height * scale);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    canvas.toBlob(
      (png) => {
        if (!png) {
          toast("PNG export failed");
          return;
        }
        downloadBlob(
          png,
          `hypercube-q${state.settings.n}-${state.settings.palette}-${scale}x.png`,
        );
        toast(`PNG exported (${scale}×)`);
      },
      "image/png",
    );
  };
  img.onerror = () => {
    URL.revokeObjectURL(url);
    toast("PNG export failed");
  };
  img.src = url;
}

/* —— Keyboard —— */
function setupKeyboard() {
  document.addEventListener("keydown", (e) => {
    const tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
    if (e.key === "r" || e.key === "R") {
      document.getElementById("btn-reset").click();
    } else if (e.key === "s" || e.key === "S") {
      e.preventDefault();
      exportPng();
    } else if (e.key === "e" || e.key === "E") {
      e.preventDefault();
      exportSvg();
    } else if (e.key === "f" || e.key === "F") {
      fitView();
    }
  });
}

/* —— Init —— */
function init() {
  fillPaletteSelect();
  const fromHash = loadFromHash();
  if (!fromHash) state.settings = defaultSettings();
  syncFormFromSettings();
  setupControls();
  setupMobileChrome();
  setupStageInteractions();
  setupResizeFit();
  setupKeyboard();
  renderPresetList();
  redraw();
  requestAnimationFrame(() => {
    fitView();
    scheduleHash();
  });
}

init();
