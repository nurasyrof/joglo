// Around the house: the krong padé (rice granary), the fence and gateway of the yard, the
// yard itself and its shade trees. Built in site coordinates; north is +z.
import * as THREE from 'three';
import { V, reseed, rand, partStore, box, beam } from '../../lib/geometry.js';
import { wallRun } from '../../lib/kit.js';

export const YARD = { x: 15, z0: -12, z1: 14, gate: 1.4 };
export const KRONG = [9.6, -5.6];
const TREES = [[-11.5, 9.5, 1.1], [-13, 2.5, 0.9], [-12, -8.5, 1.2], [5.5, -10, 0.95]];

function buildKrong() {
  reseed(311);
  const { parts, P } = partStore();
  const [cx, cz] = KRONG, base = 0.9;
  // A raised platform on four short posts
  for (const dx of [-1, 1]) for (const dz of [-1, 1]) {
    P('tiang').add('stone', box(0.4, 0.12, 0.4, cx + dx * 0.95, 0.06, cz + dz * 0.95, 'stone', 1));
    P('tiang').add('wood', new THREE.CylinderGeometry(0.11, 0.12, base - 0.12, 8).translate(cx + dx * 0.95, 0.12 + (base - 0.12) / 2, cz + dz * 0.95));
  }
  P('tiang').add('plank', box(2.4, 0.08, 2.4, cx, base + 0.04, cz));
  // The bin: a drum of woven bamboo holding unhusked rice
  const bin = new THREE.CylinderGeometry(1.0, 0.92, 1.9, 24, 1, true);
  const uv = bin.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 6.3, uv.getY(i) * 1.9);
  P('krong').add('bamboo', bin.translate(cx, base + 1.03, cz));
  for (const y of [0.35, 1.0, 1.65]) P('krong').add('rattan', new THREE.TorusGeometry(0.98, 0.03, 5, 40).rotateX(Math.PI / 2).translate(cx, base + 0.08 + y, cz));
  P('krong').add('plank', new THREE.CylinderGeometry(1.0, 1.0, 0.05, 24).translate(cx, base + 1.97, cz));
  // A little thatched roof on its own posts
  for (const dx of [-1, 1]) for (const dz of [-1, 1]) P('bubong').add('wood', box(0.08, 3.4 - base, 0.08, cx + dx * 1.15, base + (3.4 - base) / 2, cz + dz * 1.15));
  const roof = new THREE.ConeGeometry(2.0, 1.5, 4, 1, true).rotateY(Math.PI / 4);
  const ru = roof.attributes.uv;
  for (let i = 0; i < ru.count; i++) ru.setXY(i, ru.getX(i) * 4, ru.getY(i) * 2);
  P('bubong').add('roof', roof.translate(cx, 3.4 + 0.75, cz));
  return { parts, counts: {} };
}

function tree(part, x, z, s) {
  const h = 3.4 * s;
  part.add('wood', new THREE.CylinderGeometry(0.22 * s, 0.32 * s, h, 8).translate(x, h / 2, z));
  for (const [dx, dy, dz, r] of [[0, 1.6, 0, 2.2], [1.3, 0.9, 0.4, 1.6], [-1.2, 1.0, -0.3, 1.7], [0.2, 2.6, -0.8, 1.5]]) {
    part.add('leaf', new THREE.IcosahedronGeometry(r * s, 1).scale(1, 0.75, 1).translate(x + dx * s, h + dy * s, z + dz * s));
  }
}

