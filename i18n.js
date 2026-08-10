/** English / Hungarian UI strings. Preference: system | en | hu */

export const LOCALE_PREF_KEY = "hypercube-locale";

export const LOCALE_OPTIONS = [
  { id: "system", labelKey: "lang.system" },
  { id: "en", labelKey: "lang.en" },
  { id: "hu", labelKey: "lang.hu" },
];

const STRINGS = {
  en: {
    "lang.system": "System",
    "lang.en": "English",
    "lang.hu": "Hungarian",
    "lang.label": "Language",
    "title": "Hypercube Q₇ — Interactive Viewer",
    "brand": "Hypercube",
    "view": "View",
    "view.aria": "Projection view",
    "view.nested": "Nested",
    "view.szalkai": "Szalkai",
    "view.petrie": "Petrie",
    "style": "Style",
    "style.aria": "Color style",
    "palette.dark": "Dark",
    "palette.bright": "Bright",
    "png": "PNG",
    "png.aria": "Screenshot scale",
    "btn.screenshot": "Screenshot",
    "btn.screenshot.title": "Screenshot (S)",
    "btn.export": "Export SVG",
    "btn.export.title": "Export SVG (E)",
    "btn.copyLink": "Copy link",
    "btn.copyLink.title": "Copy shareable link",
    "btn.reset": "Reset",
    "btn.reset.title": "Reset (R)",
    "btn.controls": "Controls",
    "btn.controlsDone": "Done",
    "btn.controlsClose": "Close controls",
    "btn.fit": "Fit",
    "btn.zoomIn": "Zoom in",
    "btn.zoomOut": "Zoom out",
    "hint.desktop": "Scroll to zoom · drag to pan",
    "hint.mobile": "Pinch to zoom · drag to pan",
    "section.math": "Math",
    "section.structure": "Structure",
    "section.lengths": "Line lengths",
    "section.style": "Style",
    "section.presets": "Presets",
    "math.def":
      "The <strong>hypercube graph</strong> <span class=\"math-sym\" id=\"math-qn\">Q<sub>7</sub></span> " +
      "has vertex set <span class=\"math-sym\">{0,1}<sup>n</sup></span> " +
      "(binary strings of length <span class=\"math-sym\">n</span>). " +
      "Two vertices are adjacent if and only if they differ in exactly one bit " +
      "(Hamming distance&nbsp;1). " +
      "<span class=\"math-sym\">Q<sub>0</sub></span> is a single vertex.",
    "math.vertices": "Vertices",
    "math.edges": "Edges",
    "math.degree": "Degree",
    "math.note1": "Equal-color edges flip the same bit — one dimension.",
    "math.note2": "The graph is bipartite (partition by parity of the number of 1-bits).",
    "math.note3": "Hamilton paths correspond to Gray codes on <span class=\"math-sym\">n</span> bits.",
    "math.proj.nested":
      "This drawing is a <strong>2D projection</strong> of <span class=\"math-sym\">Q<sub>n</sub></span> " +
      "(nested / Schlegel for the 4th dimension), not a literal view of <span class=\"math-sym\">n</span>-space.",
    "math.proj.szalkai":
      "This drawing is <strong>Szalkai’s presentation</strong> of <span class=\"math-sym\">Q<sub>n</sub></span>, " +
      "not a literal view of <span class=\"math-sym\">n</span>-space.",
    "math.proj.petrie":
      "This drawing is a <strong>Petrie projection</strong> of <span class=\"math-sym\">Q<sub>n</sub></span> " +
      "(Coxeter plane; outer Petrie polygon is a regular <span class=\"math-sym\">2n</span>-gon), not a literal view of <span class=\"math-sym\">n</span>-space.",
    "math.labels": "Binary labels on vertices",
    "math.hint":
      "Hover a vertex for its binary address even when labels are off. Bits read left→right as dim&nbsp;<span class=\"math-sym\">n</span> … dim&nbsp;1 (rightmost bit flips with dim&nbsp;1 edges).",
    "struct.dimensions": "Dimensions",
    "struct.dimensionsValue": "Dimensions value",
    "struct.stretch": "Horizontal stretch",
    "struct.stretchValue": "Horizontal stretch value",
    "lengths.advanced": "Advanced angles",
    "style.showVertices": "Show vertices",
    "style.vertexRadius": "Vertex radius",
    "style.vertexRadiusValue": "Vertex radius value",
    "style.stroke": "Stroke width",
    "style.strokeValue": "Stroke width value",
    "style.glow": "Glow",
    "style.glowValue": "Glow value",
    "preset.reference": "Reference",
    "preset.name": "Preset name",
    "preset.save": "Save",
    "preset.load": "Load",
    "preset.delete": "Delete",
    "preset.empty": "No saved presets yet.",
    "toast.reset": "Reset to defaults",
    "toast.reference": "Loaded reference preset",
    "toast.presetName": "Enter a preset name",
    "toast.saved": "Saved “{name}”",
    "toast.loaded": "Loaded “{name}”",
    "toast.deleted": "Preset deleted",
    "toast.linkCopied": "Link copied",
    "toast.linkFailed": "Copy failed — URL is in the address bar",
    "toast.svg": "SVG exported",
    "toast.png": "PNG exported ({scale}×)",
    "toast.pngFail": "PNG export failed",
    "dim.short": "Dim {n}",
    "dim.nestScale": "Nest scale value",
    "dim.nestScaleAria": "Nest scale (dim {n})",
    "dim.lengthAria": "{label} length",
    "dim.angle": "Angle {n}°",
    "dim.angleAria": "Angle {n}",
    "dim.show": "Show dimension",
    "dim.color": "Override color",
    "dim.nested.1": "Dim 1 — cuboid width",
    "dim.nested.2": "Dim 2 — cuboid height",
    "dim.nested.3": "Dim 3 — cuboid depth",
    "dim.nested.4": "Dim 4 — nest (inner cuboid)",
    "dim.nested.5": "Dim 5 — shelf offset",
    "dim.nested.6": "Dim 6 — layer offset",
    "dim.nested.7": "Dim 7 — long bridge",
    "dim.szalkai.1": "Dim 1 — right",
    "dim.szalkai.2": "Dim 2 — up",
    "dim.szalkai.3": "Dim 3 — nest (inner square)",
    "dim.szalkai.4": "Dim 4 — H₃ offset",
    "dim.szalkai.5": "Dim 5 — shelf offset",
    "dim.szalkai.6": "Dim 6 — layer offset",
    "dim.szalkai.7": "Dim 7 — long bridge",
    "proj.nested.short": "Nested / Schlegel",
    "proj.szalkai.short": "Szalkai Hₙ construction",
    "proj.petrie.short": "Petrie projection",
  },
  hu: {
    "lang.system": "Rendszer",
    "lang.en": "Angol",
    "lang.hu": "Magyar",
    "lang.label": "Nyelv",
    "title": "Hiperkocka Q₇ — Interaktív nézegető",
    "brand": "Hiperkocka",
    "view": "Nézet",
    "view.aria": "Vetítési nézet",
    "view.nested": "Beágyazott",
    "view.szalkai": "Szalkai",
    "view.petrie": "Petrie",
    "style": "Stílus",
    "style.aria": "Színpaletta",
    "palette.dark": "Sötét",
    "palette.bright": "Világos",
    "png": "PNG",
    "png.aria": "Képernyőkép méretarány",
    "btn.screenshot": "Képernyőkép",
    "btn.screenshot.title": "Képernyőkép (S)",
    "btn.export": "SVG export",
    "btn.export.title": "SVG export (E)",
    "btn.copyLink": "Link másolása",
    "btn.copyLink.title": "Megosztható link másolása",
    "btn.reset": "Alaphelyzet",
    "btn.reset.title": "Alaphelyzet (R)",
    "btn.controls": "Vezérlők",
    "btn.controlsDone": "Kész",
    "btn.controlsClose": "Vezérlők bezárása",
    "btn.fit": "Illesztés",
    "btn.zoomIn": "Nagyítás",
    "btn.zoomOut": "Kicsinyítés",
    "hint.desktop": "Görgetés: nagyítás · húzás: pan",
    "hint.mobile": "Csippentés: nagyítás · húzás: pan",
    "section.math": "Matematika",
    "section.structure": "Szerkezet",
    "section.lengths": "Élhosszak",
    "section.style": "Stílus",
    "section.presets": "Előbeállítások",
    "math.def":
      "A <strong>hiperkockagráf</strong> <span class=\"math-sym\" id=\"math-qn\">Q<sub>7</sub></span> " +
      "a hiperkocka csúcsaiból és éleiből álló gráf. " +
      "Minden csúcsához egy <span class=\"math-sym\">n</span> hosszú, 0 és 1 számjegyekből álló " +
      "sorozatot (standard címkét) írunk; két csúcs pontosan akkor van éllel összekötve, " +
      "ha standard címkéjük pontosan egy helyi értékben különbözik. " +
      "A <span class=\"math-sym\">Q<sub>0</sub></span> egyetlen csúcs, él nélkül.",
    "math.vertices": "Csúcsok",
    "math.edges": "Élek",
    "math.degree": "Fokszám",
    "math.note1": "Az azonos színű élek ugyanazt a helyi értéket billentik — egy dimenzió.",
    "math.note2": "A gráf páros (kétpólusú): a páros, illetve a páratlan sok 1-est tartalmazó címkéjű csúcsok alkotják a két pólust.",
    "math.note3": "A Hamilton-körök Gray-kódot adnak: a körön a szomszédos csúcsok címkéi egy helyi értékben térnek el.",
    "math.proj.nested":
      "Ez a rajz a <span class=\"math-sym\">Q<sub>n</sub></span> <strong>2D vetülete</strong> " +
      "(beágyazott / Schlegel a 4. dimenzióra), nem az <span class=\"math-sym\">n</span>-tér szó szerinti képe.",
    "math.proj.szalkai":
      "Ez a rajz <span class=\"math-sym\">Q<sub>n</sub></span> <strong>Szalkai-féle ábrázolása</strong>, " +
      "nem az <span class=\"math-sym\">n</span>-tér szó szerinti képe.",
    "math.proj.petrie":
      "Ez a rajz a <span class=\"math-sym\">Q<sub>n</sub></span> <strong>Petrie-vetülete</strong> " +
      "(Coxeter-sík; a külső Petrie-sokszög szabályos <span class=\"math-sym\">2n</span>-szög), nem az <span class=\"math-sym\">n</span>-tér szó szerinti képe.",
    "math.labels": "Bináris címkék a csúcsokon",
    "math.hint":
      "Vidd az egeret a csúcs fölé a bináris címkéhez, akkor is, ha a címkék ki vannak kapcsolva. A bitek balról jobbra: dim&nbsp;<span class=\"math-sym\">n</span> … dim&nbsp;1 (a jobb szélső bit a dim&nbsp;1 élekhez tartozik).",
    "struct.dimensions": "Dimenziók",
    "struct.dimensionsValue": "Dimenziók értéke",
    "struct.stretch": "Vízszintes nyújtás",
    "struct.stretchValue": "Vízszintes nyújtás értéke",
    "lengths.advanced": "Haladó szögek",
    "style.showVertices": "Csúcsok mutatása",
    "style.vertexRadius": "Csúcssugár",
    "style.vertexRadiusValue": "Csúcssugár értéke",
    "style.stroke": "Vonalvastagság",
    "style.strokeValue": "Vonalvastagság értéke",
    "style.glow": "Fény",
    "style.glowValue": "Fény értéke",
    "preset.reference": "Referencia",
    "preset.name": "Előbeállítás neve",
    "preset.save": "Mentés",
    "preset.load": "Betöltés",
    "preset.delete": "Törlés",
    "preset.empty": "Még nincs mentett előbeállítás.",
    "toast.reset": "Visszaállítva az alapértékekre",
    "toast.reference": "Referencia előbeállítás betöltve",
    "toast.presetName": "Adj meg egy nevet",
    "toast.saved": "Mentve: „{name}”",
    "toast.loaded": "Betöltve: „{name}”",
    "toast.deleted": "Előbeállítás törölve",
    "toast.linkCopied": "Link másolva",
    "toast.linkFailed": "Másolás sikertelen — az URL a címsávban van",
    "toast.svg": "SVG exportálva",
    "toast.png": "PNG exportálva ({scale}×)",
    "toast.pngFail": "PNG export sikertelen",
    "dim.short": "Dim {n}",
    "dim.nestScale": "Beágyazási arány",
    "dim.nestScaleAria": "Beágyazási arány (dim {n})",
    "dim.lengthAria": "{label} hossza",
    "dim.angle": "Szög {n}°",
    "dim.angleAria": "Szög {n}",
    "dim.show": "Dimenzió mutatása",
    "dim.color": "Szín felülírása",
    "dim.nested.1": "Dim 1 — szélesség",
    "dim.nested.2": "Dim 2 — magasság",
    "dim.nested.3": "Dim 3 — mélység",
    "dim.nested.4": "Dim 4 — beágyazás (belső kocka)",
    "dim.nested.5": "Dim 5 — polceltolás",
    "dim.nested.6": "Dim 6 — rétegeltolás",
    "dim.nested.7": "Dim 7 — hosszú híd",
    "dim.szalkai.1": "Dim 1 — jobbra",
    "dim.szalkai.2": "Dim 2 — fel",
    "dim.szalkai.3": "Dim 3 — beágyazás (belső négyzet)",
    "dim.szalkai.4": "Dim 4 — H₃ eltolás",
    "dim.szalkai.5": "Dim 5 — polceltolás",
    "dim.szalkai.6": "Dim 6 — rétegeltolás",
    "dim.szalkai.7": "Dim 7 — hosszú híd",
    "proj.nested.short": "Beágyazott / Schlegel",
    "proj.szalkai.short": "Szalkai Hₙ szerkesztés",
    "proj.petrie.short": "Petrie-vetület",
  },
};

