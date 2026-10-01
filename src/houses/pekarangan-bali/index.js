// Pekarangan Bali: a Balinese house compound laid out by the Sanga Mandala.
// Site coordinates: kaja (towards the mountain) is −z, kelod (towards the sea) +z,
// kangin (sunrise) +x, kauh (sunset) −x. The gateway is on the kelod side.
import { sanggah } from './sanggah.js';
import { baleMeten, baleDangin, baleDauh, paon, jineng } from './bales.js';
import { gate, WALL } from './gate.js';

const ZONES = [
  { id: 'parahyangan', label: 'Sacred',  local: 'Parahyangan', color: '#d9a441' },
  { id: 'pawongan',    label: 'Living',  local: 'Pawongan',    color: '#c8673f' },
  { id: 'palemahan',   label: 'Grounds', local: 'Palemahan',   color: '#7fa37a' },
];

const BUILDINGS = [
  {
    id: 'sanggah', def: sanggah, at: [0, 0], rot: 0, zone: 'parahyangan',
    name: 'Sanggah', alias: 'Merajan', en: 'Family temple',
    desc: 'The walled family temple in the corner closest to the mountain and the sunrise, with shrines for God and for the deified ancestors.',
    fn: 'Daily offerings and the family’s temple ceremonies take place here.',
    meaning: 'Kaja-kangin is the most sacred direction of the Sanga Mandala, so the temple always takes this corner.',
    specs: ['4 shrines', 'Kaja-kangin'],
  },
  {
    id: 'bale_meten', def: baleMeten, at: [-2, -8.5], rot: 0, zone: 'pawongan',
    name: 'Bale Meten', alias: 'Bale daja', en: 'Sleeping house',
    desc: 'The only closed bale: brick walls and a carved door on the highest plinth, on the kaja (mountain) side of the courtyard.',
    fn: 'The sleeping place of the head of the family and the elders, where heirlooms and valuables are kept.',
    meaning: 'The most honoured household building stands on the side nearest the sacred mountain.',
    specs: ['8 posts · sakutus', 'Floor +1.0 m'],
  },
  {
    id: 'bale_dangin', def: baleDangin, at: [8.5, 1.5], rot: -Math.PI / 2, zone: 'pawongan',
    name: 'Bale Dangin', alias: 'Bale gede, bale adat', en: 'Ceremonial pavilion',
    desc: 'An open pavilion on twelve posts on the kangin (east) side, with two broad platforms.',
    fn: 'Rites of passage happen here: tooth filing, weddings, and laying out the body of a family member before cremation.',
    meaning: 'Facing the sunrise, it is where the family marks each stage of life.',
    specs: ['12 posts · saka roras', 'Open'],
  },
  {
    id: 'bale_dauh', def: baleDauh, at: [-9.5, 1.5], rot: Math.PI / 2, zone: 'pawongan',
    name: 'Bale Dauh', alias: 'Bale loji', en: 'Guest pavilion',
    desc: 'An open pavilion on nine posts on the kauh (west) side.',
    fn: 'For receiving guests and for work, and traditionally a sleeping place for the young men of the household.',
    meaning: 'The sunset side is less sacred, suited to everyday and social life.',
    specs: ['9 posts · tiang sanga', 'Open'],
  },
  {
    id: 'paon', def: paon, at: [-9.5, 10], rot: Math.PI, zone: 'pawongan',
    name: 'Paon', alias: 'Dapur', en: 'Kitchen',
    desc: 'The kitchen, walled on three sides, with a clay stove (jalikan).',
    fn: 'Cooking for the household and its offerings.',
    meaning: 'Fire and daily work belong to the kelod-kauh (sea and sunset) side, the least sacred part of the compound.',
    specs: ['6 posts', 'Clay stove'],
  },
  {
    id: 'jineng', def: jineng, at: [7, 10.5], rot: Math.PI, zone: 'pawongan',
    name: 'Jineng', alias: 'Lumbung', en: 'Rice barn',
    desc: 'A rice barn on four posts with a rounded thatched roof and a sitting platform beneath.',
    fn: 'Stores the harvest; the platform below is a shaded place to rest and work.',
    meaning: 'The family’s rice, honoured as a gift of Dewi Sri, kept safe and dry.',
    specs: ['4 posts', 'Rounded roof'],
  },
  {
    id: 'gerbang', def: gate, at: [0, 0], rot: 0, zone: 'palemahan',
    name: 'Angkul-angkul & Penyengker', alias: 'Gerbang & tembok', en: 'Gateway, walls and courtyard',
    desc: 'The roofed gateway, the screen wall behind it, the wall around the compound and the natah (central courtyard).',
    fn: 'Enclose the household and control the way in from the street.',
    meaning: 'The aling-aling makes everyone turn before entering: the courtyard is never seen straight from the street.',
    specs: [`${WALL.x * 2} × ${WALL.z * 2} m`, '1 gateway'],
  },
];

