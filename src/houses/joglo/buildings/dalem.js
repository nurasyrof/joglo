// Dalem (dalem ageng): the enclosed family house behind the pendapa.
// Same joglo frame as the pendapa, on a higher floor, walled in with a carved gebyok front
// and three senthong rooms at the back. Local coordinates: front (towards the pringgitan) +z.
import { reseed, partStore, box, lathe, V } from '../../../lib/geometry.js';
import { mergeStore, plinth, wallRun, opening } from '../../../lib/kit.js';
import { jogloStructure, DIM } from '../structure.js';

const FLOOR = 0.8;
const DY = FLOOR - DIM.floorTop;          // the shared frame is designed for a 0.6 m floor
const WALL_TOP = DIM.pit.top + DY;
const WX = DIM.pit.x, WZ = DIM.pit.z;     // walls run along the outer column ring
const SENTHONG_Z = -DIM.pen.z;            // partition in front of the three senthong

const FIGURE = [[0, 0], [0.18, 0], [0.2, 0.05], [0.16, 0.25], [0.12, 0.4], [0.09, 0.48], [0.1, 0.56], [0.07, 0.66], [0, 0.72]];

function build() {
  reseed(5151);
  const { parts, P } = partStore();

  plinth(P('bebatur'), { w: 17.0, d: 14.8, h: FLOOR });

  // The joglo frame, with the smaller pieces merged into fewer parts.
  const frameStore = partStore();
  const counts = jogloStructure(frameStore.P, {
    pen: 'saka', pit: 'saka', sunduk: 'rangka', blandar: 'rangka', lambang: 'rangka',
    dadha: 'tumpang_sari', uleng: 'tumpang_sari', dudur: 'usuk', molo: 'usuk',
    mustaka: 'atap', brunjung: 'atap', penanggap: 'atap', penitih: 'atap',
  });
  mergeStore(P, frameStore.parts, { dy: DY });

  const h = WALL_TOP - FLOOR;

  // ── Gebyok: carved teak front wall with a double door and two side doors
  const front = [{ c: 0, w: 1.8, h: 2.4 }, { c: -4.0, w: 1.0, h: 2.1 }, { c: 4.0, w: 1.0, h: 2.1 }];
  const G = P('gebyok');
  wallRun(G, 'carved', { axis: 'x', at: WZ, from: -WX, to: WX, y0: FLOOR, h, t: 0.14, openings: front });
  opening(G, { at: WZ, c: 0, w: 1.8, h: 2.4, y0: FLOOR, leaves: 2, open: 1.25, t: 0.14, leafSlot: 'carved' });
  for (const c of [-4.0, 4.0]) opening(G, { at: WZ, c, w: 1.0, h: 2.1, y0: FLOOR, leaves: 1, t: 0.14, leafSlot: 'carved' });
  for (let x = -WX + 0.35; x < WX - 0.2; x += 0.75) {
    if (front.some((o) => Math.abs(x - o.c) < o.w / 2 + 0.14)) continue;
    G.add('wood', box(0.07, h - 0.1, 0.03, x, FLOOR + h / 2, WZ + 0.085));
  }
  G.add('accent', box(2 * WX - 0.2, 0.16, 0.05, 0, WALL_TOP - 0.25, WZ + 0.09));

  // ── Side and back walls of teak boards, with barred windows on the sides
  const D = P('dinding');
  wallRun(D, 'plank', { axis: 'x', at: -WZ, from: -WX, to: WX, y0: FLOOR, h, t: 0.14 });
  for (const s of [-1, 1]) {
    wallRun(D, 'plank', { axis: 'z', at: s * WX, from: -WZ, to: WZ, y0: FLOOR, h, t: 0.14, openings: [{ c: 3.15, w: 1.0, h: 1.0, sill: 1.0 }] });
    for (const z of [2.85, 3.15, 3.45]) D.add('wood', box(0.04, 1.0, 0.04, s * WX, FLOOR + 1.5, z));
  }

  // ── Senthong: carved partition with kiwa / tengah / tengen rooms behind it
  const S = P('senthong');
  const rooms = [{ c: -3.9, w: 0.9, h: 2.1 }, { c: 0, w: 2.4, h: 2.6 }, { c: 3.9, w: 0.9, h: 2.1 }];
  wallRun(S, 'carved', { axis: 'x', at: SENTHONG_Z, from: -WX, to: WX, y0: FLOOR, h, t: 0.12, openings: rooms });
  for (const c of [-3.9, 3.9]) opening(S, { at: SENTHONG_Z, c, w: 0.9, h: 2.1, y0: FLOOR, leaves: 1, open: 1.0, leafSlot: 'carved' });
  opening(S, { at: SENTHONG_Z, c: 0, w: 2.4, h: 2.6, y0: FLOOR, leaves: 0 });
  S.add('accent', box(2.7, 0.3, 0.06, 0, FLOOR + 2.6 + 0.25, SENTHONG_Z + 0.09));
  for (const x of [-2.6, 2.6]) wallRun(S, 'plank', { axis: 'z', at: x, from: -WZ, to: SENTHONG_Z, y0: FLOOR, h, t: 0.1 });

  // ── Krobongan in the senthong tengah, with loro blonyo figures in front
  const K = P('krobongan');
  const kz = -5.75;
  K.add('carved', box(2.2, 0.45, 1.5, 0, FLOOR + 0.225, kz));
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) K.add('carved', box(0.07, 1.95, 0.07, sx * 1.05, FLOOR + 0.45 + 0.975, kz + sz * 0.7));
  K.add('carved', box(2.2, 0.08, 0.08, 0, FLOOR + 2.4, kz + 0.7)).add('carved', box(2.2, 0.08, 0.08, 0, FLOOR + 2.4, kz - 0.7));
  K.add('accent', box(2.1, 1.9, 0.03, 0, FLOOR + 1.4, kz - 0.68));
  for (const s of [-1, 1]) K.add('accent', box(0.03, 1.9, 1.35, s * 1.03, FLOOR + 1.4, kz));
  K.add('accent', box(2.2, 0.35, 0.03, 0, FLOOR + 2.2, kz + 0.72));
  for (const s of [-1, 1]) K.add('ornament', lathe(FIGURE, V(s * 0.35, FLOOR, SENTHONG_Z + 0.55), null, 14));

  return { parts, counts };
}

