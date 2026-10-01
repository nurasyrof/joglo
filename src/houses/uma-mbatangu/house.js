// Uma Mbatangu: the Sumbanese "peaked house". A square house on stilts under a wide
// alang-alang roof, with a tall tower over the four main pillars. Its levels follow the
// Marapu cosmos: animals beneath, people in the middle, ancestors in the tower.
// Local coordinates: front (veranda and ladder) facing +z.
import * as THREE from 'three';
import { V, reseed, partStore, box, beam, frame, lathe, slab, tierFaces, rafters, battens } from '../../lib/geometry.js';
import { wallRun, opening } from '../../lib/kit.js';

const F = 1.8;                         // living floor height
const POSTS = [-4.5, -1.5, 1.5, 4.5];  // stilt grid
const MAIN = 1.5;                      // the four main pillars stand at (±1.5, ±1.5)
const WX = 4.6, W_FRONT = 2.4, W_BACK = -4.6;
const T = 0.35;                        // thatch thickness

const POT = [[0, 0], [0.16, 0], [0.24, 0.1], [0.26, 0.22], [0.2, 0.32], [0.22, 0.36], [0, 0.36]];
const JAR = [[0, 0], [0.18, 0], [0.3, 0.2], [0.32, 0.45], [0.24, 0.66], [0.2, 0.72], [0, 0.72]];
const FINIAL = [[0, 0], [0.09, 0], [0.11, 0.1], [0.07, 0.3], [0.1, 0.55], [0.05, 0.85], [0.07, 0.95], [0, 1.1]];

const cyl = (r, h, x, y0, z, seg = 10) => new THREE.CylinderGeometry(r * 0.92, r, h, seg).translate(x, y0 + h / 2, z);

// A pair of buffalo horns with a bit of skull, facing ±z.
function hornPair(part, at, s = 1, facing = 1) {
  const pts = [[0, 0, 0], [0.22, 0.04, 0.05], [0.42, 0.2, 0.07], [0.5, 0.45, 0.04], [0.45, 0.62, 0]];
  for (const side of [-1, 1]) {
    const curve = new THREE.CatmullRomCurve3(pts.map(([x, y, z]) => V(at.x + side * x * s, at.y + y * s, at.z + facing * z * s)));
    part.add('horn', new THREE.TubeGeometry(curve, 16, 0.04 * s, 6, false));
  }
  part.add('bone', box(0.18 * s, 0.22 * s, 0.14 * s, at.x, at.y - 0.06 * s, at.z, 'stone', 1));
}

// One thatched roof tier: slabs (alang-alang on top, bamboo lath beneath), rafters, battens, hip caps.
function thatchTier(P, tier, roofId) {
  let n = 0;
  for (const q of tierFaces(tier)) {
    const s = slab(q, T);
    P(roofId).add('thatch', s.top).add('bamboo', s.under);
    n += rafters(P('rangka_atap'), q, T, 'bamboo');
    battens(P('rangka_atap'), q, T, 'bamboo');
  }
  for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
    const a = V(sx * tier.AX, tier.y0 + 0.06, sz * tier.AZ), b = V(sx * tier.ix, tier.y1 + 0.06, sz * tier.iz);
    P(roofId).add('thatch', beam(a, b, 0.32, 0.16, 0.05));
  }
  return n;
}

