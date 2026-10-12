// The two rectangular buildings of the silimo: the hunila, the long kitchen shared by the
// whole compound, and the wamdabu, the pig sty. Both are plank walls under a low grass roof.
// Local coordinates: the long side with the doors faces +z.
import { reseed, partStore, box } from '../../lib/geometry.js';
import { T, cyl, plankLine, thatchTier, hearth } from './kit.js';

function shell(P, { L, D, WH, top, doors }) {
  P('lantai').add('yard', box(2 * L + 0.5, 0.03, 2 * D + 0.5, 0, 0.015, 0, 'world', 2));
  P('lantai').add('grass', box(2 * L - 0.15, 0.03, 2 * D - 0.15, 0, 0.045, 0, 'world', 1));
  const W = P('dinding');
  const gaps = doors.map((d) => [d.c + L - d.w / 2, d.c + L + d.w / 2]);
  let planks = plankLine(W, 'wood', [-L, D], [L, D], WH, { gaps, rail: WH - 0.12, railSlot: 'rope' });
  planks += plankLine(W, 'wood', [L, -D], [-L, -D], WH, { rail: WH - 0.12, railSlot: 'rope' });
  planks += plankLine(W, 'wood', [L, D], [L, -D], WH, { rail: WH - 0.12, railSlot: 'rope' });
  planks += plankLine(W, 'wood', [-L, -D], [-L, D], WH, { rail: WH - 0.12, railSlot: 'rope' });
  for (const d of doors) {
    for (const s of [-1, 1]) W.add('wood', box(0.08, d.h + 0.08, 0.1, d.c + s * (d.w / 2 + 0.04), (d.h + 0.08) / 2, D));
    W.add('wood', box(d.w + 0.3, 0.08, 0.11, d.c, d.h + 0.04, D));
    W.add('wood', box(d.w, 0.16, 0.06, d.c, 0.08, D));
    plankLine(W, 'wood', [d.c - d.w / 2, D], [d.c + d.w / 2, D], WH - d.h - 0.08, { y0: d.h + 0.08, jitter: 0.03 });
  }
  const tier = { AX: L + 0.55, AZ: D + 0.55, y0: WH - 0.2, ix: L - D, iz: 0, y1: top };
  const rafters = thatchTier(P, tier, 'atap', 'rangka_atap');
  P('rangka_atap').add('wood', box(2 * tier.ix + 0.3, 0.1, 0.1, 0, top - T - 0.16, 0));
  return { planks, rafters, ridge: top - T - 0.21, ix: tier.ix };
}

const HUNILA = { L: 4.5, D: 1.5, WH: 1.3, top: 2.75, doors: [{ c: -2.3, w: 0.7, h: 1.0 }, { c: 2.3, w: 0.7, h: 1.0 }] };
const HEARTHS = [-3.1, 0, 3.1];

function buildHunila() {
  reseed(211);
  const { parts, P } = partStore();
  const s = shell(P, HUNILA);
  for (const x of [-1.55, 1.55]) {
    P('tiang').add('stone', box(0.3, 0.05, 0.3, x, 0.03, 0, 'stone', 1));
    P('tiang').add('wood', cyl(0.07, s.ridge - 0.05, x, 0.05, 0));
  }
  for (const x of HEARTHS) hearth(P('tungku'), x, -0.25, 1.1);
  return { parts, counts: { planks: s.planks, rafters: s.rafters, hearths: HEARTHS.length } };
}

const STY = { L: 2.5, D: 1.2, WH: 1.0, top: 1.95, doors: [{ c: -1.85, w: 0.6, h: 0.75 }] };
const STALLS = [-1.25, 0, 1.25];

function buildSty() {
  reseed(311);
  const { parts, P } = partStore();
  const s = shell(P, STY);
  const K = P('petak');
  const { L, D } = STY, aisle = 0.3;
  for (const x of STALLS) plankLine(K, 'wood', [x, -D + 0.05], [x, aisle], 0.6, { jitter: 0.03 });
  // A low front to every stall, with a gap to drive the pig in
  const edges = [-L + 0.05, ...STALLS, L - 0.05];
  for (let k = 0; k < edges.length - 1; k++) plankLine(K, 'wood', [edges[k] + 0.5, aisle], [edges[k + 1], aisle], 0.6, { jitter: 0.03 });
  return { parts, counts: { planks: s.planks, rafters: s.rafters, stalls: STALLS.length + 1 } };
}

