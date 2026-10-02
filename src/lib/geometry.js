// Shared procedural building blocks for house models.
// Units are metres, y is up. Every helper returns BufferGeometry with position, normal and uv.
import * as THREE from 'three';

export const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

// Seeded random so each build is deterministic (texture offsets etc.).
let seed = 1;
export const reseed = (s) => { seed = s; };
export const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

// ── Parts ────────────────────────────────────────────────────────────
// A Part collects geometry per material slot; the viewer merges each slot into one mesh.
export class Part {
  constructor() { this.parts = {}; }
  add(slot, g) {
    if (g.index) g = g.toNonIndexed();
    (this.parts[slot] ||= []).push(g);
    return this;
  }
}
export function partStore() {
  const parts = {};
  return { parts, P: (id) => (parts[id] ||= new Part()) };
}

// ── Boxes and beams ──────────────────────────────────────────────────
// World-scaled UVs for boxes. 'wood' runs the grain along the longest axis.
function boxUV(g, dims, mode, scale) {
  const p = g.attributes.position, n = g.attributes.normal, uv = g.attributes.uv;
  const L = dims.indexOf(Math.max(...dims));
  const ou = rand() * 7, ov = rand() * 7;
  const c = [0, 0, 0], a = [0, 0, 0];
  for (let i = 0; i < p.count; i++) {
    c[0] = p.getX(i); c[1] = p.getY(i); c[2] = p.getZ(i);
    a[0] = Math.abs(n.getX(i)); a[1] = Math.abs(n.getY(i)); a[2] = Math.abs(n.getZ(i));
    const na = a[0] > a[1] ? (a[0] > a[2] ? 0 : 2) : (a[1] > a[2] ? 1 : 2);
    const o0 = (na + 1) % 3, o1 = (na + 2) % 3;
    if (mode === 'wood') {
      let u, v;
      if (L !== na) { v = c[L]; u = c[L === o0 ? o1 : o0]; } else { u = c[o0]; v = c[o1]; }
      uv.setXY(i, u / 0.7 + ou, v / 3 + ov);
    } else {
      const off = mode === 'stone' ? ou : 0;
      uv.setXY(i, c[o0] / scale + off, c[o1] / scale + off);
    }
  }
}

export function box(w, h, d, x, y, z, mode = 'wood', scale = 1) {
  const g = new THREE.BoxGeometry(w, h, d);
  boxUV(g, [w, h, d], mode, scale);
  g.translate(x, y, z);
  return g;
}

const _o = new THREE.Object3D();
// A box of section w × h running from a to b (extended by ext at both ends).
export function beam(a, b, w, h, ext = 0) {
  const len = a.distanceTo(b) + 2 * ext;
  const g = new THREE.BoxGeometry(w, h, len);
  boxUV(g, [w, h, len], 'wood');
  const dir = V().subVectors(b, a).normalize();
  _o.position.addVectors(a, b).multiplyScalar(0.5);
  _o.up.set(0, 1, 0);
  if (Math.abs(dir.y) > 0.99) _o.up.set(1, 0, 0);
  _o.lookAt(b);
  _o.updateMatrix();
  g.applyMatrix4(_o.matrix);
  return g;
}

// A polyline of beams through the given points.
export function beamPath(points, w, h) {
  const out = [];
  for (let i = 0; i < points.length - 1; i++) out.push(beam(points[i], points[i + 1], w, h, i ? 0 : 0.02));
  return out;
}

// Four beams forming a rectangular frame centred on the y axis.
export function frame(part, slot, hx, hz, y, w, h, over = 0) {
  part.add(slot, box(2 * hx + w + 2 * over, h, w, 0, y, hz));
  part.add(slot, box(2 * hx + w + 2 * over, h, w, 0, y, -hz));
  part.add(slot, box(w, h, 2 * hz + w + 2 * over, hx, y, 0));
  part.add(slot, box(w, h, 2 * hz + w + 2 * over, -hx, y, 0));
}

// Grid positions on the perimeter of a rectangle (|x| = X or |z| = Z).
export function ring(xs, zs, X, Z) {
  const out = [];
  for (const x of xs) for (const z of zs) if (Math.abs(x) === X || Math.abs(z) === Z) out.push([x, z]);
  return out;
}

// A lathe (vase-like turned shape) standing at `at`, optionally pointing along `dir`.
export function lathe(profile, at, dir = null, segments = 16) {
  const g = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), segments);
  if (dir) g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), dir.clone().normalize()));
  g.translate(at.x, at.y, at.z);
  return g;
}

