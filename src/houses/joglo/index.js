// Joglo (Yogyakarta): a complete Javanese omah compound.
// Site coordinates: the regol and the front of the compound face +z; the central axis is x = 0.
import pendapa from './buildings/pendapa.js';
import pringgitan from './buildings/pringgitan.js';
import dalem from './buildings/dalem.js';
import gandhok from './buildings/gandhok.js';
import gadri from './buildings/gadri.js';
import pawon from './buildings/pawon.js';
import pekiwan from './buildings/pekiwan.js';
import regol from './buildings/regol.js';

const ZONES = [
  { id: 'public',    label: 'Public',    local: 'Ngarep', color: '#dcab52' },
  { id: 'threshold', label: 'Threshold', local: 'Tengah', color: '#e08a4a' },
  { id: 'family',    label: 'Family',    local: 'Njero',  color: '#cf5b3f' },
  { id: 'service',   label: 'Service',   local: 'Mburi',  color: '#7fa37a' },
  { id: 'boundary',  label: 'Boundary',  local: 'Wates',  color: '#9a948a' },
];

const BUILDINGS = [
  {
    id: 'pendapa', def: pendapa, at: [0, 6], rot: 0, zone: 'public',
    name: 'Pendapa', alias: 'Pendhapa', en: 'Open reception pavilion',
    desc: 'The large open pavilion at the front of the compound, under a three-tier joglo roof carried by four saka guru.',
    fn: 'Where the family receives guests and holds meetings, ceremonies, dances and gamelan performances.',
    meaning: 'The public face of the household: open on all sides, it shows hospitality and standing to the community.',
    specs: ['16.6 × 14.6 m', 'Joglo roof', 'No walls'],
  },
  {
    id: 'pringgitan', def: pringgitan, at: [0, -5.95], rot: 0, zone: 'threshold',
    name: 'Pringgitan', alias: 'Paringgitan', en: 'Connecting hall',
    desc: 'A narrower hall between the pendapa and the dalem, under a lower limasan roof.',
    fn: 'The passage from the public pendapa to the private dalem, and the place where wayang kulit shadow plays are staged.',
    meaning: 'Its name comes from ringgit (wayang puppet). It is the threshold between guests and family.',
    specs: ['16.4 × 7.9 m', 'Limasan roof'],
  },
  {
    id: 'dalem', def: dalem, at: [0, -17], rot: 0, zone: 'family',
    name: 'Dalem', alias: 'Dalem ageng', en: 'Main family house',
    desc: 'The enclosed heart of the compound: a joglo like the pendapa, but walled in with a carved gebyok front, with three senthong rooms at the back.',
    fn: 'Home of the family. Guests rarely go further than the pringgitan.',
    meaning: 'The most private and sacred building. The central axis of the compound ends at its senthong tengah.',
    specs: ['17.0 × 14.8 m', 'Joglo roof', '3 senthong'],
  },
  {
    id: 'gandhok_kiwa', def: gandhok, at: [-15.5, -17], rot: Math.PI / 2, zone: 'family',
    name: 'Gandhok Kiwa', alias: 'Gandhok', en: 'Left side wing',
    desc: 'A long wing along one side of the dalem, with a row of rooms opening onto the family yard.',
    fn: 'Extra bedrooms for family members and guests, and storage.',
    meaning: 'The wings frame the dalem and enclose a private yard around it.',
    specs: ['18.4 × 6.4 m', 'Kampung roof'],
  },
  {
    id: 'gandhok_tengen', def: gandhok, at: [15.5, -17], rot: -Math.PI / 2, zone: 'family',
    name: 'Gandhok Tengen', alias: 'Gandhok', en: 'Right side wing',
    desc: 'The matching wing on the other side of the dalem.',
    fn: 'Extra bedrooms and storage.',
    meaning: 'Paired wings give the compound its balanced, symmetrical plan.',
    specs: ['18.4 × 6.4 m', 'Kampung roof'],
  },
  {
    id: 'gadri', def: gadri, at: [0, -28.3], rot: 0, zone: 'family',
    name: 'Gadri', alias: 'Gadri', en: 'Family dining room',
    desc: 'An open-fronted hall behind the dalem.',
    fn: 'Where the family eats and spends everyday time.',
    meaning: 'Everyday life happens at the back, away from the formal front and the sacred dalem.',
    specs: ['14.4 × 6.6 m', 'Limasan roof'],
  },
  {
    id: 'pawon', def: pawon, at: [-13.5, -31.5], rot: 0, zone: 'service',
    name: 'Pawon', alias: 'Pawon', en: 'Kitchen',
    desc: 'The kitchen, with woven bamboo walls and a clay wood-fired stove (luweng).',
    fn: 'Cooking for the household.',
    meaning: 'Smoke, fire and daily work are kept at the back of the compound.',
    specs: ['9.4 × 6.4 m', 'Kampung roof'],
  },
  {
    id: 'pekiwan', def: pekiwan, at: [13.5, -32], rot: 0, zone: 'service',
    name: 'Pekiwan', alias: 'Pekiwan & sumur', en: 'Well and washroom',
    desc: 'The well with its small roof and an open bamboo bathing enclosure.',
    fn: 'Water for bathing, washing and cooking.',
    meaning: 'Placed in the far back corner, the least formal part of the compound.',
    specs: ['Well', 'Bathing enclosure'],
  },
  {
    id: 'regol', def: regol, at: [0, 0], rot: 0, zone: 'boundary',
    name: 'Regol & Pagar', alias: 'Regol, pagar, seketheng', en: 'Gate, walls and courtyard',
    desc: 'The perimeter wall with its gateway, the seketheng walls dividing front from back, and the open courtyard.',
    fn: 'Enclose the compound and control movement from the street to the family areas.',
    meaning: 'Every threshold (regol, then seketheng, then gebyok) takes you one step deeper into the household.',
    specs: ['46 × 57 m', '1 gate', '2 seketheng'],
  },
];