const CATEGORIES = [
  { id: 'badan', label: { en: 'Body', id: 'Badan' }, local: 'Badan', color: '#c58a4a' },
  { id: 'atap',  label: { en: 'Roof', id: 'Atap' }, local: 'Atap', color: '#a9935a' },
];

const dims = ({ L, D }) => `${2 * L} × ${2 * D} m`;

// Parts that both buildings have, worded for each.
const common = (o, kitchen) => [
  {
    id: 'lantai', cat: 'badan', name: 'Lantai', alias: 'Lantai tanah', en: { en: 'Earth floor', id: 'Lantai tanah' }, pick: false,
    explode: [0, 0, 0], anchor: [-o.L * 0.6, 0.3, 0.4],
    desc: { en: 'Bare earth with a layer of dry grass.', id: 'Tanah yang dilapisi rumput kering.' },
    fn: kitchen
      ? { en: 'People sit on the grass around the fires to cook and eat.', id: 'Orang duduk di atas rumput mengelilingi api untuk memasak dan makan.' }
      : { en: 'Bedding for the pigs, changed when it is dirty.', id: 'Alas tidur babi, diganti bila sudah kotor.' },
    meaning: { en: 'Unlike the round houses, this building has no upper floor.', id: 'Berbeda dengan rumah bundar, bangunan ini tidak berlantai atas.' },
    specs: [dims(o)],
    ...(kitchen ? {} : { interp: true }),
  },
  {
    id: 'dinding', cat: 'badan', name: 'Dinding Papan', alias: 'Papan belah', en: { en: 'Plank walls', id: 'Dinding papan' },
    explode: [0, 0, 0], anchor: [o.L * 0.7, o.WH * 0.8, o.D + 0.1], focusDir: [0.5, 0.25, 1],
    desc: { en: 'Split planks set upright in the ground and tied to a pole, in a long rectangle.', id: 'Papan belah yang ditanam tegak di tanah dan diikat pada sebatang kayu, membentuk persegi panjang.' },
    fn: kitchen
      ? { en: 'Shelter for cooking in any weather, with low doors opening onto the yard.', id: 'Naungan untuk memasak dalam segala cuaca, dengan pintu-pintu rendah yang membuka ke halaman.' }
      : { en: 'Keeps the pigs in at night and safe from theft and cold.', id: 'Mengurung babi pada malam hari, aman dari pencurian dan dingin.' },
    meaning: { en: 'In the silimo the round buildings are for sleeping and the rectangular ones for work.', id: 'Di silimo, bangunan bundar untuk tidur dan bangunan persegi untuk bekerja.' }, interp: true,
    specs: [{ en: '{planks} planks', id: '{planks} papan' }, { en: `${o.doors.length} low door${o.doors.length > 1 ? 's' : ''}`, id: `${o.doors.length} pintu rendah` }],
  },
  {
    id: 'rangka_atap', cat: 'atap', name: 'Rangka Atap', alias: 'Usuk kayu', en: { en: 'Roof frame', id: 'Rangka atap' }, lift: true,
    explode: [0, 2.2, 0], anchor: [o.L * 0.5, o.top - 0.5, 0.6],
    desc: { en: 'Pole rafters and cane laths under the grass, tied to a ridge pole.', id: 'Usuk kayu dan reng bilah di bawah rumput, diikat pada kayu bubungan.' },
    fn: { en: 'Carries the thatch over the long room.', id: 'Memikul atap rumput di atas ruang yang panjang.' },
    meaning: { en: 'The same materials and ties as the round houses, in a simpler shape.', id: 'Bahan dan ikatan yang sama dengan rumah bundar, dalam bentuk yang lebih sederhana.' }, interp: true,
    specs: [{ en: '{rafters} rafters', id: '{rafters} usuk' }],
  },
  {
    id: 'atap', cat: 'atap', name: 'Atap Alang-alang', alias: 'Wareke', en: { en: 'Grass roof', id: 'Atap alang-alang' }, roof: true, lift: true,
    explode: [0, 3.4, 0], anchor: [0, o.top + 0.2, 0.5],
    desc: { en: 'A low roof of coarse alang-alang grass, sloping on all four sides.', id: 'Atap rendah dari alang-alang kasar, miring ke empat sisinya.' },
    fn: { en: 'Sheds the rain and reaches down close to the ground.', id: 'Mengalirkan air hujan dan menjulur hingga dekat ke tanah.' },
    meaning: { en: 'From outside, the long roofs and the round domes are how you tell the buildings of a silimo apart.', id: 'Dari luar, atap yang memanjang dan kubah yang bundar menjadi penanda untuk membedakan bangunan-bangunan silimo.' }, interp: true,
    specs: [{ en: `Ridge +${o.top} m`, id: `Bubungan +${o.top} m` }],
  },
];

