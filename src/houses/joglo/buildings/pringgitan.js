// Pringgitan: the connecting hall between the pendapa and the dalem, where wayang kulit is staged.
// Local coordinates: long side along x, front (towards the pendapa) facing +z.
import { reseed, partStore, box, frame, lathe, V } from '../../../lib/geometry.js';
import { plinth, umpak, columns, grid, span, hipRoof } from '../../../lib/kit.js';
import * as THREE from 'three';

const FLOOR = 0.7;
const LAMP = [[0, 0], [0.12, 0.02], [0.16, 0.08], [0.1, 0.14], [0.04, 0.22], [0, 0.26]];

function build() {
  reseed(707);
  const { parts, P } = partStore();
  plinth(P('bebatur'), { w: 16.4, d: 7.9, h: FLOOR });

  const pos = grid(span(-7.2, 7.2, 2.4), [-2.8, 2.8]);
  for (const [x, z] of pos) umpak(P('bebatur'), x, z, FLOOR, 0.3, 0.22, 0.3);
  columns(P('saka'), pos, FLOOR + 0.3, 3.4, 0.22);
  frame(P('saka'), 'wood', 7.2, 2.8, 3.49, 0.18, 0.18, 0.25);

  const counts = hipRoof(P, [{ AX: 8.8, AZ: 4.1, y0: 3.1, ix: 5.2, iz: 0, y1: 5.4 }], { roof: 'atap', frame: 'usuk', caps: 'atap' });

  // ── Kelir: wayang screen on its banana-trunk base, with the blencong lamp in front
  const K = P('kelir');
  for (const x of [-2.7, 2.7]) K.add('wood', box(0.1, 2.6, 0.1, x, FLOOR + 1.3, 0.4));
  K.add('plaster', box(5.2, 1.8, 0.02, 0, FLOOR + 1.55, 0.4));
  for (const y of [FLOOR + 0.62, FLOOR + 2.48]) K.add('accent', box(5.3, 0.08, 0.05, 0, y, 0.4));
  K.add('bamboo', new THREE.CylinderGeometry(0.16, 0.16, 5.4, 12).rotateZ(Math.PI / 2).translate(0, FLOOR + 0.16, 0.4));
  K.add('wood', box(0.03, 0.5, 0.03, 0, 3.15, 1.6));
  K.add('ornament', lathe(LAMP, V(0, 2.65, 1.6), null, 12));

  return { parts, counts };
}

const CATEGORIES = [
  { id: 'base',   label: 'Foundation', local: 'Dasar',  color: '#9a948a' },
  { id: 'frame',  label: 'Structure',  local: 'Rangka', color: '#b27a45' },
  { id: 'fixture', label: 'Fittings',  local: 'Piranti', color: '#dcab52' },
  { id: 'roof',   label: 'Roof',       local: 'Atap',   color: '#cf5b3f' },
];

const PARTS = [
  {
    id: 'bebatur', cat: 'base', name: 'Bebatur', alias: 'Umpak', en: 'Plinth and column bases',
    explode: [0, 0, 0], anchor: [-5, 0.45, 4.0],
    desc: 'A stone plinth slightly higher than the pendapa, with an umpak under each column.',
    fn: 'Bridges the floor levels of the pendapa in front and the dalem behind.',
    meaning: 'Moving from pendapa to pringgitan to dalem, the floor rises a little at each step inward.',
    specs: ['Floor +0.70 m', '14 umpak'],
  },
  {
    id: 'saka', cat: 'frame', name: 'Saka & Blandar', alias: 'Rangka', en: 'Columns and ring beam',
    explode: [0, 1.6, 0], anchor: [4.8, 2.4, 2.8],
    desc: 'Two rows of columns tied by a ring beam, carrying a single hipped roof.',
    fn: 'A light open frame: the pringgitan is a passage and a stage rather than a closed room.',
    meaning: 'Its simpler frame shows that it serves the buildings on either side.',
    specs: ['14 columns', '1 ring beam'],
  },
  {
    id: 'kelir', cat: 'fixture', name: 'Kelir', alias: 'Kelir & blencong', en: 'Wayang screen',
    explode: [0, 1.2, 2.5], anchor: [2.2, 2.6, 0.5], focusDir: [0.3, 0.2, 1],
    desc: 'The white cloth screen for a wayang kulit performance, set up on a banana trunk (gedebog) into which the puppets are stuck, lit by the blencong oil lamp. It is put up for performances rather than left standing.',
    fn: 'The dalang sits between lamp and screen and brings the puppets to life as shadows.',
    meaning: 'The pringgitan takes its name from ringgit, an old word for the wayang puppets.',
    specs: ['Set up for performances'],
  },
  {
    id: 'usuk', cat: 'roof', name: 'Usuk & Dudur', alias: 'Rangka atap', en: 'Rafters and hips',
    explode: [0, 4.0, 0], anchor: [4.0, 3.8, 3.2],
    desc: 'Rafters, battens, hip rafters and ridge beam of the hipped roof.',
    fn: 'Carry the clay tiles.',
    meaning: 'The same rafter system as the joglo roofs, on a simpler shape.',
    specs: ['{rafters} rafters', '{battens} battens'],
  },
  {
    id: 'atap', cat: 'roof', name: 'Atap Limasan', alias: 'Limasan', en: 'Hipped roof', roof: true,
    explode: [0, 5.5, 0], anchor: [0, 4.9, 1.6],
    desc: 'A limasan roof: four slopes meeting at a short ridge, lower than the joglo roofs on either side.',
    fn: 'Covers the space between pendapa and dalem; its eaves tuck under theirs.',
    meaning: 'Roof form shows rank: the limasan sits a step below the joglo in the Javanese hierarchy of roofs.',
    specs: ['1 tier', 'Clay tiles'],
  },
];

export default { build, categories: CATEGORIES, parts: PARTS, sectionY: 1.8, views: { inside: { pos: [-5.5, 2.0, 2.2], target: [0, 2.1, 0.4] } } };
