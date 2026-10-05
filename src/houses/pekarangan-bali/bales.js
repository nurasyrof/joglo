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
    walls: { en: 'Walls of red brick with a band of carved paras, a carved double door facing the courtyard and two small windows.', id: 'Tembok bata merah dengan pita paras berukir, pintu ganda berukir yang menghadap natah, dan dua jendela kecil.' },
    wallsFn: { en: 'A closed room for sleeping and for keeping heirlooms and valuables safe.', id: 'Ruang tertutup untuk tidur dan menyimpan pusaka serta barang berharga dengan aman.' },
    wallsMeaning: { en: 'The only fully enclosed bale, on the kaja (mountain) side, the most honoured side of the courtyard.', id: 'Satu-satunya bale yang sepenuhnya tertutup, di sisi kaja (gunung), sisi natah yang paling terhormat.' },
    platforms: { en: 'Two sleeping platforms, one on each side of the room.', id: 'Dua bale-bale untuk tidur, satu di setiap sisi ruang.' },
    platformsFn: { en: 'Beds for the head of the family and for the elders.', id: 'Tempat tidur bagi kepala keluarga dan para tetua.' },
    platformsMeaning: { en: 'Rest is taken on the side of the courtyard closest to the sacred mountain.', id: 'Beristirahat dilakukan di sisi natah yang paling dekat dengan gunung suci.' },
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
    platforms: { en: 'Two broad platforms filling the pavilion.', id: 'Dua bale-bale lebar yang memenuhi bale.' },
    platformsFn: { en: 'Offerings are laid out and rites of passage take place on them.', id: 'Persembahan ditata dan upacara daur hidup berlangsung di atasnya.' },
    platformsMeaning: { en: 'The family’s life-cycle ceremonies happen in full view of the courtyard.', id: 'Upacara daur hidup keluarga berlangsung di hadapan seluruh natah.' },
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
    platforms: { en: 'A wide platform at the back of the pavilion.', id: 'Bale-bale lebar di bagian belakang bale.' },
    platformsFn: { en: 'For receiving guests, for work and as a sleeping place for the young men of the house.', id: 'Untuk menerima tamu, bekerja, dan menjadi tempat tidur para pemuda rumah ini.' },
    platformsMeaning: { en: 'The most public of the bale, nearest the street side of the compound.', id: 'Bale yang paling publik, paling dekat dengan sisi jalan pekarangan.' },
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
        id: 'tembok_paon', cat: 'madya', name: 'Tembok Paon', alias: 'Dinding dapur', en: { en: 'Kitchen walls', id: 'Tembok dapur' },
        explode: [0, 2.0, -1.0], anchor: [-1.95, 1.5, -0.6],
        desc: { en: 'Brick walls on three sides; the front stays open to let smoke out and light in.', id: 'Tembok bata di tiga sisi; bagian depannya terbuka agar asap keluar dan cahaya masuk.' },
        fn: { en: 'Shelter the stove from wind.', id: 'Melindungi tungku dari angin.' }, meaning: { en: 'A working room, plainer than the bale for living and ceremony.', id: 'Ruang kerja, lebih sederhana daripada bale untuk tinggal dan upacara.' },
        specs: [{ en: 'Red brick', id: 'Bata merah' }, { en: 'Open front', id: 'Depan terbuka' }],
      },
      {
        id: 'jalikan', cat: 'madya', name: 'Jalikan', alias: 'Tungku tanah liat', en: { en: 'Clay stove', id: 'Tungku tanah liat' },
        explode: [0, 1.4, 1.2], anchor: [-0.6, 1.2, -0.9], focusDir: [0.3, 0.6, 1],
        desc: { en: 'A wood-fired stove of clay with openings for the pots, and a large water jar.', id: 'Tungku kayu bakar dari tanah liat dengan lubang untuk periuk, dan gentong air yang besar.' },
        fn: { en: 'Cooking for the household.', id: 'Memasak untuk rumah tangga.' },
        meaning: { en: 'Fire, smoke and daily work are kept on the kelod (seaward) side, away from the sacred kaja.', id: 'Api, asap, dan pekerjaan sehari-hari ditempatkan di sisi kelod (ke arah laut), jauh dari kaja yang suci.' },
        specs: [{ en: '2 fire holes', id: '2 lubang api' }, { en: 'Water jar', id: 'Gentong air' }],
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
    { id: 'nista', label: { en: 'Base', id: 'Kaki' }, local: 'Nista angga', color: '#9a948a' },
    { id: 'madya', label: { en: 'Body', id: 'Badan' }, local: 'Madya angga', color: '#c58a4a' },
    { id: 'utama', label: { en: 'Head', id: 'Kepala' }, local: 'Utama angga', color: '#b0624a' },
  ],
  parts: [
    {
      id: 'bebaturan', cat: 'nista', name: 'Bebaturan', alias: 'Bataran', en: { en: 'Low plinth', id: 'Bebaturan rendah' },
      explode: [0, 0, 0], anchor: [-1.4, 0.2, 1.4],
      desc: { en: 'A low base of brick and paras.', id: 'Alas rendah dari bata dan paras.' }, fn: { en: 'Keeps the posts out of standing water.', id: 'Menjauhkan tiang dari genangan air.' },
      meaning: { en: 'The feet of the barn.', id: 'Kaki lumbung.' }, specs: [{ en: 'Floor +0.30 m', id: 'Lantai +0,30 m' }],
    },
    {
      id: 'saka', cat: 'madya', name: 'Saka', alias: 'Tiang jineng', en: { en: 'Four posts', id: 'Empat tiang' },
      explode: [0, 0.8, 0], anchor: [0.95, 1.4, 0.95],
      desc: { en: 'Four round posts on stone bases carrying the store high above the ground.', id: 'Empat tiang bulat di atas alas batu yang memikul lumbung tinggi di atas tanah.' },
      fn: { en: 'Keep the rice dry and away from rats; traditionally the posts can be fitted with guards against climbing pests.', id: 'Menjaga padi tetap kering dan jauh dari tikus; secara tradisi tiangnya dapat dipasangi penghalang agar hama tidak memanjat.' },
      meaning: { en: 'A small building standing on its own, like the bale.', id: 'Bangunan kecil yang berdiri sendiri, seperti bale.' }, specs: [{ en: '4 posts', id: '4 tiang' }],
    },
    {
      id: 'bale_bale', cat: 'madya', name: 'Bale-bale', alias: 'Tempat duduk', en: { en: 'Platform beneath', id: 'Balai di bawah' },
      explode: [0, 0.6, 1.4], anchor: [0, 1.0, 0.9],
      desc: { en: 'A timber platform between the posts, under the store.', id: 'Balai kayu di antara tiang, di bawah lumbung.' },
      fn: { en: 'A shaded place to sit, rest and work, for example sorting the harvest.', id: 'Tempat teduh untuk duduk, beristirahat, dan bekerja, misalnya memilah hasil panen.' },
      meaning: { en: 'Nothing is wasted: the space under the barn becomes a small pavilion.', id: 'Tidak ada ruang yang terbuang: ruang di bawah lumbung menjadi bale kecil.' }, specs: ['2 × 2 m'],
    },
    {
      id: 'lumbung', cat: 'utama', name: 'Lumbung', alias: 'Ruang padi', en: { en: 'Rice store', id: 'Tempat padi' }, lift: true,
      explode: [0, 2.0, 0], anchor: [0.6, 3.2, 1.5], focusDir: [0.4, 0.3, 1],
      desc: { en: 'The store itself: a floor under the roof, closed by woven gable ends with a small door high on the front.', id: 'Lumbung itu sendiri: lantai di bawah atap, ditutup tebeng anyaman dengan pintu kecil di bagian atas depan.' },
      fn: { en: 'Holds bundles of rice from the harvest.', id: 'Menyimpan ikatan padi hasil panen.' },
      meaning: { en: 'Rice is life; it is stored in the head of the building, the highest and most honoured part.', id: 'Padi adalah kehidupan; ia disimpan di kepala bangunan, bagian tertinggi dan paling terhormat.' }, specs: [{ en: '1 door', id: '1 pintu' }],
    },
    {
      id: 'atap', cat: 'utama', name: 'Raab', alias: 'Atap jineng', en: { en: 'Rounded thatched roof', id: 'Atap alang-alang melengkung' }, roof: true, lift: true,
      explode: [0, 2.8, 0], anchor: [1.0, 4.4, 0],
      desc: { en: 'A steep, rounded roof of alang-alang thatch that forms the walls of the store.', id: 'Atap alang-alang yang curam dan melengkung, sekaligus menjadi dinding lumbung.' },
      fn: { en: 'Sheds rain and keeps the harvest dry.', id: 'Mengalirkan hujan dan menjaga hasil panen tetap kering.' },
      meaning: { en: 'Its distinctive curved shape makes the jineng easy to recognise.', id: 'Bentuk lengkungnya yang khas membuat jineng mudah dikenali.' }, specs: [{ en: 'Alang-alang thatch', id: 'Atap alang-alang' }],
    },
  ],
  sectionY: 2.8,
  views: { inside: { pos: [2.2, 1.4, 2.8], target: [0, 1.4, 0] } },
};
