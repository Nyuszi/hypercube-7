#!/usr/bin/env python3
"""Measure the projection vectors of the reference Q7 drawing.

Each dimension of the source image is drawn in its own colour, so the mask for
a colour contains only lines parallel to that dimension's offset vector. For
each colour we find the directions along which the mask is most self-aligned,
then measure how long an uninterrupted run of that colour is along the
direction, which gives the length of a single edge.
"""

import sys

import numpy as np
from PIL import Image


def colour_masks(path):
    a = np.asarray(Image.open(path).convert("RGB")).astype(int)
    r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
    mx, mn = a.max(axis=2), a.min(axis=2)
    ink = mn < 200
    sat = mx - mn
    return {
        "green": ink & (g >= r + 20) & (g >= b + 20),
        "blue": ink & (b >= g + 30) & (b >= r + 45),
        "red": ink & (r >= g + 50) & (r >= b + 40) & (b <= g + 30),
        "purple": ink & (r >= g + 25) & (b >= g + 40) & (b >= r - 40),
        "black": ink & (sat < 35),
    }


def direction_peaks(mask, n_peaks=3, step=0.5):
    angles = np.arange(0.0, 180.0, step)
    scores = []
    for deg in angles:
        t = np.deg2rad(deg)
        s = 0
        for d in (8, 14, 20):
            sx, sy = int(round(np.cos(t) * d)), int(round(np.sin(t) * d))
            s += (mask & np.roll(np.roll(mask, sy, 0), sx, 1)).sum()
        scores.append(s)
    scores = np.array(scores, dtype=float)

    peaks = []
    taken = np.zeros(len(scores), dtype=bool)
    for _ in range(n_peaks):
        masked = np.where(taken, -1, scores)
        i = int(masked.argmax())
        if masked[i] <= 0:
            break
        peaks.append((float(angles[i]), float(scores[i])))
        # suppress a +/-8 degree window (wrapping) around the peak
        for j in range(len(scores)):
            d = min(abs(j - i), len(scores) - abs(j - i))
            if d * step <= 8:
                taken[j] = True
    return peaks


def run_lengths(mask, deg, max_len=700):
    """Histogram of uninterrupted run lengths of the mask along a direction."""
    t = np.deg2rad(deg)
    dx, dy = np.cos(t), np.sin(t)
    h, w = mask.shape
    ys, xs = np.nonzero(mask)
    if len(ys) == 0:
        return []
    idx = np.random.default_rng(0).choice(len(ys), size=min(4000, len(ys)), replace=False)
    lengths = []
    for k in idx:
        y0, x0 = ys[k], xs[k]
        # only start a run where the previous pixel is empty
        py, px = int(round(y0 - dy)), int(round(x0 - dx))
        if 0 <= py < h and 0 <= px < w and mask[py, px]:
            continue
        n = 0
        while n < max_len:
            y, x = int(round(y0 + dy * (n + 1))), int(round(x0 + dx * (n + 1)))
            if not (0 <= y < h and 0 <= x < w) or not mask[y, x]:
                break
            n += 1
        if n >= 4:
            lengths.append(n)
    return lengths


def main():
    path = sys.argv[1]
    masks = colour_masks(path)
    for name, m in masks.items():
        n_peaks = 3 if name == "black" else 2
        print(f"\n{name}: {m.sum()} px")
        for deg, score in direction_peaks(m, n_peaks):
            ls = run_lengths(m, deg)
            if not ls:
                print(f"  {deg:6.1f} deg  score={score:>8.0f}  (no runs)")
                continue
            ls = np.array(ls)
            hi = np.percentile(ls, [50, 75, 90, 97])
            t = np.deg2rad(deg)
            print(
                f"  {deg:6.1f} deg  score={score:>8.0f}  runs n={len(ls)} "
                f"median={hi[0]:.0f} p75={hi[1]:.0f} p90={hi[2]:.0f} p97={hi[3]:.0f}"
            )
            for L in (hi[2], hi[3]):
                print(
                    f"        length {L:6.1f} -> vector "
                    f"({np.cos(t) * L:7.1f}, {np.sin(t) * L:7.1f})"
                )


if __name__ == "__main__":
    main()
