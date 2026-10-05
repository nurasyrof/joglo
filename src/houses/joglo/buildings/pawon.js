// Pawon: the kitchen at the back of the compound, with woven bamboo walls and a clay stove.
// Local coordinates: long side along x, door facing +z.
import { reseed, partStore, box, frame, lathe, V } from '../../../lib/geometry.js';
import { columns, grid, gableRoof, wallRun, opening } from '../../../lib/kit.js';

const FLOOR = 0.15, TOP = 2.7;
const POT = [[0, 0], [0.14, 0], [0.22, 0.1], [0.24, 0.2], [0.18, 0.3], [0.2, 0.34], [0, 0.34]];
const JAR = [[0, 0], [0.18, 0], [0.3, 0.2], [0.32, 0.45], [0.24, 0.66], [0.2, 0.72], [0, 0.72]];

function build() {
  reseed(1010);
  const { parts, P } = partStore();
  P('lantai').add('ground', box(9.4, FLOOR, 6.4, 0, FLOOR / 2, 0, 'world', 2));

  columns(P('saka'), grid([-3.6, -1.2, 1.2, 3.6], [-2.4, 2.4]), FLOOR, TOP, 0.16);
  frame(P('saka'), 'wood', 3.6, 2.4, TOP + 0.07, 0.14, 0.14, 0.3);

  const h = TOP - FLOOR;
  wallRun(P('dinding'), 'bamboo', { axis: 'x', at: 2.4, from: -3.6, to: 3.6, y0: FLOOR, h, t: 0.06, mode: 'world', openings: [{ c: 0.6, w: 1.1, h: 2.0 }] });
  wallRun(P('dinding'), 'bamboo', { axis: 'x', at: -2.4, from: -3.6, to: 3.6, y0: FLOOR, h, t: 0.06, mode: 'world' });
  for (const x of [-3.6, 3.6]) wallRun(P('dinding'), 'bamboo', { axis: 'z', at: x, from: -2.4, to: 2.4, y0: FLOOR, h, t: 0.06, mode: 'world' });
  opening(P('dinding'), { at: 2.4, c: 0.6, w: 1.1, h: 2.0, y0: FLOOR, leaves: 1, open: 0.7, t: 0.06, leafSlot: 'bamboo' });

  // Luweng: clay wood-fired stove with two pots, and a water jar by the door
  P('luweng').add('plaster', box(1.8, 0.7, 0.7, -1.6, FLOOR + 0.35, -1.85, 'stone', 1));
  for (const x of [-2.1, -1.1]) P('luweng').add('accent', lathe(POT, V(x, FLOOR + 0.7, -1.85), null, 14));
  P('luweng').add('accent', lathe(JAR, V(2.6, FLOOR, 1.7), null, 16));

  const counts = gableRoof(P, {
    AX: 5.2, AZ: 3.4, y0: 2.6, y1: 4.4, roof: 'atap', frame: 'usuk',
    gable: 'dinding', gableSlot: 'bamboo', gableBase: TOP + 0.14, gableAt: 3.6,
  });
  return { parts, counts };
}

const CATEGORIES = [
  { id: 'base',  label: { en: 'Floor & frame', id: 'Lantai & rangka' }, local: 'Rangka',  color: '#b27a45' },
  { id: 'walls', label: { en: 'Walls & stove', id: 'Dinding & tungku' }, local: 'Dinding', color: '#d9c7a0' },
  { id: 'roof',  label: { en: 'Roof', id: 'Atap' },          local: 'Atap',    color: '#cf5b3f' },
];

