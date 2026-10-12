// The betang itself: one long house of ironwood on tall posts. A hall (los) fills the
// middle; at each end four rooms (karung) open off a passage. The proportions follow
// Betang Toyoi at Tumbang Malahoi as measured by Restyanto (2012): 36 × 9.75 m, floor
// 2.3 m up, 3.3 m from floor to roof frame.
// Local coordinates: the long axis is x, the front and the main stair face +z.
import * as THREE from 'three';
import { V, reseed, partStore, box, beam, slab } from '../../lib/geometry.js';
import { wallRun, opening, gableRoof } from '../../lib/kit.js';
import { F, WALL, SLOPE, post, boards, barkWall, notchedLog } from './kit.js';
import { PARTS, CATEGORIES } from './betang-parts.js';

export const LEN = 18, DEP = 4.875;            // half length and half depth
const TOP = 5.6;                                // top of the posts: floor + 3.3 m
const RIDGE = 7.7;                              // 1.9 m above the wall zone
const FRAMES = [-17.8, -14, -10, -6, -2, 2, 6, 10, 14, 17.8];
const ROW = 4.7;                                // outer rows of posts
const NAVE = 2.2;                               // the four great posts stand 4.4 m apart
const PASS = 1.75;                              // half-width of the passage in the wings
const HALL = 10;                                // the hall runs from −10 to +10
export const BACK_DOORS = { kitchen: 5, stair: -5 };

// A tiger on top of a post, facing +z.
function tiger(part, x, y, z) {
  part.add('ornament', box(0.24, 0.26, 0.62, x, y + 0.36, z, 'stone', 1));
  part.add('ornament', box(0.26, 0.26, 0.26, x, y + 0.5, z + 0.4, 'stone', 1));
  for (const sx of [-1, 1]) {
    part.add('ornament', box(0.07, 0.1, 0.05, x + sx * 0.09, y + 0.67, z + 0.36, 'stone', 1));
    for (const sz of [-0.22, 0.22]) part.add('ornament', box(0.08, 0.26, 0.08, x + sx * 0.08, y + 0.13, z + sz, 'stone', 1));
  }
  part.add('ornament', beam(V(x, y + 0.42, z - 0.3), V(x, y + 0.72, z - 0.5), 0.05, 0.05));
}