function buildYard() {
  reseed(312);
  const { parts, P } = partStore();
  const { x: X, z0, z1, gate } = YARD;
  P('halaman').add('yard', box(2 * X, 0.04, z1 - z0, 0, 0.02, (z0 + z1) / 2, 'world', 3));
  P('halaman').add('ground', box(2 * X + 24, 0.03, z1 - z0 + 20, 0, 0.01, (z0 + z1) / 2, 'world', 3));
  for (const [x, z, s] of TREES) tree(P('pohon'), x, z, s);

  // A fence of woven bamboo between timber posts, round the house yard
  const Pg = P('pageue');
  const fence = (o) => wallRun(Pg, 'bamboo', { y0: 0.1, h: 1.2, t: 0.04, mode: 'world', ...o });
  fence({ axis: 'x', at: z0, from: -X, to: X });
  fence({ axis: 'x', at: z1, from: -X, to: X, openings: [{ c: 0, w: 2 * gate, h: 1.2 }] });
  for (const s of [-1, 1]) fence({ axis: 'z', at: s * X, from: z0, to: z1 });
  let n = 0;
  for (let x = -X; x <= X + 0.01; x += 2.5) for (const z of [z0, z1]) if (z === z0 || Math.abs(x) > gate + 0.1) { Pg.add('wood', box(0.12, 1.5, 0.12, x, 0.75, z)); n++; }
  for (let z = z0 + 2.5; z < z1; z += 2.5) for (const s of [-1, 1]) { Pg.add('wood', box(0.12, 1.5, 0.12, s * X, 0.75, z)); n++; }

  // Keupaleh: a small roofed gateway at the entrance
  const G = P('keupaleh');
  for (const s of [-1, 1]) G.add('wood', box(0.2, 2.6, 0.2, s * gate, 1.3, z1));
  G.add('wood', box(2 * gate + 0.6, 0.18, 0.24, 0, 2.55, z1));
  for (const s of [-1, 1]) {
    const q = [V(-gate - 0.7, 2.6, z1 + s * 1.1), V(gate + 0.7, 2.6, z1 + s * 1.1), V(gate + 0.7, 3.6, z1), V(-gate - 0.7, 3.6, z1)];
    const g = new THREE.BufferGeometry().setFromPoints([q[0], q[1], q[2], q[0], q[2], q[3]]);
    g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 3, 0, 3, 1.4, 0, 0, 3, 1.4, 0, 1.4], 2));
    g.computeVertexNormals();
    G.add('roof', g);
  }
  G.add('ornament', box(2 * gate + 1.5, 0.12, 0.2, 0, 3.62, z1, 'stone', 1));
  G.add('gorga', box(2 * gate - 0.1, 0.35, 0.05, 0, 2.3, z1 + 0.13, 'world', 1));
  return { parts, counts: { posts: n } };
}

export const krong = {
  build: buildKrong,
  categories: [{ id: 'lumbung', label: { en: 'Granary', id: 'Lumbung' }, local: 'Krong padé', color: '#c58a4a' }],
  parts: [
    {
      id: 'tiang', cat: 'lumbung', name: 'Tiang & Lantai', alias: 'Panggung lumbung', en: { en: 'Platform', id: 'Panggung' },
      explode: [0, 0, 0], anchor: [KRONG[0] + 1.2, 0.8, KRONG[1] + 1.2], focusDir: [0.7, 0.3, 1],
      desc: { en: 'A low floor on four short posts.', id: 'Lantai rendah di atas empat tiang pendek.' },
      fn: { en: 'Keeps the rice off the damp ground.', id: 'Menjauhkan padi dari tanah yang lembap.' },
      meaning: { en: 'The granary is small: it stands beside the house, or sometimes under it.', id: 'Lumbung ini kecil: berdiri di samping rumah, atau kadang di bawahnya.' },
      specs: [{ en: '4 posts', id: '4 tiang' }], interp: true,
    },
    {
      id: 'krong', cat: 'lumbung', name: 'Krong Padé', alias: 'Lumbung padi', en: { en: 'Rice bin', id: 'Tempat padi' },
      explode: [0, 1.2, 0], anchor: [KRONG[0], 2.4, KRONG[1] + 1.0], focusDir: [0.6, 0.4, 1],
      desc: { en: 'A drum of woven bamboo bound with rattan hoops.', id: 'Wadah bundar dari anyaman bambu yang diikat gelang-gelang rotan.' },
      fn: { en: 'It holds the family’s rice still in the husk, taken out as it is needed.', id: 'Menyimpan padi keluarga yang masih berkulit, yang diambil sesuai kebutuhan.' },
      meaning: { en: 'The popular name of the Acehnese house, “Krong Bade”, seems to come from krong padé, the granary: the house itself is the rumoh Aceh.', id: 'Nama populer rumah Aceh, “Krong Bade”, tampaknya berasal dari krong padé, lumbung padi: rumah itu sendiri adalah rumoh Aceh.' },
      specs: [{ en: 'Unhusked rice', id: 'Padi berkulit' }], interp: true,
    },
    {
      id: 'bubong', cat: 'lumbung', name: 'Atap Lumbung', alias: 'Atap rumbia', en: { en: 'Granary roof', id: 'Atap lumbung' }, roof: true, lift: true,
      explode: [0, 2.2, 0], anchor: [KRONG[0], 4.6, KRONG[1]],
      desc: { en: 'A pyramid of thatch on four posts over the bin.', id: 'Atap rumbia berbentuk limas di atas empat tiang yang menaungi wadah padi.' },
      fn: { en: 'Keeps the rain off the rice.', id: 'Melindungi padi dari hujan.' },
      meaning: { en: 'The same thatch as the house.', id: 'Atap rumbia yang sama dengan rumah.' }, interp: true,
      specs: [{ en: 'Thatch', id: 'Rumbia' }],
    },
  ],
  sectionY: 1.8,
  views: { inside: { pos: [KRONG[0] - 4, 1.7, KRONG[1] + 4.5], target: [KRONG[0], 2, KRONG[1]] } },
};

