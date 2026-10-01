// The bale of the compound, each built from makeBale, plus the jineng (rice barn).
import * as THREE from 'three';
import { V, reseed, partStore, box, frame, lathe, saddleRoof, gablePanel } from '../../lib/geometry.js';
import { grid, wallRun } from '../../lib/kit.js';
import { makeBale, bebaturan } from './bale.js';

const POT = [[0, 0], [0.15, 0], [0.22, 0.1], [0.24, 0.2], [0.18, 0.3], [0.2, 0.34], [0, 0.34]];
const JAR = [[0, 0], [0.2, 0], [0.32, 0.22], [0.34, 0.48], [0.26, 0.7], [0.22, 0.76], [0, 0.76]];

// Bale Meten: the closed sleeping house on the kaja side. Sakutus: 8 posts.
export const baleMeten = makeBale({
  seed: 101,
  posts: grid([-2.7, -0.9, 0.9, 2.7], [-1.3, 1.3]),
  plinth: { w: 7.6, d: 5.2, h: 1.0 },
  postH: 2.6, o: 0.8, k: 1.5,
  walls: { x: 2.9, back: -1.5, front: 1.5, door: { c: 0, w: 0.95, h: 1.9 }, windows: [-1.9, 1.9] },
  platforms: [{ x: -1.75, z: -0.35, w: 1.9, d: 1.9, h: 0.45 }, { x: 1.75, z: -0.35, w: 1.9, d: 1.9, h: 0.45 }],
  inside: { pos: [1.9, 2.6, 0.9], target: [-2.0, 1.5, -0.7] },
  text: {
    postName: 'Sakutus',
    walls: 'Walls of red brick with a band of carved paras, a carved double door facing the courtyard and two small windows.',
    wallsFn: 'A closed room for sleeping and for keeping heirlooms and valuables safe.',
    wallsMeaning: 'The only fully enclosed bale, on the kaja (mountain) side, the most honoured side of the courtyard.',
    platforms: 'Two sleeping platforms, one on each side of the room.',
    platformsFn: 'Beds for the head of the family and for the elders.',
    platformsMeaning: 'Rest is taken on the side of the courtyard closest to the sacred mountain.',
  },
});

// Bale Dangin: the open ceremonial pavilion on the east. Saka roras: 12 posts.
export const baleDangin = makeBale({
  seed: 102,
  posts: grid([-2.4, -0.8, 0.8, 2.4], [-1.6, 0, 1.6]),
  plinth: { w: 6.4, d: 5.0, h: 0.9 },
  postH: 2.6, o: 0.9, k: 1.35,
  platforms: [{ x: -1.22, z: 0, w: 2.1, d: 3.0, h: 0.55 }, { x: 1.22, z: 0, w: 2.1, d: 3.0, h: 0.55 }],
  inside: { pos: [3.6, 2.4, 3.6], target: [-0.5, 1.6, -0.6] },
  text: {
    postName: 'Saka roras',
    platforms: 'Two broad platforms filling the pavilion.',
    platformsFn: 'Offerings are laid out and rites of passage take place on them.',
    platformsMeaning: 'The family’s life-cycle ceremonies happen in full view of the courtyard.',
  },
});

// Bale Dauh: the open pavilion on the west. Tiang sanga: 9 posts.
export const baleDauh = makeBale({
  seed: 103,
  posts: grid([-1.7, 0, 1.7], [-1.7, 0, 1.7]),
  plinth: { w: 5.0, d: 5.0, h: 0.6 },
  postH: 2.6, o: 0.9, k: 1.4,
  platforms: [{ x: 0, z: -0.75, w: 3.2, d: 2.0, h: 0.5 }],
  inside: { pos: [2.6, 2.1, 3.0], target: [-0.4, 1.2, -0.8] },
  text: {
    postName: 'Tiang sanga',
    platforms: 'A wide platform at the back of the pavilion.',
    platformsFn: 'For receiving guests, for work and as a sleeping place for the young men of the house.',
    platformsMeaning: 'The most public of the bale, nearest the street side of the compound.',
  },
});

