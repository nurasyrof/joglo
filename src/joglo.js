// Procedural geometry for a Yogyakarta joglo pendapa.
// Units are metres; y is up, the ridge runs along x, the front faces +z.
import * as THREE from 'three';

const V = (x, y, z) => new THREE.Vector3(x, y, z);

export const DIM = {
  floorTop: 0.6,
  guru: { x: 2.2, z: 1.9, top: 6.2, s: 0.32, base: 1.0 },
  pen:  { x: 5.2, z: 4.4, top: 4.85, s: 0.26, base: 1.0 },
  pit:  { x: 7.8, z: 6.8, top: 3.6, s: 0.22, base: 0.95 },
  // Roof tiers: eave rectangle (AX, AZ) at y0, upper edge (ix, iz) at y1.
  brunjung:  { AX: 3.6, AZ: 3.3, y0: 6.72, ix: 0.8, iz: 0, y1: 11.01 },
  penanggap: { AX: 6.2, AZ: 5.4, y0: 4.71, ix: 3.3, iz: 3.0, y1: 6.35 },
  penitih:   { AX: 9.0, AZ: 8.0, y0: 3.58, ix: 5.7, iz: 4.9, y1: 4.7 },
  slab: 0.1,
};

let seed = 20240917;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

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

function box(w, h, d, x, y, z, mode = 'wood', scale = 1) {
  const g = new THREE.BoxGeometry(w, h, d);
  boxUV(g, [w, h, d], mode, scale);
  g.translate(x, y, z);
  return g;
}

const _o = new THREE.Object3D();
function beam(a, b, w, h, ext = 0) {
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

class Part {
  constructor() { this.parts = {}; this.count = 0; }
  add(slot, g) {
    if (g.index) g = g.toNonIndexed();
    (this.parts[slot] ||= []).push(g);
    return this;
  }
}

// Builds non-indexed triangles, orienting each so its normal faces away from `center`.
class TriBuilder {
  constructor() { this.p = []; this.uv = []; }
  tri(a, b, c, center, uvf) {
    const n = V().subVectors(b, a).cross(V().subVectors(c, a));
    if (n.lengthSq() < 1e-10) return;
    const fc = V().add(a).add(b).add(c).multiplyScalar(1 / 3).sub(center);
    if (n.dot(fc) < 0) [b, c] = [c, b];
    for (const p of [a, b, c]) {
      this.p.push(p.x, p.y, p.z);
      const w = uvf(p);
      this.uv.push(w[0], w[1]);
    }
  }
  quad(a, b, c, d, center, uvf) { this.tri(a, b, c, center, uvf); this.tri(a, c, d, center, uvf); }
  geom() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    g.computeVertexNormals();
    return g;
  }
}

