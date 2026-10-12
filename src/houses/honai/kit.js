// Pieces shared by the silimo's buildings: walls and fences of split planks set in the
// ground, thatched roofs, lashings, and small round helpers.
import * as THREE from 'three';
import { V, rand, box, beam, slab, tierFaces, rafters, battens } from '../../lib/geometry.js';

export const T = 0.22;                 // thatch thickness

export const cyl = (r, h, x, y0, z, seg = 10) => new THREE.CylinderGeometry(r * 0.9, r, h, seg).translate(x, y0 + h / 2, z);

// A flat round layer (floor grass, ash…) with its texture at world scale.
export function disc(r, y0, t, x = 0, z = 0) {
  const g = new THREE.CylinderGeometry(r, r, t, 40);
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 2 * r, uv.getY(i) * 2 * r);
  return g.translate(x, y0 + t / 2, z);
}

// A row of split planks standing in the ground from a to b ([x, z] pairs), each a little
// different in height. `gaps` are [from, to] distances along the row left open; `rail` adds
// a lashed pole at that height. Returns the number of planks.
export function plankLine(part, slot, a, b, h, { y0 = 0, step = 0.17, t = 0.045, jitter = 0.05, gaps = [], rail = null, railSlot = slot } = {}) {
  const dx = b[0] - a[0], dz = b[1] - a[1], len = Math.hypot(dx, dz);
  const ang = Math.atan2(-dz, dx), n = Math.max(1, Math.round(len / step)), w = len / n;
  const at = (s) => [a[0] + (dx * s) / len, a[1] + (dz * s) / len];
  const open = (s) => gaps.some(([g0, g1]) => s > g0 && s < g1);
  let count = 0;
  for (let k = 0; k < n; k++) {
    const s = (k + 0.5) * w;
    if (open(s)) continue;
    const hk = h + (rand() - 0.5) * 2 * jitter, [x, z] = at(s);
    part.add(slot, box(w - 0.015, hk, t, 0, y0 + hk / 2, 0).rotateY(ang).translate(x, 0, z));
    count++;
  }
  if (rail != null) {
    let cur = 0;
    for (const [g0, g1] of [...gaps].sort((p, q) => p[0] - q[0]).concat([[len, len]])) {
      if (g0 - cur > 0.3) {
        const [x0, z0] = at(cur), [x1, z1] = at(g0);
        part.add(railSlot, beam(V(x0, y0 + rail, z0), V(x1, y0 + rail, z1), 0.05, 0.05));
      }
      cur = g1;
    }
  }
  return count;
}

// A lashing run round a circle of radius r at height y, open over `gap` radians centred on +z.
export function tieRing(r, y, gap = 0, tube = 0.018) {
  const g = new THREE.TorusGeometry(r, tube, 5, 72, 2 * Math.PI - gap);
  return g.rotateX(-Math.PI / 2).rotateY(gap / 2 - Math.PI / 2).translate(0, y, 0);
}

// One hipped thatch tier: grass on top, cane lath beneath, pole rafters, thatched hips.
export function thatchTier(P, tier, roofId, frameId) {
  let n = 0;
  for (const q of tierFaces(tier)) {
    const s = slab(q, T);
    P(roofId).add('thatch', s.top).add('cane', s.under);
    n += rafters(P(frameId), q, T, 'wood');
    battens(P(frameId), q, T, 'cane');
  }
  for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
    const a = V(sx * tier.AX, tier.y0 + 0.05, sz * tier.AZ), b = V(sx * tier.ix, tier.y1 + 0.05, sz * tier.iz);
    P(roofId).add('thatch', beam(a, b, 0.3, 0.14, 0.04));
  }
  P(roofId).add('thatch', box(2 * tier.ix + 0.4, 0.2, 0.36, 0, tier.y1 + 0.04, 0));
  return n;
}

// A cooking fire on the earth floor: a pad of earth and ash, three stones and a few logs.
export function hearth(part, x, z, s = 1) {
  part.add('yard', box(0.7 * s, 0.05, 0.7 * s, x, 0.065, z, 'world', 1));
  part.add('ash', disc(0.2 * s, 0.09, 0.02, x, z));
  for (let k = 0; k < 3; k++) {
    const a = (k / 3) * Math.PI * 2 + 0.4;
    part.add('stone', new THREE.DodecahedronGeometry(0.075 * s, 0).translate(x + Math.cos(a) * 0.24 * s, 0.13, z + Math.sin(a) * 0.24 * s));
  }
  for (let k = 0; k < 3; k++) {
    const a = (k / 3) * Math.PI * 2 + 1.4;
    const p = V(x + Math.cos(a) * 0.05, 0.14, z + Math.sin(a) * 0.05), q = V(x + Math.cos(a) * 0.42 * s, 0.12, z + Math.sin(a) * 0.42 * s);
    part.add('wood', beam(p, q, 0.05, 0.05));
  }
}