// ── Triangle builder ─────────────────────────────────────────────────
// Builds non-indexed triangles, orienting each so its normal faces away from `center`.
// Points may carry a `uv` property ([u, v]); otherwise uvf(p) is used.
export class TriBuilder {
  constructor() { this.p = []; this.uv = []; }
  tri(a, b, c, center, uvf) {
    const n = V().subVectors(b, a).cross(V().subVectors(c, a));
    if (n.lengthSq() < 1e-12) return;
    const fc = V().add(a).add(b).add(c).multiplyScalar(1 / 3).sub(center);
    if (n.dot(fc) < 0) [b, c] = [c, b];
    this.raw(a, b, c, uvf);
  }
  // Adds a triangle with the winding exactly as given.
  raw(a, b, c, uvf) {
    for (const p of [a, b, c]) {
      this.p.push(p.x, p.y, p.z);
      const w = p.uv || (uvf ? uvf(p) : [0, 0]);
      this.uv.push(w[0], w[1]);
    }
  }
  quad(a, b, c, d, center, uvf) { this.tri(a, b, c, center, uvf); this.tri(a, c, d, center, uvf); }
  get empty() { return this.p.length === 0; }
  geom() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    g.computeVertexNormals();
    return g;
  }
}

// A closed six-sided solid from a bottom quad and a top quad (each listed in the same order).
export function hexa(bottom, top, uvf = null) {
  const pts = [...bottom, ...top];
  const center = pts.reduce((s, p) => s.add(p), V()).multiplyScalar(1 / 8);
  const t = new TriBuilder();
  const [a, b, c, d] = bottom, [e, f, g, h] = top;
  t.quad(a, b, c, d, center, uvf);
  t.quad(e, f, g, h, center, uvf);
  t.quad(a, b, f, e, center, uvf);
  t.quad(b, c, g, f, center, uvf);
  t.quad(c, d, h, g, center, uvf);
  t.quad(d, a, e, h, center, uvf);
  return t.geom();
}

// ── Straight hipped roofs (joglo, limasan…) ──────────────────────────
// A closed roof slab from one face quad [E0, E1, T1, T0]; tiles on top, planks underneath.
export function slab(q, t) {
  const down = V(0, -t, 0);
  const b = q.map((p) => p.clone().add(down));
  const center = V();
  [...q, ...b].forEach((p) => center.add(p));
  center.multiplyScalar(1 / 8);
  const eaveDir = q[1].clone().sub(q[0]).normalize();
  const uvOf = (p) => {
    const d = p.clone().sub(q[0]);
    const u = d.dot(eaveDir);
    const perp = d.sub(eaveDir.clone().multiplyScalar(u));
    return [u, perp.length() / 1.2];
  };
  const none = () => [0.02, 0.02];
  const top = new TriBuilder(), under = new TriBuilder();
  top.quad(q[0], q[1], q[2], q[3], center, uvOf);
  under.quad(b[0], b[1], b[2], b[3], center, (p) => { const w = uvOf(p); return [w[0] / 0.7, w[1] / 2.5]; });
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    top.quad(q[i], q[j], b[j], b[i], center, none);
  }
  return { top: top.geom(), under: under.geom() };
}

// The four face quads of a hipped roof tier: eave rectangle (AX, AZ) at y0, upper edge (ix, iz) at y1.
export function tierFaces({ AX, AZ, y0, ix, iz, y1 }) {
  return [
    [V(-AX, y0, AZ), V(AX, y0, AZ), V(ix, y1, iz), V(-ix, y1, iz)],
    [V(AX, y0, -AZ), V(-AX, y0, -AZ), V(-ix, y1, -iz), V(ix, y1, -iz)],
    [V(AX, y0, AZ), V(AX, y0, -AZ), V(ix, y1, -iz), V(ix, y1, iz)],
    [V(-AX, y0, -AZ), V(-AX, y0, AZ), V(-ix, y1, iz), V(-ix, y1, -iz)],
  ];
}

function faceFrame(q) {
  const [E0, E1, T1, T0] = q;
  const eaveDir = E1.clone().sub(E0);
  const LA = eaveDir.length() / 2;
  eaveDir.normalize();
  return {
    E0, E1, T0, T1, eaveDir, LA,
    LI: T0.distanceTo(T1) / 2,
    mE: E0.clone().add(E1).multiplyScalar(0.5),
    mT: T0.clone().add(T1).multiplyScalar(0.5),
  };
}

