// Ruma: the Batak Toba house, and the sopo (rice barn) that faces it. Both stand on thick
// posts tied together by rails, with plank walls that lean outwards and a saddle roof of
// palm fibre whose back peak stands a little higher than the front one.
// Local coordinates: the carved front faces +z.
import * as THREE from 'three';
import { V, reseed, partStore, box, beam, hexa, saddleRoof, saddleFrame, saddleGable } from '../../lib/geometry.js';
import { rumaParts, sopoParts, RUMA_CATEGORIES } from './ruma-parts.js';

const F = 1.75;           // floor above the ground: the height of the posts
const WH = 1.5;           // wall height
const LEAN = 0.35;        // how far the walls lean out at the top

const post = (r, y0, y1, x, z) => new THREE.CylinderGeometry(r * 0.94, r, y1 - y0, 10).translate(x, (y0 + y1) / 2, z);
const woodUV = (p) => [(p.x + p.z) / 0.9, p.y / 1.4];
const carvedUV = (p) => [p.x / 1.2, p.y / 1.2];

// A wall plane standing on the floor edge and leaning outwards; `dir` is its outward normal.
function leanWall(a, b, dir, y0, h, lean, t = 0.06, uvf = woodUV) {
  const o = V(dir[0] * t, 0, dir[1] * t), up = V(dir[0] * lean, h, dir[1] * lean);
  const A = V(a[0], y0, a[1]), B = V(b[0], y0, b[1]);
  // The top edge is longer where the neighbouring walls lean away too
  const along = B.clone().sub(A).normalize().multiplyScalar(lean);
  const bottom = [A, B, B.clone().add(o), A.clone().add(o)];
  const top = [A.clone().add(up).sub(along), B.clone().add(up).add(along), B.clone().add(up).add(along).add(o), A.clone().add(up).sub(along).add(o)];
  return hexa(bottom, top, uvf);
}

// Raises the back half of a roof geometry so the rear peak ends up higher than the front.
function liftBack(g, len, extra) {
  if (!g) return g;
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const z = p.getZ(i);
    if (z < 0) p.setY(i, p.getY(i) + extra * Math.pow(Math.min(1, -z / len), 2.5));
  }
  g.computeVertexNormals();
  return g;
}

function roofOver(P, { w, l, rise, back, over = 2.2 }) {
  const len = l + over, bottom = F + WH;
  // Set a little forward, so the front peak reaches further out than the back one
  const roof = saddleRoof({ axis: 'z', cx: 0, cz: 0.4, len, yR: bottom + rise, yE: bottom - 0.15, H: rise * 0.85, d0: w + LEAN + 0.75, ends: 'both', gamma: 1, p: 2.2, pinch: 0.35, converge: false, split: 0.6, t: 0.25 });
  P('atap').add('roof', liftBack(roof.main, len, back));
  if (roof.horn) P('atap').add('roof', liftBack(roof.horn, len, back));
  const rafters = saddleFrame(P('rangka_atap'), roof, { slot: 'bamboo', maxRise: 0.55 });
  return { roof, len, rafters };
}

// Buffalo horns on a carved head.
function horns(part, at, s = 1) {
  const pts = [[0, 0], [0.24, 0.02], [0.46, 0.2], [0.52, 0.5], [0.44, 0.74]];
  for (const side of [-1, 1]) {
    const curve = new THREE.CatmullRomCurve3(pts.map(([x, y]) => V(at.x + side * x * s, at.y + y * s, at.z)));
    part.add('horn', new THREE.TubeGeometry(curve, 14, 0.05 * s, 6, false));
  }
}