// A closed roof slab from one face quad [E0, E1, T1, T0]; tiles on top, planks underneath.
function slab(q, t) {
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

function tierFaces({ AX, AZ, y0, ix, iz, y1 }) {
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

function rafters(part, q, t) {
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
    part.add('wood', beam(bot, top, 0.07, 0.09, 0.04));
    count++;
  }
  return count;
}

function battens(part, q, t) {
  const { E0, E1, T0, T1, mE, mT } = faceFrame(q);
  const n = Math.floor(mE.distanceTo(mT) / 0.3);
  const drop = V(0, -(t + 0.018), 0);
  let count = 0;
  for (let k = 1; k < n; k++) {
    const f = k / n;
    const a = E0.clone().lerp(T0, f).add(drop);
    const b = E1.clone().lerp(T1, f).add(drop);
    if (a.distanceTo(b) < 0.25) continue;
    part.add('plank', beam(a, b, 0.045, 0.03));
    count++;
  }
  return count;
}

function frame(part, slot, hx, hz, y, w, h, over = 0) {
  part.add(slot, box(2 * hx + w + 2 * over, h, w, 0, y, hz));
  part.add(slot, box(2 * hx + w + 2 * over, h, w, 0, y, -hz));
  part.add(slot, box(w, h, 2 * hz + w + 2 * over, hx, y, 0));
  part.add(slot, box(w, h, 2 * hz + w + 2 * over, -hx, y, 0));
}

function ring(xs, zs, X, Z) {
  const out = [];
  for (const x of xs) for (const z of zs) if (Math.abs(x) === X || Math.abs(z) === Z) out.push([x, z]);
  return out;
}

export function buildJoglo() {
  seed = 20240917;
  const C = {};
  const P = (id) => (C[id] ||= new Part());
  const { floorTop: F, guru, pen, pit } = DIM;

  // ── Bebatur: plinth, tiled floor, steps
  P('bebatur')
    .add('stone', box(16.6, 0.5, 14.6, 0, 0.25, 0, 'stone', 1.5))
    .add('stone', box(16.95, 0.14, 14.95, 0, 0.07, 0, 'stone', 1.5))
    .add('floor', box(16.4, 0.1, 14.4, 0, 0.55, 0, 'world', 1));
  for (const s of [1, -1]) {
    P('bebatur').add('stone', box(4.6, 0.4, 0.42, 0, 0.2, s * (7.3 + 0.21), 'stone', 1.5));
    P('bebatur').add('stone', box(4.6, 0.2, 0.42, 0, 0.1, s * (7.3 + 0.63), 'stone', 1.5));
  }

  // ── Columns and their umpak
  const guruPos = ring([-guru.x, guru.x], [-guru.z, guru.z], guru.x, guru.z);
  const penPos = ring([-pen.x, -guru.x, guru.x, pen.x], [-pen.z, -guru.z, guru.z, pen.z], pen.x, pen.z);
  const pitPos = ring(
    [-pit.x, -pen.x, -guru.x, guru.x, pen.x, pit.x],
    [-pit.z, -pen.z, -guru.z, guru.z, pen.z, pit.z], pit.x, pit.z);

  const umpak = (x, z, rt, rb, h) => {
    const g = new THREE.CylinderGeometry(rt, rb, h - 0.08, 4, 1);
    g.rotateY(Math.PI / 4);
    g.translate(x, F + 0.08 + (h - 0.08) / 2, z);
    P('umpak').add('stone', g);
    const side = rb * Math.SQRT2 + 0.06;
    P('umpak').add('stone', box(side, 0.08, side, x, F + 0.04, z, 'stone', 1));
  };
  const columns = (id, pos, c, ur) => {
    for (const [x, z] of pos) {
      umpak(x, z, ur[0], ur[1], c.base - F);
      P(id).add('wood', box(c.s, c.top - c.base, c.s, x, (c.top + c.base) / 2, z));
    }
  };
  columns('saka_guru', guruPos, guru, [0.3, 0.42]);
  columns('saka_penanggap', penPos, pen, [0.26, 0.36]);
  columns('saka_penitih', pitPos, pit, [0.22, 0.31]);

  // ── Sunduk (through-beams) and kili (wedges)
  const yS = guru.top - 1.0;
  const SK = P('sunduk_kili');
  for (const z of [-guru.z, guru.z]) SK.add('wood', box(2 * guru.x + 0.7, 0.26, 0.12, 0, yS, z));
  for (const x of [-guru.x, guru.x]) SK.add('wood', box(0.12, 0.26, 2 * guru.z + 0.7, x, yS - 0.34, 0));
  for (const z of [-guru.z, guru.z]) for (const sx of [-1, 1]) SK.add('accent', box(0.05, 0.36, 0.16, sx * (guru.x + 0.27), yS, z));
  for (const x of [-guru.x, guru.x]) for (const sz of [-1, 1]) SK.add('accent', box(0.16, 0.36, 0.05, x, yS - 0.34, sz * (guru.z + 0.27)));

  // ── Blandar & pengeret ring beams
  frame(P('blandar'), 'wood', guru.x, guru.z, guru.top + 0.11, 0.26, 0.22, 0.22);
  frame(P('blandar'), 'wood', pen.x, pen.z, pen.top + 0.09, 0.2, 0.18, 0.18);
  frame(P('blandar'), 'wood', pit.x, pit.z, pit.top + 0.08, 0.18, 0.16, 0.28);

  // ── Tumpang sari: five courses stepping outward
  const tsBase = guru.top + 0.22;
  for (let i = 0; i < 5; i++) {
    frame(P('tumpang_sari'), i % 2 ? 'accent' : 'carved',
      2.3 + 0.14 * i, 2.0 + 0.13 * i, tsBase + 0.09 + 0.18 * i, 0.26, 0.18, 0.08);
  }
  const tsTop = tsBase + 5 * 0.18;

  // ── Dhadha peksi across the middle
  P('dadha_peksi')
    .add('carved', box(2 * 2.3 + 0.26, 0.36, 0.3, 0, tsBase + 0.2, 0))
    .add('accent', box(2 * 2.3 - 0.3, 0.05, 0.34, 0, tsBase + 0.005, 0))
    .add('accent', box(0.5, 0.2, 0.36, 0, tsBase - 0.1, 0));

  // ── Uleng: inward stepped ceiling above the tumpang sari
  let ux = 2.62, uz = 2.41;
  for (let j = 0; j < 4; j++) {
    frame(P('uleng'), j % 2 ? 'accent' : 'carved', ux, uz, tsTop + 0.08 + 0.16 * j, 0.22, 0.16, 0);
    if (j < 3) { ux -= 0.3; uz -= 0.28; }
  }
  P('uleng').add('accent', box(2 * ux + 0.22, 0.04, 2 * uz + 0.22, 0, tsTop + 0.64 + 0.02, 0));

  // ── Lambang sari: rings and short posts at the brunjung / penanggap junction
  const LS = P('lambang_sari');
  const lx = 3.25, lz = 2.95;
  frame(LS, 'wood', lx, lz, 6.04, 0.14, 0.16, 0.05);
  frame(LS, 'wood', lx, lz, 6.86, 0.12, 0.14, 0.05);
  const posts = (half, place) => {
    const n = Math.round((2 * half) / 0.65);
    for (let k = 0; k <= n; k++) place(-half + (k * 2 * half) / n);
  };
  posts(lx, (x) => { for (const z of [-lz, lz]) LS.add('wood', box(0.08, 0.68, 0.08, x, 6.46, z)); });
  posts(lz, (z) => { for (const x of [-lx, lx]) LS.add('wood', box(0.08, 0.68, 0.08, x, 6.46, z)); });

  // ── Roof tiers: tiled slabs, rafters, battens, hips, caps
  let nRafters = 0, nBattens = 0;
  const t = DIM.slab;
  const corners = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  for (const [id, tier] of [['atap_brunjung', DIM.brunjung], ['atap_penanggap', DIM.penanggap], ['atap_penitih', DIM.penitih]]) {
    for (const q of tierFaces(tier)) {
      const s = slab(q, t);
      P(id).add('roof', s.top).add('plank', s.under);
      nRafters += rafters(P('usuk'), q, t);
      nBattens += battens(P('usuk'), q, t);
    }
    for (const [sx, sz] of corners) {
      const a = V(sx * tier.AX, tier.y0, sz * tier.AZ);
      const b = V(sx * tier.ix, tier.y1, sz * tier.iz);
      const dn = V(0, -(t + 0.12), 0), up = V(0, 0.05, 0);
      P('dudur').add('wood', beam(a.clone().add(dn), b.clone().add(dn), 0.14, 0.2));
      P('mustaka').add('ornament', beam(a.clone().add(up), b.clone().add(up), 0.2, 0.1, 0.05));
    }
  }

  // ── Molo (ridge beam) and ridge crown ornaments
  const B = DIM.brunjung;
  P('molo').add('wood', box(2 * B.ix + 0.5, 0.26, 0.2, 0, B.y1 - t - 0.14, 0));
  P('mustaka').add('ornament', box(2 * B.ix + 0.3, 0.16, 0.26, 0, B.y1 + 0.06, 0, 'stone', 1));
  const prof = [[0, 0], [0.2, 0], [0.22, 0.06], [0.14, 0.12], [0.12, 0.2], [0.24, 0.34], [0.2, 0.46],
    [0.1, 0.56], [0.07, 0.66], [0.12, 0.74], [0.05, 0.86], [0, 0.95]].map(([r, y]) => new THREE.Vector2(r, y));
  for (const sx of [-1, 1]) {
    const g = new THREE.LatheGeometry(prof, 16);
    g.translate(sx * (B.ix + 0.05), B.y1 + 0.1, 0);
    P('mustaka').add('ornament', g);
  }

  return { parts: C, counts: { rafters: nRafters, battens: nBattens } };
}
