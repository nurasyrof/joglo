// Rumoh Aceh: a long timber house on four rows of round posts, 2.5 m apart. Across its
// depth it has three parts: the front gallery (seuramoe keue), the raised middle with the
// bedrooms (rumoh inong), and the back gallery (seuramoe likot). The ridge runs east–west.
// Local coordinates: x runs east, the front (north) faces +z.
import * as THREE from 'three';
import { V, reseed, partStore, box, beam } from '../../lib/geometry.js';
import { wallRun, opening, gableRoof } from '../../lib/kit.js';
import { PARTS, CATEGORIES } from './rumoh-parts.js';

export const BAY = 2.5, BAYS = 5;                   // five ruang along the house
export const HX = (BAY * BAYS) / 2;                 // 6.25: half length on the post lines
const ROWS = [1.5, 0.5, -0.5, -1.5].map((k) => k * BAY);     // front, middle front, middle back, back
const F = 2.5;                                      // floor of the galleries
const MID = F + 0.5;                                // the middle part is half a metre higher
const PLATE = F + 2.0;
const EDGE = 0.2;                                   // floor and walls stand this far outside the posts
const RIDGE = 8.7;
const DOOR = { c: 0, w: 0.8, h: 1.8 };
const WIN = { w: 0.6, h: 1.0 };

const post = (r, y0, y1, x, z) => new THREE.CylinderGeometry(r * 0.94, r, y1 - y0, 12).translate(x, (y0 + y1) / 2, z);
const xs = Array.from({ length: BAYS + 1 }, (_, i) => -HX + i * BAY);