export function makeRuma({ w = 2.9, l = 5.2, rise = 3.0, seed = 71 } = {}) {
  const ROWS = 6, COLS = [-w + 0.1, -w / 3, w / 3, w - 0.1];
  const rowZ = (k) => -l + 0.2 + (k * (2 * l - 0.4)) / (ROWS - 1);

  function build() {
    reseed(seed);
    const { parts, P } = partStore();

    // ── Banua toru: posts, the rails that tie them, the pen, the stair up through the floor
    const T = P('tiang');
    let posts = 0;
    for (let k = 0; k < ROWS; k++) for (const x of COLS) {
      if (Math.abs(x) < w - 0.2 && k > 0 && k < ROWS - 1 && k !== ROWS - 2) continue;     // inner posts only at the ends
      T.add('stone', box(0.6, 0.12, 0.6, x, 0.06, rowZ(k), 'stone', 1));
      T.add('wood', post(0.21, 0.12, F - 0.12, x, rowZ(k)));
      posts++;
    }
    // Flat rails threaded through the posts, three high, all the way round
    for (const y of [0.45, 0.9, 1.35]) {
      for (const s of [-1, 1]) {
        T.add('wood', box(0.07, 0.2, 2 * l + 0.5, s * (w - 0.1), y, 0));
        T.add('wood', box(2 * w + 0.3, 0.2, 0.07, 0, y + 0.02, s * (l - 0.2)));
      }
    }
    for (const s of [-1, 1]) T.add('wood', box(0.22, 0.26, 2 * l + 1.4, s * (w - 0.1), F - 0.25, 0.2));
    for (let k = 0; k < ROWS; k++) T.add('wood', box(2 * w + 0.4, 0.2, 0.2, 0, F - 0.02, rowZ(k)));

    P('kolong').add('ground', box(2 * w, 0.04, 2 * l - 2.6, 0, 0.02, -1.1, 'world', 2));
    for (const s of [-1, 1]) P('kolong').add('bamboo', box(0.04, 0.3, 2 * l - 2.8, s * (w - 0.35), 0.2, -1.1, 'world', 1));

    const S = P('tangga');
    const sz0 = l - 0.45, sz1 = l - 1.75;
    for (const s of [-1, 1]) S.add('wood', beam(V(s * 0.42, 0.04, sz0), V(s * 0.42, F + 0.05, sz1), 0.08, 0.2));
    for (let k = 1; k <= 7; k++) {
      const f = k / 8;
      S.add('plank', box(0.76, 0.05, 0.24, 0, f * F, sz0 + f * (sz1 - sz0)));
    }
    // The door is in the floor: a hatch that is lowered at night
    S.add('plank', box(1.0, 1.3, 0.05, 0, F + 0.65, l - 2.45));

    // ── Banua tonga: the floor, the leaning walls, the carved front, the hearth
    const Fl = P('papan');
    const hole = { x: 0.5, z0: l - 2.4, z1: l - 0.95 };
    Fl.add('plank', box(2 * w, 0.06, hole.z0 + l, 0, F + 0.03, (hole.z0 - l) / 2));
    Fl.add('plank', box(2 * w, 0.06, l - hole.z1, 0, F + 0.03, (l + hole.z1) / 2));
    for (const s of [-1, 1]) Fl.add('plank', box(w - hole.x, 0.06, hole.z1 - hole.z0, s * (w + hole.x) / 2, F + 0.03, (hole.z0 + hole.z1) / 2));

    const D = P('dorpi');
    for (const s of [-1, 1]) D.add('plank', leanWall([s * w, -l], [s * w, l], [s, 0], F, WH, LEAN));
    D.add('plank', leanWall([-w, -l], [w, -l], [0, -1], F, WH, LEAN));
    for (const s of [-1, 1]) {
      D.add('wood', box(0.16, 0.16, 2 * (l + LEAN) + 0.3, s * (w + LEAN), F + WH + 0.08, 0));
      D.add('wood', box(2 * (w + LEAN) + 0.3, 0.16, 0.16, 0, F + WH + 0.08, s * (l + LEAN)));
    }

    const J = P('dorpi_jolo');
    J.add('gorga', leanWall([-w, l], [w, l], [0, 1], F, WH, LEAN, 0.07, carvedUV));
    // Carved boards stepping forward above the wall, then the gable
    const tiers = 3, step = 0.28;
    for (let k = 0; k < tiers; k++) {
      J.add('gorga', box(2 * (w + LEAN) - k * 0.8, 0.4, 0.09, 0, F + WH + 0.36 + k * 0.42, l + LEAN + 0.1 + k * step, 'world', 1.2));
      J.add('wood', box(2 * (w + LEAN) - k * 0.8 + 0.2, 0.07, 0.3, 0, F + WH + 0.14 + k * 0.42, l + LEAN + k * step));
    }
    // Adop-adop and boraspati: four breasts and four lizards on either side of the front
    for (const s of [-1, 1]) for (let k = 0; k < 4; k++) {
      const x = s * (0.75 + k * 0.5), y = F + 0.95, z = l + LEAN * (0.95 / WH) + 0.07;
      J.add('accent', new THREE.SphereGeometry(0.08, 10, 8).translate(x, y, z));
      J.add('accent', box(0.06, 0.26, 0.03, x, y - 0.36, z - 0.06, 'stone', 1));
    }
    // Singa-singa: carved heads at the two front corners
    for (const s of [-1, 1]) {
      const g = P('singa');
      g.add('gorga', box(0.34, 0.75, 0.3, s * (w - 0.1), F + 0.15, l + 0.42, 'world', 1));
      g.add('accent', box(0.22, 0.2, 0.12, s * (w - 0.1), F + 0.2, l + 0.6, 'stone', 1));
      for (const e of [-1, 1]) g.add('dark', new THREE.SphereGeometry(0.045, 8, 6).translate(s * (w - 0.1) + e * 0.09, F + 0.38, l + 0.58));
    }

    const H = P('tataring');
    const hz = -l * 0.3;
    H.add('wood', box(1.5, 0.14, 1.5, 0, F + 0.13, hz));
    H.add('earth', box(1.34, 0.06, 1.34, 0, F + 0.22, hz, 'world', 1));
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * Math.PI * 2 + 0.5;
      H.add('stone', new THREE.DodecahedronGeometry(0.11, 0).scale(1, 1.3, 1).translate(Math.cos(a) * 0.24, F + 0.37, hz + Math.sin(a) * 0.24));
    }
    H.add('dark', box(0.3, 0.02, 0.3, 1.2, F + 0.065, hz + 0.3, 'stone', 1));             // talaga: the hole for sweepings
    // Para-para: a rack across the middle of the house
    for (const z of [-0.5, 0.5]) H.add('wood', box(2 * w + 0.5, 0.1, 0.1, 0, F + WH + 0.3, z));
    for (let x = -w + 0.2; x < w; x += 0.3) H.add('bamboo', box(0.05, 0.04, 1.1, x, F + WH + 0.37, 0));

    // Songkor at the front and pangabang at the back: platforms inside the roof
    const G = P('songkor');
    for (const s of [-1, 1]) {
      const z = s * (l - 0.2);
      G.add('plank', box(2 * w + 0.5, 0.05, 1.6, 0, F + WH + 0.33, z));
      G.add('wood', box(2 * w + 0.5, 0.1, 0.1, 0, F + WH + 0.26, z - s * 0.75));
    }
    for (const [x, z] of [[-1.2, -l + 0.2], [0.2, -l + 0.1], [1.4, -l + 0.3]]) G.add('bamboo', new THREE.CylinderGeometry(0.3, 0.26, 0.6, 12).translate(x, F + WH + 0.66, z));

    // ── Banua ginjang: the roof
    const { roof, len, rafters } = roofOver(P, { w, l, rise, back: 0.8 });
    const at = l + LEAN + 0.1 + tiers * step;
    J.add('gorga', saddleGable(roof, at, w + LEAN - tiers * 0.4, F + WH + 0.5 + tiers * 0.42));
    const backG = saddleGable(roof, -(l + LEAN), w + LEAN, F + WH + 0.16);
    P('dorpi').add('plank', liftBack(backG, len, 0.8));

    // Ulu paung: the horned head at the front peak
    const tip = roof.tips.find((t) => t.at.z > 0).at;
    const U = P('ulu_paung');
    U.add('gorga', box(0.4, 0.5, 0.3, 0, tip.y - 0.55, tip.z - 0.25, 'world', 1));
    U.add('accent', box(0.2, 0.16, 0.1, 0, tip.y - 0.62, tip.z - 0.08, 'stone', 1));
    horns(U, V(0, tip.y - 0.35, tip.z - 0.25), 0.9);

    return { parts, counts: { posts, rafters } };
  }

  return {
    build, categories: RUMA_CATEGORIES, parts: rumaParts({ w, l, rise }), sectionY: F + 1.3,
    views: { inside: { pos: [0.9, F + 1.3, l - 3.1], target: [-0.2, F + 0.8, -l] } },
  };
}

