// Uma Mbatangu (Sumba): a kampung adat with clan houses facing a plaza of stone tombs.
// Site coordinates: the plaza runs along x; the north row faces +z, the south row −z.
import { makeUma } from './house.js';
import { tombs, plaza, VILLAGE } from './village.js';

const ZONES = [
  { id: 'uma',     label: 'Clan houses', local: 'Uma',      color: '#c58a4a' },
  { id: 'leluhur', label: 'Ancestors',   local: 'Marapu',   color: '#8d8a82' },
  { id: 'kampung', label: 'Village',     local: 'Paraingu', color: '#a89a7c' },
];

const house = (top, hornRows, seed) => makeUma({ top, hornRows, seed });
const MAIN = house(14.5, 4, 31);

const CLAN = {
  zone: 'uma', alias: 'Uma kabisu', en: 'Clan house',
  desc: 'Another clan house of the village, built like the main house with a tall tower over four main pillars.',
  fn: 'Home of one of the village’s clans (kabisu), with its own hearth, heirlooms and ancestors.',
  meaning: 'The houses face one another across the plaza and its tombs, so every clan lives in sight of the ancestors.',
};

const BUILDINGS = [
  {
    id: 'uma_utama', def: MAIN, at: [0, -13], rot: 0, zone: 'uma',
    name: 'Uma Utama', alias: 'Uma mbatangu', en: 'Main peaked house',
    desc: 'The main house of the village, with the tallest tower. A square house on stilts under a wide grass roof, crowned by a steep peak.',
    fn: 'Home of the founding clan, and a place for ceremonies of the whole village.',
    meaning: 'Built in three levels like the Marapu cosmos: animals beneath, people in the middle, ancestors in the tower.',
    specs: ['9.6 × 9.6 m floor', 'Peak +14.5 m'],
  },
  { id: 'uma_barat', def: house(12.6, 3, 41), at: [-14, -13], rot: 0, name: 'Uma Kabisu I', ...CLAN, specs: ['Peak +12.6 m'] },
  { id: 'uma_timur', def: house(13.2, 2, 51), at: [14, -13], rot: 0, name: 'Uma Kabisu II', ...CLAN, specs: ['Peak +13.2 m'] },
  { id: 'uma_selatan_1', def: house(12.2, 2, 61), at: [-7, 13], rot: Math.PI, name: 'Uma Kabisu III', ...CLAN, specs: ['Peak +12.2 m'] },
  { id: 'uma_selatan_2', def: house(13.6, 3, 71), at: [7, 13], rot: Math.PI, name: 'Uma Kabisu IV', ...CLAN, specs: ['Peak +13.6 m'] },
  {
    id: 'kubur', def: tombs, at: [0, 0], rot: 0, zone: 'leluhur',
    name: 'Kubur Batu', alias: 'Kubur megalitik', en: 'Megalithic tombs',
    desc: 'Stone tombs of the ancestors standing in the plaza between the houses.',
    fn: 'Graves of the village’s ancestors and noble families.',
    meaning: 'Sumba is one of the few places where megalithic tombs are still built today.',
    specs: ['5 tombs', '3 carved stones'],
  },
  {
    id: 'natara', def: plaza, at: [0, 0], rot: 0, zone: 'kampung',
    name: 'Natara & Pagar Batu', alias: 'Halaman & tembok', en: 'Plaza and stone wall',
    desc: 'The open plaza at the centre of the village and the dry-stone wall around it.',
    fn: 'Ceremonies, gatherings and daily life happen on the plaza; the wall encloses the village.',
    meaning: 'Houses, tombs and plaza together make the paraingu, the village of the clans and their ancestors.',
    specs: [`${VILLAGE.x * 2} × ${VILLAGE.z * 2} m`],
  },
];