// Paon: the kitchen on the kelod (seaward) side, with a clay stove (jalikan).
export const paon = makeBale({
  seed: 104,
  posts: grid([-1.8, 0, 1.8], [-1.2, 1.2]),
  plinth: { w: 4.8, d: 3.6, h: 0.35 },
  postH: 2.5, o: 0.8, k: 1.3,
  inside: { pos: [1.5, 1.8, 2.6], target: [-0.6, 0.8, -1.0] },
  extra: (P, { F }) => {
    const W = P('tembok_paon');
    wallRun(W, 'bata', { axis: 'x', at: -1.38, from: -1.95, to: 1.95, y0: F, h: 1.9, t: 0.2, mode: 'world' });
    for (const s of [-1, 1]) wallRun(W, 'bata', { axis: 'z', at: s * 1.95, from: -1.38, to: 0.2, y0: F, h: 1.9, t: 0.2, mode: 'world' });
    const J = P('jalikan');
    J.add('clay', box(1.6, 0.6, 0.6, -0.6, F + 0.3, -0.9, 'stone', 1));
    for (const x of [-1.05, -0.2]) J.add('clay', lathe(POT, V(x, F + 0.6, -0.9), null, 14));
    J.add('clay', lathe(JAR, V(1.35, F, -0.85), null, 16));
  },
  text: {
    extraParts: [
      {
        id: 'tembok_paon', cat: 'madya', name: 'Tembok Paon', alias: 'Dinding dapur', en: 'Kitchen walls',
        explode: [0, 2.0, -1.0], anchor: [-1.95, 1.5, -0.6],
        desc: 'Brick walls on three sides; the front stays open to let smoke out and light in.',
        fn: 'Shelter the stove from wind.', meaning: 'A working room, plainer than the bale for living and ceremony.',
        specs: ['Red brick', 'Open front'],
      },
      {
        id: 'jalikan', cat: 'madya', name: 'Jalikan', alias: 'Tungku tanah liat', en: 'Clay stove',
        explode: [0, 1.4, 1.2], anchor: [-0.6, 1.2, -0.9], focusDir: [0.3, 0.6, 1],
        desc: 'A wood-fired stove of clay with openings for the pots, and a large water jar.',
        fn: 'Cooking for the household.',
        meaning: 'Fire, smoke and daily work are kept on the kelod (seaward) side, away from the sacred kaja.',
        specs: ['2 fire holes', 'Water jar'],
      },
    ],
  },
});

// Jineng: rice barn with a rounded thatch roof over the store, and a sitting platform beneath.
function buildJineng() {
  reseed(105);
  const { parts, P } = partStore();
  const F = 0.3;
  bebaturan(P('bebaturan'), { w: 2.8, d: 2.8, h: F, front: false });
  const posts = [[-0.95, -0.95], [0.95, -0.95], [-0.95, 0.95], [0.95, 0.95]];
  for (const [x, z] of posts) {
    P('saka').add('paras', box(0.3, 0.25, 0.3, x, F + 0.125, z, 'stone', 1));
    P('saka').add('wood', new THREE.CylinderGeometry(0.1, 0.11, 1.75, 10).translate(x, F + 0.25 + 0.875, z));
  }
  frame(P('saka'), 'wood', 0.95, 0.95, F + 2.06, 0.16, 0.16, 0.3);
  P('bale_bale').add('plank', box(2.0, 0.08, 2.0, 0, F + 0.55, 0, 'wood'));
  const L = P('lumbung');
  L.add('plank', box(2.5, 0.1, 2.5, 0, F + 2.2, 0, 'wood'));
  // Rounded saddle roof with the ridge running front to back; gable ends close the store.
  const roof = saddleRoof({
    axis: 'z', cx: 0, cz: 0, len: 1.55, yR: 5.4, yE: F + 2.25, H: 0, pinch: 0, converge: false,
    d0: 1.75, ends: 'both', t: 0.28, gamma: 1.7, nu: 16, nv: 18,
  });
  P('atap').add('thatch', roof.main);
  if (roof.horn) P('atap').add('thatch', roof.horn);
  for (const s of [-1, 1]) {
    const at = s * 1.38;
    const pts = [];
    for (let k = 0; k <= 16; k++) {
      const v = -1 + (2 * k) / 16;
      const p = roof.surf(s * (1.38 / 1.55), v, 0.3);
      pts.push([p.x, p.y]);
    }
    L.add('bamboo', gablePanel([[-1.6, F + 2.25], ...pts.filter(([x]) => Math.abs(x) <= 1.6), [1.6, F + 2.25]], 0.06, 'z', at));
  }
  L.add('accent', box(0.5, 0.55, 0.05, 0, F + 3.0, 1.42)).add('wood', box(0.64, 0.69, 0.03, 0, F + 3.0, 1.4));
  return { parts, counts: {} };
}

