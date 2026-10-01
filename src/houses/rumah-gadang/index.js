// Rumah Gadang (West Sumatra): the house of a Minangkabau kaum with its rice barns,
// surau and yard. Site coordinates: the house faces +z towards the yard and gate.
import house from './house.js';
import { makeRangkiang } from './rangkiang.js';
import { surau, yard, YARD } from './compound.js';

const ZONES = [
  { id: 'rumah',     label: 'House',         local: 'Rumah',     color: '#cf5b3f' },
  { id: 'rangkiang', label: 'Rice barns',    local: 'Rangkiang', color: '#dcab52' },
  { id: 'surau',     label: 'Prayer house',  local: 'Surau',     color: '#6f9bb8' },
  { id: 'halaman',   label: 'Yard',          local: 'Halaman',   color: '#7fa37a' },
];

const BARN_Z = 12.5;
const barn = (o) => ({ zone: 'rangkiang', rot: Math.PI, alias: 'Rangkiang', ...o });

const BUILDINGS = [
  {
    id: 'rumah_gadang', def: house, at: [0, 0], rot: 0, zone: 'rumah',
    name: 'Rumah Gadang', alias: 'Rumah bagonjong', en: 'The great house',
    desc: 'The long family house of the kaum on its forest of columns, with carved walls that lean outward and a roof sweeping up into gonjong.',
    fn: 'Home of the women of the kaum and their children. Each married daughter has a biliak along the back of the hall, and the hall in front is shared for daily life and ceremonies.',
    meaning: 'The house belongs to the women and passes from mother to daughter, the heart of the matrilineal Minangkabau family.',
    specs: ['7 ruang', '5 gonjong'],
  },
  barn({
    id: 'rangkiang_sitinjau', at: [-4.3, BARN_Z], name: 'Sitinjau Lauik', en: 'Barn for trade',
    def: makeRangkiang({ w: 1.5, d: 1.5, postH: 1.6, bodyH: 1.6, roofH: 1.5, seed: 11 }),
    desc: 'The tallest and most finely carved of the barns. Its name means “looking out to sea”.',
    fn: 'Holds rice to be sold or bartered for goods the family cannot make itself.',
    meaning: 'Rice that connects the household with the world beyond the village.',
    specs: ['4 posts', 'Carved'],
  }),
  barn({
    id: 'rangkiang_sibayau', at: [4.6, BARN_Z], name: 'Sibayau-bayau', en: 'Barn for daily meals',
    def: makeRangkiang({ w: 2.6, d: 1.7, posts: 3, postH: 1.4, bodyH: 1.4, roofH: 1.3, seed: 12 }),
    desc: 'The widest barn, on six posts.',
    fn: 'Holds the rice the family eats every day.',
    meaning: 'The everyday store that feeds the household.',
    specs: ['6 posts', 'Carved'],
  }),
  barn({
    id: 'rangkiang_sitangguang', at: [-10, BARN_Z], name: 'Sitangguang Lapa', en: 'Barn against hunger',
    def: makeRangkiang({ w: 1.9, d: 1.9, postH: 1.4, bodyH: 1.5, roofH: 1.35, seed: 13 }),
    desc: 'A square barn whose name means “bearing hunger”.',
    fn: 'A reserve kept for lean seasons and disasters, also used to help poorer members of the community.',
    meaning: 'Care for the kaum: no one should go hungry while the barn is full.',
    specs: ['4 posts', 'Reserve'],
  }),
  barn({
    id: 'rangkiang_kaciak', at: [10, BARN_Z], name: 'Rangkiang Kaciak', en: 'Small barn for seed',
    def: makeRangkiang({ w: 1.2, d: 1.2, postH: 1.0, bodyH: 1.1, roofH: 0.9, carved: false, gonjong: false, seed: 14 }),
    desc: 'The smallest and plainest barn (kaciak means “small”), under a simple roof without gonjong.',
    fn: 'Keeps seed rice for the next planting and rice to pay for working the fields.',
    meaning: 'Small, but it holds the next harvest.',
    specs: ['4 posts', 'Plain'],
  }),
  {
    id: 'surau', def: surau, at: [20.5, 3], rot: -Math.PI / 2, zone: 'surau',
    name: 'Surau', alias: 'Surau kaum', en: 'Prayer house',
    desc: 'A small hall on stilts under a two-tier ijuk roof, beside the house.',
    fn: 'A place of prayer and learning. Traditionally the boys and unmarried young men of the kaum slept here rather than in the house, learning religion, adat and silek (self-defence).',
    meaning: 'The house is the women’s; the surau is where boys grow into men of the kaum.',
    specs: ['6.6 × 6.6 m', '2-tier roof'],
  },
  {
    id: 'halaman', def: yard, at: [0, 0], rot: 0, zone: 'halaman',
    name: 'Halaman & Pagar', alias: 'Laman', en: 'Yard, fence and path',
    desc: 'The open yard in front of the house with its bamboo fence and stone path.',
    fn: 'Space for drying rice, ceremonies and gatherings, enclosed by a light fence.',
    meaning: 'The yard shows the rangkiang, and so the family’s prosperity, to every visitor.',
    specs: [`${YARD.x1 - YARD.x0} × ${YARD.z1 - YARD.z0} m`],
  },
];

