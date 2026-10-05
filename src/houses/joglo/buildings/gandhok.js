// Gandhok: a long side wing beside the dalem (used for both the left and right wings).
// Local coordinates: long side along x, doors facing +z (turned towards the dalem on site).
import { reseed, partStore, box, frame } from '../../../lib/geometry.js';
import { plinth, columns, grid, span, gableRoof, wallRun, opening } from '../../../lib/kit.js';

const FLOOR = 0.5, TOP = 3.2;

function build() {
  reseed(909);
  const { parts, P } = partStore();
  plinth(P('bebatur'), { w: 18.4, d: 6.4, h: FLOOR });

  columns(P('saka'), grid(span(-8.4, 8.4, 2.4), [-2.6, 2.6]), FLOOR, TOP, 0.18);
  frame(P('saka'), 'wood', 8.4, 2.6, TOP + 0.08, 0.16, 0.16, 0.3);

  const h = TOP - FLOOR;
  const doors = [-6, 0, 6], windows = [-3, 3];
  wallRun(P('dinding'), 'plaster', {
    axis: 'x', at: 2.6, from: -8.4, to: 8.4, y0: FLOOR, h, mode: 'stone',
    openings: [...doors.map((c) => ({ c, w: 0.9, h: 2.1 })), ...windows.map((c) => ({ c, w: 0.9, h: 1.0, sill: 0.9 }))],
  });
  wallRun(P('dinding'), 'plaster', { axis: 'x', at: -2.6, from: -8.4, to: 8.4, y0: FLOOR, h, mode: 'stone' });
  for (const x of [-8.4, 8.4]) wallRun(P('dinding'), 'plaster', { axis: 'z', at: x, from: -2.6, to: 2.6, y0: FLOOR, h, mode: 'stone' });
  for (const c of doors) opening(P('pintu'), { at: 2.6, c, w: 0.9, h: 2.1, y0: FLOOR, leaves: 1, open: c === 0 ? 0.9 : 0 });
  for (const c of windows) opening(P('pintu'), { at: 2.6, c, w: 0.9, h: 1.0, y0: FLOOR + 0.9, leaves: 2 });

  const counts = gableRoof(P, {
    AX: 9.6, AZ: 3.9, y0: 3.05, y1: 5.1, roof: 'atap', frame: 'usuk',
    gable: 'dinding', gableSlot: 'plaster', gableBase: TOP + 0.16, gableAt: 8.4,
  });
  return { parts, counts };
}

const CATEGORIES = [
  { id: 'base',  label: { en: 'Foundation', id: 'Fondasi' }, local: 'Dasar',   color: '#9a948a' },
  { id: 'frame', label: { en: 'Structure', id: 'Struktur' },  local: 'Rangka',  color: '#b27a45' },
  { id: 'walls', label: { en: 'Walls', id: 'Dinding' },      local: 'Dinding', color: '#d9c7a0' },
  { id: 'roof',  label: { en: 'Roof', id: 'Atap' },       local: 'Atap',    color: '#cf5b3f' },
];

