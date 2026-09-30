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
  { id: 'base',  label: 'Foundation', local: 'Dasar',   color: '#9a948a' },
  { id: 'frame', label: 'Structure',  local: 'Rangka',  color: '#b27a45' },
  { id: 'walls', label: 'Walls',      local: 'Dinding', color: '#d9c7a0' },
  { id: 'roof',  label: 'Roof',       local: 'Atap',    color: '#cf5b3f' },
];

const PARTS = [
  {
    id: 'bebatur', cat: 'base', name: 'Bebatur', alias: 'Undhak', en: 'Plinth',
    explode: [0, 0, 0], anchor: [-6, 0.35, 3.1],
    desc: 'A low masonry plinth along the length of the wing.', fn: 'Keeps the rooms dry.',
    meaning: 'Lower than the dalem’s plinth: the wings are secondary to the main house.',
    specs: ['Floor +0.50 m', '18.4 × 6.4 m'],
  },
  {
    id: 'saka', cat: 'frame', name: 'Saka & Blandar', alias: 'Rangka', en: 'Columns and ring beam',
    explode: [0, 1.6, 0], anchor: [4.8, 2.2, 2.7],
    desc: 'Two rows of slender columns tied by a ring beam, built into the walls.', fn: 'Carry the gable roof.',
    meaning: 'A plain frame for everyday rooms.',
    specs: ['16 columns'],
  },
  {
    id: 'dinding', cat: 'walls', name: 'Dinding', alias: 'Tembok & tebeng', en: 'Walls and gable ends',
    explode: [0, 2.8, -1.5], anchor: [-8.4, 2.4, 0], focusDir: [-1, 0.3, 0.4],
    desc: 'Whitewashed walls, with triangular gable panels (tebeng) closing the ends of the roof.',
    fn: 'Enclose a row of rooms.', meaning: 'The long walls give the dalem a sheltered, private yard between the wings.',
    specs: ['Whitewashed', '2 gable ends'],
  },
  {
    id: 'pintu', cat: 'walls', name: 'Pintu & Jendela', alias: 'Kusen', en: 'Doors and windows',
    explode: [0, 1.4, 2.4], anchor: [0, 1.8, 2.8],
    desc: 'A row of doors and windows along the side facing the dalem.', fn: 'Each door opens onto its own room.',
    meaning: 'All openings face inward, towards the family courtyard.',
    specs: ['3 doors', '2 windows'],
  },
  {
    id: 'usuk', cat: 'roof', name: 'Usuk & Molo', alias: 'Rangka atap', en: 'Rafters and ridge',
    explode: [0, 4.0, 0], anchor: [4, 3.7, 3.2],
    desc: 'Rafters, battens and ridge beam of the gable roof.', fn: 'Carry the clay tiles.', meaning: 'The simplest rafter layout in the compound.',
    specs: ['{rafters} rafters'],
  },
  {
    id: 'atap', cat: 'roof', name: 'Atap Kampung', alias: 'Kampung', en: 'Gable roof', roof: true,
    explode: [0, 5.2, 0], anchor: [0, 4.7, 1.4],
    desc: 'A kampung roof: two slopes meeting at a ridge, closed by gables at the ends.', fn: 'Covers the wing simply and cheaply.',
    meaning: 'The kampung is the most common Javanese roof form, below both limasan and joglo in rank.',
    specs: ['2 slopes', 'Clay tiles'],
  },
];

export default { build, categories: CATEGORIES, parts: PARTS, sectionY: 1.6, views: { inside: { pos: [-6.5, 1.7, 1.5], target: [2, 1.8, -1] } } };
