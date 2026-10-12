// Pieces shared by the betang and its kitchen: ironwood posts, bark walls clamped with
// rattan, board floors and the notched-log stair.
import * as THREE from 'three';
import { V, box, beam } from '../../lib/geometry.js';
import { wallRun } from '../../lib/kit.js';

export const F = 2.3;            // floor above the ground
export const WALL = 2.65;        // height of the bark walls; the rest is left open for air
export const SLOPE = 0.34;       // roof rise per metre of run

// A many-sided ironwood post from y0 to y1.
export const post = (r, y0, y1, x, z, seg = 8) => new THREE.CylinderGeometry(r, r, y1 - y0, seg).translate(x, (y0 + y1) / 2, z);

// A floor of boards laid across z, each `w` wide, covering x0…x1.
export function boards(part, slot, x0, x1, z0, z1, y, w = 0.28, t = 0.035) {
  const n = Math.max(1, Math.round((x1 - x0) / w)), step = (x1 - x0) / n;
  for (let k = 0; k < n; k++) part.add(slot, box(step - 0.008, t, z1 - z0, x0 + (k + 0.5) * step, y - t / 2, (z0 + z1) / 2));
  return n;
}

// An outside wall of bark sheets: the bark itself, three split-rattan clamps along it and
// the studs (guntung) that carry the wall plate above the open strip.
export function barkWall(part, { axis, at, from, to, out, openings = [], top, y0 = F }) {
  wallRun(part, 'bark', { axis, at, from, to, y0, h: WALL, t: 0.03, openings, mode: 'world' });
  const run = (a0, a1, y, w, h, off, slot) => {
    if (a1 - a0 < 0.05) return;
    const mid = (a0 + a1) / 2, len = a1 - a0, p = at + out * off;
    part.add(slot, axis === 'x' ? box(len, h, w, mid, y, p) : box(w, h, len, p, y, mid));
  };
  for (const y of [0.35, 1.3, 2.3]) {
    let cur = from;
    for (const op of [...openings].sort((a, b) => a.c - b.c)) {
      const sill = op.sill || 0, hit = y > sill - 0.05 && y < sill + op.h + 0.05;
      if (!hit) continue;
      run(cur, op.c - op.w / 2, y0 + y, 0.02, 0.05, 0.025, 'rattan');
      cur = op.c + op.w / 2;
    }
    run(cur, to, y0 + y, 0.02, 0.05, 0.025, 'rattan');
  }
  const n = Math.max(1, Math.round((to - from) / 2));
  for (let k = 0; k <= n; k++) {
    const a = from + ((to - from) * k) / n;
    if (openings.some((op) => Math.abs(a - op.c) < op.w / 2 + 0.06)) continue;
    const p = at - out * 0.06;
    part.add('wood', axis === 'x' ? box(0.08, top - y0, 0.1, a, (y0 + top) / 2, p) : box(0.1, top - y0, 0.08, p, (y0 + top) / 2, a));
  }
  run(from, to, top + 0.06, 0.12, 0.12, -0.06, 'wood');
  for (const op of openings) {
    const sill = op.sill || 0, f = 0.07;
    const bar = (len, h, c, y) => part.add('wood', axis === 'x' ? box(len, h, 0.12, c, y, at) : box(0.12, h, len, at, y, c));
    bar(op.w + 2 * f, f, op.c, y0 + sill + op.h + f / 2);
    if (sill) bar(op.w + 2 * f, f, op.c, y0 + sill - f / 2);
    for (const s of [-1, 1]) bar(f, op.h, op.c + s * (op.w / 2 + f / 2), y0 + sill + op.h / 2);
  }
}

// A round log with steps notched into it, from the ground at `a` up to `b`.
export function notchedLog(part, a, b, n = 8) {
  part.add('wood', beam(a, b, 0.3, 0.3, 0.15));
  const flat = V(b.x - a.x, 0, b.z - a.z).normalize();
  for (let k = 1; k <= n; k++) {
    const p = a.clone().lerp(b, (k - 0.3) / (n + 0.4));
    const g = box(0.34, 0.05, 0.2, 0, 0, 0);
    g.rotateY(Math.atan2(flat.x, flat.z)).translate(p.x, p.y + 0.17, p.z);
    part.add('wood', g);
  }
}

// A cooking place: a timber box filled with earth, three stones and a pot.
export function hearthBox(part, x, z, y) {
  part.add('wood', box(1.1, 0.14, 1.1, x, y + 0.07, z));
  part.add('earth', box(0.96, 0.06, 0.96, x, y + 0.16, z, 'world', 1));
  for (let k = 0; k < 3; k++) {
    const a = (k / 3) * Math.PI * 2 + 0.5;
    part.add('stone', new THREE.DodecahedronGeometry(0.1, 0).scale(1, 1.3, 1).translate(x + Math.cos(a) * 0.2, y + 0.3, z + Math.sin(a) * 0.2));
  }
  const pot = [[0, 0], [0.15, 0], [0.22, 0.09], [0.23, 0.2], [0.17, 0.28], [0.19, 0.31], [0, 0.31]];
  part.add('earth', new THREE.LatheGeometry(pot.map(([r, h]) => new THREE.Vector2(r, h)), 14).translate(x, y + 0.4, z));
}
