// Directory of Indonesian traditional houses.
// `status: 'ready'` entries have a 3D model and a `load()` that imports their definition;
// the rest are listed in the directory as coming soon.
// `art` is SVG markup for a 120 × 72 silhouette drawn in currentColor.

export const ISLANDS = ['Sumatra', 'Java', 'Bali & Nusa Tenggara', 'Kalimantan', 'Sulawesi', 'Maluku & Papua'];

const stilts = (xs, top = 52, bottom = 66) => xs.map((x) => `<rect x="${x - 1}" y="${top}" width="2" height="${bottom - top}"/>`).join('');
const range = (a, b, step) => Array.from({ length: Math.floor((b - a) / step) + 1 }, (_, i) => a + i * step);

export const HOUSES = [
  {
    id: 'krong-bade', name: 'Rumah Krong Bade', local: 'Rumoh Aceh', island: 'Sumatra', province: 'Aceh', people: 'Acehnese',
    blurb: 'A long timber house raised on round posts, entered by a stair at the front.',
    status: 'soon',
    art: `<path d="M16 34 60 8l44 26Z"/><rect x="24" y="34" width="72" height="16"/>${stilts(range(28, 92, 8), 50)}<path d="M40 50 32 66" stroke="currentColor" stroke-width="2"/>`,
  },
  {
    id: 'rumah-bolon', name: 'Rumah Bolon', local: 'Jabu Bolon', island: 'Sumatra', province: 'North Sumatra', people: 'Batak Toba',
    blurb: 'A great house on piles with a steep saddle roof and carved, overhanging gables.',
    status: 'soon',
    art: `<path d="M8 12c16 9 32 12 52 12s36-3 52-12L98 40H22Z"/><rect x="26" y="40" width="68" height="12"/>${stilts(range(30, 90, 10))}`,
  },
  {
    id: 'rumah-gadang', name: 'Rumah Gadang', local: 'Rumah Bagonjong', island: 'Sumatra', province: 'West Sumatra', people: 'Minangkabau',
    blurb: 'A long matrilineal family house whose roof sweeps up into buffalo-horn gonjong.',
    status: 'ready', load: () => import('./rumah-gadang/index.js'),
    art: `<path d="M4 6c8 18 18 28 36 28h40c18 0 28-10 36-28-4 20-14 34-28 36H32C18 40 8 26 4 6Z"/><path d="M28 2c6 16 14 24 32 24s26-8 32-24c-3 18-11 30-22 32H50C39 32 31 20 28 2Z"/><rect x="24" y="42" width="72" height="12"/>${stilts(range(28, 92, 8), 54)}`,
  },
  {
    id: 'rumah-limas', name: 'Rumah Limas', local: 'Rumah Bari', island: 'Sumatra', province: 'South Sumatra', people: 'Palembang Malay',
    blurb: 'A stilt house with stepped floor levels under a pyramidal limas roof.',
    status: 'soon',
    art: `<path d="M60 8 102 34H18Z"/><rect x="26" y="34" width="68" height="12"/><rect x="18" y="46" width="84" height="4"/>${stilts(range(24, 96, 12), 50)}`,
  },
  {
    id: 'joglo', name: 'Joglo', local: 'Omah Joglo', island: 'Java', province: 'DI Yogyakarta', people: 'Javanese',
    blurb: 'A walled compound laid out from public to private: open pendapa, wayang hall and the enclosed dalem.',
    status: 'ready', load: () => import('./joglo/index.js'),
    art: `<path d="M60 6l8 14 12 6 26 14H14l26-14 12-6Z"/>${stilts([22, 34, 48, 72, 86, 98], 40, 62)}<rect x="12" y="62" width="96" height="4"/>`,
  },
  {
    id: 'rumah-kebaya', name: 'Rumah Kebaya', local: 'Rumah Betawi', island: 'Java', province: 'Jakarta', people: 'Betawi',
    blurb: 'Named for a roof that folds like a kebaya, fronted by a wide open veranda.',
    status: 'soon',
    art: `<path d="M60 10l24 16 24 12H12l24-12Z"/><rect x="24" y="38" width="72" height="22"/><rect x="12" y="60" width="96" height="6"/>`,
  },
  {
    id: 'julang-ngapak', name: 'Imah Julang Ngapak', local: 'Imah Panggung', island: 'Java', province: 'West Java', people: 'Sundanese',
    blurb: 'Its roof flares out at the sides like a bird spreading its wings.',
    status: 'soon',
    art: `<path d="M60 8l28 22 24 8H96L60 16 24 38H8l24-8Z"/><rect x="28" y="36" width="64" height="20"/>${stilts(range(32, 88, 14), 56)}`,
  },
  {
    id: 'pekarangan-bali', name: 'Pekarangan Bali', local: 'Umah Bali', island: 'Bali & Nusa Tenggara', province: 'Bali', people: 'Balinese',
    blurb: 'A walled compound of open pavilions around a courtyard, laid out by the nine zones of the Sanga Mandala.',
    status: 'ready', load: () => import('./pekarangan-bali/index.js'),
    art: `<rect x="10" y="58" width="100" height="8"/><path d="M14 40h30l-6-16H20Z"/><rect x="17" y="40" width="24" height="18" fill-opacity=".55"/><path d="M48 46h28l-6-20H54Z"/><rect x="52" y="46" width="20" height="12" fill-opacity=".55"/><path d="M80 38h28l-5-18H85Z"/><rect x="84" y="38" width="20" height="20" fill-opacity=".55"/>`,
  },
  {
    id: 'bale-tani', name: 'Bale Tani', local: 'Bale Sasak', island: 'Bali & Nusa Tenggara', province: 'West Nusa Tenggara', people: 'Sasak',
    blurb: 'A Sasak house with a low-slung grass roof and a raised earthen floor.',
    status: 'soon',
    art: `<path d="M60 10l46 42H14Z"/><rect x="30" y="52" width="60" height="8"/><rect x="22" y="60" width="76" height="6"/>`,
  },
  {
    id: 'uma-mbatangu', name: 'Uma Mbatangu', local: 'Rumah Adat Sumba', island: 'Bali & Nusa Tenggara', province: 'East Nusa Tenggara', people: 'Sumbanese',
    blurb: 'A village of peaked clan houses on stilts, facing a plaza of megalithic tombs.',
    status: 'ready', load: () => import('./uma-mbatangu/index.js'),
    art: `<path d="M60 2l7 22 33 16H20l33-16Z"/><rect x="26" y="40" width="68" height="10"/>${stilts(range(30, 90, 12), 50)}<path d="M51 1c3 2 6 2 9 0 3 2 6 2 9 0" fill="none" stroke="currentColor" stroke-width="2"/>`,
  },
  {
    id: 'mbaru-niang', name: 'Mbaru Niang', local: 'Wae Rebo', island: 'Bali & Nusa Tenggara', province: 'East Nusa Tenggara', people: 'Manggarai',
    blurb: 'A tall conical house of many storeys, shared by several families.',
    status: 'soon',
    art: `<path d="M60 4l36 62H24Z"/><rect x="59" y="0" width="2" height="6"/><rect x="54" y="54" width="12" height="12" fill-opacity=".35"/>`,
  },
  {
    id: 'rumah-betang', name: 'Rumah Betang', local: 'Lamin', island: 'Kalimantan', province: 'Central Kalimantan', people: 'Dayak',
    blurb: 'A communal longhouse on tall piles, home to many families under one roof.',
    status: 'soon',
    art: `<path d="M6 26l10-10h88l10 10Z"/><rect x="10" y="26" width="100" height="12"/>${stilts(range(14, 106, 8), 38)}`,
  },
  {
    id: 'tongkonan', name: 'Tongkonan', local: 'Banua Toraja', island: 'Sulawesi', province: 'South Sulawesi', people: 'Toraja',
    blurb: 'Ancestral houses whose roofs rise like a boat’s prow, facing their rice barns across the yard.',
    status: 'ready', load: () => import('./tongkonan/index.js'),
    art: `<path d="M4 8c20 22 40 20 56 20s36 2 56-20c-8 22-20 32-32 34H36C24 40 12 30 4 8Z"/><rect x="38" y="42" width="44" height="10"/>${stilts(range(42, 78, 9))}`,
  },
  {
    id: 'baileo', name: 'Baileo', local: 'Rumah Baileo', island: 'Maluku & Papua', province: 'Maluku', people: 'Central Maluku',
    blurb: 'An open-sided raised hall where the village council meets.',
    status: 'soon',
    art: `<path d="M34 12h52l22 22H12Z"/>${stilts(range(22, 98, 12), 34)}<rect x="18" y="44" width="84" height="4"/>`,
  },
  {
    id: 'honai', name: 'Honai', local: 'Pilamo', island: 'Maluku & Papua', province: 'Highland Papua', people: 'Dani',
    blurb: 'A round hut with a thick thatched dome that keeps highland nights warm.',
    status: 'soon',
    art: `<path d="M20 50c2-26 22-38 40-38s38 12 40 38Z"/><rect x="30" y="50" width="60" height="16"/><rect x="55" y="54" width="10" height="12" fill-opacity=".35"/>`,
  },
];

export const houseById = (id) => HOUSES.find((h) => h.id === id);
export const readyHouses = () => HOUSES.filter((h) => h.status === 'ready');