// Parallel rafters under one roof face, clipped at the hips. Returns the count.
export function rafters(part, q, t, slot = 'wood') {
  const { eaveDir, LA, LI, mE, mT } = faceFrame(q);
  const drop = V(0, -(t + 0.035 + 0.045), 0);
  const span = 2 * LA - 0.3;
  const n = Math.floor(span / 0.45);
  let count = 0;
  for (let k = 0; k <= n; k++) {
    const c = -LA + 0.15 + (k * span) / n;
    const ac = Math.abs(c);
    const f = ac <= LI ? 1 : (LA - ac) / (LA - LI);
    if (f < 0.06) continue;
    const bot = mE.clone().addScaledVector(eaveDir, c).add(drop);
    const top = mE.clone().lerp(mT, f).addScaledVector(eaveDir, c).add(drop);
    part.add(slot, beam(bot, top, 0.07, 0.09, 0.04));
    count++;
  }
  return count;
}

// Battens across one roof face. Returns the count.
export function battens(part, q, t, slot = 'plank') {
  const { E0, E1, T0, T1, mE, mT } = faceFrame(q);
  const n = Math.floor(mE.distanceTo(mT) / 0.3);
  const drop = V(0, -(t + 0.018), 0);
  let count = 0;
  for (let k = 1; k < n; k++) {
    const f = k / n;
    const a = E0.clone().lerp(T0, f).add(drop);
    const b = E1.clone().lerp(T1, f).add(drop);
    if (a.distanceTo(b) < 0.25) continue;
    part.add(slot, beam(a, b, 0.045, 0.03));
    count++;
  }
  return count;
}

// ── Curved saddle roofs (gonjong, tongkonan, bolon…) ─────────────────
// A thick roof shell whose ridge sags in the middle and sweeps up into horns at one or both ends.
//   axis     'x' or 'z': direction of the ridge
//   cx, cz   centre of the roof in plan; len: half-length along the ridge
//   yR, yE   ridge and eave height at the lowest point; H: how far the horns rise
//   d0       half-width across the ridge; ends: 'both' | 'pos' | 'neg' (which ends rise)
//   t        shell thickness; split: rise fraction beyond which triangles count as "horn"
//   converge false keeps the eaves level to the ends (no horns, with H = 0 and pinch = 0)
export function saddleRoof(o) {
  const cfg = { gamma: 0.85, p: 3.5, pinch: 0.93, nu: 56, nv: 16, split: 0.7, t: 0.3, ...o };
  const { axis, cx, cz, len, yR, yE, H, d0, ends, t, gamma, p, pinch, nu, nv, split } = cfg;
  const rise = (s) => (ends === 'both' ? Math.abs(s) : ends === 'pos' ? (s + 1) / 2 : (1 - s) / 2);
  const width = (s) => d0 * (1 - pinch * Math.pow(rise(s), 6));
  const surf = (s, v, off = 0) => {
    const r = rise(s);
    const R = yR + H * Math.pow(r, p);
    // Eaves rise to meet the ridge at the horns, unless `converge` is false (plain saddle).
    const D = cfg.converge === false ? yR - yE : (yR - yE) * (1 - Math.pow(r, 10)) + 0.25 * Math.pow(r, 10);
    const y = R - D * Math.pow(Math.abs(v), gamma) - off;
    const a = s * len, b = v * width(s);
    return axis === 'x' ? V(cx + a, y, cz + b) : V(cx + b, y, cz + a);
  };

  // Top and bottom grids; points carry their UVs.
  const T = [], B = [];
  for (let i = 0; i <= nu; i++) {
    const s = -1 + (2 * i) / nu;
    T.push([]); B.push([]);
    for (let j = 0; j <= nv; j++) {
      const v = -1 + (2 * j) / nv;
      const uv = [(s * len) / 1.2, Math.abs(v) * width(s)];
      const top = surf(s, v, 0); top.uv = uv;
      const bot = surf(s, v, t); bot.uv = [uv[0] / 0.7, uv[1] / 2];
      T[i].push(top); B[i].push(bot);
    }
  }
  // The (s, v) grid maps to plan without folding, so one winding test works for every cell.
  const mid = [Math.floor(nu / 2), Math.floor(nv / 2)];
  const n0 = V().subVectors(T[mid[0] + 1][mid[1]], T[mid[0]][mid[1]])
    .cross(V().subVectors(T[mid[0] + 1][mid[1] + 1], T[mid[0]][mid[1]]));
  const flip = n0.y < 0;

  const main = new TriBuilder(), horn = new TriBuilder();
  const pick = (i) => (rise(-1 + (2 * (i + 0.5)) / nu) >= split ? horn : main);
  const push = (tb, a, b, c, up) => (up !== flip ? tb.raw(a, b, c) : tb.raw(a, c, b));
  for (let i = 0; i < nu; i++) {
    const tb = pick(i);
    for (let j = 0; j < nv; j++) {
      const [a, b, c, d] = [T[i][j], T[i + 1][j], T[i + 1][j + 1], T[i][j + 1]];
      push(tb, a, b, c, true); push(tb, a, c, d, true);
      const [e, f, g, h] = [B[i][j], B[i + 1][j], B[i + 1][j + 1], B[i][j + 1]];
      push(tb, e, f, g, false); push(tb, e, g, h, false);
    }
  }
  // Close the shell's four edges; orient each strip away from the neighbouring interior point.
  const strip = (tb, a, b, c, d, inner) => tb.quad(a, b, c, d, inner);
  const edgeUV = (p) => { p.uv = [0.01, 0.01]; return p; };
  for (let i = 0; i < nu; i++) {
    const tb = pick(i);
    for (const [j, jn] of [[0, 1], [nv, nv - 1]]) {
      const inner = T[i][jn].clone().add(B[i][jn]).multiplyScalar(0.5);
      strip(tb, T[i][j], T[i + 1][j], edgeUV(B[i + 1][j].clone()), edgeUV(B[i][j].clone()), inner);
    }
  }
  for (const [i, inI] of [[0, 1], [nu, nu - 1]]) {
    const tb = pick(Math.min(i, nu - 1));
    for (let j = 0; j < nv; j++) {
      const inner = T[inI][j].clone().add(B[inI][j]).multiplyScalar(0.5);
      strip(tb, T[i][j], T[i][j + 1], edgeUV(B[i][j + 1].clone()), edgeUV(B[i][j].clone()), inner);
    }
  }

  // Tips of the rising ends, with the direction the ridge is heading there.
  const tips = [];
  for (const s of ends === 'both' ? [-1, 1] : ends === 'pos' ? [1] : [-1]) {
    const tip = surf(s, 0);
    tips.push({ at: tip, dir: tip.clone().sub(surf(s * 0.95, 0)).normalize() });
  }
  return {
    main: main.empty ? null : main.geom(),
    horn: horn.empty ? null : horn.geom(),
    surf, rise, width, tips, cfg,
  };
}

