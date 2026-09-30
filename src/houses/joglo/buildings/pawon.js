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
  { id: 'base',  label: 'Floor & frame', local: 'Rangka',  color: '#b27a45' },
  { id: 'walls', label: 'Walls & stove', local: 'Dinding', color: '#d9c7a0' },
  { id: 'roof',  label: 'Roof',          local: 'Atap',    color: '#cf5b3f' },
];

const PARTS = [
  {
    id: 'lantai', cat: 'base', name: 'Lantai', alias: 'Jogan', en: 'Earth floor',
    explode: [0, 0, 0], anchor: [2, 0.2, 2.9],
    desc: 'A floor of rammed earth, barely raised above the yard.', fn: 'Tolerates fire, ash and water from cooking.',
    meaning: 'The lowest floor in the compound, for the humblest, busiest room.',
    specs: ['Rammed earth'],
  },
  {
    id: 'saka', cat: 'base', name: 'Saka', alias: 'Rangka', en: 'Columns and ring beam',
    explode: [0, 1.4, 0], anchor: [3.6, 2.0, 2.4],
    desc: 'A light timber frame of eight columns and a ring beam.', fn: 'Carries the roof.', meaning: 'Built simply and cheaply, easy to repair.',
    specs: ['8 columns'],
  },
  {
    id: 'dinding', cat: 'walls', name: 'Dinding Gedhèk', alias: 'Gedhèk', en: 'Woven bamboo walls',
    explode: [0, 2.4, 0], anchor: [-3.6, 1.8, 0], focusDir: [-1, 0.3, 0.5],
    desc: 'Walls and gable ends of woven split bamboo (gedhèk).', fn: 'Let smoke from the stove escape through the weave while keeping out rain.',
    meaning: 'Light, breathable walls for a working room.',
    specs: ['Woven bamboo', '1 door'],
  },
  {
    id: 'luweng', cat: 'walls', name: 'Luweng', alias: 'Tungku', en: 'Clay stove',
    explode: [0, 1.2, 1.4], anchor: [-1.6, 1.1, -1.85], focusDir: [0.3, 0.5, 1],
    desc: 'A wood-fired stove of clay-plastered brick with openings for the pots, and a large water jar by the door.',
    fn: 'Cooking for the whole household.', meaning: 'The kitchen fire is the everyday heart of the household.',
    specs: ['2 fire holes', 'Water jar'],
  },
  {
    id: 'usuk', cat: 'roof', name: 'Usuk & Molo', alias: 'Rangka atap', en: 'Rafters and ridge',
    explode: [0, 3.4, 0], anchor: [2, 3.1, 2.8],
    desc: 'Rafters, battens and ridge beam.', fn: 'Carry the roof tiles.', meaning: 'The same simple system as the gandhok.',
    specs: ['{rafters} rafters'],
  },
  {
    id: 'atap', cat: 'roof', name: 'Atap Kampung', alias: 'Kampung', en: 'Gable roof', roof: true,
    explode: [0, 4.4, 0], anchor: [0, 3.9, 1.2],
    desc: 'A simple kampung (gable) roof.', fn: 'Covers the kitchen.', meaning: 'The plainest roof form, for a service building.',
    specs: ['2 slopes'],
  },
];

export default { build, categories: CATEGORIES, parts: PARTS, sectionY: 1.4, views: { inside: { pos: [2.8, 1.6, 1.6], target: [-1.6, 0.9, -1.8] } } };