function build() {
  reseed(901);
  const { parts, P } = partStore();

  // ── Bawah: the posts, the floor frame and the stairs
  const J = P('jihi'), T = P('tungket');
  let jihi = 0, tungket = 0;
  for (const x of FRAMES) {
    for (const z of [-ROW, ROW]) { J.add('wood', post(0.2, 0, TOP, x, z)); jihi++; }
    if (Math.abs(x) >= HALL) for (const z of [-PASS, PASS]) { J.add('wood', post(0.2, 0, TOP, x, z)); jihi++; }
  }
  // The four great posts in the middle of the hall; the largest stands front right.
  for (const x of [-2, 2]) for (const z of [-NAVE, NAVE]) {
    const agung = x > 0 && z > 0;
    P('jihi_bakas').add('wood', post(agung ? 0.285 : 0.23, 0, TOP + 0.45, x, z, 10));
    jihi++;
  }
  for (let k = 0; k < FRAMES.length - 1; k++) {
    const x = (FRAMES[k] + FRAMES[k + 1]) / 2;
    for (const z of [-ROW, -NAVE, NAVE, ROW]) { T.add('wood', post(0.11, 0, F - 0.4, x, z)); tungket++; }
  }
  for (const x of [-6, 6]) for (const z of [-NAVE, NAVE]) { T.add('wood', post(0.11, 0, F - 0.4, x, z)); tungket++; }

  const B = P('bahat');
  for (const z of [-ROW, -NAVE, NAVE, ROW]) B.add('wood', box(2 * LEN, 0.22, 0.16, 0, F - 0.29, z));
  let joists = 0;
  for (let x = -LEN + 0.25; x < LEN; x += 0.5) { B.add('wood', box(0.08, 0.14, 2 * DEP, x, F - 0.105, 0)); joists++; }

  // Main stair: two flights with a landing, eleven steps of solid ironwood, a metre wide
  const H = P('hejan');
  const rise = F / 13, z0 = DEP + 0.12;
  const step = (k, y, z) => H.add('wood', box(1.0, 0.09, rise + 0.06, 0, y - 0.045, z));
  for (let k = 1; k <= 5; k++) step(k, F - k * rise, z0 + (k - 0.5) * rise);
  const land = { y: F - 6 * rise, z: z0 + 5 * rise + 0.5 };
  H.add('wood', box(1.3, 0.1, 1.0, 0, land.y - 0.05, land.z));
  for (let k = 1; k <= 6; k++) step(k, land.y - k * rise, land.z + 0.5 + (k - 0.5) * rise);
  const foot = land.z + 0.5 + 6 * rise;
  for (const s of [-1, 1]) {
    H.add('wood', beam(V(s * 0.56, F - 0.14, z0 - 0.1), V(s * 0.56, land.y - 0.12, land.z - 0.5), 0.1, 0.22));
    H.add('wood', beam(V(s * 0.56, land.y - 0.12, land.z + 0.5), V(s * 0.56, 0.02, foot + 0.1), 0.1, 0.22));
    H.add('wood', post(0.1, 0, land.y - 0.1, s * 0.78, land.z));
    // Haramaung: a tiger on a tall post at either side of the stair
    P('haramaung').add('wood', post(0.13, 0, 2.6, s * 1.25, land.z, 8));
    tiger(P('haramaung'), s * 1.25, 2.55, land.z);
  }
  H.add('wood', box(1.9, 0.14, 0.14, 0, land.y - 0.17, land.z));

  notchedLog(P('tangga_belakang'), V(BACK_DOORS.stair, 0, -DEP - 2.5), V(BACK_DOORS.stair, F - 0.1, -DEP - 0.15), 9);

  // ── Tengah: floor boards, bark walls, the rooms
  const boardsN = boards(P('laseh'), 'plank', -LEN, LEN, -DEP, DEP, F);

  const D = P('dinding');
  const win = (c) => ({ c, w: 0.6, h: 0.7, sill: 1.12 });
  const frontOps = [{ c: 0, w: 1.2, h: 2.0 }, ...[-16.5, -12.5, -6, 6, 12.5, 16.5].map(win)];
  const backOps = [{ c: BACK_DOORS.stair, w: 0.9, h: 1.9 }, { c: BACK_DOORS.kitchen, w: 1.0, h: 1.9 }, ...[-16.5, -12.5, 12.5, 16.5].map(win)];
  barkWall(D, { axis: 'x', at: DEP, from: -LEN, to: LEN, out: 1, openings: frontOps, top: TOP });
  barkWall(D, { axis: 'x', at: -DEP, from: -LEN, to: LEN, out: -1, openings: backOps, top: TOP });
  for (const s of [-1, 1]) barkWall(D, { axis: 'z', at: s * LEN, from: -DEP, to: DEP, out: s, openings: [win(0)], top: TOP });
  // The main door: one thick leaf on pivots, barred from inside
  opening(P('pintu'), { at: DEP, c: 0, w: 1.2, h: 2.0, y0: F, leaves: 1, open: 1.1, t: 0.1, leafSlot: 'plank' });
  P('pintu').add('wood', box(1.6, 0.14, 0.1, -1.55, F + 1.05, DEP - 0.14));          // the bar, slid aside

  const K = P('karung');
  const part = (o) => wallRun(K, 'plank', { y0: F, h: WALL, t: 0.05, ...o });
  for (const s of [-1, 1]) {
    part({ axis: 'z', at: s * HALL, from: -DEP, to: DEP, openings: [{ c: 0, w: 1.3, h: 1.9 }] });
    for (const z of [-PASS, PASS]) {
      const from = Math.min(s * HALL, s * LEN), to = Math.max(s * HALL, s * LEN);
      part({ axis: 'x', at: z, from, to, openings: [{ c: s * 12.5, w: 0.8, h: 1.8 }, { c: s * 16.4, w: 0.8, h: 1.8 }] });
    }
    for (const [a, b] of [[-DEP, -PASS], [PASS, DEP]]) part({ axis: 'z', at: s * 15, from: a, to: b });
    // Two small rooms at the back of the hall: one for guests, one for heirlooms
    const x0 = Math.min(s * 7.3, s * HALL), x1 = Math.max(s * 7.3, s * HALL);
    part({ axis: 'x', at: -DEP + 1.8, from: x0, to: x1, openings: [{ c: s * 8.6, w: 0.8, h: 1.8 }] });
    part({ axis: 'z', at: s * 7.3, from: -DEP, to: -DEP + 1.8 });
  }

  // ── Atas: trusses, purlins, shingle roof, gable ends
  const Kd = P('kuda_kuda');
  const under = (z) => RIDGE - 0.2 - SLOPE * Math.abs(z);
  for (const x of FRAMES) {
    Kd.add('wood', box(0.23, 0.3, 2 * ROW + 0.5, x, TOP + 0.15, 0));
    for (const z of [-NAVE, 0, NAVE]) Kd.add('wood', box(0.15, under(z) - TOP - 0.3, 0.16, x, (under(z) + TOP + 0.3) / 2, z));
    for (const s of [-1, 1]) Kd.add('wood', beam(V(x, under(ROW) - 0.1, s * ROW), V(x, under(0) - 0.1, 0), 0.19, 0.19));
  }
  for (const z of [-ROW + 0.4, -NAVE, NAVE, ROW - 0.4]) {
    Kd.add('wood', new THREE.CylinderGeometry(0.09, 0.09, 2 * LEN + 0.6, 8).rotateZ(Math.PI / 2).translate(0, under(z) + 0.08, z));
  }

  const AZ = DEP + 0.65, y0 = RIDGE - SLOPE * AZ;
  const roof = gableRoof(P, { AX: LEN + 0.6, AZ, y0, y1: RIDGE, t: 0.08, roof: 'atap', frame: 'rangka_atap', gable: 'tawing', gableSlot: 'plank', gableBase: TOP + 0.3, gableAt: LEN - 0.03 });
  // A short lean-to roof under each gable
  for (const s of [-1, 1]) {
    const q = [V(s * (LEN + 1.3), TOP - 0.25, s * AZ), V(s * (LEN + 1.3), TOP - 0.25, -s * AZ), V(s * LEN, TOP + 0.28, -s * AZ), V(s * LEN, TOP + 0.28, s * AZ)];
    const sl = slab(q, 0.08);
    P('atap').add('roof', sl.top).add('plank', sl.under);
    // Peep-holes in the gable, once used to look out without being seen
    for (const z of [-0.9, 0.9]) P('tawing').add('dark', new THREE.CylinderGeometry(0.075, 0.075, 0.1, 14).rotateZ(Math.PI / 2).translate(s * (LEN - 0.03), TOP + 0.95, z));
  }

  return { parts, counts: { jihi, tungket, posts: jihi + tungket, joists, boards: boardsN, rafters: roof.rafters, trusses: FRAMES.length } };
}

export const betang = {
  build, categories: CATEGORIES, parts: PARTS, sectionY: F + 1.4,
  views: { inside: { pos: [-8.5, F + 1.6, 3.2], target: [3, F + 1.5, -0.6] } },
};