export const jineng = {
  build: buildJineng,
  categories: [
    { id: 'nista', label: 'Base', local: 'Nista angga', color: '#9a948a' },
    { id: 'madya', label: 'Body', local: 'Madya angga', color: '#c58a4a' },
    { id: 'utama', label: 'Head', local: 'Utama angga', color: '#b0624a' },
  ],
  parts: [
    {
      id: 'bebaturan', cat: 'nista', name: 'Bebaturan', alias: 'Bataran', en: 'Low plinth',
      explode: [0, 0, 0], anchor: [-1.4, 0.2, 1.4],
      desc: 'A low base of brick and paras.', fn: 'Keeps the posts out of standing water.',
      meaning: 'The feet of the barn.', specs: ['Floor +0.30 m'],
    },
    {
      id: 'saka', cat: 'madya', name: 'Saka', alias: 'Tiang jineng', en: 'Four posts',
      explode: [0, 0.8, 0], anchor: [0.95, 1.4, 0.95],
      desc: 'Four round posts on stone bases carrying the store high above the ground.',
      fn: 'Keep the rice dry and away from rats; traditionally the posts can be fitted with guards against climbing pests.',
      meaning: 'A small building standing on its own, like the bale.', specs: ['4 posts'],
    },
    {
      id: 'bale_bale', cat: 'madya', name: 'Bale-bale', alias: 'Tempat duduk', en: 'Platform beneath',
      explode: [0, 0.6, 1.4], anchor: [0, 1.0, 0.9],
      desc: 'A timber platform between the posts, under the store.',
      fn: 'A shaded place to sit, rest and work, for example sorting the harvest.',
      meaning: 'Nothing is wasted: the space under the barn becomes a small pavilion.', specs: ['2 × 2 m'],
    },
    {
      id: 'lumbung', cat: 'utama', name: 'Lumbung', alias: 'Ruang padi', en: 'Rice store', lift: true,
      explode: [0, 2.0, 0], anchor: [0.6, 3.2, 1.5], focusDir: [0.4, 0.3, 1],
      desc: 'The store itself: a floor under the roof, closed by woven gable ends with a small door high on the front.',
      fn: 'Holds bundles of rice from the harvest.',
      meaning: 'Rice is life; it is stored in the head of the building, the highest and most honoured part.', specs: ['1 door'],
    },
    {
      id: 'atap', cat: 'utama', name: 'Raab', alias: 'Atap jineng', en: 'Rounded thatched roof', roof: true, lift: true,
      explode: [0, 2.8, 0], anchor: [1.0, 4.4, 0],
      desc: 'A steep, rounded roof of alang-alang thatch that forms the walls of the store.',
      fn: 'Sheds rain and keeps the harvest dry.',
      meaning: 'Its distinctive curved shape makes the jineng easy to recognise.', specs: ['Alang-alang thatch'],
    },
  ],
  sectionY: 2.8,
  views: { inside: { pos: [2.2, 1.4, 2.8], target: [0, 1.4, 0] } },
};