function build() {
  reseed(301);
  const { parts, P } = partStore();
  const X = HX + EDGE, Z = ROWS[0] + EDGE;

  // ── Posts on flat stones; the middle two rows run higher to carry the roof
  const T = P('tameh');
  let posts = 0;
  for (const z of ROWS) for (const x of xs) {
    const raja = x === -BAY / 2 && z === ROWS[1], putroe = x === -BAY / 2 && z === ROWS[2];
    T.add('stone', box(0.62, 0.16, 0.62, x, 0.08, z, 'stone', 1));
    const top = Math.abs(z) < 2 ? PLATE + 1.0 : PLATE;
    (raja || putroe ? P('tameh_raja') : T).add('wood', post(raja || putroe ? 0.2 : 0.17, 0.16, top, x, z));
    posts++;
  }
  // Two bands of cloth on the king and queen posts
  for (const z of [ROWS[1], ROWS[2]]) P('tameh_raja').add('accent', post(0.215, MID + 1.2, MID + 1.45, -BAY / 2, z));

  // ── Lhue: beams along the rows, joists across them
  const L = P('lhue');
  for (const z of ROWS) L.add('wood', box(2 * X + 0.3, 0.24, 0.16, 0, F - 0.3, z));
  for (const z of [ROWS[1], ROWS[2]]) L.add('wood', box(2 * X + 0.3, 0.2, 0.16, 0, MID - 0.25, z));
  for (let x = -X + 0.2; x < X; x += 0.5) {
    L.add('wood', box(0.08, 0.14, BAY + EDGE, x, F - 0.11, ROWS[0] - BAY / 2 + EDGE / 2));
    L.add('wood', box(0.08, 0.14, BAY + EDGE, x, F - 0.11, ROWS[3] + BAY / 2 - EDGE / 2));
    L.add('wood', box(0.08, 0.14, BAY, x, MID - 0.11, 0));
  }
  for (const z of ROWS) for (const x of xs) L.add('wood', box(0.08, 0.5, 0.08, x + 0.25, PLATE + 0.25, z));     // short struts under the plate

  // ── Reunyeun: the steep stair up to the front door
  const R = P('reunyeun');
  const z0 = Z + 2.3, z1 = Z + 0.1;
  for (const s of [-1, 1]) R.add('wood', beam(V(s * 0.45, 0.04, z0), V(s * 0.45, F - 0.05, z1), 0.08, 0.2));
  const n = 9;
  for (let k = 1; k <= n; k++) {
    const f = k / (n + 1);
    R.add('plank', box(0.82, 0.05, 0.22, 0, f * F, z0 + f * (z1 - z0)));
  }
  for (const s of [-1, 1]) R.add('wood', beam(V(s * 0.45, 0.95, z0 - 0.05), V(s * 0.45, F + 0.9, z1), 0.05, 0.05));

  // ── Yup moh: the space under the house, with a bench and a loom
  const Y = P('yup_moh');
  Y.add('yard', box(2 * HX, 0.03, 2 * ROWS[0], 0, 0.015, 0, 'world', 2));
  Y.add('plank', box(2.2, 0.06, 1.0, -3.75, 0.55, 0.3));
  for (const dx of [-1, 1]) for (const dz of [-0.4, 0.4]) Y.add('wood', box(0.08, 0.52, 0.08, -3.75 + dx * 1.0, 0.27, 0.3 + dz));
  for (const dx of [-0.7, 0.7]) Y.add('wood', box(0.08, 1.1, 0.08, 3.4 + dx, 0.55, -0.4));
  for (const y of [0.35, 0.95]) Y.add('wood', box(1.5, 0.06, 0.06, 3.4, y, -0.4));
  Y.add('accent', box(1.3, 0.02, 0.9, 3.4, 0.62, -0.05).rotateX(0.35));

  // ── Seuramoe keue: the front gallery, its wall, the door and windows
  const K = P('seuramoe_keue');
  K.add('plank', box(2 * X, 0.05, BAY + EDGE, 0, F + 0.025, ROWS[0] - BAY / 2 + EDGE / 2, 'wood'));
  const winsF = [-5, -2.5, 2.5, 5].map((c) => ({ c, w: WIN.w, h: WIN.h, sill: 0.7 }));
  wallRun(K, 'gorga', { axis: 'x', at: Z, from: -X, to: X, y0: F, h: PLATE - F, t: 0.06, openings: [DOOR, ...winsF], mode: 'world' });
  opening(K, { at: Z, c: DOOR.c, w: DOOR.w, h: DOOR.h, y0: F, leaves: 2, open: 1.1, t: 0.06, leafSlot: 'plank' });
  for (const w of winsF) opening(K, { at: Z, c: w.c, w: w.w, h: w.h, y0: F + w.sill, leaves: 2, open: 1.3, t: 0.06, leafSlot: 'plank' });
  for (const s of [-1, 1]) wallRun(K, 'plank', { axis: 'z', at: s * X, from: ROWS[1], to: Z, y0: F, h: PLATE - F, t: 0.06, mode: 'world' });

  // ── Rumoh inong: the raised middle, with the two bedrooms and the passage between them
  const I = P('rumoh_inong');
  I.add('plank', box(2 * X, 0.05, BAY, 0, MID + 0.025, 0, 'wood'));
  for (const z of [ROWS[1], ROWS[2]]) I.add('plank', box(2 * X, MID - F, 0.06, 0, (F + MID) / 2, z));
  const room = (o) => wallRun(I, 'plank', { y0: MID, h: PLATE - MID, t: 0.05, mode: 'world', ...o });
  for (const s of [-1, 1]) {
    room({ axis: 'z', at: s * BAY / 2, from: ROWS[2], to: ROWS[1], openings: [{ c: 0, w: 0.75, h: 1.75 }] });
    for (const z of [ROWS[1], ROWS[2]]) room({ axis: 'x', at: z, from: Math.min(s * X, s * BAY / 2), to: Math.max(s * X, s * BAY / 2) });
    room({ axis: 'z', at: s * X, from: ROWS[2], to: ROWS[1], openings: s < 0 ? [{ c: 0, w: WIN.w, h: WIN.h, sill: 0.7 }] : [] });
  }
  // A bed platform in the jurei, the main bedroom at the west end
  I.add('plank', box(2.0, 0.35, 1.6, -4.4, MID + 0.175, -0.2));
  I.add('accent', box(1.9, 0.08, 1.5, -4.4, MID + 0.39, -0.2));

  // ── Seuramoe likot: the back gallery, where the cooking is done
  const B = P('seuramoe_likot');
  B.add('plank', box(2 * X, 0.05, BAY + EDGE, 0, F + 0.025, ROWS[3] + BAY / 2 - EDGE / 2, 'wood'));
  const winsB = [-5, -2.5, 2.5].map((c) => ({ c, w: WIN.w, h: WIN.h, sill: 0.7 }));
  wallRun(B, 'plank', { axis: 'x', at: -Z, from: -X, to: X, y0: F, h: PLATE - F, t: 0.06, openings: winsB, mode: 'world' });
  for (const s of [-1, 1]) wallRun(B, 'plank', { axis: 'z', at: s * X, from: -Z, to: ROWS[2], y0: F, h: PLATE - F, t: 0.06, mode: 'world' });
  const hx = 4.6, hz = ROWS[3] + 0.2;
  B.add('wood', box(1.4, 0.16, 1.0, hx, F + 0.13, hz));
  B.add('earth', box(1.26, 0.08, 0.86, hx, F + 0.25, hz, 'world', 1));
  for (let k = 0; k < 3; k++) B.add('stone', new THREE.DodecahedronGeometry(0.1, 0).scale(1, 1.3, 1).translate(hx - 0.3 + k * 0.3, F + 0.4, hz));
  const JAR = [[0, 0], [0.18, 0], [0.28, 0.2], [0.3, 0.42], [0.22, 0.62], [0.16, 0.68], [0, 0.68]];
  for (const dx of [2.9, 3.5]) B.add('earth', new THREE.LatheGeometry(JAR.map(([r, y]) => new THREE.Vector2(r, y)), 14).translate(dx, F + 0.05, ROWS[3] + 0.1));

  // ── Roof: rafters on a ridge, a steep thatch of sago palm, and the carved gable screens
  const AZ = Z + 1.15, y0 = 4.25;
  const roof = gableRoof(P, { AX: X + 1.1, AZ, y0, y1: RIDGE, t: 0.15, roof: 'atap', frame: 'rangka_atap', gable: 'tulak_angen', gableSlot: 'gorga', gableBase: PLATE, gableAt: X + 0.35 });
  for (const z of [ROWS[1], ROWS[2]]) P('rangka_atap').add('wood', box(2 * X + 1.6, 0.18, 0.14, 0, PLATE + 1.05, z));
  for (const x of xs) P('rangka_atap').add('wood', box(0.14, 0.18, 2 * Z, x, PLATE + 0.09, 0));
  // A carved board along the foot of each gable
  for (const s of [-1, 1]) P('tulak_angen').add('gorga', box(0.06, 0.3, 2 * AZ - 0.6, s * (X + 0.38), PLATE + 0.12, 0, 'world', 1));

  return { parts, counts: { posts, rafters: roof.rafters } };
}

export const rumoh = {
  build, categories: CATEGORIES, parts: PARTS, sectionY: MID + 1.2,
  views: { inside: { pos: [4.2, F + 1.5, ROWS[0] - 0.6], target: [-4, F + 1.2, ROWS[0] - 1.0] } },
};
export const GEOM = { F, MID, PLATE, ROWS, X: HX + EDGE, Z: ROWS[0] + EDGE, RIDGE };