const HUNILA_PARTS = common(HUNILA, true);
HUNILA_PARTS.splice(2, 0,
  {
    id: 'tiang', cat: 'badan', name: 'Tiang Bubungan', alias: 'Tiang tengah', en: { en: 'Ridge posts', id: 'Tiang bubungan' },
    explode: [0, 0, 0], anchor: [1.55, 1.5, 0], focusDir: [0.4, 0.3, 1],
    desc: { en: 'Posts down the middle of the room, holding up the ridge pole.', id: 'Tiang-tiang di tengah ruang yang menopang kayu bubungan.' },
    fn: { en: 'Carry the roof so the long room stays open from end to end.', id: 'Memikul atap sehingga ruang panjang ini tetap terbuka dari ujung ke ujung.' },
    meaning: { en: 'The fires are spaced between them along the room.', id: 'Api-api ditempatkan berjarak di antara tiang-tiang itu sepanjang ruang.' }, interp: true,
    specs: [{ en: '2 posts', id: '2 tiang' }],
  },
  {
    id: 'tungku', cat: 'badan', name: 'Tungku', alias: 'Perapian', en: { en: 'Cooking fires', id: 'Tungku masak' },
    explode: [0, 0, 0], anchor: [0, 0.5, -0.25], focusDir: [0.3, 0.6, 1],
    desc: { en: 'A row of fires on the earth floor along the length of the kitchen.', id: 'Sederet api di lantai tanah sepanjang dapur.' },
    fn: { en: 'Sweet potatoes, the daily food, are cooked here for people and for the pigs.', id: 'Ubi jalar, makanan sehari-hari, dimasak di sini untuk orang dan untuk babi.' },
    meaning: { en: 'The kitchen is one of the few places in the compound where men, women and children all sit together.', id: 'Dapur adalah salah satu dari sedikit tempat di kompleks ini di mana laki-laki, perempuan, dan anak-anak duduk bersama.' },
    specs: [{ en: '{hearths} fires', id: '{hearths} tungku' }],
  });

const STY_PARTS = common(STY, false);
STY_PARTS.splice(2, 0, {
  id: 'petak', cat: 'badan', name: 'Petak Babi', alias: 'Sekat kandang', en: { en: 'Stalls', id: 'Petak kandang' },
  explode: [0, 0, 0], anchor: [0, 0.8, -0.5], focusDir: [0.3, 0.8, 1],
  desc: { en: 'Low plank partitions dividing the sty into stalls off a narrow passage.', id: 'Sekat-sekat papan rendah yang membagi kandang menjadi petak-petak di sisi lorong sempit.' },
  fn: { en: 'Each stall holds a pig or a sow with her young for the night.', id: 'Setiap petak menampung seekor babi atau induk dengan anak-anaknya pada malam hari.' },
  meaning: { en: 'Pigs are the wealth of a Hubula family: they are given at weddings and funerals and settle debts and disputes.', id: 'Babi adalah kekayaan keluarga Hubula: diberikan dalam pernikahan dan upacara kematian, serta untuk melunasi utang dan menyelesaikan sengketa.' },
  specs: [{ en: '{stalls} stalls', id: '{stalls} petak' }],
});

export const hunila = {
  build: buildHunila, categories: CATEGORIES, parts: HUNILA_PARTS, sectionY: 0.95, dims: dims(HUNILA),
  views: { inside: { pos: [3.9, 0.9, 0.8], target: [-1, 0.5, -0.3] } },
};
export const wamdabu = {
  build: buildSty, categories: CATEGORIES, parts: STY_PARTS, sectionY: 0.8, dims: dims(STY),
  views: { inside: { pos: [2.1, 0.85, 0.8], target: [-0.5, 0.3, -0.4] } },
};