export function makeUma({ top = 14.5, hornRows = 3, seed = 31 } = {}) {
  const LOWER = { AX: 6.4, AZ: 6.4, y0: 2.9, ix: 2.3, iz: 2.3, y1: 6.3 };
  const TOWER = { AX: 2.6, AZ: 2.6, y0: 6.1, ix: 0.35, iz: 0.08, y1: top };

  function build() {
    reseed(seed);
    const { parts, P } = partStore();

    // ── Bawah: stilts on flat stones, the animal pen beneath the floor
    for (const x of POSTS) for (const z of POSTS) {
      if (Math.abs(x) === MAIN && Math.abs(z) === MAIN) continue;
      P('tiang').add('stone', box(0.6, 0.16, 0.6, x, 0.08, z, 'stone', 1));
      P('tiang').add('wood', cyl(0.14, 3.9 - 0.16, x, 0.16, z));
    }
    frame(P('tiang'), 'wood', 4.5, 4.5, 3.95, 0.18, 0.16, 0.4);
    const pen = P('kolong');
    pen.add('ground', box(9.2, 0.04, 9.2, 0, 0.02, 0, 'world', 2));
    wallRun(pen, 'bamboo', { axis: 'x', at: -4.5, from: -4.5, to: 4.5, y0: 0, h: 1.0, t: 0.05, mode: 'world' });
    for (const x of [-4.5, 4.5]) wallRun(pen, 'bamboo', { axis: 'z', at: x, from: -4.5, to: 0, y0: 0, h: 1.0, t: 0.05, mode: 'world' });
    wallRun(pen, 'bamboo', { axis: 'x', at: 0, from: -4.5, to: 4.5, y0: 0, h: 1.0, t: 0.05, mode: 'world', openings: [{ c: 0, w: 1.0, h: 1.0 }] });

    // Ladder: a notched log up to the veranda
    const L = P('tangga');
    const a = V(0, 0.05, 6.4), b = V(0, F, 4.85);
    L.add('wood', beam(a, b, 0.34, 0.26));
    for (let k = 1; k <= 5; k++) {
      const p = a.clone().lerp(b, k / 6.2);
      L.add('wood', box(0.42, 0.06, 0.16, 0, p.y + 0.14, p.z));
    }
    L.add('stone', box(0.9, 0.16, 0.7, 0, 0.08, 6.5, 'stone', 1));

    // ── Tengah: floor, the four main pillars, walls and doors, hearth, horns
    const Fl = P('lantai');
    Fl.add('plank', box(9.6, 0.12, 9.6, 0, F - 0.06, 0, 'wood'));
    for (const z of POSTS) Fl.add('wood', box(9.4, 0.16, 0.16, 0, F - 0.2, z));
    for (const x of [-4.8, 4.8]) Fl.add('wood', box(0.12, 0.14, 2.4, x, F + 0.07, 3.6));     // veranda edge

    const M = P('tiang_utama');
    for (const x of [-MAIN, MAIN]) for (const z of [-MAIN, MAIN]) {
      M.add('stone', box(0.75, 0.2, 0.75, x, 0.1, z, 'stone', 1));
      M.add('wood', cyl(0.21, 6.15 - 0.2, x, 0.2, z, 12));
    }
    frame(M, 'wood', MAIN, MAIN, 6.0, 0.22, 0.22, 0.8);             // cantilevers carry the tower
    frame(M, 'wood', MAIN, MAIN, 3.75, 0.16, 0.18, 0.1);

    const D = P('dinding');
    const wh = 3.7 - F;
    wallRun(D, 'bamboo', { axis: 'x', at: W_BACK, from: -WX, to: WX, y0: F, h: wh, t: 0.06, mode: 'world' });
    for (const x of [-WX, WX]) wallRun(D, 'bamboo', { axis: 'z', at: x, from: W_BACK, to: W_FRONT, y0: F, h: wh, t: 0.06, mode: 'world' });
    const doors = [{ c: -2.6, w: 0.9, h: 1.6 }, { c: 2.6, w: 0.9, h: 1.6 }];
    wallRun(D, 'bamboo', { axis: 'x', at: W_FRONT, from: -WX, to: WX, y0: F, h: wh, t: 0.06, mode: 'world', openings: doors });
    for (const d of doors) opening(D, { at: W_FRONT, c: d.c, w: d.w, h: d.h, y0: F, leaves: 1, open: 0.9, t: 0.06, leafSlot: 'plank' });

    const H = P('tungku');
    H.add('wood', box(1.6, 0.16, 1.6, 0, F + 0.08, 0));
    H.add('ground', box(1.4, 0.14, 1.4, 0, F + 0.1, 0, 'world', 1));
    for (let k = 0; k < 3; k++) {
      const ang = (k / 3) * Math.PI * 2 + 0.3;
      H.add('stone', new THREE.DodecahedronGeometry(0.15, 0).scale(1, 1.3, 1).translate(Math.cos(ang) * 0.24, F + 0.32, Math.sin(ang) * 0.24));
    }
    H.add('accent', lathe(POT, V(0, F + 0.42, 0), null, 16));
    H.add('bamboo', box(2.0, 0.05, 2.0, 0, 3.55, 0, 'world', 1));                          // drying rack above the fire
    for (const [x, z] of [[-0.95, -0.95], [0.95, -0.95], [-0.95, 0.95], [0.95, 0.95]]) H.add('wood', box(0.025, 0.2, 0.025, x, 3.68, z));

    const Hn = P('tanduk');
    for (const x of [-MAIN, MAIN]) for (let r = 0; r < hornRows; r++) hornPair(Hn, V(x, 2.45 + r * 0.5, 4.62), 1 - r * 0.08);
    for (let r = 0; r < Math.max(1, hornRows - 1); r++) hornPair(Hn, V(0, 2.5 + r * 0.55, W_FRONT + 0.1), 1.05);

    // ── Atas: storage loft in the tower, roof frame, lower roof, tower, finials
    const Lo = P('loteng');
    Lo.add('plank', box(3.4, 0.1, 3.4, 0, 7.0, 0, 'wood'));
    for (const [x, z] of [[-0.9, -0.8], [0.7, -0.9], [-0.8, 0.8]]) Lo.add('bamboo', cyl(0.28, 0.55, x, 7.05, z, 14));
    Lo.add('accent', lathe(JAR, V(0.8, 7.05, 0.7), null, 16));

    frame(P('rangka_atap'), 'wood', 2.25, 2.25, 6.15, 0.16, 0.16, 0.1);
    const nLower = thatchTier(P, LOWER, 'atap');
    const nTower = thatchTier(P, TOWER, 'menara');
    P('menara').add('thatch', box(2 * TOWER.ix + 0.4, 0.22, 0.4, 0, top + 0.05, 0));

    for (const sx of [-1, 1]) {
      const at = V(sx * (TOWER.ix + 0.05), top + 0.12, 0);
      P('mahkota').add('wood', lathe(FINIAL, at, null, 10));
      hornPair(P('mahkota'), V(at.x, top + 1.05, 0), 0.75, 1);
    }

    return { parts, counts: { rafters: nLower + nTower } };
  }

  return { build, categories: CATEGORIES, parts: partsFor(top), sectionY: 2.6, views: { inside: { pos: [3.9, 3.0, 2.0], target: [-0.6, 2.7, -1.2] } } };
}