// Rafters and a ridge beam under a saddle roof.
export function saddleFrame(part, roof, { slot = 'wood', step = 0.55, maxRise = 0.85 } = {}) {
  const { surf, rise, cfg } = roof;
  const t = cfg.t, n = Math.floor((2 * cfg.len) / step);
  let count = 0;
  const ridge = [];
  for (let k = 0; k <= n; k++) {
    const s = -1 + (2 * k) / n;
    if (rise(s) > maxRise) continue;
    ridge.push(surf(s, 0, t + 0.12));
    for (const sign of [-1, 1]) {
      const pts = [0, 0.33, 0.66, 1].map((v) => surf(s, sign * v, t + 0.05));
      for (const g of beamPath(pts, 0.06, 0.08)) part.add(slot, g);
      count++;
    }
  }
  for (const g of beamPath(ridge, 0.14, 0.18)) part.add(slot, g);
  return count;
}

// Gable infill under a saddle roof's end, between `bottom` and the roof's underside.
export function saddleGable(roof, at, half, bottom) {
  const { surf, width, cfg } = roof;
  const s = ((cfg.axis === 'x' ? at - cfg.cx : at - cfg.cz)) / cfg.len;
  const w = width(s);
  const pts = [[-half, bottom]];
  for (let k = 0; k <= 24; k++) {
    const u = -half + (2 * half * k) / 24;
    pts.push([u, Math.max(bottom, surf(s, Math.max(-1, Math.min(1, u / w)), cfg.t).y - 0.02)]);
  }
  pts.push([half, bottom]);
  return gablePanel(pts, 0.1, cfg.axis, at);
}

// A flat shape given in (u, y) coordinates, extruded by `depth` and placed in a vertical plane.
//   axis 'x': plane x = at, u runs along z.   axis 'z': plane z = at, u runs along x.
export function gablePanel(points, depth, axis, at) {
  const shape = new THREE.Shape(points.map(([u, y]) => new THREE.Vector2(u, y)));
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
  g.translate(0, 0, -depth / 2);
  if (axis === 'x') { g.rotateY(Math.PI / 2); g.translate(at, 0, 0); } else g.translate(0, 0, at);
  return g;
}
