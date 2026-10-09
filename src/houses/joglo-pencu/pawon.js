// Pawon: the kitchen and everyday wing beside the omah, under a steep kampung roof with a
// sosoran (lean-to) in front. Local coordinates: front (towards the yard) faces +z.
import { reseed, partStore, box, frame, lathe, slab, rafters, battens, V } from '../../lib/geometry.js';
import { plinth, steps, umpak, columns, gableRoof, wallRun } from '../../lib/kit.js';
import { gebyokFace, konsol } from './kit.js';

const FL = 0.45, TOP = 3.15;
const WX = 2.8, WZ = 3.6;
const SOSORAN = { z0: 3.8, y0: 3.28, z1: 5.0, y1: 2.95, x: 3.3 };
const POT = [[0, 0], [0.14, 0], [0.22, 0.1], [0.24, 0.2], [0.18, 0.3], [0.2, 0.34], [0, 0.34]];
const JAR = [[0, 0], [0.18, 0], [0.3, 0.2], [0.32, 0.45], [0.24, 0.66], [0.2, 0.72], [0, 0.72]];

function build() {
  reseed(40221);
  const { parts, P } = partStore();

  plinth(P('bebatur'), { w: 2 * WX + 0.5, d: 2 * WZ + 0.5, h: FL });
  steps(P('bebatur'), { z: WZ + 0.25, w: 1.4, h: FL, n: 1 });

  // ── Saka: front columns on umpak, corner columns, ring beam and the sosoran's konsol
  const frontXs = [-WX, -0.6, 0.6, WX];
  for (const x of frontXs) umpak(P('saka'), x, WZ, FL, 0.16, 0.12, 0.16);
  columns(P('saka'), frontXs.map((x) => [x, WZ]), FL + 0.16, TOP, 0.16);
  columns(P('saka'), [[-WX, -WZ], [WX, -WZ]], FL, TOP, 0.16);
  frame(P('saka'), 'wood', WX, WZ, TOP + 0.08, 0.16, 0.16, 0.2);
  for (const x of frontXs) konsol(P('saka'), x, WZ + 0.08, 2.84, 1.12, { slot: 'wood' });
  P('saka').add('wood', box(2 * SOSORAN.x - 0.2, 0.14, 0.12, 0, 2.86, 4.85));

  // ── Gebyok pawon: the same pattern as the house front, four panels to a row,
  // with a single door split into upper and lower leaves
  const G = P('gebyok');
  wallRun(G, 'wood', { axis: 'x', at: WZ, from: -WX, to: WX, y0: FL, h: TOP - FL, t: 0.1, openings: [{ c: 0, w: 0.95, h: 2.05 }] });
  for (const [a, b] of [[-WX, -0.6], [0.6, WX]]) gebyokFace(G, { from: a, to: b, at: WZ, y0: FL, y1: TOP, cols: 4 });
  G.add('carved', box(0.92, 1.0, 0.05, 0, FL + 0.51, WZ));
  G.add('carved', box(0.05, 1.0, 0.9, -0.45, FL + 1.54, WZ - 0.47));

  // ── Tembok: plastered side and back walls, with a door towards the omah
  const D = P('tembok');
  wallRun(D, 'plaster', { axis: 'x', at: -WZ, from: -WX, to: WX, y0: FL, h: TOP - FL, t: 0.22, mode: 'stone' });
  wallRun(D, 'plaster', { axis: 'z', at: -WX, from: -WZ, to: WZ - 0.1, y0: FL, h: TOP - FL, t: 0.22, mode: 'stone', openings: [{ c: -1.2, w: 0.9, h: 0.8, sill: 1.3 }] });
  wallRun(D, 'plaster', { axis: 'z', at: WX, from: -WZ, to: WZ - 0.1, y0: FL, h: TOP - FL, t: 0.22, mode: 'stone', openings: [{ c: 2.0, w: 0.9, h: 2.05 }] });
  for (const z of [-1.45, -1.2, -0.95]) D.add('wood', box(0.05, 0.8, 0.05, -WX, FL + 1.7, z));

  // ── Tungku: a wood-fired stove with two pots, and a water jar
  P('tungku').add('plaster', box(1.9, 0.75, 0.75, -1.5, FL + 0.375, -2.95, 'stone', 1));
  for (const x of [-2.0, -1.0]) P('tungku').add('accent', lathe(POT, V(x, FL + 0.75, -2.95), null, 14));
  P('tungku').add('accent', lathe(JAR, V(2.1, FL, -2.8), null, 16));

  // ── Atap: a steep kampung roof, gables of plaster, and the sosoran on konsol in front
  const counts = gableRoof(P, {
    AX: 3.3, AZ: 4.0, y0: 3.4, y1: 6.6, roof: 'atap', frame: 'usuk',
    gable: 'tembok', gableSlot: 'plaster', gableBase: TOP + 0.16, gableAt: WX,
  });
  const { z0, y0, z1, y1, x } = SOSORAN;
  const q = [V(-x, y1, z1), V(x, y1, z1), V(x, y0, z0), V(-x, y0, z0)];
  const s = slab(q, 0.1);
  P('atap').add('roof', s.top).add('plank', s.under);
  counts.rafters += rafters(P('usuk'), q, 0.1);
  battens(P('usuk'), q, 0.1);
  return { parts, counts };
}