const CATEGORIES = [
  { id: 'base',     label: 'Foundation', local: 'Dasar',  color: '#9a948a' },
  { id: 'column',   label: 'Columns',    local: 'Saka',   color: '#b27a45' },
  { id: 'frame',    label: 'Frame',      local: 'Rangka', color: '#dcab52' },
  { id: 'walls',    label: 'Walls',      local: 'Dinding', color: '#d9c7a0' },
  { id: 'interior', label: 'Interior',   local: 'Jero',   color: '#b3674a' },
  { id: 'roof',     label: 'Roof',       local: 'Atap',   color: '#cf5b3f' },
];

const PARTS = [
  {
    id: 'bebatur', cat: 'base', name: 'Bebatur', alias: 'Undhak', en: 'Raised plinth',
    explode: [0, 0, 0], anchor: [0, 0.45, 7.4],
    desc: 'The dalem stands on a stone plinth higher than the pendapa’s.',
    fn: 'Lifts the family rooms above ground damp and flooding.',
    meaning: 'The floor rises as you move inward: each step deeper into the compound is also a step up, towards the most private and honoured space.',
    specs: ['Floor +0.80 m', '17.0 × 14.8 m'],
  },
  {
    id: 'umpak', cat: 'base', name: 'Umpak', alias: 'Ompak', en: 'Stone column bases',
    explode: [0, 1.3, 0], anchor: [5.2, 1.2, 4.4],
    desc: 'Truncated-pyramid stones under every column, as in the pendapa.',
    fn: 'Keep the posts dry and let the frame shift in an earthquake without snapping.',
    meaning: 'The same foundation as the pendapa: the whole omah rests on stone rather than being rooted in the ground.',
    specs: ['36 bases', 'Andesite'],
  },
  {
    id: 'saka_guru', cat: 'column', name: 'Saka Guru', alias: 'Soko guru', en: 'Four master columns',
    explode: [0, 2.6, 0], anchor: [2.2, 4.4, 1.9], focusDir: [0.9, 0.25, 1],
    desc: 'The four central teak columns carry the tumpang sari and the high brunjung roof, just as in the pendapa.',
    fn: 'The main load path of the dalem’s roof.',
    meaning: 'They mark the sacred centre of the family house, the four directions around the pancer.',
    specs: ['4 columns', '32 × 32 cm'],
  },
  {
    id: 'saka', cat: 'column', name: 'Saka Penanggap & Penitih', alias: 'Saka pinggir', en: 'Outer column rings',
    explode: [0, 2.6, 0], anchor: [-5.2, 3.2, 4.4],
    desc: 'Two rings of shorter columns around the saka guru. The outer ring is built into the walls.',
    fn: 'Carry the middle and lower roof tiers and frame the walls and senthong partition.',
    meaning: 'Rings around a centre, like the pendapa: the order of the house repeats in every building.',
    specs: ['32 columns'],
  },
  {
    id: 'rangka', cat: 'frame', name: 'Blandar, Sunduk & Lambang Sari', alias: 'Rangka', en: 'Beams and ties',
    explode: [0, 4.7, 0], anchor: [0, 5.1, 4.4],
    desc: 'The ring beams (blandar and pengeret), through-beams with wedges (sunduk and kili), and the lambang sari between the roof tiers.',
    fn: 'Tie the columns into rigid frames without nails and carry the roof tiers.',
    meaning: 'Knock-down joinery: the whole dalem can be dismantled and rebuilt elsewhere.',
    specs: ['Pegged joints', 'No nails'],
  },
  {
    id: 'tumpang_sari', cat: 'frame', name: 'Tumpang Sari', alias: 'Tumpangsari', en: 'Stepped beam stack & ceiling',
    explode: [0, 6.9, 0], anchor: [0, 7.15, 2.6], focusDir: [0.5, -0.55, 1],
    desc: 'The stepped beam courses over the saka guru, with the dhadha peksi beam and the uleng ceiling above.',
    fn: 'Cantilevers outward to carry the steep brunjung roof on only four columns.',
    meaning: 'The most decorated part of the frame, usually carved and gilded.',
    specs: ['5 courses', 'Dhadha peksi', 'Uleng ceiling'],
  },
  {
    id: 'gebyok', cat: 'walls', name: 'Gebyok', alias: 'Gebyog', en: 'Carved teak front wall',
    explode: [0, 2.6, 4], anchor: [-5.8, 2.5, 6.95],
    desc: 'The front wall of the dalem, facing the pringgitan, is a screen of carved teak panels with a large double door in the middle and smaller doors either side.',
    fn: 'Closes off the family house from the public front of the compound while still letting air through its carving.',
    meaning: 'The gebyok is the family’s formal face: the richness of its carving shows the household’s standing.',
    specs: ['3 doors', 'Carved teak'],
  },
  {
    id: 'dinding', cat: 'walls', name: 'Dinding', alias: 'Dinding papan', en: 'Side and back walls',
    explode: [0, 5.2, 0], anchor: [7.9, 2.4, -1.2], focusDir: [1, 0.3, 0.3],
    desc: 'Walls of teak boards on the sides and back, with barred windows high on the side walls.',
    fn: 'Enclose the family rooms; the high windows light the hall while keeping it private.',
    meaning: 'The dalem looks inward. Its openings face the pringgitan and the family, not the street.',
    specs: ['Teak boards', '2 windows'],
  },
  {
    id: 'senthong', cat: 'interior', name: 'Senthong', alias: 'Kiwa · tengah · tengen', en: 'Three back rooms',
    explode: [0, 3.6, -2], anchor: [-5.0, 2.4, -4.4], focusDir: [0.3, 0.35, 1],
    desc: 'Three rooms along the back of the dalem: senthong kiwa (left), senthong tengah (middle) and senthong tengen (right). The side rooms are used for sleeping and storage.',
    fn: 'Private rooms for the family, separated from the open hall by a carved partition.',
    meaning: 'The senthong tengah, in the middle, is the most sacred room of the whole compound, where the central axis of the house ends.',
    specs: ['3 rooms', 'Carved partition'],
  },
  {
    id: 'krobongan', cat: 'interior', name: 'Krobongan', alias: 'Pasren', en: 'Sacred bed in the senthong tengah',
    explode: [0, 1.8, 0], anchor: [0, 1.7, -5.0], focusDir: [0.25, 0.3, 1],
    desc: 'A draped, bed-like platform inside the senthong tengah. A pair of loro blonyo figures, a seated bride and groom, sits in front of it.',
    fn: 'Not used for everyday sleeping; it is kept as a symbolic resting place at the heart of the house.',
    meaning: 'Dedicated to Dewi Sri, goddess of rice and fertility, as a prayer for the family’s prosperity. The loro blonyo stand for a harmonious marriage.',
    specs: ['Draped platform', 'Loro blonyo pair'],
  },
  {
    id: 'usuk', cat: 'roof', name: 'Usuk, Dudur & Molo', alias: 'Rangka atap', en: 'Rafters, hips and ridge',
    explode: [0, 9.7, 0], anchor: [4.4, 5.95, 3.9],
    desc: 'Rafters, battens and hip rafters of the three roof tiers, and the molo ridge beam at the top.',
    fn: 'Carry the clay tiles and give each tier its pitch.',
    meaning: 'The raising of the molo is marked with the munggah molo ceremony.',
    specs: ['{rafters} rafters', '{battens} battens'],
  },
  {
    id: 'atap', cat: 'roof', name: 'Atap Joglo', alias: 'Brunjung · penanggap · penitih', en: 'Three-tier roof', roof: true,
    explode: [0, 12.8, 0], anchor: [0, 9.4, 1.4],
    desc: 'The same three-tier joglo roof as the pendapa, with ridge crowns on top.',
    fn: 'Sheds rain and shades the walls with deep eaves.',
    meaning: 'Giving the dalem a joglo roof, like the pendapa’s, marks it as a house of high standing.',
    specs: ['3 tiers', 'Clay tiles'],
  },
];

export default {
  build,
  categories: CATEGORIES,
  parts: PARTS,
  sectionY: 2.2,
  views: { inside: { pos: [0.8, 2.4, 5.0], target: [0, 2.0, -5.6] } },
};