export default {
  loading: 'Laying out the omah…',
  about: {
    title: 'The Joglo of Yogyakarta',
    paras: [
      'The joglo is the most prestigious form of the traditional Javanese house. Its steep central roof over four master columns was once reserved for the nobility (priyayi) and the courts of Yogyakarta and Surakarta.',
      'A joglo is not one building but a compound (omah) laid out along a central axis, from public to private. The regol gate opens onto a courtyard and the open pendapa, where guests are received. Behind it the pringgitan, a stage for wayang, leads to the enclosed dalem, the family’s home, whose three senthong rooms close the axis. Side wings (gandhok), a family room (gadri), the kitchen (pawon) and the well (pekiwan) complete it.',
      'The frame is joined only with timber joints and sits loosely on stone bases, so it rides out earthquakes and can be taken apart and moved.',
      'This model is an idealised compound for learning. Real households vary widely in size, layout and which buildings they have.',
    ],
  },

  site: {
    categories: ZONES,
    buildings: BUILDINGS,
    sectionY: 1.6,
    views: { inside: { pos: [0, 1.7, 18.3], target: [0, 3.2, 6] } },
    // Site logic overlay: bands from public (front) to service (back), and the central axis.
    overlay: {
      x0: -23, x1: 23,
      zones: [
        { zone: 'public', z0: -3, z1: 20, text: 'Ngarep · public front' },
        { zone: 'threshold', z0: -10, z1: -3, text: 'Tengah · threshold' },
        { zone: 'family', z0: -25, z1: -10, text: 'Njero · family' },
        { zone: 'service', z0: -37, z1: -25, text: 'Mburi · service' },
      ],
      axis: { from: [0, 20], to: [0, -22.6], text: 'Central axis · regol → senthong tengah' },
    },
  },

  // Material slots shared by every building. `tex` names a texture in viewer/materials.js.
  slots: [
    { id: 'wood', label: 'Teak', tex: 'wood' },
    { id: 'carved', label: 'Carving', tex: 'wood' },
    { id: 'accent', label: 'Prada', tex: 'wood', glossy: true },
    { id: 'roof', label: 'Tiles', tex: 'tile', clay: '#dcd4c8' },
    { id: 'ornament', label: 'Crowns', tex: null, clay: '#d6cdbf' },
    { id: 'plaster', label: 'Walls', tex: 'stone', clay: '#f1eee8' },
    { id: 'stone', label: 'Stone', tex: 'stone', clay: '#d2cdc5' },
    { id: 'floor', label: 'Floor', tex: 'floor', clay: '#f3f0ea' },
    { id: 'plank', label: 'Planks', tex: 'wood', ui: false },
    { id: 'bamboo', label: 'Bamboo', tex: 'bamboo', ui: false },
    { id: 'ground', label: 'Courtyard', tex: 'stone', ui: false, clay: '#ece8e0' },
  ],
  presets: {
    natural: {
      label: 'Jati alami · natural teak', rough: 0.72, metal: { accent: 0.1 },
      colors: { wood: '#8b5a32', carved: '#7a4a28', accent: '#a8773f', roof: '#b4603f', ornament: '#9c4a30', plaster: '#e8dfd0', stone: '#8a857c', floor: '#c2ae90', plank: '#9c7049', bamboo: '#c9a773', ground: '#c7b594' },
    },
    kraton: {
      label: 'Kraton · painted & gilded', rough: 0.55, metal: { accent: 0.8 },
      colors: { wood: '#5e3a22', carved: '#2d5a44', accent: '#d8aa4c', roof: '#9a4a32', ornament: '#c99a3c', plaster: '#f2eee6', stone: '#6d6a64', floor: '#dcd4c4', plank: '#77553c', bamboo: '#c2a06c', ground: '#d4c6a8' },
    },
    aged: {
      label: 'Sepuh · weathered', rough: 0.92, metal: {},
      colors: { wood: '#6d5a48', carved: '#5c4c3e', accent: '#7a6650', roof: '#6e5046', ornament: '#6e5046', plaster: '#b9b1a3', stone: '#5f625e', floor: '#8f877a', plank: '#83705b', bamboo: '#9c8a6c', ground: '#a39479' },
    },
    modern: {
      label: 'Kontemporer · dark stain', rough: 0.6, metal: { accent: 0.3 },
      colors: { wood: '#3a2a20', carved: '#33251c', accent: '#b08a55', roof: '#4a4f55', ornament: '#4a4f55', plaster: '#f4f2ee', stone: '#a3a39e', floor: '#e6e3dd', plank: '#59483b', bamboo: '#b7a079', ground: '#d8d4cc' },
    },
  },
};
