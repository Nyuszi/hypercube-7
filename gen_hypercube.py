#!/usr/bin/env python3
"""Generate a scalable SVG drawing of the hypercube graph Q_n (default n=7).

Vertices are the 2^n binary strings; edges join strings that differ in exactly
one bit. The first three dimensions form a cuboid. The fourth uses a Schlegel
(nested) projection: the copy with that bit set is a smaller cuboid sitting
inside the outer one, with connecting edges between corresponding corners —
the classic "cuboid in cuboid" tesseract look. Dimensions 5–7 then place
parallel copies of that nested 4-cube, matching the shelf layout of the
reference drawing.
"""

import argparse
import math

# (direction in degrees clockwise from +x, length).
# Dims 0–2: the base cuboid (similar lengths → readable 3D box).
# Dim 3: unused for position (nesting uses scale); kept for CLI/scale hooks.
# Dims 4–6: long parallel offsets for the higher-dimensional shelves.
BASIS_POLAR = [
    (8.0, 72.0),
    (98.0, 52.0),
    (148.0, 58.0),
    (0.0, 1.0),
    (6.0, 300.0),
    (78.0, 230.0),
    (108.0, 470.0),
]

NEST_DIM = 3
NEST_SCALE = 0.42

PALETTES = {
    "reference": {
        "background": "#ffffff",
        "edges": [
            "#2b2b2b", "#2b2b2b", "#2b2b2b",
            "#8d24b8", "#1a7f27", "#1c3fc4", "#cf2233",
        ],
        "vertex": "#f2ddd6",
        "vertex_stroke": "#4a3330",
    },
    "neon": {
        "background": "#05060a",
        "edges": [
            "#00e5ff", "#3df5c4", "#7cff5c",
            "#ffe14d", "#ff8a3d", "#ff3d84", "#b56cff",
        ],
        "vertex": "#ffffff",
        "vertex_stroke": "none",
    },
    "tokyo": {
        "background": "#11121a",
        "edges": [
            "#7dcfff", "#7aa2f7", "#bb9af7",
            "#73daca", "#9ece6a", "#e0af68", "#f7768e",
        ],
        "vertex": "#c0caf5",
        "vertex_stroke": "none",
    },
    "dracula": {
        "background": "#12141c",
        "edges": [
            "#8be9fd", "#50fa7b", "#f1fa8c",
            "#ffb86c", "#ff79c6", "#bd93f9", "#ff5555",
        ],
        "vertex": "#f8f8f2",
        "vertex_stroke": "none",
    },
    "nord": {
        "background": "#161a22",
        "edges": [
            "#8fbcbb", "#88c0d0", "#81a1c1",
            "#a3be8c", "#ebcb8b", "#d08770", "#bf616a",
        ],
        "vertex": "#eceff4",
        "vertex_stroke": "none",
    },
    "aurora": {
        "background": "#04090f",
        "edges": [
            "#9bffe4", "#3fe0b0", "#1fb6c9",
            "#3f7fe0", "#7a5cf0", "#c15ce0", "#ff8ecb",
        ],
        "vertex": "#e8fff8",
        "vertex_stroke": "none",
    },
    "ember": {
        "background": "#0b0705",
        "edges": [
            "#fff1b8", "#ffd166", "#ffa53d",
            "#ff7a2f", "#ff4f45", "#e02f6b", "#a3308f",
        ],
        "vertex": "#fff4dd",
        "vertex_stroke": "none",
    },
    "ice": {
        "background": "#060a12",
        "edges": [
            "#eaf7ff", "#a8e4ff", "#6cc6ff",
            "#4a9eff", "#6f7dff", "#9a6cff", "#cf6cff",
        ],
        "vertex": "#ffffff",
        "vertex_stroke": "none",
    },
    "gold": {
        "background": "#0a0806",
        "edges": [
            "#fffbe8", "#f7e6b0", "#e9cd83",
            "#d9ae55", "#c28e35", "#a06d22", "#7a4f16",
        ],
        "vertex": "#fff6d8",
        "vertex_stroke": "none",
    },
    "spectrum": {
        "background": "#000000",
        "edges": [
            "#ff2d55", "#ff9500", "#ffe000",
            "#3ddc63", "#00d4d8", "#2f7bff", "#a45cff",
        ],
        "vertex": "#ffffff",
        "vertex_stroke": "none",
    },
}

MARGIN = 26.0


def basis_vectors(polar, scale=1.0, stretch_x=1.0):
    return [
        (
            math.cos(math.radians(deg)) * length * scale * stretch_x,
            math.sin(math.radians(deg)) * length * scale,
        )
        for deg, length in polar
    ]


def projected_positions(basis, nest_dim=NEST_DIM, nest_scale=NEST_SCALE):
    """Project Q_n with a nested (Schlegel) 4th dimension."""
    n = len(basis)
    cube_dims = min(3, n)
    center = [0.0, 0.0]
    for i in range(cube_dims):
        center[0] += basis[i][0] * 0.5
        center[1] += basis[i][1] * 0.5

    positions = []
    for v in range(1 << n):
        x = y = 0.0
        for i in range(cube_dims):
            if v >> i & 1:
                x += basis[i][0]
                y += basis[i][1]

        if n > nest_dim and (v >> nest_dim & 1):
            x = center[0] + nest_scale * (x - center[0])
            y = center[1] + nest_scale * (y - center[1])

        for i in range(n):
            if i < cube_dims or i == nest_dim:
                continue
            if v >> i & 1:
                x += basis[i][0]
                y += basis[i][1]

        positions.append((x, y))
    return positions