export const yard = {
  build: buildYard,
  categories: [{ id: 'pekarangan', label: { en: 'Yard', id: 'Pekarangan' }, local: 'Pekarangan', color: '#7f8a6a' }],
  parts: [
    {
      id: 'halaman', cat: 'pekarangan', name: 'Pekarangan', alias: 'Halaman rumah', en: { en: 'Yard', id: 'Halaman' }, pick: false,
      explode: [0, 0, 0], anchor: [-9, 0.4, 6],
      desc: { en: 'The open ground round the house.', id: 'Tanah lapang di sekeliling rumah.' },
      fn: { en: 'For daily work and drying, and for the guests at a feast.', id: 'Untuk pekerjaan sehari-hari dan menjemur, serta untuk para tamu saat kenduri.' },
      meaning: { en: 'Houses in a gampong are scattered without a set plan, but every one lies east–west.', id: 'Rumah-rumah di gampong tersebar tanpa pola tertentu, tetapi semuanya membujur timur–barat.' },
      specs: [`${2 * YARD.x} × ${YARD.z1 - YARD.z0} m`],
    },
    {
      id: 'pohon', cat: 'pekarangan', name: 'Pohon Peneduh', alias: 'Pohon halaman', en: { en: 'Shade trees', id: 'Pohon peneduh' },
      explode: [0, 0, 0], anchor: [-11.5, 7.2, 9.5], focusDir: [-0.4, 0.3, 1],
      desc: { en: 'Trees planted in the yard.', id: 'Pohon-pohon yang ditanam di halaman.' },
      fn: { en: 'Shade for the yard and the house.', id: 'Meneduhi halaman dan rumah.' },
      meaning: { en: 'With the fence, they make the yard a world of its own.', id: 'Bersama pagar, pohon-pohon menjadikan halaman dunianya sendiri.' }, interp: true,
      specs: [{ en: `${TREES.length} trees`, id: `${TREES.length} pohon` }],
    },
    {
      id: 'pageue', cat: 'pekarangan', name: 'Pagar', alias: 'Pagar bambu', en: { en: 'Fence', id: 'Pagar' },
      explode: [0, 0.6, 0], anchor: [-YARD.x, 1.6, 0], focusDir: [-1, 0.3, 0.5],
      desc: { en: 'A fence of woven bamboo between timber posts round the yard.', id: 'Pagar anyaman bambu di antara tiang-tiang kayu yang mengelilingi halaman.' },
      fn: { en: 'Marks the house plot and keeps animals out.', id: 'Menandai kapling rumah dan menahan hewan masuk.' },
      meaning: { en: 'Hedges or fences close the yard off from the lane.', id: 'Pagar hidup atau pagar kayu memisahkan halaman dari jalan kampung.' },
      specs: [{ en: '{posts} posts', id: '{posts} tiang' }],
    },
    {
      id: 'keupaleh', cat: 'pekarangan', name: 'Keupaleh', alias: 'Gerbang', en: { en: 'Gateway', id: 'Gerbang' },
      explode: [0, 1.2, 0], anchor: [0, 4.2, YARD.z1], focusDir: [0.3, 0.3, 1],
      desc: { en: 'A small roofed gateway in the fence, with a carved board under the roof.', id: 'Gerbang kecil beratap di pagar, dengan papan berukir di bawah atapnya.' },
      fn: { en: 'The way into the yard.', id: 'Jalan masuk ke halaman.' },
      meaning: { en: 'Only well-off families build a keupaleh.', id: 'Hanya keluarga berada yang membangun keupaleh.' },
      specs: [{ en: '1 gateway', id: '1 gerbang' }],
    },
  ],
  sectionY: 0.8,
  views: { inside: { pos: [3, 1.7, YARD.z1 + 5], target: [0, 3, 0] } },
};
