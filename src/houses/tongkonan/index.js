// Tongkonan (Toraja, South Sulawesi): a row of ancestral houses facing north across a yard
// to their row of rice barns (alang), with the rante, the field of funeral stones, to the west.
// Site coordinates: north is −z, east +x. Houses face north, barns face south.
import { makeTongkonan } from './banua.js';
import { makeAlang } from './alang.js';
import { rante, yard, SITE, ROW_XS } from './village.js';

const ZONES = [
  { id: 'banua',   label: 'Houses',        local: 'Tongkonan', color: '#b3402f' },
  { id: 'alang',   label: 'Rice barns',    local: 'Alang',     color: '#d9a63a' },
  { id: 'rante',   label: 'Funeral field', local: 'Rante',     color: '#8d8a82' },
  { id: 'halaman', label: 'Yard',          local: 'Halaman',   color: '#7fa37a' },
];

const HOUSE_Z = 11, BARN_Z = -8;
const [W, C, E] = ROW_XS;

const FAMILY = {
  zone: 'banua', rot: Math.PI, alias: 'Tongkonan', en: 'Family house',
  desc: 'Another tongkonan of the family line, built like the main house but with a lower roof and fewer horns.',
  fn: 'Home of a branch of the family. Toraja trace descent through both parents, so a person belongs to several tongkonan at once.',
  meaning: 'Houses stand side by side in a row, all facing north, the same way as their ancestors’ houses.',
};
const BARN = {
  zone: 'alang', rot: 0, alias: 'Lumbung padi', en: 'Rice barn',
  desc: 'A plainer alang facing its house across the yard.',
  fn: 'Stores the family’s rice. Guests sit on the platform beneath it.',
  meaning: 'Every tongkonan has its alang opposite: the house and the rice that sustains it.',
};

const BUILDINGS = [
  {
    id: 'tongkonan', def: makeTongkonan({ horns: 14, H: 4.4, seed: 41 }), at: [C, HOUSE_Z], rot: Math.PI, zone: 'banua',
    name: 'Tongkonan', alias: 'Banua', en: 'Ancestral house',
    desc: 'The ancestral house of the family, on a base of posts, under a roof that sweeps up at both ends. Buffalo horns are stacked on the post at the front.',
    fn: 'The origin house of the family line, where its members gather for ceremonies, and where its heirlooms are kept.',
    meaning: 'Tongkonan comes from tongkon, “to sit”: the place where the family sits together.',
    specs: ['3 rooms', '14 pairs of horns'],
  },
  { id: 'tongkonan_barat', def: makeTongkonan({ horns: 8, H: 3.8, seed: 42 }), at: [W, HOUSE_Z], name: 'Tongkonan II', ...FAMILY, specs: ['8 pairs of horns'] },
  { id: 'tongkonan_timur', def: makeTongkonan({ horns: 5, H: 3.6, seed: 43 }), at: [E, HOUSE_Z], name: 'Tongkonan III', ...FAMILY, specs: ['5 pairs of horns'] },
  {
    id: 'alang_sura', def: makeAlang({ carved: true, seed: 51 }), at: [C, BARN_Z], rot: 0, zone: 'alang',
    name: 'Alang Sura’', alias: 'Lumbung berukir', en: 'Carved rice barn',
    desc: 'The carved rice barn facing the main house: a closed store on six smooth posts, under a small curved roof.',
    fn: 'Stores the family’s rice. The platform beneath is where guests are seated at ceremonies.',
    meaning: 'Sura’ means carved. The barn is decorated like the house it faces, a sign of the family’s prosperity.',
    specs: ['6 posts', 'Carved'],
  },
  { id: 'alang_barat', def: makeAlang({ carved: false, seed: 52 }), at: [W, BARN_Z], name: 'Alang II', ...BARN, specs: ['6 posts', 'Plain'] },
  { id: 'alang_timur', def: makeAlang({ carved: false, seed: 53 }), at: [E, BARN_Z], name: 'Alang III', ...BARN, specs: ['6 posts', 'Plain'] },
  {
    id: 'rante', def: rante, at: [0, 0], rot: 0, zone: 'rante',
    name: 'Rante', alias: 'Simbuang batu', en: 'Field of standing stones',
    desc: 'An open field to the west of the houses, with standing stones of many sizes.',
    fn: 'The great funerals (Rambu Solo’) are held here. A stone is raised for the funeral of a person of high standing.',
    meaning: 'In Toraja, west is the direction of death and the ancestors, east the direction of life. Funerals belong to the west.',
    specs: ['11 stones'],
  },
  {
    id: 'halaman', def: yard, at: [0, 0], rot: 0, zone: 'halaman',
    name: 'Halaman', alias: 'Halaman tongkonan', en: 'Yard',
    desc: 'The long yard between the row of houses and the row of barns.',
    fn: 'For drying rice, daily work and family ceremonies.',
    meaning: 'Shared ground, framed by the houses on one side and their barns on the other.',
    specs: [`${SITE.x1 - SITE.x0} × ${SITE.z1 - SITE.z0} m`],
  },
];