const PARTS = [
  {
    id: 'bebatur', cat: 'base', name: 'Bebatur', alias: 'Undhak', en: { en: 'Plinth', id: 'Bebatur' },
    explode: [0, 0, 0], anchor: [-6, 0.35, 3.1],
    desc: { en: 'A low masonry plinth along the length of the wing.', id: 'Bebatur pasangan bata yang rendah di sepanjang sayap bangunan.' }, fn: { en: 'Keeps the rooms dry.', id: 'Menjaga ruang-ruang tetap kering.' },
    meaning: { en: 'Lower than the dalem’s plinth: the wings are secondary to the main house.', id: 'Lebih rendah dari bebatur dalem: sayap bangunan berkedudukan di bawah rumah utama.' },
    specs: [{ en: 'Floor +0.50 m', id: 'Lantai +0,50 m' }, '18.4 × 6.4 m'],
  },
  {
    id: 'saka', cat: 'frame', name: 'Saka & Blandar', alias: 'Rangka', en: { en: 'Columns and ring beam', id: 'Tiang dan balok keliling' },
    explode: [0, 1.6, 0], anchor: [4.8, 2.2, 2.7],
    desc: { en: 'Two rows of slender columns tied by a ring beam, built into the walls.', id: 'Dua baris tiang ramping yang diikat balok keliling dan menyatu dengan dinding.' }, fn: { en: 'Carry the gable roof.', id: 'Memikul atap pelana.' },
    meaning: { en: 'A plain frame for everyday rooms.', id: 'Rangka sederhana untuk ruang sehari-hari.' },
    specs: [{ en: '16 columns', id: '16 tiang' }],
  },
  {
    id: 'dinding', cat: 'walls', name: 'Dinding', alias: 'Tembok & tebeng', en: { en: 'Walls and gable ends', id: 'Dinding dan tebeng' },
    explode: [0, 2.8, -1.5], anchor: [-8.4, 2.4, 0], focusDir: [-1, 0.3, 0.4],
    desc: { en: 'Whitewashed walls, with triangular gable panels (tebeng) closing the ends of the roof.', id: 'Dinding bercat kapur putih, dengan panel segitiga (tebeng) yang menutup kedua ujung atap.' },
    fn: { en: 'Enclose a row of rooms.', id: 'Menutup sederetan kamar.' }, meaning: { en: 'The long walls give the dalem a sheltered, private yard between the wings.', id: 'Dinding yang panjang memberi dalem halaman yang terlindung dan privat di antara kedua sayap.' },
    specs: [{ en: 'Whitewashed', id: 'Dikapur putih' }, { en: '2 gable ends', id: '2 tebeng' }],
  },
  {
    id: 'pintu', cat: 'walls', name: 'Pintu & Jendela', alias: 'Kusen', en: { en: 'Doors and windows', id: 'Pintu dan jendela' },
    explode: [0, 1.4, 2.4], anchor: [0, 1.8, 2.8],
    desc: { en: 'A row of doors and windows along the side facing the dalem.', id: 'Deretan pintu dan jendela di sisi yang menghadap dalem.' }, fn: { en: 'Each door opens onto its own room.', id: 'Setiap pintu membuka ke kamarnya sendiri.' },
    meaning: { en: 'All openings face inward, towards the family courtyard.', id: 'Semua bukaan menghadap ke dalam, ke halaman keluarga.' },
    specs: [{ en: '3 doors', id: '3 pintu' }, { en: '2 windows', id: '2 jendela' }],
  },
  {
    id: 'usuk', cat: 'roof', name: 'Usuk & Molo', alias: 'Rangka atap', en: { en: 'Rafters and ridge', id: 'Usuk dan bubungan' },
    explode: [0, 4.0, 0], anchor: [4, 3.7, 3.2],
    desc: { en: 'Rafters, battens and ridge beam of the gable roof.', id: 'Usuk, reng, dan balok bubungan atap pelana.' }, fn: { en: 'Carry the clay tiles.', id: 'Memikul genteng tanah liat.' }, meaning: { en: 'The simplest rafter layout in the compound.', id: 'Susunan usuk paling sederhana di kompleks ini.' },
    specs: [{ en: '{rafters} rafters', id: '{rafters} usuk' }],
  },
  {
    id: 'atap', cat: 'roof', name: 'Atap Kampung', alias: 'Kampung', en: { en: 'Gable roof', id: 'Atap pelana' }, roof: true,
    explode: [0, 5.2, 0], anchor: [0, 4.7, 1.4],
    desc: { en: 'A kampung roof: two slopes meeting at a ridge, closed by gables at the ends.', id: 'Atap kampung: dua bidang miring yang bertemu di bubungan, ditutup tebeng di kedua ujungnya.' }, fn: { en: 'Covers the wing simply and cheaply.', id: 'Menaungi sayap bangunan dengan sederhana dan murah.' },
    meaning: { en: 'The kampung is the most common Javanese roof form, below both limasan and joglo in rank.', id: 'Kampung adalah bentuk atap Jawa yang paling umum, kedudukannya di bawah limasan dan joglo.' },
    specs: [{ en: '2 slopes', id: '2 bidang atap' }, { en: 'Clay tiles', id: 'Genteng tanah liat' }],
  },
];

export default { build, categories: CATEGORIES, parts: PARTS, sectionY: 1.6, views: { inside: { pos: [-6.5, 1.7, 1.5], target: [2, 1.8, -1] } } };
