// The compound's boundary: angkul-angkul (gateway), aling-aling (screen wall),
// penyengker (perimeter wall) and the natah (central courtyard). Built in site coordinates.
import { reseed, partStore, box } from '../../lib/geometry.js';
import { mergeStore, steps, wallRun, opening } from '../../lib/kit.js';
import { thatchHip } from './bale.js';

export const WALL = { x: 15, z: 15, gate: -3 };

function build() {
  reseed(1001);
  const { parts, P } = partStore();
  const { x: X, z: Z, gate: G } = WALL;
  const H = 2.0, T = 0.4;

  // ── Penyengker: brick wall with paras coping all round, open at the gateway
  const W = P('penyengker');
  const wall = (o) => wallRun(W, 'bata', { y0: 0, h: H, t: T, mode: 'world', ...o });
  wall({ axis: 'x', at: Z, from: -X, to: X, openings: [{ c: G, w: 3.0, h: H }] });
  wall({ axis: 'x', at: -Z, from: -X, to: X });
  for (const s of [-1, 1]) wall({ axis: 'z', at: s * X, from: -Z, to: Z });
  for (const [a, b] of [[-X, G - 1.5], [G + 1.5, X]]) W.add('paras', box(b - a, 0.14, T + 0.16, (a + b) / 2, H + 0.07, Z, 'stone', 1));
  W.add('paras', box(2 * X + 0.4, 0.14, T + 0.16, 0, H + 0.07, -Z, 'stone', 1));
  for (const s of [-1, 1]) W.add('paras', box(T + 0.16, 0.14, 2 * Z, s * X, H + 0.07, 0, 'stone', 1));

  // ── Angkul-angkul: roofed gateway of brick and carved paras, with steps and double doors
  const A = P('angkul_angkul');
  for (const s of [-1, 1]) {
    A.add('bata', box(1.0, 2.6, 1.0, G + s * 1.5, 1.3, Z, 'world', 1));
    A.add('paras', box(1.15, 0.18, 1.15, G + s * 1.5, 2.69, Z, 'stone', 1));
    A.add('paras', box(1.12, 0.3, 1.12, G + s * 1.5, 0.15, Z, 'stone', 1));
  }
  A.add('paras', box(2.0, 0.2, 1.0, G, 0.1, Z, 'stone', 1));
  steps(A, { x: G, z: Z + 0.5, w: 2.0, h: 0.2, n: 1, run: 0.4, slot: 'paras' });
  opening(A, { at: Z, c: G, w: 2.0, h: 2.2, y0: 0.2, leaves: 2, open: 1.25, t: 0.3, leafSlot: 'accent' });
  const roof = partStore();
  thatchHip(roof.P, { px: 1.5, pz: 0.5, o: 0.7, k: 1.05, top: 2.35, roof: 'angkul_angkul', frame: 'angkul_angkul', crown: 'angkul_angkul', t: 0.22 });
  mergeStore(P, roof.parts, { dx: G, dz: Z });

  // ── Aling-aling: freestanding screen wall just inside the gateway
  const S = P('aling_aling');
  S.add('paras', box(4.3, 0.2, 0.55, G, 0.1, Z - 2.4, 'stone', 1));
  S.add('bata', box(4.0, 1.7, 0.35, G, 1.05, Z - 2.4, 'world', 1));
  S.add('paras', box(4.3, 0.16, 0.5, G, 1.98, Z - 2.4, 'stone', 1));

  // ── Natah: the open courtyard at the centre of the compound
  P('natah').add('ground', box(2 * X - 0.5, 0.04, 2 * Z - 0.5, 0, 0.02, 0, 'world', 3));
  return { parts, counts: {} };
}

export const gate = {
  build,
  categories: [{ id: 'bound', label: 'Boundary', local: 'Wates', color: '#9a948a' }],
  parts: [
    {
      id: 'angkul_angkul', cat: 'bound', name: 'Angkul-angkul', alias: 'Pamesuan', en: 'Roofed gateway',
      explode: [0, 1.2, 0], anchor: [-1.2, 3.4, 15.5], focusDir: [0.4, 0.3, 1],
      desc: 'The gateway of the compound: two piers of brick and carved paras, a pair of carved doors and a small thatched roof, reached by a step from the street.',
      fn: 'The everyday way in and out of the household.',
      meaning: 'The family’s face to the street; its carving and size show the household’s standing.',
      specs: ['Thatched roof', 'Double doors'],
    },
    {
      id: 'aling_aling', cat: 'bound', name: 'Aling-aling', alias: 'Tembok penghalang', en: 'Screen wall',
      explode: [0, 1.0, 0], anchor: [-3, 2.4, 12.6], focusDir: [0.3, 0.3, 1],
      desc: 'A short freestanding wall a few steps inside the gateway, so you must turn to enter the courtyard.',
      fn: 'Keeps the courtyard private from the street.',
      meaning: 'By tradition it also keeps out evil spirits, which are said to travel only in straight lines.',
      specs: ['4 m long'],
    },
    {
      id: 'penyengker', cat: 'bound', name: 'Penyengker', alias: 'Tembok keliling', en: 'Compound wall',
      explode: [0, 0.6, 0], anchor: [-14.8, 2.4, 6],
      desc: 'A wall of red brick with paras coping around the whole compound.',
      fn: 'Encloses the family’s ground and gives privacy.',
      meaning: 'It defines the pekarangan as one world, ordered inside by the Sanga Mandala.',
      specs: ['2 m high', '30 × 30 m'],
    },
    {
      id: 'natah', cat: 'bound', name: 'Natah', alias: 'Halaman tengah', en: 'Central courtyard', pick: false,
      explode: [0, 0, 0], anchor: [-2, 0.3, 4],
      desc: 'The open courtyard at the centre of the compound, which every bale faces.',
      fn: 'Daily life, work and ceremonies spill out here from the bale around it.',
      meaning: 'The empty centre that holds the compound together; it is often described as the meeting of sky and earth.',
      specs: ['Open ground'],
    },
  ],
  sectionY: 1.2,
  views: { inside: { pos: [-3, 1.7, 21], target: [-3, 2, 14] } },
};
