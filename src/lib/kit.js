// Higher-level building pieces built on lib/geometry.js: plinths, columns, walls with
// openings, doors and complete hipped or gable roofs. All of them add to Part objects.
import * as THREE from 'three';
import { V, box, beam, frame, lathe, slab, tierFaces, rafters, battens, gablePanel, partStore } from './geometry.js';

// Copies every geometry from a temporary part store into P, shifted by (dx, dy, dz).
// `rename` maps a temporary part id to the target part id.
export function mergeStore(P, parts, { dx = 0, dy = 0, dz = 0, rename = (id) => id } = {}) {
  for (const [id, part] of Object.entries(parts)) {
    for (const [slot, list] of Object.entries(part.parts)) {
      for (const g of list) P(rename(id)).add(slot, g.translate(dx, dy, dz));
    }
  }
}

// Raised stone plinth with a tiled or plain floor on top (top surface at y = h).
export function plinth(part, { w, d, h, x = 0, z = 0, floor = 'floor', stone = 'stone' }) {
  part.add(stone, box(w, h - 0.1, d, x, (h - 0.1) / 2, z, 'stone', 1.5))
    .add(stone, box(w + 0.35, 0.14, d + 0.35, x, 0.07, z, 'stone', 1.5))
    .add(floor, box(w - 0.2, 0.1, d - 0.2, x, h - 0.05, z, floor === 'floor' ? 'world' : 'wood', 1));
}

// A flight of `n` steps descending from height h, starting at edge z and running along dir (±1).
export function steps(part, { x = 0, z, w, h, n = 2, run = 0.42, dir = 1, slot = 'stone' }) {
  for (let k = 0; k < n; k++) {
    const hk = (h * (n - k)) / (n + 1);
    part.add(slot, box(w, hk, run, x, hk / 2, z + dir * (run * k + run / 2), 'stone', 1.5));
  }
}

// A truncated-pyramid stone base (umpak) whose top is at floor + h.
export function umpak(part, x, z, floor, h, rt = 0.26, rb = 0.36) {
  const g = new THREE.CylinderGeometry(rt, rb, h - 0.08, 4, 1);
  g.rotateY(Math.PI / 4);
  g.translate(x, floor + 0.08 + (h - 0.08) / 2, z);
  part.add('stone', g);
  const side = rb * Math.SQRT2 + 0.06;
  part.add('stone', box(side, 0.08, side, x, floor + 0.04, z, 'stone', 1));
}

// Square timber columns at the given [x, z] positions, from y0 to y1.
export function columns(part, pos, y0, y1, size = 0.2, slot = 'wood') {
  for (const [x, z] of pos) part.add(slot, box(size, y1 - y0, size, x, (y0 + y1) / 2, z));
}

export const grid = (xs, zs) => xs.flatMap((x) => zs.map((z) => [x, z]));
export const span = (a, b, step) => {
  const n = Math.max(1, Math.round((b - a) / step));
  return Array.from({ length: n + 1 }, (_, i) => +(a + ((b - a) * i) / n).toFixed(3));
};

// A straight wall along x (at z = at) or along z (at x = at), from `from` to `to`,
// leaving gaps for openings: [{ c: centre, w: width, h: height, sill: 0 }].
export function wallRun(part, slot, { axis, at, from, to, y0, h, t = 0.12, openings = [], mode = 'wood' }) {
  const put = (a0, a1, yb, yt) => {
    if (a1 - a0 < 0.01 || yt - yb < 0.01) return;
    const len = a1 - a0, mid = (a0 + a1) / 2, hy = yt - yb, cy = (yb + yt) / 2;
    part.add(slot, axis === 'x' ? box(len, hy, t, mid, cy, at, mode, 1.2) : box(t, hy, len, at, cy, mid, mode, 1.2));
  };
  let cur = from;
  for (const op of [...openings].sort((a, b) => a.c - b.c)) {
    const a0 = op.c - op.w / 2, a1 = op.c + op.w / 2, sill = op.sill || 0;
    put(cur, a0, y0, y0 + h);
    put(a0, a1, y0, y0 + sill);
    put(a0, a1, y0 + sill + op.h, y0 + h);
    cur = a1;
  }
  put(cur, to, y0, y0 + h);
}

