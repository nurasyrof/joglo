// The kitchen behind the betang and the karayan, the open deck that joins the two. The
// kitchen is a separate building with its own roof, whose ridge runs across that of the house.
// Local coordinates: the ridge runs along x; −x is towards the betang (the karayan), +x is
// the back wall with the hearths. The site turns the building a quarter turn.
import { V, reseed, partStore, box } from '../../lib/geometry.js';
import { gableRoof } from '../../lib/kit.js';
import { F, SLOPE, post, boards, barkWall, notchedLog, hearthBox } from './kit.js';

export const KITCHEN = { L: 3, D: 4, deck: 3 };
const TOP = F + 3.0;
const HEARTHS = [-2.7, -0.9, 0.9, 2.7];

function build() {
  reseed(902);
  const { parts, P } = partStore();
  const { L, D, deck } = KITCHEN;

  // Posts: six through to the roof under the kitchen, four props under the deck
  let posts = 0;
  for (const x of [-L + 0.2, L - 0.2]) for (const z of [-D + 0.2, 0, D - 0.2]) { P('tiang').add('wood', post(0.16, 0, TOP, x, z)); posts++; }
  for (const x of [-L - deck + 0.3, -L - deck / 2]) for (const z of [-D + 0.3, D - 0.3]) { P('tiang').add('wood', post(0.11, 0, F - 0.4, x, z)); posts++; }
  for (const z of [-D + 0.2, 0, D - 0.2]) P('tiang').add('wood', box(2 * L + deck, 0.2, 0.14, -deck / 2, F - 0.28, z));
  for (let x = -L - deck + 0.25; x < L; x += 0.5) P('tiang').add('wood', box(0.08, 0.14, 2 * D, x, F - 0.105, 0));

  // Karayan: the open deck, with a rail and the log stair down
  const Kr = P('karayan');
  boards(Kr, 'plank', -L - deck, -L, -D, D, F);
  for (const z of [-D + 0.06, D - 0.06]) {
    const gap = z > 0 ? [-L - 2.0, -L - 1.0] : null;          // where the stair comes up
    for (let x = -L - deck + 0.15; x <= -L; x += 0.95) if (!gap || x < gap[0] || x > gap[1]) Kr.add('wood', box(0.07, 0.9, 0.07, x, F + 0.45, z));
    if (gap) {
      Kr.add('wood', box(gap[0] + L + deck, 0.06, 0.08, (gap[0] - L - deck) / 2, F + 0.9, z));
      Kr.add('wood', box(-L - gap[1], 0.06, 0.08, (gap[1] - L) / 2, F + 0.9, z));
    } else Kr.add('wood', box(deck, 0.06, 0.08, -L - deck / 2, F + 0.9, z));
  }
  notchedLog(P('tangga_dapur'), V(-L - 1.5, 0, D + 2.4), V(-L - 1.5, F - 0.1, D + 0.1), 9);

  // Kitchen: board floor, bark walls, a door to the deck, one hearth for each family
  boards(P('lantai'), 'plank', -L, L, -D, D, F);
  const W = P('dinding');
  barkWall(W, { axis: 'z', at: -L, from: -D, to: D, out: -1, openings: [{ c: 0, w: 1.0, h: 1.9 }], top: TOP });
  barkWall(W, { axis: 'z', at: L, from: -D, to: D, out: 1, openings: [], top: TOP });
  for (const s of [-1, 1]) barkWall(W, { axis: 'x', at: s * D, from: -L, to: L, out: s, openings: [{ c: 0, w: 0.6, h: 0.6, sill: 1.12 }], top: TOP });

  const T = P('tungku');
  for (const z of HEARTHS) hearthBox(T, L - 0.85, z, F);
  // Para-para: a rack over the fires for drying and smoking
  T.add('rattan', box(1.0, 0.04, 2 * D - 1.0, L - 0.85, F + 1.7, 0, 'world', 1));
  for (const z of [-D + 0.6, 0, D - 0.6]) for (const x of [L - 1.3, L - 0.4]) T.add('wood', box(0.05, TOP - F - 1.7, 0.05, x, (TOP + F + 1.7) / 2, z));

  const y1 = TOP + 0.2 + SLOPE * D, AZ = D + 0.6;
  const roof = gableRoof(P, { AX: L + 0.6, AZ, y0: y1 - SLOPE * AZ, y1, t: 0.08, roof: 'atap', frame: 'rangka_atap', gable: 'atap', gableSlot: 'plank', gableBase: TOP + 0.12, gableAt: L - 0.03 });
  for (const x of [-L + 0.2, L - 0.2]) P('rangka_atap').add('wood', box(0.18, 0.24, 2 * D, x, TOP + 0.12, 0));

  return { parts, counts: { posts, hearths: HEARTHS.length, rafters: roof.rafters } };
}