const CATEGORIES = [
  { id: 'bawah',  label: 'Lower world',  local: 'Bawah',  color: '#7f8a6a' },
  { id: 'tengah', label: 'Middle world', local: 'Tengah', color: '#c58a4a' },
  { id: 'atas',   label: 'Upper world',  local: 'Atas',   color: '#b0624a' },
];

// Anatomy text; `top` is this house's tower height.
const partsFor = (top) => [
  {
    id: 'kolong', cat: 'bawah', name: 'Kolong', alias: 'Bawah rumah', en: 'Space beneath the house',
    explode: [0, 0, 0], anchor: [-3, 1.1, -3], focusDir: [0.6, 0.15, 1],
    desc: 'The open ground beneath the raised floor, partly fenced with bamboo.',
    fn: 'Pigs, chickens and sometimes buffalo are kept here, close to the family and protected at night.',
    meaning: 'The lowest of the three levels of the house: the world of animals, below the world of people.',
    specs: ['Bamboo pen'],
  },
  {
    id: 'tiang', cat: 'bawah', name: 'Tiang', alias: 'Tiang rumah', en: 'Stilts',
    explode: [0, 0, 0], anchor: [4.5, 1.2, 4.5],
    desc: 'Round timber posts standing on flat stones, carrying the floor and the lower roof.',
    fn: 'Lift the living floor about two metres off the ground, away from damp, animals and floods.',
    meaning: 'Resting on stones rather than buried, the frame can flex in earthquakes.',
    specs: ['12 posts', 'Stone bases'],
  },
  {
    id: 'tangga', cat: 'bawah', name: 'Tangga', alias: 'Tangga kayu', en: 'Log ladder',
    explode: [0, 0, 2.5], anchor: [0.4, 1.0, 5.8], focusDir: [0.8, 0.3, 1],
    desc: 'A single log with notches cut as steps, leading up to the front veranda.',
    fn: 'The way up from the plaza to the veranda and the doors.',
    meaning: 'Climbing up into the house is climbing from the world of animals into the world of people.',
    specs: ['Notched log'],
  },
  {
    id: 'lantai', cat: 'tengah', name: 'Lantai & Beranda', alias: 'Lantai rumah', en: 'Floor and veranda',
    explode: [0, 1.6, 0], anchor: [-3, 1.95, 3.6],
    desc: 'A raised timber floor, extended at the front into an open veranda where visitors are received.',
    fn: 'The veranda is where guests sit, work is done and meetings are held; the enclosed part behind it is for the family.',
    meaning: 'The middle level of the house: the world of the living.',
    specs: ['Floor +1.8 m', 'Open veranda'],
  },
  {
    id: 'tiang_utama', cat: 'tengah', name: 'Tiang Utama', alias: 'Empat tiang utama', en: 'Four main pillars',
    explode: [0, 1.6, 0], anchor: [1.5, 4.6, 1.5], focusDir: [0.7, 0.2, 1],
    desc: 'Four tall pillars around the hearth rise through the house to carry the tower roof.',
    fn: 'The main structure of the house: the tower and its loft rest on them.',
    meaning: 'The most important posts of the house. Each has its own role in rituals, and offerings are made at them.',
    specs: ['4 pillars', 'Floor to tower'],
  },
  {
    id: 'dinding', cat: 'tengah', name: 'Dinding & Pintu', alias: 'Dinding bambu', en: 'Walls and two doors',
    explode: [0, 3.2, 0], anchor: [-4.6, 2.8, -1.2], focusDir: [-1, 0.3, 0.6],
    desc: 'Low walls of woven bamboo and boards enclose the family room, with two doors opening from the veranda.',
    fn: 'Shelter the living space while the deep roof keeps it shaded and dry.',
    meaning: 'Many houses have two entrances, and the inside is divided into a men’s side and a women’s side, each with its own door.',
    specs: ['Woven bamboo', '2 doors'],
  },
  {
    id: 'tungku', cat: 'tengah', name: 'Tungku', alias: 'Perapian', en: 'Central hearth',
    explode: [0, 2.4, 0], anchor: [0, 2.3, 0], focusDir: [0.5, 0.8, 1],
    desc: 'The fireplace at the centre of the house, between the four main pillars: three stones holding a clay pot, with a bamboo drying rack above.',
    fn: 'Cooking and warmth. Smoke rises into the tower, drying and preserving the stored harvest and the thatch.',
    meaning: 'The hearth is the heart of the household, at the centre of the house and of family life.',
    specs: ['3 hearth stones', 'Drying rack'],
  },
  {
    id: 'tanduk', cat: 'tengah', name: 'Tanduk Kerbau', alias: 'Tanduk', en: 'Buffalo horns',
    explode: [0, 3.2, 2.5], anchor: [-1.5, 3.8, 4.7], focusDir: [0.4, 0.2, 1],
    desc: 'Horns of buffalo, hung in rows on the front posts and the wall facing the veranda.',
    fn: 'They come from buffalo sacrificed at funerals and feasts held by the family.',
    meaning: 'A visible record of the family’s ceremonies and standing, shown to everyone on the plaza.',
    specs: ['From funerals & feasts'],
  },
  {
    id: 'loteng', cat: 'atas', name: 'Loteng', alias: 'Ruang menara', en: 'Storage loft in the tower',
    explode: [0, 6, 0], anchor: [0, 7.4, 0], focusDir: [0.5, -0.6, 1],
    desc: 'A platform inside the tower, above the hearth, holding baskets and jars.',
    fn: 'Stores seed and harvest, kept dry by smoke from the fire, and the family’s sacred heirlooms.',
    meaning: 'The upper level belongs to the ancestors (marapu). Heirlooms kept here link the living to them.',
    specs: ['Heirlooms', 'Seed & harvest'],
  },
  {
    id: 'rangka_atap', cat: 'atas', name: 'Rangka Atap', alias: 'Usuk bambu', en: 'Roof frame', lift: true,
    explode: [0, 8, 0], anchor: [4.0, 4.0, 4.0],
    desc: 'Bamboo rafters and battens for both roofs, and the ring beam at the foot of the tower.',
    fn: 'Hold the heavy thatch; bamboo is light, strong and easy to replace.',
    meaning: 'Rebuilding a roof is a shared task for the clan.',
    specs: ['{rafters} rafters', 'Bamboo'],
  },
  {
    id: 'atap', cat: 'atas', name: 'Atap', alias: 'Atap alang-alang', en: 'Lower roof', roof: true, lift: true,
    explode: [0, 9.5, 0], anchor: [0, 4.6, 4.8],
    desc: 'A wide hipped roof of alang-alang grass that reaches far beyond the walls.',
    fn: 'Its deep eaves shade the veranda and keep rain off the walls and the floor.',
    meaning: 'Shelter for the world of people, under the tower of the ancestors.',
    specs: ['Alang-alang thatch'],
  },
  {
    id: 'menara', cat: 'atas', name: 'Menara', alias: 'Uma mbatangu', en: 'Tower roof', roof: true, lift: true,
    explode: [0, 11.5, 0], anchor: [0, 10, 1.4],
    desc: 'The tall, steep peak rising from the middle of the roof, which gives the Uma Mbatangu (“peaked house”) its name.',
    fn: 'Covers the loft and draws smoke and hot air up and away from the living floor.',
    meaning: 'The tower is the realm of the marapu, the ancestral spirits. The taller the tower, the more important the house.',
    specs: [`Peak +${top} m`, 'Alang-alang thatch'],
  },
  {
    id: 'mahkota', cat: 'atas', name: 'Mahkota Menara', alias: 'Hiasan puncak', en: 'Peak ornaments', lift: true,
    explode: [0, 13, 0], anchor: [0.4, 16, 0], focusDir: [0.7, 0.2, 1],
    desc: 'Carved wooden ornaments, here with small horns, crowning the two ends of the tower ridge.',
    fn: 'Finish and protect the top of the ridge.',
    meaning: 'They mark the house from afar, at the point closest to the ancestors.',
    specs: ['2 ornaments'],
  },
];