const CATEGORIES = [
  { id: 'base',  label: { en: 'Floor & frame', id: 'Lantai & rangka' }, local: 'Rangka',  color: '#b27a45' },
  { id: 'walls', label: { en: 'Walls & stove', id: 'Dinding & tungku' }, local: 'Dinding', color: '#d9c7a0' },
  { id: 'roof',  label: { en: 'Roof', id: 'Atap' },                    local: 'Atap',    color: '#cf5b3f' },
];

const PARTS = [
  {
    id: 'bebatur', cat: 'base', name: 'Bebatur', alias: 'Lantai', en: { en: 'Plinth', id: 'Bebatur' },
    explode: [0, 0, 0], anchor: [1.6, 0.4, 3.9],
    desc: { en: 'A low plinth with a tiled floor, lower than the omah’s.', id: 'Bebatur rendah berlantai tegel, lebih rendah dari lantai omah.' },
    fn: { en: 'Keeps the kitchen floor dry.', id: 'Menjaga lantai dapur tetap kering.' },
    meaning: { en: 'The working wing sits lower than the house it serves.', id: 'Sayap kerja ini lebih rendah daripada rumah yang dilayaninya.' }, interp: true,
    specs: [{ en: 'Floor +0.45 m', id: 'Lantai +0,45 m' }],
  },
  {
    id: 'saka', cat: 'base', name: 'Saka & Konsol', alias: 'Rangka', en: { en: 'Columns, beams and brackets', id: 'Tiang, balok, dan konsol' },
    explode: [0, 1.4, 0.6], anchor: [2.8, 2.4, 3.7],
    desc: { en: 'Timber columns and a ring beam, with konsol brackets carrying the sosoran in front.', id: 'Tiang kayu dan balok keliling, dengan konsol yang memikul sosoran di depan.' },
    fn: { en: 'Carry the roof and its front overhang.', id: 'Memikul atap dan bagian yang menjorok di depannya.' },
    meaning: { en: 'The same bracketed eave as the omah, on a smaller scale.', id: 'Tritisan berkonsol yang sama dengan omah, dalam skala lebih kecil.' },
    specs: [{ en: '6 columns', id: '6 tiang' }, { en: '4 konsol', id: '4 konsol' }],
  },
  {
    id: 'gebyok', cat: 'walls', name: 'Gebyok Pawon', alias: 'Gebyok', en: { en: 'Timber front wall', id: 'Dinding depan kayu' },
    explode: [0, 0.4, 2.0], anchor: [-1.7, 2.0, 3.75], focusDir: [0, 0.15, 1],
    desc: { en: 'The pawon’s front repeats the pattern of the house front, with four panels to a row instead of five, and a smaller single door split into an upper and a lower leaf.', id: 'Bagian depan pawon mengulang pola dinding depan rumah, dengan empat panel per baris alih-alih lima, dan pintu tunggal yang lebih kecil, terbagi menjadi daun atas dan daun bawah.' },
    fn: { en: 'The upper leaf can stand open for light and air while the lower one stays shut.', id: 'Daun atas bisa dibuka untuk cahaya dan udara sementara daun bawah tetap tertutup.' }, interp: true,
    meaning: { en: 'Kept plainer than the omah’s front: decoration follows the importance of each room.', id: 'Dibuat lebih polos daripada bagian depan omah: hiasan mengikuti derajat setiap ruang.' },
    specs: [{ en: '4 panels per row', id: '4 panel per baris' }, { en: 'Split door', id: 'Pintu dua daun atas-bawah' }],
  },
  {
    id: 'tembok', cat: 'walls', name: 'Tembok', alias: 'Dinding', en: { en: 'Masonry walls', id: 'Dinding tembok' },
    explode: [0, 0.6, -1.4], anchor: [-2.9, 2.4, -1.8], focusDir: [-1, 0.25, 0.3],
    desc: { en: 'Plastered side and back walls and gable ends, with a barred window and a door towards the omah.', id: 'Dinding samping, belakang, dan tebeng berplester, dengan jendela berjeruji dan pintu ke arah omah.' },
    fn: { en: 'Enclose the kitchen; the door leads to the side door of the house.', id: 'Menutup dapur; pintunya menuju pintu samping rumah.' },
    meaning: { en: 'Pawon and omah are separate buildings but work as one household.', id: 'Pawon dan omah adalah bangunan terpisah tetapi bekerja sebagai satu rumah tangga.' },
    specs: [{ en: 'Masonry', id: 'Tembok' }, { en: '1 window, 1 door', id: '1 jendela, 1 pintu' }],
  },
  {
    id: 'tungku', cat: 'walls', name: 'Tungku', alias: 'Luweng, pawon', en: { en: 'Stove', id: 'Tungku' },
    explode: [0, 1.2, 1.4], anchor: [-1.5, 1.4, -2.95], focusDir: [0.3, 0.5, 1],
    desc: { en: 'A wood-fired stove of plastered brick with two pots, and a large water jar.', id: 'Tungku kayu bakar dari bata berplester dengan dua periuk, dan sebuah gentong air besar.' },
    fn: { en: 'Cooking for the household.', id: 'Memasak untuk rumah tangga.' },
    meaning: { en: 'The pawon is the busy, active part of the house, unlike the formal jogosatru and the quiet dalem.', id: 'Pawon adalah bagian rumah yang sibuk dan aktif, berbeda dengan jogosatru yang resmi dan dalem yang tenang.' },
    specs: [{ en: '2 fire holes', id: '2 lubang api' }, { en: 'Water jar', id: 'Gentong air' }],
  },
  {
    id: 'usuk', cat: 'roof', name: 'Usuk & Molo', alias: 'Rangka atap', en: { en: 'Rafters and ridge', id: 'Usuk dan bubungan' },
    explode: [0, 3.6, 0], anchor: [1.8, 4.6, 2.2],
    desc: { en: 'Rafters, battens and ridge beam of the main roof and the sosoran.', id: 'Usuk, reng, dan balok bubungan atap utama dan sosoran.' },
    fn: { en: 'Carry the clay tiles.', id: 'Memikul genteng.' },
    meaning: { en: 'A simple frame for a working building.', id: 'Rangka sederhana untuk bangunan kerja.' },
    specs: [{ en: '{rafters} rafters', id: '{rafters} usuk' }],
  },
  {
    id: 'atap', cat: 'roof', name: 'Kampung Gajah Ngombe', alias: 'Atap kampung', en: { en: 'Steep gable roof with lean-to', id: 'Atap pelana curam dengan sosoran' }, roof: true,
    explode: [0, 5.4, 0], anchor: [0, 5.2, 1.6],
    desc: { en: 'A kampung (gable) roof with a sosoran, a lower lean-to, in front. Like the pencu, its slopes are steep.', id: 'Atap kampung (pelana) dengan sosoran, atap tambahan yang lebih rendah, di depannya. Seperti pencu, bidang atapnya curam.' },
    fn: { en: 'Covers the kitchen and shades its front.', id: 'Menaungi dapur dan meneduhi bagian depannya.' },
    meaning: { en: 'Its steep pitch echoes the pencu next to it.', id: 'Kemiringannya yang curam menggemakan pencu di sebelahnya.' },
    specs: [{ en: '≈39° pitch', id: 'Kemiringan ≈39°' }, { en: 'Sosoran in front', id: 'Sosoran di depan' }],
  },
];

export default { build, categories: CATEGORIES, parts: PARTS, sectionY: 1.7, views: { inside: { pos: [1.6, 2.1, 2.6], target: [-1.5, 1.2, -2.9] } } };