const CATEGORIES = [
  { id: 'bawah',  label: { en: 'Below', id: 'Bawah' },   local: 'Bawah',  color: '#7f8a6a' },
  { id: 'tengah', label: { en: 'Kitchen and deck', id: 'Dapur dan karayan' }, local: 'Tengah', color: '#c58a4a' },
  { id: 'atas',   label: { en: 'Roof', id: 'Atap' },    local: 'Atas',   color: '#b0624a' },
];

const PARTS = [
  {
    id: 'tiang', cat: 'bawah', name: 'Tiang & Bahat', alias: 'Tiang dapur', en: { en: 'Posts and floor frame', id: 'Tiang dan rangka lantai' },
    explode: [0, 0, 0], anchor: [2.8, 1.2, 3.8], focusDir: [0.6, 0.2, 1],
    desc: { en: 'Ironwood posts, beams and joists like those of the house, at the same floor height.', id: 'Tiang, balok, dan gelagar ulin seperti pada rumah, dengan tinggi lantai yang sama.' },
    fn: { en: 'Carry the kitchen and the deck so people walk level from the hall to the fires.', id: 'Memikul dapur dan karayan sehingga orang berjalan rata dari los ke tungku.' },
    meaning: { en: 'The kitchen stands on its own posts, apart from the house.', id: 'Dapur berdiri di atas tiangnya sendiri, terpisah dari rumah.' },
    specs: [{ en: '{posts} posts', id: '{posts} tiang' }],
  },
  {
    id: 'tangga_dapur', cat: 'bawah', name: 'Tangga Dapur', alias: 'Tangga takik', en: { en: 'Kitchen stair', id: 'Tangga dapur' },
    explode: [0, 0, 2.5], anchor: [-4.5, 1.4, 5.6], focusDir: [0.3, 0.3, 1],
    desc: { en: 'A notched ironwood log from the ground up to the deck.', id: 'Sebatang kayu ulin bertakik dari tanah naik ke karayan.' },
    fn: { en: 'The working way in and out: for water, firewood and what comes from the fields.', id: 'Jalan kerja keluar-masuk: untuk air, kayu bakar, dan hasil ladang.' },
    meaning: { en: 'Daily traffic uses this stair, not the main one at the front.', id: 'Lalu-lalang sehari-hari memakai tangga ini, bukan tangga utama di depan.' }, interp: true,
    specs: [{ en: 'Notched log', id: 'Batang bertakik' }],
  },
  {
    id: 'karayan', cat: 'tengah', name: 'Karayan', alias: 'Pelataran penghubung', en: { en: 'Connecting deck', id: 'Pelataran penghubung' },
    explode: [0, 0.8, 0], anchor: [-4.5, 3.4, 0], focusDir: [0.3, 0.8, 1],
    desc: { en: 'An open, unroofed deck between the back of the house and the kitchen.', id: 'Pelataran terbuka tanpa atap di antara bagian belakang rumah dan dapur.' },
    fn: { en: 'It joins house and kitchen, and is a place to rest, to dry rice and fish and to keep what is brought from the forest.', id: 'Menghubungkan rumah dan dapur, sekaligus tempat beristirahat, menjemur padi dan ikan, serta menyimpan hasil hutan.' },
    meaning: { en: 'The gap it leaves keeps a kitchen fire from reaching the house.', id: 'Jarak yang dibentuknya mencegah api dapur menjalar ke rumah.' },
    specs: [{ en: '8 × 3 m', id: '8 × 3 m' }, { en: 'Open to the sky', id: 'Tanpa atap' }],
  },
  {
    id: 'lantai', cat: 'tengah', name: 'Laseh Dapur', alias: 'Lantai dapur', en: { en: 'Kitchen floor', id: 'Lantai dapur' }, pick: false,
    explode: [0, 0.8, 0], anchor: [0, 2.5, -2],
    desc: { en: 'A floor of boards on joists, like the floor of the house.', id: 'Lantai papan di atas gelagar, seperti lantai rumah.' },
    fn: { en: 'People cook and eat sitting on the floor.', id: 'Orang memasak dan makan sambil duduk di lantai.' },
    meaning: { en: 'Level with the house floor, so the kitchen is part of the same raised world.', id: 'Rata dengan lantai rumah, sehingga dapur menjadi bagian dari dunia panggung yang sama.' }, interp: true,
    specs: [{ en: '6 × 8 m', id: '6 × 8 m' }],
  },
  {
    id: 'dinding', cat: 'tengah', name: 'Dinding Dapur', alias: 'Dinding kulit kayu', en: { en: 'Kitchen walls', id: 'Dinding dapur' },
    explode: [0, 1.6, 0], anchor: [0, 3.8, 4.05], focusDir: [0.3, 0.2, 1],
    desc: { en: 'Bark walls clamped with rattan, open under the roof, with a door onto the deck.', id: 'Dinding kulit kayu yang dijepit rotan, terbuka di bawah atap, dengan pintu ke karayan.' },
    fn: { en: 'The open strip under the roof lets the smoke out.', id: 'Celah terbuka di bawah atap mengeluarkan asap.' },
    meaning: { en: 'Built the same way as the house, only smaller.', id: 'Dibangun dengan cara yang sama seperti rumah, hanya lebih kecil.' }, interp: true,
    specs: [{ en: 'Bark and rattan', id: 'Kulit kayu dan rotan' }],
  },
  {
    id: 'tungku', cat: 'tengah', name: 'Tungku', alias: 'Perapian', en: { en: 'Hearths', id: 'Tungku' },
    explode: [0, 1.6, 0], anchor: [2.15, 3.0, 0], focusDir: [-0.6, 0.6, 0.6],
    desc: { en: 'A row of hearths along the back wall: boxes of earth on the board floor, each with three stones and a pot, under a drying rack.', id: 'Sederet tungku di sepanjang dinding belakang: kotak berisi tanah di atas lantai papan, masing-masing dengan tiga batu dan periuk, di bawah para-para.' },
    fn: { en: 'Everyone in the house cooks here, on as many hearths as there are families.', id: 'Semua penghuni rumah memasak di sini, dengan tungku sebanyak jumlah keluarga.' },
    meaning: { en: 'The families sleep in separate rooms but cook side by side.', id: 'Keluarga-keluarga tidur di bilik terpisah tetapi memasak berdampingan.' },
    specs: [{ en: '{hearths} hearths', id: '{hearths} tungku' }],
  },
  {
    id: 'rangka_atap', cat: 'atas', name: 'Rangka Atap', alias: 'Kasau dan reng', en: { en: 'Roof frame', id: 'Rangka atap' }, lift: true,
    explode: [0, 3.2, 0], anchor: [1.5, 5.6, 2],
    desc: { en: 'Tie beams, rafters and battens of ironwood.', id: 'Balok tarik, kasau, dan reng dari ulin.' },
    fn: { en: 'Carry the shingles over the kitchen.', id: 'Memikul sirap di atas dapur.' },
    meaning: { en: 'The same carpentry as the main roof.', id: 'Pertukangan yang sama dengan atap utama.' }, interp: true,
    specs: [{ en: '{rafters} rafters', id: '{rafters} kasau' }],
  },
  {
    id: 'atap', cat: 'atas', name: 'Atap Dapur', alias: 'Atap sirap', en: { en: 'Kitchen roof', id: 'Atap dapur' }, roof: true, lift: true,
    explode: [0, 4.4, 0], anchor: [0, 6.6, 1.5],
    desc: { en: 'A gable roof of shingles whose ridge runs at right angles to the ridge of the house.', id: 'Atap pelana dari sirap yang bubungannya tegak lurus terhadap bubungan rumah.' },
    fn: { en: 'Shelters the cooking fires.', id: 'Menaungi tungku-tungku masak.' },
    meaning: { en: 'The turned roof shows from outside that the kitchen is a building of its own.', id: 'Atap yang berbeda arah memperlihatkan dari luar bahwa dapur adalah bangunan tersendiri.' }, interp: true,
    specs: [{ en: 'Ridge across the house', id: 'Bubungan melintang' }],
  },
];

export const dapur = {
  build, categories: CATEGORIES, parts: PARTS, sectionY: F + 1.3,
  views: { inside: { pos: [-2.2, F + 1.5, -2.6], target: [2.2, F + 0.7, 1.2] } },
};