export default {
  loading: 'Raising the roofs…',
  about: {
    title: 'The Tongkonan of the Toraja',
    paras: [
      'The tongkonan is the ancestral house of the Toraja people of the South Sulawesi highlands. Its name comes from tongkon, “to sit”: it is the place where a family sits together. A tongkonan is less a home than the origin of a family line, and Toraja count themselves members of the tongkonan of both their mother and their father.',
      'Every tongkonan faces north. In front of it, across a long yard, its rice barns (alang) face back towards it. Many villages have a row of houses facing a row of barns, with buffalo horns from past funerals stacked up the front of the houses.',
      'Read from the top down, the house has three parts, like the Toraja cosmos: the roof (rattiang banua) belongs with the upper world, the body (kale banua) with the world of the living, and the base of posts (sulluk banua) with the world below. The great roof of layered bamboo rises at both ends, like a boat’s prow or a buffalo’s horns.',
      'Directions matter: north is linked to the Creator, Puang Matua, and the south to the land of souls. Ceremonies of life (Rambu Tuka’) belong to the east, and funerals (Rambu Solo’) to the west. This model is an idealised settlement for learning, loosely based on villages like Ke’te’ Kesu’. Many tongkonan today have zinc roofs.',
    ],
  },

  site: {
    categories: ZONES,
    buildings: BUILDINGS,
    sectionY: 3.3,
    views: { inside: { pos: [31, 2.4, -2.5], target: [0, 5, 4] } },
    overlay: {
      x0: SITE.x0, x1: SITE.x1,
      zones: [
        { zone: 'banua', x0: -18, x1: 18, z0: 2.0, z1: SITE.z1, text: 'Tongkonan · facing north' },
        { zone: 'halaman', x0: -18, x1: 18, z0: -4.0, z1: 2.0, text: 'Halaman' },
        { zone: 'alang', x0: -18, x1: 18, z0: SITE.z0, z1: -4.0, text: 'Alang · facing the houses' },
        { zone: 'rante', x0: SITE.x0, x1: -20, z0: -6, z1: 12, text: 'Rante · the west, side of the dead' },
      ],
      axis: { from: [6, SITE.z1], to: [6, SITE.z0], text: 'North · Puang Matua ↑   South · Puya ↓' },
    },
    walk: {
      stops: [
        {
          title: 'Tongkonan', local: 'The row of houses',
          pos: [31, 2.4, -2.5], target: [0, 5, 4],
          text: 'A row of houses faces a row of rice barns across a long yard. Every tongkonan faces north, and its roof rises at both ends like the prow of a boat.',
        },
        {
          title: 'Alang', local: 'The rice barns', buildings: ['alang_sura', 'alang_barat', 'alang_timur'],
          pos: [4.2, 1.6, -0.6], target: [0, 2.6, -8],
          text: 'Opposite each house stands its alang, a small house for rice on smooth palm-wood posts that rats cannot climb. On the platform beneath, guests are seated at ceremonies.',
        },
        {
          title: 'Tanduk Tedong', local: 'Horns of the buffalo',
          pos: [4.6, 2.0, -4.6], target: [0, 4.6, 5],
          text: 'Up the post at the front of the house are buffalo horns, one pair for each buffalo sacrificed at the family’s funerals. Above the door is a carved buffalo head, and above it the long-necked katik.',
        },
        {
          title: 'Sali', local: 'Inside the house',
          pos: [-1.1, 3.55, 9.75], target: [1.4, 2.6, 12.2],
          via: [[0, 2.4, 3.6], [0, 3.3, 6.0], [0, 3.4, 7.6], [-0.95, 3.5, 9.0]],
          text: 'Up the ladder and through the small door, the house is dark and low. The middle room, sali, holds the hearth. When someone dies, the body stays in the house, often for months, until the funeral can be held.',
        },
        {
          title: 'Rattiang Banua', local: 'The roof',
          pos: [21, 5, 21], target: [3, 7, 10],
          text: 'The roof is built of split bamboo laid in thick layers. Its ridge sags in the middle and sweeps up at both ends, far beyond the walls, carried by tall posts. The roof is the house’s link to the upper world.',
        },
        {
          title: 'Rante', local: 'The field of stones', buildings: ['rante'],
          pos: [-16.5, 2.2, -4], target: [-28, 2.6, 3],
          text: 'To the west lies the rante. The great funerals are held here, with buffalo sacrifices and hundreds of guests, and a stone is raised for a person of high standing. Only after the funeral does the soul leave for Puya, the land of souls.',
        },
        {
          title: 'The settlement', local: 'Reading the whole', overlay: true,
          pos: [22, 42, 42], target: [-8, 0, 3],
          text: 'From above: houses face north towards their barns, life and its ceremonies to the east, death and the ancestors to the west.',
        },
      ],
    },
  },

  slots: [
    { id: 'roof', label: 'Bamboo roof', tex: 'bambooRoof', clay: '#d6d0c4' },
    { id: 'passura', label: 'Passura’', tex: 'passura' },
    { id: 'wood', label: 'Timber', tex: 'wood' },
    { id: 'plank', label: 'Boards', tex: 'wood' },
    { id: 'accent', label: 'Carving', tex: null },
    { id: 'horn', label: 'Horns', tex: null, glossy: true },
    { id: 'stone', label: 'Stone', tex: 'stone', clay: '#d2cdc5' },
    { id: 'bone', label: 'Bone', tex: null, ui: false },
    { id: 'ground', label: 'Ground', tex: 'stone', ui: false, clay: '#ece8e0' },
  ],
  presets: {
    tradisional: {
      label: 'Tradisional · bamboo & passura’', rough: 0.85, metal: {},
      colors: { roof: '#7a6a52', passura: '#ffffff', wood: '#4a3020', plank: '#6b4a32', accent: '#2a1c14', horn: '#4a423a', stone: '#7d786e', bone: '#e6dcc6', ground: '#8f9a6a' },
    },
    lumut: {
      label: 'Berlumut · mossy old roofs', rough: 0.95, metal: {},
      colors: { roof: '#56653c', passura: '#e8ddcc', wood: '#3f2b1d', plank: '#5d422d', accent: '#251912', horn: '#463f37', stone: '#726e64', bone: '#d9cfb9', ground: '#7f8d5c' },
    },
    seng: {
      label: 'Atap seng · zinc roof', rough: 0.55, metal: { roof: 0.6 }, tex: { roof: null },
      colors: { roof: '#9aa0a6', passura: '#ffffff', wood: '#4a3020', plank: '#6b4a32', accent: '#2a1c14', horn: '#4a423a', stone: '#7d786e', bone: '#e6dcc6', ground: '#8f9a6a' },
    },
  },
};