def edges_by_dimension(n):
    """Edges of Q_n grouped by the bit position they flip."""
    return [
        [(v, v ^ (1 << i)) for v in range(1 << n) if not v >> i & 1]
        for i in range(n)
    ]


def mean_edge_length(pos, edges):
    if not edges:
        return 0.0
    total = 0.0
    for a, b in edges:
        dx = pos[a][0] - pos[b][0]
        dy = pos[a][1] - pos[b][1]
        total += math.hypot(dx, dy)
    return total / len(edges)


def build_svg(basis, palette, stroke_width, vertex_radius, margin, glow,
              nest_scale):
    pos = projected_positions(basis, nest_scale=nest_scale)
    xs = [p[0] for p in pos]
    ys = [p[1] for p in pos]
    dx = margin - min(xs)
    dy = margin - min(ys)
    width = max(xs) - min(xs) + 2 * margin
    height = max(ys) - min(ys) + 2 * margin
    pos = [(x + dx, y + dy) for x, y in pos]

    n = len(basis)
    groups = edges_by_dimension(n)
    # Longest edges first so the small nested cuboids stay readable on top.
    order = sorted(
        range(n),
        key=lambda i: -mean_edge_length(pos, groups[i]),
    )

    out = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width:.1f}" '
        f'height="{height:.1f}" viewBox="0 0 {width:.1f} {height:.1f}">',
        f'  <title>Hypercube graph Q{n}</title>',
    ]
    if glow:
        out += [
            '  <defs>',
            '    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">',
            f'      <feGaussianBlur stdDeviation="{glow:.2f}" result="b"/>',
            '      <feMerge>',
            '        <feMergeNode in="b"/>',
            '        <feMergeNode in="SourceGraphic"/>',
            '      </feMerge>',
            '    </filter>',
            '  </defs>',
        ]
    out.append(
        f'  <rect width="{width:.1f}" height="{height:.1f}" '
        f'fill="{palette["background"]}"/>'
    )
    filt = ' filter="url(#glow)"' if glow else ""
    out.append(
        f'  <g{filt} stroke-width="{stroke_width}" stroke-linecap="round" fill="none">'
    )

    for i in order:
        out.append(f'    <g stroke="{palette["edges"][i]}" data-dimension="{i + 1}">')
        for a, b in groups[i]:
            x1, y1 = pos[a]
            x2, y2 = pos[b]
            out.append(
                f'      <line x1="{x1:.2f}" y1="{y1:.2f}" '
                f'x2="{x2:.2f}" y2="{y2:.2f}"/>'
            )
        out.append('    </g>')

    out.append('  </g>')
    if vertex_radius > 0:
        stroke = palette.get("vertex_stroke", "none")
        stroke_attr = (
            "" if stroke == "none"
            else f' stroke="{stroke}" stroke-width="{stroke_width * 0.8:.2f}"'
        )
        out.append(f'  <g fill="{palette["vertex"]}"{stroke_attr}>')
        for x, y in pos:
            out.append(
                f'    <circle cx="{x:.2f}" cy="{y:.2f}" r="{vertex_radius:.2f}"/>'
            )
        out.append('  </g>')
    out.append('</svg>')
    return "\n".join(out) + "\n"


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("-o", "--output", default="hypercube-7.svg")
    p.add_argument("-n", "--dimensions", type=int, default=7)
    p.add_argument("-p", "--palette", default="neon", choices=sorted(PALETTES))
    p.add_argument("--stroke-width", type=float, default=0.9)
    p.add_argument("--vertex-radius", type=float, default=1.6)
    p.add_argument("--glow", type=float, default=0.0,
                   help="blur radius for a neon bloom; 0 disables")
    p.add_argument("--scale", type=float, default=1.0)
    p.add_argument("--stretch-x", type=float, default=1.0,
                   help="multiply all x offsets (>1 widens the figure)")
    p.add_argument("--nest-scale", type=float, default=NEST_SCALE,
                   help="inner cuboid size relative to outer (4th dimension)")
    args = p.parse_args()

    n = args.dimensions
    if not 1 <= n <= len(BASIS_POLAR):
        p.error(f"--dimensions must be between 1 and {len(BASIS_POLAR)}")

    basis = basis_vectors(BASIS_POLAR[:n], args.scale, args.stretch_x)
    palette = dict(PALETTES[args.palette])
    palette["edges"] = palette["edges"][:n]
    svg = build_svg(
        basis,
        palette,
        args.stroke_width * args.scale,
        args.vertex_radius * args.scale,
        MARGIN * args.scale,
        args.glow * args.scale,
        args.nest_scale,
    )
    with open(args.output, "w") as f:
        f.write(svg)

    print(f"{args.output}: Q{n}, {1 << n} vertices, {n * (1 << (n - 1))} edges, "
          f"palette={args.palette}, nest_scale={args.nest_scale}")


if __name__ == "__main__":
    main()
