// Gadri: the everyday family room behind the dalem, used for eating and daily life.
// Local coordinates: long side along x, open front (towards the dalem) facing +z.
import { reseed, partStore, box, frame } from '../../../lib/geometry.js';
import { plinth, umpak, columns, grid, span, hipRoof, wallRun } from '../../../lib/kit.js';

const FLOOR = 0.6;

function build() {
  reseed(808);
  const { parts, P } = partStore();
  plinth(P('bebatur'), { w: 14.4, d: 6.6, h: FLOOR });

  const pos = grid(span(-6, 6, 2.4), [-2.4, 2.4]);
  for (const [x, z] of pos) umpak(P('bebatur'), x, z, FLOOR, 0.3, 0.2, 0.28);
  columns(P('saka'), pos, FLOOR + 0.3, 3.2, 0.2);
  frame(P('saka'), 'wood', 6, 2.4, 3.28, 0.16, 0.16, 0.25);

  wallRun(P('dinding'), 'plank', { axis: 'x', at: -2.4, from: -6, to: 6, y0: FLOOR, h: 2.6 });
  for (const x of [-6, 6]) wallRun(P('dinding'), 'plank', { axis: 'z', at: x, from: -2.4, to: 2.4, y0: FLOOR, h: 2.6 });

  // Two bamboo daybeds (amben)
  for (const x of [-3, 2.6]) {
    P('amben').add('bamboo', box(2.0, 0.08, 1.2, x, FLOOR + 0.45, -1.2));
    for (const [dx, dz] of [[-0.9, -0.5], [0.9, -0.5], [-0.9, 0.5], [0.9, 0.5]]) P('amben').add('bamboo', box(0.07, 0.42, 0.07, x + dx, FLOOR + 0.21, -1.2 + dz));
  }

  const counts = hipRoof(P, [{ AX: 7.6, AZ: 3.6, y0: 3.0, ix: 4.0, iz: 0, y1: 5.0 }], { roof: 'atap', frame: 'usuk', caps: 'atap' });
  return { parts, counts };
}

const CATEGORIES = [
  { id: 'base',  label: 'Foundation', local: 'Dasar',  color: '#9a948a' },
  { id: 'frame', label: 'Structure',  local: 'Rangka', color: '#b27a45' },
  { id: 'walls', label: 'Walls & fittings', local: 'Dinding', color: '#d9c7a0' },
  { id: 'roof',  label: 'Roof',       local: 'Atap',   color: '#cf5b3f' },
];

const PARTS = [
  {
    id: 'bebatur', cat: 'base', name: 'Bebatur', alias: 'Umpak', en: 'Plinth and column bases',
    explode: [0, 0, 0], anchor: [-4.5, 0.4, 3.2],
    desc: 'A low stone plinth with an umpak under each column.',
    fn: 'Keeps the family room dry.', meaning: 'A step down from the dalem: this is the everyday, not the ceremonial, side of the house.',
    specs: ['Floor +0.60 m'],
  },
  {
    id: 'saka', cat: 'frame', name: 'Saka & Blandar', alias: 'Rangka', en: 'Columns and ring beam',
    explode: [0, 1.6, 0], anchor: [3.6, 2.4, 2.4],
    desc: 'Two rows of columns and a ring beam under a hipped roof.',
    fn: 'A simple open frame for a working room.', meaning: 'Plainer than the dalem: no tumpang sari, no carving.',
    specs: ['12 columns'],
  },
  {
    id: 'dinding', cat: 'walls', name: 'Dinding', alias: 'Dinding papan', en: 'Back and side walls',
    explode: [0, 2.6, -1.5], anchor: [0, 2.2, -2.4], focusDir: [0.3, 0.3, 1],
    desc: 'Plank walls at the back and sides; the front stays open towards the dalem.',
    fn: 'Shelters the room while keeping it connected to the rest of the house.', meaning: 'The gadri faces inward, towards the family.',
    specs: ['Teak boards', 'Open front'],
  },
  {
    id: 'amben', cat: 'walls', name: 'Amben', alias: 'Bale-bale', en: 'Bamboo daybeds',
    explode: [0, 1.4, 1.5], anchor: [-3, 1.2, -1.2],
    desc: 'Low bamboo platforms used for sitting, eating and resting.',
    fn: 'The family gathers, eats and naps here during the day.', meaning: 'Everyday life happens here, away from the formal pendapa and the sacred dalem.',
    specs: ['2 daybeds', 'Bamboo'],
  },
  {
    id: 'usuk', cat: 'roof', name: 'Usuk & Dudur', alias: 'Rangka atap', en: 'Rafters and hips',
    explode: [0, 4.0, 0], anchor: [3.6, 3.6, 3.0],
    desc: 'Rafters, battens, hip rafters and ridge beam.', fn: 'Carry the clay tiles.', meaning: 'The same timber system as the rest of the compound.',
    specs: ['{rafters} rafters'],
  },
  {
    id: 'atap', cat: 'roof', name: 'Atap Limasan', alias: 'Limasan', en: 'Hipped roof', roof: true,
    explode: [0, 5.2, 0], anchor: [0, 4.6, 1.4],
    desc: 'A limasan roof tucked under the eaves of the dalem.', fn: 'Covers the family room.',
    meaning: 'A lower roof form for a lower-ranked space.',
    specs: ['1 tier', 'Clay tiles'],
  },
];

export default { build, categories: CATEGORIES, parts: PARTS, sectionY: 1.8, views: { inside: { pos: [-5.0, 1.7, 2.0], target: [2, 1.4, -1.5] } } };