const PARTS = [
  {
    id: 'lantai', cat: 'base', name: 'Lantai', alias: 'Jogan', en: { en: 'Earth floor', id: 'Lantai tanah' },
    explode: [0, 0, 0], anchor: [2, 0.2, 2.9],
    desc: { en: 'A floor of rammed earth, barely raised above the yard.', id: 'Lantai tanah yang dipadatkan, nyaris sejajar dengan halaman.' }, fn: { en: 'Tolerates fire, ash and water from cooking.', id: 'Tahan terhadap api, abu, dan air dari kegiatan memasak.' },
    meaning: { en: 'The lowest floor in the compound, for the humblest, busiest room.', id: 'Lantai paling rendah di kompleks, untuk ruang yang paling sederhana dan paling sibuk.' },
    specs: [{ en: 'Rammed earth', id: 'Tanah dipadatkan' }],
  },
  {
    id: 'saka', cat: 'base', name: 'Saka', alias: 'Rangka', en: { en: 'Columns and ring beam', id: 'Tiang dan balok keliling' },
    explode: [0, 1.4, 0], anchor: [3.6, 2.0, 2.4],
    desc: { en: 'A light timber frame of eight columns and a ring beam.', id: 'Rangka kayu ringan dari delapan tiang dan balok keliling.' }, fn: { en: 'Carries the roof.', id: 'Memikul atap.' }, meaning: { en: 'Built simply and cheaply, easy to repair.', id: 'Dibangun sederhana dan murah, mudah diperbaiki.' },
    specs: [{ en: '8 columns', id: '8 tiang' }],
  },
  {
    id: 'dinding', cat: 'walls', name: 'Dinding Gedhèk', alias: 'Gedhèk', en: { en: 'Woven bamboo walls', id: 'Dinding anyaman bambu' },
    explode: [0, 2.4, 0], anchor: [-3.6, 1.8, 0], focusDir: [-1, 0.3, 0.5],
    desc: { en: 'Walls and gable ends of woven split bamboo (gedhèk).', id: 'Dinding dan tebeng dari anyaman bilah bambu (gedhèk).' }, fn: { en: 'Let smoke from the stove escape through the weave while keeping out rain.', id: 'Membiarkan asap tungku keluar melalui celah anyaman sambil menahan air hujan.' },
    meaning: { en: 'Light, breathable walls for a working room.', id: 'Dinding yang ringan dan berongga untuk ruang kerja.' },
    specs: [{ en: 'Woven bamboo', id: 'Anyaman bambu' }, { en: '1 door', id: '1 pintu' }],
  },
  {
    id: 'luweng', cat: 'walls', name: 'Luweng', alias: 'Tungku', en: { en: 'Clay stove', id: 'Tungku tanah liat' },
    explode: [0, 1.2, 1.4], anchor: [-1.6, 1.1, -1.85], focusDir: [0.3, 0.5, 1],
    desc: { en: 'A wood-fired stove of clay-plastered brick with openings for the pots, and a large water jar by the door.', id: 'Tungku kayu bakar dari bata berlapis tanah liat dengan lubang untuk periuk, dan gentong air besar di dekat pintu.' },
    fn: { en: 'Cooking for the whole household.', id: 'Memasak untuk seluruh rumah tangga.' }, meaning: { en: 'The kitchen fire is the everyday heart of the household.', id: 'Api dapur adalah jantung keseharian rumah tangga.' },
    specs: [{ en: '2 fire holes', id: '2 lubang api' }, { en: 'Water jar', id: 'Gentong air' }],
  },
  {
    id: 'usuk', cat: 'roof', name: 'Usuk & Molo', alias: 'Rangka atap', en: { en: 'Rafters and ridge', id: 'Usuk dan bubungan' },
    explode: [0, 3.4, 0], anchor: [2, 3.1, 2.8],
    desc: { en: 'Rafters, battens and ridge beam.', id: 'Usuk, reng, dan balok bubungan.' }, fn: { en: 'Carry the roof tiles.', id: 'Memikul genteng.' }, meaning: { en: 'The same simple system as the gandhok.', id: 'Sistem sederhana yang sama dengan gandhok.' },
    specs: [{ en: '{rafters} rafters', id: '{rafters} usuk' }],
  },
  {
    id: 'atap', cat: 'roof', name: 'Atap Kampung', alias: 'Kampung', en: { en: 'Gable roof', id: 'Atap pelana' }, roof: true,
    explode: [0, 4.4, 0], anchor: [0, 3.9, 1.2],
    desc: { en: 'A simple kampung (gable) roof.', id: 'Atap kampung (pelana) yang sederhana.' }, fn: { en: 'Covers the kitchen.', id: 'Menaungi dapur.' }, meaning: { en: 'The plainest roof form, for a service building.', id: 'Bentuk atap paling sederhana, untuk bangunan servis.' },
    specs: [{ en: '2 slopes', id: '2 bidang atap' }],
  },
];

export default { build, categories: CATEGORIES, parts: PARTS, sectionY: 1.4, views: { inside: { pos: [2.8, 1.6, 1.6], target: [-1.6, 0.9, -1.8] } } };
