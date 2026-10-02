// Alang: the Toraja rice barn, a small tongkonan on smooth round posts with a sitting
// platform between them. Alang stand in a row facing the houses across the yard.
// Local coordinates: the ridge runs along z, the front faces +z.
import * as THREE from 'three';
import { V, reseed, partStore, box } from '../../lib/geometry.js';
import { torajaRoof, buffaloHorns } from './banua.js';

export function makeAlang({ carved = true, seed = 1 } = {}) {
  const XS = [-0.85, 0.85], ZS = [-1.3, 0, 1.3];
  const DECK = 0.85, Y0 = 2.5, Y1 = 3.9;           // sitting platform, store floor, store top
  const BX = 1.15, BZ = 1.7;
  const ROOF = { len: 3.2, yR: 4.95, yE: 3.45, H: 1.5, d0: 1.95, t: 0.28, nu: 40, nv: 12 };
  const wall = carved ? 'passura' : 'plank';

  function build() {
    reseed(seed);
    const { parts, P } = partStore();

    // ── Tiang banga: round, polished palm-wood posts
    const T = P('tiang');
    for (const x of XS) for (const z of ZS) {
      T.add('stone', box(0.45, 0.16, 0.45, x, 0.08, z, 'stone', 1));
      T.add('wood', new THREE.CylinderGeometry(0.16, 0.17, Y0 - 0.16, 14).translate(x, 0.16 + (Y0 - 0.16) / 2, z));
    }
    for (const x of XS) T.add('wood', box(0.24, 0.26, 2 * BZ + 0.3, x, Y0 - 0.13, 0));

    // ── Sitting platform between the posts
    const D = P('bale');
    for (const x of XS) D.add('wood', box(0.12, 0.14, 2 * BZ - 0.2, x * 0.82, DECK - 0.1, 0));
    D.add('plank', box(1.5, 0.07, 2 * BZ - 0.3, 0, DECK, 0, 'wood'));

    // ── The store: a closed box with carved walls and a small door at the front
    const S = P('lumbung');
    S.add('plank', box(2 * BX, 0.1, 2 * BZ, 0, Y0 + 0.05, 0, 'wood'));
    for (const z of [-BZ, BZ]) S.add(wall, box(2 * BX, Y1 - Y0, 0.08, 0, (Y0 + Y1) / 2, z, 'world', 1.4));
    for (const x of [-BX, BX]) S.add(wall, box(0.08, Y1 - Y0, 2 * BZ, x, (Y0 + Y1) / 2, 0, 'world', 1.4));
    for (const x of [-BX, BX]) for (const z of [-BZ, BZ]) S.add('wood', box(0.14, Y1 - Y0 + 0.1, 0.14, x, (Y0 + Y1) / 2, z));
    S.add('accent', box(0.5, 0.55, 0.05, 0, Y0 + 0.75, BZ + 0.05));
    if (carved) buffaloHorns(S, V(0, Y1 - 0.15, BZ + 0.12), 0.7);

    // ── Roof and gables, like the house in miniature
    torajaRoof(P, ROOF, { roof: 'atap', ends: 'atap', frame: 'atap', gable: 'para', gableSlot: wall, gableAt: BZ + 0.05, gableBottom: Y1 });
    return { parts, counts: {} };
  }

  return {
    build,
    categories: [
      { id: 'base', label: 'Posts',  local: 'Tiang',  color: '#9a948a' },
      { id: 'body', label: 'Store',  local: 'Alang',  color: '#b3402f' },
      { id: 'roof', label: 'Roof',   local: 'Rattiang', color: '#6f8a5a' },
    ],
    parts: [
      {
        id: 'tiang', cat: 'base', name: 'Tiang Banga', alias: 'Tiang alang', en: 'Palm-wood posts',
        explode: [0, 0, 0], anchor: [0.85, 1.6, 1.3], focusDir: [1, 0.25, 0.7],
        desc: 'Six round posts of banga palm wood, smooth and polished, on flat stones.',
        fn: 'Lift the rice high off the ground. The posts are so smooth that rats cannot climb them.',
        meaning: 'The rice, the family’s life, is kept safe above the earth.',
        specs: ['6 posts', 'Banga palm'],
      },
      {
        id: 'bale', cat: 'base', name: 'Bale-bale', alias: 'Tempat duduk', en: 'Sitting platform',
        explode: [0, 0.4, 0], anchor: [-0.4, DECK + 0.1, 1.2], focusDir: [0.8, 0.4, 1],
        desc: 'A platform of boards between the posts, in the shade under the store.',
        fn: 'A place to sit, rest and work, and to receive guests. At ceremonies, guests are seated under the alang.',
        meaning: 'The barn is not only a store but part of the social life of the yard.',
        specs: ['Floor +0.85 m'],
      },
      {
        id: 'lumbung', cat: 'body', name: 'Kale Alang', alias: 'Lumbung', en: 'Rice store',
        explode: [0, 1.6, 0], anchor: [BX, 3.3, 0.6], focusDir: [1, 0.2, 0.5],
        desc: carved
          ? 'A closed box with walls carved and painted in passura’, entered by a small door at the front.'
          : 'A closed box of plain boards, entered by a small door at the front.',
        fn: 'Stores rice in the sheaf, dry and safe until it is needed.',
        meaning: carved ? 'Its carving matches the house it faces: the alang is the house’s partner.' : 'A working barn, plainer than the one before the main house.',
        specs: [`${2 * BX} × ${2 * BZ} m`, carved ? 'Carved' : 'Plain'],
      },
      {
        id: 'atap', cat: 'roof', name: 'Rattiang Alang', alias: 'Atap', en: 'Roof', roof: true,
        explode: [0, 3.0, 0], anchor: [1.6, 4.6, 0], focusDir: [1, 0.5, 0.3],
        desc: 'A small copy of the tongkonan’s curved roof, of layered bamboo.',
        fn: 'Keeps the rice dry.',
        meaning: 'The same prow-like form as the house: the barn belongs to the family’s tongkonan.',
        specs: ['Layered bamboo'],
      },
      {
        id: 'para', cat: 'roof', name: 'Dinding Ujung', alias: 'Tebeng', en: 'Gables',
        explode: [0, 2.4, 0], anchor: [0.6, Y1 + 0.6, BZ + 0.1], focusDir: [0.5, 0.2, 1],
        desc: carved ? 'Carved and painted triangular panels under both ends of the roof.' : 'Plain triangular panels under both ends of the roof.',
        fn: 'Close the roof space at the ends.',
        meaning: 'The face of the barn, turned towards the house.',
        specs: [carved ? 'Passura’ carving' : 'Plain boards'],
      },
    ],
    sectionY: Y0 + 0.6,
    views: { inside: { pos: [3.4, 1.2, 4.2], target: [0, 2.2, 0] } },
  };
}