let pref = "system";
let resolved = "en";

export function systemLocale() {
  const lang = String(
    (typeof navigator !== "undefined" && (navigator.language || navigator.userLanguage)) ||
      "en",
  ).toLowerCase();
  return lang.startsWith("hu") ? "hu" : "en";
}

export function getLocalePref() {
  return pref;
}

export function getLocale() {
  return resolved;
}

export function resolveLocale(preference = pref) {
  if (preference === "hu" || preference === "en") return preference;
  return systemLocale();
}

export function setLocalePref(preference) {
  pref = preference === "hu" || preference === "en" || preference === "system"
    ? preference
    : "system";
  resolved = resolveLocale(pref);
  try {
    localStorage.setItem(LOCALE_PREF_KEY, pref);
  } catch {
    /* ignore */
  }
  if (typeof document !== "undefined") {
    document.documentElement.lang = resolved;
  }
  return resolved;
}

export function loadLocalePref() {
  let stored = "system";
  try {
    stored = localStorage.getItem(LOCALE_PREF_KEY) || "system";
  } catch {
    stored = "system";
  }
  return setLocalePref(stored);
}

/** Translate key; `{name}` style placeholders from vars. */
export function t(key, vars = {}) {
  const table = STRINGS[resolved] || STRINGS.en;
  let s = table[key] ?? STRINGS.en[key] ?? key;
  for (const [k, v] of Object.entries(vars)) {
    s = s.replaceAll(`{${k}}`, String(v));
  }
  return s;
}

/** Apply data-i18n / data-i18n-html / data-i18n-attr-* on the document. */
export function applyI18n(root = document) {
  const scope = root.body || root;
  scope.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    if (key) node.textContent = t(key);
  });
  scope.querySelectorAll("[data-i18n-html]").forEach((node) => {
    const key = node.getAttribute("data-i18n-html");
    if (key) node.innerHTML = t(key);
  });
  scope.querySelectorAll("*").forEach((node) => {
    const attrs = [...node.attributes];
    for (const attr of attrs) {
      if (!attr.name.startsWith("data-i18n-attr-")) continue;
      const target = attr.name.slice("data-i18n-attr-".length);
      if (target) node.setAttribute(target, t(attr.value));
    }
  });
  if (typeof document !== "undefined") {
    document.title = t("title");
  }
}