export function makeSopo({ w = 2.4, l = 3.6, seed = 81 } = {}) {
  const LOFT = F + WH + 0.1;

  function build() {
    reseed(seed);
    const { parts, P } = partStore();

    const T = P('tiang');
    let posts = 0;
    for (const x of [-w + 0.1, w - 0.1]) for (const z of [-l + 0.2, 0, l - 0.2]) {
      T.add('stone', box(0.6, 0.12, 0.6, x, 0.06, z, 'stone', 1));
      T.add('wood', post(0.2, 0.12, LOFT - 0.1, x, z));
      // A wide disc under the loft keeps rats from climbing in
      T.add('wood', new THREE.CylinderGeometry(0.5, 0.5, 0.06, 16).translate(x, LOFT - 0.32, z));
      posts++;
    }
    for (const s of [-1, 1]) T.add('wood', box(0.2, 0.22, 2 * l + 0.8, s * (w - 0.1), LOFT - 0.2, 0));

    // Balai: the open floor below, with no walls
    const B = P('balai');
    B.add('plank', box(2 * w - 0.5, 0.06, 2 * l - 0.6, 0, 1.0, 0));
    for (const z of [-l + 0.2, 0, l - 0.2]) B.add('wood', box(2 * w, 0.16, 0.14, 0, 0.9, z));
    for (let k = 1; k <= 3; k++) B.add('plank', box(0.9, 0.05, 0.26, 0, k * 0.25, l + 0.5 - k * 0.22));

    // Lumbung: the store under the roof
    const L = P('lumbung');
    L.add('plank', box(2 * w + 0.4, 0.06, 2 * l + 0.4, 0, LOFT + 0.03, 0));
    for (const s of [-1, 1]) {
      L.add('plank', leanWall([s * w, -l], [s * w, l], [s, 0], LOFT, 1.0, 0.3));
      L.add('gorga', leanWall([-s * w, s * l], [s * w, s * l], [0, s], LOFT, 1.0, 0.3, 0.06, carvedUV));
    }
    for (const [x, z] of [[-0.9, -1.2], [0.7, 0.4], [-0.4, 1.6]]) L.add('bamboo', new THREE.CylinderGeometry(0.42, 0.36, 0.8, 12).translate(x, LOFT + 0.46, z));

    const bottom = LOFT + 1.0, len = l + 1.8;
    const roof = saddleRoof({ axis: 'z', cx: 0, cz: 0, len, yR: bottom + 2.2, yE: bottom - 0.2, H: 1.9, d0: w + 1.0, ends: 'both', gamma: 1, p: 2.2, pinch: 0.35, converge: false, split: 0.6, t: 0.22 });
    P('atap').add('roof', liftBack(roof.main, len, 0.5));
    if (roof.horn) P('atap').add('roof', liftBack(roof.horn, len, 0.5));
    const rafters = saddleFrame(P('rangka_atap'), roof, { slot: 'bamboo', maxRise: 0.55 });
    for (const s of [-1, 1]) L.add('gorga', liftBack(saddleGable(roof, s * (l + 0.32), w + 0.3, bottom), len, 0.5));

    return { parts, counts: { posts, rafters } };
  }

  return {
    build, categories: RUMA_CATEGORIES, parts: sopoParts({ w, l }), sectionY: 2.2,
    views: { inside: { pos: [w + 2.5, 1.6, l + 2.5], target: [0, 1.6, 0] } },
  };
}