// Door or window in a wall that runs along x at z = at, facing +z.
// Leaves swing inward (towards −z) by `open` radians; frame goes in `frameSlot`.
export function opening(part, { at, c, w, h, y0, leaves = 2, open = 0, t = 0.12, leafSlot = 'wood', frameSlot = 'wood' }) {
  const f = 0.08;
  part.add(frameSlot, box(w + 2 * f, f, t + 0.04, c, y0 + h + f / 2, at));
  for (const s of [-1, 1]) part.add(frameSlot, box(f, h, t + 0.04, c + s * (w / 2 + f / 2), y0 + h / 2, at));
  const lw = w / leaves;
  for (let k = 0; k < leaves; k++) {
    const dir = leaves === 1 ? 1 : k === 0 ? 1 : -1;
    const hinge = leaves === 1 ? c - w / 2 : k === 0 ? c - w / 2 : c + w / 2;
    const g = new THREE.BoxGeometry(lw - 0.02, h - 0.02, 0.05);
    g.translate((dir * lw) / 2, h / 2, 0);
    g.rotateY(open * dir);
    g.translate(hinge, y0, at);
    part.add(leafSlot, g);
  }
}

// Hipped roof with one or more tiers (joglo, limasan…): tiled slabs, planks, rafters,
// battens, hip rafters and ridge/hip caps. Returns { rafters, battens } counts.
export function hipRoof(P, tiers, { roof, frame: frameId = roof, caps = roof, t = 0.1, withBattens = true }) {
  let nR = 0, nB = 0;
  const corners = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  tiers.forEach((tier, i) => {
    const roofId = Array.isArray(roof) ? roof[i] : roof;
    for (const q of tierFaces(tier)) {
      const s = slab(q, t);
      P(roofId).add('roof', s.top).add('plank', s.under);
      nR += rafters(P(frameId), q, t);
      if (withBattens) nB += battens(P(frameId), q, t);
    }
    for (const [sx, sz] of corners) {
      const a = V(sx * tier.AX, tier.y0, sz * tier.AZ), b = V(sx * tier.ix, tier.y1, sz * tier.iz);
      P(frameId).add('wood', beam(a.clone().add(V(0, -(t + 0.12), 0)), b.clone().add(V(0, -(t + 0.12), 0)), 0.14, 0.2));
      P(caps).add('ornament', beam(a.clone().add(V(0, 0.05, 0)), b.clone().add(V(0, 0.05, 0)), 0.2, 0.1, 0.05));
    }
  });
  const top = tiers[0];
  if (top.iz === 0 && top.ix > 0) {
    P(frameId).add('wood', box(2 * top.ix + 0.4, 0.24, 0.18, 0, top.y1 - t - 0.14, 0));
    P(caps).add('ornament', box(2 * top.ix + 0.3, 0.14, 0.24, 0, top.y1 + 0.05, 0, 'stone', 1));
  }
  return { rafters: nR, battens: nB };
}

// Gable (kampung) roof with the ridge along x: two sloped slabs, rafters, battens,
// ridge beam and cap, plus optional gable-end panels (tebeng) closing the ends.
export function gableRoof(P, { AX, AZ, y0, y1, t = 0.1, roof, frame: frameId = roof, gable = null, gableSlot = 'plank', gableBase = y0, gableAt = AX - 0.35 }) {
  const V3 = (x, y, z) => V(x, y, z);
  const faces = [
    [V3(-AX, y0, AZ), V3(AX, y0, AZ), V3(AX, y1, 0), V3(-AX, y1, 0)],
    [V3(AX, y0, -AZ), V3(-AX, y0, -AZ), V3(-AX, y1, 0), V3(AX, y1, 0)],
  ];
  let nR = 0;
  for (const q of faces) {
    const s = slab(q, t);
    P(roof).add('roof', s.top).add('plank', s.under);
    nR += rafters(P(frameId), q, t);
    battens(P(frameId), q, t);
  }
  P(frameId).add('wood', box(2 * AX, 0.22, 0.16, 0, y1 - t - 0.14, 0));
  P(roof).add('ornament', box(2 * AX + 0.1, 0.14, 0.24, 0, y1 + 0.05, 0, 'stone', 1));
  if (gable) {
    // Height of the roof underside above the gable line at distance z from the ridge.
    const under = (z) => y1 - t - 0.2 - ((y1 - y0) * Math.abs(z)) / AZ;
    const half = (AZ * (y1 - t - 0.2 - gableBase)) / (y1 - y0);
    for (const x of [-gableAt, gableAt]) {
      P(gable).add(gableSlot, gablePanel([[-half, gableBase], [half, gableBase], [0, under(0)]], 0.08, 'x', x));
    }
  }
  return { rafters: nR };
}

// Turned figure / pot, re-exported for building files.
export { lathe, beam, box, frame, V };