// Sanga Mandala: nine zones from the two axes; the sacredness of a zone rises towards kaja and kangin.
const ROWS = [['utama', -WALL.z, -5], ['madya', -5, 5], ['nista', 5, WALL.z]];        // kaja → kelod
const COLS = [['nista', -WALL.x, -5], ['madya', -5, 5], ['utama', 5, WALL.x]];        // kauh → kangin
const RANK = { utama: 2, madya: 1, nista: 0 };
const SHADES = ['#7d8794', '#9a9a88', '#b9a77a', '#cfa75c', '#e3a33a'];
const MANDALA = ROWS.flatMap(([row, z0, z1]) => COLS.map(([col, x0, x1]) => ({
  zone: 'pawongan', x0, x1, z0, z1, color: SHADES[RANK[row] + RANK[col]],
  text: `${row[0].toUpperCase() + row.slice(1)}ning ${col}`,
})));

export default {
  loading: 'Laying out the Sanga Mandala…',
  about: {
    title: 'The Balinese house compound',
    paras: [
      'A traditional Balinese home (umah) is not one building but a walled compound (pekarangan) of separate pavilions (bale) around an open courtyard, the natah. Each bale has its own purpose and its own place.',
      'The layout follows the Sanga Mandala, nine zones formed by two axes: kaja–kelod, towards the mountain or the sea, and kangin–kauh, towards the sunrise or the sunset. The kaja-kangin corner is the most sacred and holds the family temple; the kitchen and the gateway sit on the kelod side.',
      'The rules for proportion and placement are set out in the Asta Kosala Kosali. Each bale is read like a body (Tri Angga): a base, a body of posts, and a roof as its head. The compound as a whole balances the sacred (parahyangan), the human (pawongan) and the natural (palemahan).',
      'This model is an idealised compound for learning, based on South Bali, where the mountain lies to the north. Real compounds vary in size, layout and which bale they have.',
    ],
  },

  site: {
    categories: ZONES,
    buildings: BUILDINGS,
    sectionY: 1.6,
    views: { inside: { pos: [-3, 1.7, 21], target: [-1, 2.2, 6] } },
    overlay: {
      x0: -WALL.x, x1: WALL.x,
      zones: MANDALA,
      axis: { from: [0, WALL.z], to: [0, -WALL.z], text: 'Kaja · mountain ↑   Kelod · sea ↓' },
    },
    walk: {
      stops: [
        {
          title: 'Angkul-angkul', local: 'The gateway',
          pos: [-3, 1.7, 22], target: [-3, 2.4, 15],
          text: 'From the lane, a Balinese home shows only a wall and a roofed gateway. Everything else lies behind it, inside the pekarangan.',
        },
        {
          title: 'Aling-aling', local: 'The screen wall',
          pos: [-3, 1.7, 14.4], target: [-3, 1.5, 12.6],
          text: 'Just inside, a wall blocks the way. You must turn to enter. It keeps the courtyard private, and by tradition it stops evil spirits, which travel only in straight lines.',
        },
        {
          title: 'Natah', local: 'The courtyard', via: [[0.6, 1.7, 13.6], [0.6, 1.7, 11.0]],
          pos: [-0.4, 1.7, 8.5], target: [0, 2.6, -4],
          text: 'Around the aling-aling opens the natah, the courtyard at the centre of the compound. Every bale faces it, each on its own side and for its own purpose.',
        },
        {
          title: 'Bale Dangin', local: 'Ceremonies of life', buildings: ['bale_dangin'],
          pos: [1.6, 2.0, 3.4], target: [8.5, 2.0, 1.5],
          text: 'On the sunrise side stands the open Bale Dangin. The family’s rites of passage take place on its platforms, from tooth filing and weddings to the last rites before cremation.',
        },
        {
          title: 'Bale Meten', local: 'Towards the mountain', buildings: ['bale_meten'],
          pos: [-1.4, 2.0, -1.2], target: [-2, 2.4, -8.5],
          text: 'On the mountain side, on the highest plinth, is the Bale Meten, the only closed bale. The head of the family and the elders sleep here, and heirlooms are kept safe.',
        },
        {
          title: 'Sanggah', local: 'The family temple', buildings: ['sanggah'],
          pos: [8.2, 2.4, -2.4], target: [11.4, 1.8, -11.2],
          text: 'In the corner closest to the mountain and the sunrise is the family temple, with its own walls and gateway. Here stand the shrines for God and for the deified ancestors.',
        },
        {
          title: 'Paon & Jineng', local: 'Towards the sea', buildings: ['paon', 'jineng'],
          pos: [-0.5, 3.4, 3.6], target: [-1, 1.4, 10.8],
          text: 'On the seaward side are the kitchen and the rice barn. Fire, smoke and daily work belong to the least sacred part of the compound, close to the gateway.',
        },
        {
          title: 'Sanga Mandala', local: 'Nine zones', overlay: true,
          pos: [0, 58, 16], target: [0, 0, 1],
          text: 'From above, the nine zones of the Sanga Mandala appear. Sacredness rises towards the mountain and the sunrise: the temple holds the highest corner, the kitchen and gate the lowest.',
        },
      ],
    },
  },

  slots: [
    { id: 'thatch', label: 'Alang-alang', tex: 'thatch', clay: '#dcd4c6' },
    { id: 'ijuk', label: 'Ijuk', tex: 'thatch', clay: '#cfc7ba' },
    { id: 'bata', label: 'Brick', tex: 'brick', clay: '#e6e0d6' },
    { id: 'paras', label: 'Paras', tex: 'stone', clay: '#ece8e0' },
    { id: 'wood', label: 'Timber', tex: 'wood' },
    { id: 'accent', label: 'Prada', tex: null, glossy: true },
    { id: 'plank', label: 'Platforms', tex: 'wood', ui: false },
    { id: 'bamboo', label: 'Bamboo', tex: 'bamboo', ui: false },
    { id: 'clay', label: 'Clay', tex: 'stone', ui: false },
    { id: 'ground', label: 'Courtyard', tex: 'stone', ui: false, clay: '#ece8e0' },
  ],
  presets: {
    tradisional: {
      label: 'Tradisional · alang-alang & bata', rough: 0.8, metal: { accent: 0.7 },
      colors: { thatch: '#a8915f', ijuk: '#2a2522', bata: '#a4553b', paras: '#a29f91', wood: '#6e4a2f', accent: '#c9a24a', plank: '#8b6a48', bamboo: '#c2a571', clay: '#9c5a3c', ground: '#93a067' },
    },
    genteng: {
      label: 'Genteng · clay tile roofs', rough: 0.7, metal: { accent: 0.7 }, tex: { thatch: 'tile' },
      colors: { thatch: '#b55d3c', ijuk: '#2a2522', bata: '#a4553b', paras: '#a29f91', wood: '#6e4a2f', accent: '#c9a24a', plank: '#8b6a48', bamboo: '#c2a571', clay: '#9c5a3c', ground: '#93a067' },
    },
    puri: {
      label: 'Puri · pale paras & gold', rough: 0.6, metal: { accent: 0.85 },
      colors: { thatch: '#9a8458', ijuk: '#221d1a', bata: '#b2603f', paras: '#d4cfbf', wood: '#4e3424', accent: '#d8aa4c', plank: '#6f5038', bamboo: '#b89a66', clay: '#9c5a3c', ground: '#8e9b62' },
    },
  },
};