export default {
  loading: 'Raising the gonjong…',
  about: {
    title: 'The Rumah Gadang of the Minangkabau',
    paras: [
      'The Rumah Gadang (“big house”), also called Rumah Bagonjong, is the ancestral house of the Minangkabau of West Sumatra. Its roof sweeps up into sharp horn-like peaks called gonjong.',
      'The Minangkabau are matrilineal: the house belongs to the women of the kaum (clan) and passes from mother to daughter. Married daughters each have a sleeping room (biliak) along the back of the house, while the long hall in front is shared.',
      'The house is part of a compound. Rice barns (rangkiang), each with its own purpose, stand in the yard in front, and nearby the surau, where boys and young men traditionally slept and learned.',
      'Styles vary by adat tradition. Houses of the Koto Piliang tradition have raised floors (anjuang) at both ends, while Bodi Caniago houses keep one level. This model is an idealised single-level compound for learning.',
    ],
  },

  site: {
    categories: ZONES,
    buildings: BUILDINGS,
    sectionY: 3.3,
    views: { inside: { pos: [0, 1.7, 24], target: [0, 4.5, 0] } },
    overlay: {
      x0: YARD.x0, x1: YARD.x1,
      zones: [
        { zone: 'rumah', x0: -12, x1: 12.5, z0: -7, z1: 8.6, text: 'Rumah · the women’s house' },
        { zone: 'rangkiang', x0: -12, x1: 12.5, z0: 8.6, z1: 16, text: 'Rangkiang · the kaum’s rice' },
        { zone: 'surau', x0: 15, x1: 26, z0: -3, z1: 9, text: 'Surau · men and boys' },
      ],
    },
    walk: {
      stops: [
        {
          title: 'Rumah Gadang', local: 'The great house',
          pos: [0, 1.7, 25], target: [0, 5.5, 0],
          text: 'From the gate, the long house fills the view: carved walls leaning outward under a roof that sweeps up into gonjong. It is the house of the women of the kaum.',
        },
        {
          title: 'Rangkiang', local: 'The rice barns', buildings: ['rangkiang_sitinjau', 'rangkiang_sibayau', 'rangkiang_sitangguang', 'rangkiang_kaciak'],
          pos: [-8.5, 2.0, 19], target: [-1, 3.0, 12.5],
          text: 'Four barns stand in the yard, each with its own purpose: rice for trade, for daily meals, against hunger, and seed for the next planting. Together they show how the kaum provides for its own.',
        },
        {
          title: 'Tangga', local: 'Up to the house',
          pos: [2.4, 1.7, 10.6], target: [0, 2.8, 5.4],
          text: 'A stair climbs to the small porch under its own gonjong. Traditionally a jar of water stood by the steps so that visitors could wash their feet before going in.',
        },
        {
          title: 'The long hall', local: 'Shared by the family',
          pos: [-6.6, 3.6, 2.6], target: [5, 3.0, -1.3], via: [[0, 3.0, 6.4], [0, 3.0, 2.6]],
          text: 'Inside, the hall runs the length of the house between rows of columns. Daily life, meals and ceremonies happen here, in the shared front part of the house.',
        },
        {
          title: 'Biliak', local: 'The daughters’ rooms',
          pos: [-3.4, 3.4, 1.4], target: [-4.8, 2.9, -2.6],
          text: 'Along the back wall, each bay holds a small room. Every married daughter has her own biliak, where her husband comes to live with her: the house belongs to its women.',
        },
        {
          title: 'Surau', local: 'Where boys become men', buildings: ['surau'],
          pos: [11.5, 1.9, 10], target: [20.5, 3.2, 3],
          text: 'Beside the house stands the surau. Boys and young men of the kaum traditionally slept here rather than at home, learning religion, adat and silek.',
        },
        {
          title: 'The compound', local: 'Reading the whole', overlay: true,
          pos: [-24, 28, 36], target: [3, 2, 4],
          text: 'From above: the women’s house at the centre, the kaum’s rice in front of it, and the surau of the men and boys to the side, all within one yard.',
        },
      ],
    },
  },

  slots: [
    { id: 'wood', label: 'Timber', tex: 'wood' },
    { id: 'ukiran', label: 'Ukiran', tex: 'ukiran' },
    { id: 'accent', label: 'Shutters', tex: 'wood' },
    { id: 'thatch', label: 'Ijuk', tex: 'thatch', clay: '#d9d2c6' },
    { id: 'metal', label: 'Finials', tex: null, glossy: true, clay: '#d6cdbf' },
    { id: 'bamboo', label: 'Sasak', tex: 'bamboo' },
    { id: 'stone', label: 'Stone', tex: 'stone', clay: '#d2cdc5' },
    { id: 'plank', label: 'Floor', tex: 'wood' },
    { id: 'ground', label: 'Yard', tex: 'stone', ui: false, clay: '#ece8e0' },
  ],
  presets: {
    tradisional: {
      label: 'Tradisional · ijuk & ukiran', rough: 0.82, metal: { metal: 0.75 },
      colors: { wood: '#4b2e20', ukiran: '#ffffff', accent: '#8f2b1e', thatch: '#3b332d', metal: '#b9953f', bamboo: '#c9a773', stone: '#8a857c', plank: '#6e4a31', ground: '#a8a07c' },
    },
    seng: {
      label: 'Atap seng · zinc roof', rough: 0.6, metal: { metal: 0.75, thatch: 0.6 }, tex: { thatch: null },
      colors: { wood: '#5a3a28', ukiran: '#f3eadf', accent: '#7a2a20', thatch: '#8d949b', metal: '#a9adb2', bamboo: '#c9a773', stone: '#8a857c', plank: '#7a5238', ground: '#a8a07c' },
    },
    istano: {
      label: 'Istano · gilded carving', rough: 0.5, metal: { metal: 0.85, accent: 0.5 },
      colors: { wood: '#3a2016', ukiran: '#ffe6b3', accent: '#b88a2e', thatch: '#2c2622', metal: '#d4ab4c', bamboo: '#b89260', stone: '#77736c', plank: '#5b3a26', ground: '#9d9474' },
    },
  },
};