export default {
  loading: 'Raising the tower…',
  about: {
    title: 'The Uma Mbatangu of Sumba',
    paras: [
      'On the island of Sumba, in East Nusa Tenggara, the traditional house (uma) is crowned by a tall, steep peak that gives the Uma Mbatangu, the “peaked house”, its name. Villages such as Ratenggaro and Praijing in West Sumba are known for especially tall roofs.',
      'Many Sumbanese follow Marapu, the religion of the ancestors. The house is built as a model of the cosmos in three levels: animals live beneath the floor, people in the middle around the hearth, and the ancestors (marapu) and sacred heirlooms in the tower above.',
      'Houses stand in villages (paraingu) on high ground, enclosed by stone walls, facing a plaza where the megalithic tombs of the ancestors stand. Large tomb stones are still hauled and raised in community ceremonies today.',
      'This model is an idealised village for learning. Houses differ between East and West Sumba and from village to village.',
    ],
  },

  site: {
    categories: ZONES,
    buildings: BUILDINGS,
    sectionY: 2.6,
    views: { inside: { pos: [-27, 1.7, 0], target: [0, 3, -2] } },
    overlay: {
      x0: -VILLAGE.x, x1: VILLAGE.x,
      zones: [
        { zone: 'uma', z0: -VILLAGE.z, z1: -7, text: 'Uma · clan houses' },
        { zone: 'leluhur', z0: -7, z1: 7, text: 'Natara · plaza of the ancestors' },
        { zone: 'uma', z0: 7, z1: VILLAGE.z, text: 'Uma · clan houses' },
      ],
    },
    walk: {
      stops: [
        {
          title: 'Paraingu', local: 'The village',
          pos: [-29, 1.7, 0], target: [0, 3.5, -3],
          text: 'A traditional Sumbanese village sits on high ground behind a wall of stacked stone. Inside, the houses of the clans face one another across an open plaza.',
        },
        {
          title: 'Kubur Batu', local: 'The tombs of the ancestors', buildings: ['kubur'],
          pos: [-6.5, 1.7, 6.5], target: [0.5, 1.2, 1.8],
          text: 'In the middle of the plaza stand the tombs: great stone slabs raised on stone legs. The ancestors are buried at the heart of the village, among the living, not outside it.',
        },
        {
          title: 'Tanduk Kerbau', local: 'Horns on the veranda',
          pos: [2.4, 1.7, -3.2], target: [0, 3.0, -8.6],
          text: 'Rows of buffalo horns hang on the front of the main house. They come from buffalo sacrificed at the family’s funerals and feasts, a record of its ceremonies for all to see.',
        },
        {
          title: 'Tungku', local: 'The hearth',
          pos: [3.9, 3.0, -11.0], target: [-0.6, 2.4, -14.2], via: [[2.6, 2.8, -9.4], [2.6, 2.8, -11.2]],
          text: 'Through the door is the family room, built around the hearth between the four main pillars. This middle level of the house is the world of the living.',
        },
        {
          title: 'Menara', local: 'The tower of the ancestors',
          pos: [0.6, 2.6, -13.7], target: [0, 11, -13.1],
          text: 'Look up: the tower rises above the fire. Its loft keeps the harvest and the sacred heirlooms dry in the smoke, and it is the realm of the marapu, the ancestral spirits.',
        },
        {
          title: 'Three worlds', local: 'Reading the village', overlay: true,
          pos: [28, 30, 34], target: [0, 3, 0],
          text: 'From above, the order is clear: each clan’s house rises from the animals below, to the people, to the ancestors in its peak, and every house faces the tombs in the plaza.',
        },
      ],
    },
  },

  slots: [
    { id: 'thatch', label: 'Thatch', tex: 'thatch', clay: '#dcd4c6' },
    { id: 'wood', label: 'Timber', tex: 'wood' },
    { id: 'bamboo', label: 'Bamboo', tex: 'bamboo' },
    { id: 'plank', label: 'Floor', tex: 'wood' },
    { id: 'stone', label: 'Stone', tex: 'stone', clay: '#d2cdc5' },
    { id: 'horn', label: 'Horns', tex: null, glossy: true },
    { id: 'bone', label: 'Bone', tex: null, ui: false },
    { id: 'accent', label: 'Clay pots', tex: null, ui: false },
    { id: 'ground', label: 'Ground', tex: 'stone', ui: false, clay: '#ece8e0' },
  ],
  presets: {
    alang: {
      label: 'Alang-alang · fresh thatch', rough: 0.85, metal: {},
      colors: { thatch: '#b39a68', wood: '#6b4a32', bamboo: '#c2a571', plank: '#8a6a48', stone: '#9a958b', horn: '#2f2a25', bone: '#e6dcc6', accent: '#9a4b2c', ground: '#b9a684' },
    },
    tua: {
      label: 'Tua · weathered thatch', rough: 0.95, metal: {},
      colors: { thatch: '#8c8578', wood: '#58493b', bamboo: '#a3926f', plank: '#75604a', stone: '#85827b', horn: '#2a2622', bone: '#d8cfba', accent: '#8a4a30', ground: '#a69a80' },
    },
    seng: {
      label: 'Atap seng · zinc roof', rough: 0.55, metal: { thatch: 0.6 }, tex: { thatch: null },
      colors: { thatch: '#9aa0a6', wood: '#5f4632', bamboo: '#b89a66', plank: '#806146', stone: '#9a958b', horn: '#2f2a25', bone: '#e6dcc6', accent: '#9a4b2c', ground: '#b9a684' },
    },
  },
};
