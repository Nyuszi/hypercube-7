#!/usr/bin/env python3
"""Recover the 7 projection vectors of a Q7 drawing from a raster image.

Vertices in the source image are drawn as pale pink discs. After locating
their centres, the drawing's basis can be read off directly: in a parallel
projection of the 7-cube, each dimension's offset occurs exactly 2^6 = 64
times among the pairwise differences of vertex positions, far more often than
any other difference. So the 7 most common difference vectors are the basis.
"""

import sys
from collections import Counter, deque

import numpy as np
from PIL import Image


def box_count(mask, radius):
    """For each pixel, how many True pixels lie in the surrounding box."""
    padded = np.zeros(
        (mask.shape[0] + 1, mask.shape[1] + 1), dtype=np.int32
    )
    padded[1:, 1:] = mask.astype(np.int32)
    integral = padded.cumsum(0).cumsum(1)
    h, w = mask.shape
    ys = np.arange(h)
    xs = np.arange(w)
    y0 = np.clip(ys - radius, 0, h)[:, None]
    y1 = np.clip(ys + radius + 1, 0, h)[:, None]
    x0 = np.clip(xs - radius, 0, w)[None, :]
    x1 = np.clip(xs + radius + 1, 0, w)[None, :]
    return (
        integral[y1, x1] - integral[y0, x1] - integral[y1, x0] + integral[y0, x0]
    )


def vertex_centres(path, radius=3, min_density=44, min_area=12):
    img = np.asarray(Image.open(path).convert("RGB")).astype(int)
    ink = img.min(axis=2) < 235
    # Edges are hairlines; only the filled vertex discs are locally solid.
    mask = ink & (box_count(ink, radius) >= min_density)

    h, w = mask.shape
    seen = np.zeros_like(mask)
    centres = []
    for y0 in range(h):
        for x0 in range(w):
            if not mask[y0, x0] or seen[y0, x0]:
                continue
            queue = deque([(y0, x0)])
            seen[y0, x0] = True
            blob = []
            while queue:
                y, x = queue.popleft()
                blob.append((y, x))
                for dy in (-1, 0, 1):
                    for dx in (-1, 0, 1):
                        ny, nx = y + dy, x + dx
                        if 0 <= ny < h and 0 <= nx < w:
                            if mask[ny, nx] and not seen[ny, nx]:
                                seen[ny, nx] = True
                                queue.append((ny, nx))
            if len(blob) >= min_area:
                ys = [p[0] for p in blob]
                xs = [p[1] for p in blob]
                centres.append((sum(xs) / len(xs), sum(ys) / len(ys)))
    return centres


def common_differences(points, tol=2.5, top=12):
    """Cluster pairwise differences and return the most frequent ones."""
    buckets = Counter()
    reps = {}
    for i in range(len(points)):
        xi, yi = points[i]
        for j in range(i + 1, len(points)):
            dx = points[j][0] - xi
            dy = points[j][1] - yi
            if dy < 0 or (abs(dy) < 1e-9 and dx < 0):
                dx, dy = -dx, -dy
            key = (round(dx / tol), round(dy / tol))
            buckets[key] += 1
            reps.setdefault(key, []).append((dx, dy))
    out = []
    for key, count in buckets.most_common(top):
        vs = reps[key]
        out.append(
            (
                sum(v[0] for v in vs) / len(vs),
                sum(v[1] for v in vs) / len(vs),
                count,
            )
        )
    return out


def main():
    path = sys.argv[1]
    pts = vertex_centres(path)
    print(f"detected {len(pts)} vertex blobs")
    for dx, dy, count in common_differences(pts):
        length = (dx * dx + dy * dy) ** 0.5
        print(f"  ({dx:8.2f}, {dy:8.2f})  len={length:7.2f}  occurrences={count}")


if __name__ == "__main__":
    main()
