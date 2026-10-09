// Kudus joinery details shared by the omah and the pawon: the gebyok panel pattern,
// konsol brackets and kere screens. Walls run along x; `dir` (±1) is the face being dressed.
import { box, beam, V } from '../../lib/geometry.js';

// The standard Kudus gebyok pattern on one face of a wall unit: two rows of rectangular
// panels between three horizontal bands. The upper row and the middle band are carved;
// with `rich`, the lower row is carved too and the middle band is gilded.
export function gebyokFace(part, { from, to, at, y0, y1, dir = 1, cols = 5, rich = false, plain = false }) {
  const w = to - from, h = y1 - y0;
  const band = Math.min(0.26, h * 0.09), stile = 0.07, d = 0.025;
  const z = at + dir * (0.05 + d / 2);
  const yMid = y0 + h * 0.52;
  const bands = [y0 + band / 2, yMid, y1 - band / 2];
  bands.forEach((y, i) => {
    const slot = plain ? 'wood' : i === 1 ? (rich ? 'accent' : 'carved') : i === 2 ? 'carved' : 'wood';
    part.add(slot, box(w, band, d + 0.01, (from + to) / 2, y, z + dir * 0.005));
  });
  const rows = [[y0 + band, yMid - band / 2], [yMid + band / 2, y1 - band]];
  const pw = (w - (cols + 1) * stile) / cols;
  for (let k = 0; k <= cols; k++) {
    const x = from + stile / 2 + k * (pw + stile);
    part.add('wood', box(stile, h - 2 * band, d, x, (y0 + y1) / 2, z));
  }
  rows.forEach(([a, b], r) => {
    const slot = plain ? 'wood' : r === 1 || rich ? 'carved' : 'wood';
    for (let k = 0; k < cols; k++) {
      const x = from + stile + pw / 2 + k * (pw + stile);
      part.add(slot, box(pw - 0.08, b - a - 0.08, d * 0.6, x, (a + b) / 2, z - dir * d * 0.2));
    }
  });
}

// A konsol bracket on a column face at (x, z): a horizontal arm reaching `reach` along z
// (sign gives the direction) at height y, propped by a diagonal strut.
export function konsol(part, x, z, y, reach, { w = 0.12, h = 0.16, slot = 'carved' } = {}) {
  const s = Math.sign(reach), r = Math.abs(reach);
  part.add(slot, box(w, h, r + 0.08, x, y, z + s * (r / 2 + 0.02)));
  part.add(slot, beam(V(x, y - 0.65, z + s * 0.08), V(x, y - h / 2, z + s * r * 0.72), w * 0.85, 0.11));
  part.add(slot, box(w + 0.02, 0.2, 0.12, x, y - 0.12, z + s * (r - 0.02)));
}

// A kere: a lattice screen about 1.5 m high hung in front of an opening, with carved bands
// at the top, middle and bottom and thin vertical bars between them.
export function kere(part, { c, w, at, top, h = 1.5, dir = 1 }) {
  const z = at + dir * 0.1, bh = 0.12;
  for (const y of [top - bh / 2, top - h * 0.45, top - h + bh / 2]) part.add('carved', box(w, bh, 0.04, c, y, z));
  for (const s of [-1, 1]) part.add('wood', box(0.05, h, 0.05, c + s * (w / 2 - 0.025), top - h / 2, z));
  const n = Math.round(w / 0.09);
  for (let k = 1; k < n; k++) part.add('wood', box(0.018, h - 0.1, 0.018, c - w / 2 + (k * w) / n, top - h / 2, z));
  part.add('wood', box(w + 0.3, 0.05, 0.05, c, top + 0.05, z));
}
