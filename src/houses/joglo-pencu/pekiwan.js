// Pekiwan: the well and two roofed bathing rooms, across the yard in front of the pawon.
// Local coordinates: well on the left (−x), bathing rooms on the right, entrances facing +z.
import * as THREE from 'three';
import { reseed, partStore, box, lathe, V } from '../../lib/geometry.js';
import { mergeStore, gableRoof, wallRun, opening } from '../../lib/kit.js';

const WELL = [[0.55, 0], [0.72, 0], [0.72, 0.8], [0.55, 0.8], [0.55, 0]];
const BUCKET = [[0, 0], [0.12, 0], [0.15, 0.25], [0, 0.25]];
const JAR = [[0, 0], [0.18, 0], [0.3, 0.2], [0.32, 0.45], [0.24, 0.66], [0.2, 0.72], [0, 0.72]];
const FL = 0.15, TOP = 2.3;

function build() {
  reseed(50331);
  const { parts, P } = partStore();
  const wx = -1.7;

  // ── Sumur: brick well ring on a stone apron, with a timber frame, pulley and bucket
  const S = P('sumur');
  S.add('stone', box(2.6, 0.08, 2.6, wx, 0.04, 0.1, 'stone', 1));
  S.add('plaster', lathe(WELL, V(wx, 0.08, 0), null, 24));
  for (const s of [-1, 1]) S.add('wood', box(0.12, 2.2, 0.12, wx + s * 0.9, 1.1, 0));
  S.add('wood', box(1.92, 0.12, 0.12, wx, 2.2, 0));
  S.add('ornament', new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16).rotateX(Math.PI / 2).translate(wx, 2.02, 0));
  S.add('wood', box(0.02, 1.1, 0.02, wx, 1.45, 0));
  S.add('wood', lathe(BUCKET, V(wx, 0.9, 0), null, 12));

  // ── Bilik: two bathing rooms side by side, with doors to the yard and water jars
  const B = P('bilik');
  const x0 = -0.2, x1 = 3.4, xm = (x0 + x1) / 2, D = 1.3;
  B.add('stone', box(x1 - x0, FL, 2 * D, xm, FL / 2, 0, 'stone', 1));
  const doors = [{ c: x0 + 0.9, w: 0.75, h: 1.95 }, { c: x1 - 0.9, w: 0.75, h: 1.95 }];
  wallRun(B, 'plaster', { axis: 'x', at: D, from: x0, to: x1, y0: FL, h: TOP - FL, t: 0.15, mode: 'stone', openings: doors });
  for (const o of doors) opening(B, { at: D, c: o.c, w: o.w, h: o.h, y0: FL, leaves: 1, open: 0.5, t: 0.15 });
  wallRun(B, 'plaster', { axis: 'x', at: -D, from: x0, to: x1, y0: FL, h: TOP - FL, t: 0.15, mode: 'stone' });
  for (const x of [x0, xm, x1]) wallRun(B, 'plaster', { axis: 'z', at: x, from: -D, to: D, y0: FL, h: TOP - FL, t: 0.15, mode: 'stone' });
  for (const x of [x0 + 0.9, x1 - 0.9]) B.add('accent', lathe(JAR, V(x, FL, -0.7), null, 16));

  const roof = partStore();
  gableRoof(roof.P, {
    AX: (x1 - x0) / 2 + 0.45, AZ: D + 0.55, y0: TOP - 0.05, y1: TOP + 1.25, t: 0.08, roof: 'atap', frame: 'atap',
    gable: 'bilik', gableSlot: 'plaster', gableBase: TOP, gableAt: (x1 - x0) / 2,
  });
  mergeStore(P, roof.parts, { dx: xm });

  return { parts, counts: {} };
}

const CATEGORIES = [
  { id: 'water', label: { en: 'Water', id: 'Air' },     local: 'Banyu', color: '#6fa0b8' },
  { id: 'roof',  label: { en: 'Roof', id: 'Atap' },     local: 'Atap',  color: '#cf5b3f' },
];

const PARTS = [
  {
    id: 'sumur', cat: 'water', name: 'Sumur', alias: 'Sumur & kerekan', en: { en: 'Well', id: 'Sumur' },
    explode: [0, 0, 0], anchor: [-1.7, 1.0, 0.8], focusDir: [0.4, 0.6, 1],
    desc: { en: 'A brick-lined well with a timber frame, pulley and bucket.', id: 'Sumur berdinding bata dengan rangka kayu, kerekan, dan timba.' },
    fn: { en: 'Water for bathing, washing and cooking.', id: 'Air untuk mandi, mencuci, dan memasak.' },
    meaning: { en: 'In the Kudus house the well stands across the yard from the house, not behind it.', id: 'Pada rumah Kudus, sumur berada di seberang halaman dari rumah, bukan di belakangnya.' },
    specs: [{ en: 'Brick ring', id: 'Cincin bata' }, { en: 'Pulley & bucket', id: 'Kerekan & timba' }],
  },
  {
    id: 'bilik', cat: 'water', name: 'Bilik Mandi', alias: 'Kamar mandi', en: { en: 'Two bathing rooms', id: 'Dua bilik mandi' },
    explode: [0, 1.2, 1.0], anchor: [2.5, 1.6, 1.4],
    desc: { en: 'Two small rooms for bathing, each with a large water jar.', id: 'Dua bilik kecil untuk mandi, masing-masing dengan gentong air besar.' },
    fn: { en: 'Privacy for bathing with water drawn from the well next to them.', id: 'Memberi privasi untuk mandi dengan air yang ditimba dari sumur di sebelahnya.' },
    meaning: { en: 'Service spaces are kept apart from the house, on the far side of the yard.', id: 'Ruang servis dipisahkan dari rumah, di sisi seberang halaman.' }, interp: true,
    specs: [{ en: '2 rooms', id: '2 bilik' }, { en: 'Water jars', id: 'Gentong air' }],
  },
  {
    id: 'atap', cat: 'roof', name: 'Atap Kampung', alias: 'Kampung', en: { en: 'Gable roof', id: 'Atap pelana' }, roof: true,
    explode: [0, 2.6, 0], anchor: [1.6, 3.2, 1.0],
    desc: { en: 'A small kampung (gable) roof over the bathing rooms.', id: 'Atap kampung (pelana) kecil di atas bilik mandi.' },
    fn: { en: 'Keeps the rain off the bathing rooms.', id: 'Melindungi bilik mandi dari hujan.' },
    meaning: { en: 'The plainest roof form, for the plainest building.', id: 'Bentuk atap paling sederhana, untuk bangunan paling sederhana.' },
    specs: [{ en: 'Clay tiles', id: 'Genteng tanah liat' }],
  },
];

export default { build, categories: CATEGORIES, parts: PARTS, sectionY: 1.2, views: { inside: { pos: [0.8, 1.7, 3.6], target: [-1.2, 0.9, 0] } } };
