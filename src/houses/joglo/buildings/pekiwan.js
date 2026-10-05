// Pekiwan: the well and bathing enclosure at the back of the compound.
// Local coordinates: well on the left (−x), enclosure on the right (+x), entrances facing +z.
import { reseed, partStore, box, frame, lathe, V } from '../../../lib/geometry.js';
import { mergeStore, columns, grid, gableRoof, wallRun } from '../../../lib/kit.js';
import * as THREE from 'three';

const WELL = [[0.55, 0], [0.72, 0], [0.72, 0.8], [0.55, 0.8], [0.55, 0]];
const BUCKET = [[0, 0], [0.12, 0], [0.15, 0.25], [0, 0.25]];
const JAR = [[0, 0], [0.18, 0], [0.3, 0.2], [0.32, 0.45], [0.24, 0.66], [0.2, 0.72], [0, 0.72]];

function build() {
  reseed(1111);
  const { parts, P } = partStore();
  const wx = -1.6;

  // ── Sumur: brick well ring on a stone apron, pulley and bucket
  P('sumur').add('stone', box(3.0, 0.08, 2.8, wx, 0.04, 0, 'stone', 1));
  P('sumur').add('plaster', lathe(WELL, V(wx, 0.08, 0), null, 24));
  P('sumur').add('ornament', new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16).rotateX(Math.PI / 2).translate(wx, 2.02, 0));
  P('sumur').add('wood', box(0.02, 1.1, 0.02, wx, 1.45, 0));
  P('sumur').add('wood', lathe(BUCKET, V(wx, 0.9, 0), null, 12));

  // ── Well roof on four posts
  columns(P('atap'), grid([wx - 1.1, wx + 1.1], [-0.95, 0.95]), 0.08, 2.2, 0.12);
  frame(P('atap'), 'wood', 1.1, 0.95, 2.26, 0.1, 0.12, 0.2);
  const roof = partStore();
  gableRoof(roof.P, { AX: 1.6, AZ: 1.35, y0: 2.15, y1: 2.95, t: 0.08, roof: 'atap', frame: 'atap' });
  mergeStore(P, roof.parts, { dx: wx });

  // ── Bilik: open-topped bathing enclosure of woven bamboo, with a water jar
  const bx0 = 0.6, bx1 = 3.4;
  P('bilik').add('stone', box(bx1 - bx0, 0.1, 2.4, (bx0 + bx1) / 2, 0.05, 0, 'stone', 1));
  wallRun(P('bilik'), 'bamboo', { axis: 'x', at: 1.2, from: bx0, to: bx1, y0: 0.1, h: 1.9, t: 0.06, mode: 'world', openings: [{ c: 1.3, w: 0.8, h: 1.9 }] });
  wallRun(P('bilik'), 'bamboo', { axis: 'x', at: -1.2, from: bx0, to: bx1, y0: 0.1, h: 1.9, t: 0.06, mode: 'world' });
  for (const x of [bx0, bx1]) wallRun(P('bilik'), 'bamboo', { axis: 'z', at: x, from: -1.2, to: 1.2, y0: 0.1, h: 1.9, t: 0.06, mode: 'world' });
  P('bilik').add('accent', lathe(JAR, V(2.8, 0.1, -0.6), null, 16));

  return { parts, counts: {} };
}

const CATEGORIES = [
  { id: 'water', label: { en: 'Water', id: 'Air' }, local: 'Banyu', color: '#6fa0b8' },
  { id: 'roof',  label: { en: 'Shelter', id: 'Naungan' }, local: 'Atap', color: '#cf5b3f' },
];

const PARTS = [
  {
    id: 'sumur', cat: 'water', name: 'Sumur', alias: 'Sumur & kerekan', en: { en: 'Well', id: 'Sumur' },
    explode: [0, 0, 0], anchor: [-1.6, 1.0, 0.8], focusDir: [0.4, 0.6, 1],
    desc: { en: 'A brick-lined well on a stone apron, with a pulley and bucket for drawing water.', id: 'Sumur berdinding bata di atas lantai batu, dengan kerekan dan timba untuk menimba air.' },
    fn: { en: 'The compound’s water supply for washing, bathing and cooking.', id: 'Sumber air kompleks untuk mencuci, mandi, dan memasak.' },
    meaning: { en: 'Water work belongs at the back of the compound, far from the formal front.', id: 'Pekerjaan yang berurusan dengan air ditempatkan di belakang kompleks, jauh dari bagian depan yang resmi.' },
    specs: [{ en: 'Brick ring', id: 'Cincin bata' }, { en: 'Pulley & bucket', id: 'Kerekan & timba' }],
  },
  {
    id: 'bilik', cat: 'water', name: 'Bilik Pekiwan', alias: 'Kamar mandi', en: { en: 'Bathing enclosure', id: 'Bilik mandi' },
    explode: [0, 1.2, 1.2], anchor: [2.0, 1.4, 1.3],
    desc: { en: 'An open-topped enclosure of woven bamboo with a large water jar, used for bathing.', id: 'Bilik tanpa atap dari anyaman bambu dengan gentong air besar, tempat mandi.' },
    fn: { en: 'Privacy for bathing with water carried from the well.', id: 'Memberi privasi untuk mandi dengan air yang diambil dari sumur.' },
    meaning: { en: 'Placed in the back corner, the least formal part of the compound.', id: 'Terletak di sudut belakang, bagian kompleks yang paling tidak resmi.' },
    specs: [{ en: 'Woven bamboo', id: 'Anyaman bambu' }, { en: 'Open to the sky', id: 'Terbuka ke langit' }],
  },
  {
    id: 'atap', cat: 'roof', name: 'Cungkup Sumur', alias: 'Atap sumur', en: { en: 'Well shelter', id: 'Cungkup sumur' }, roof: true,
    explode: [0, 2.6, 0], anchor: [-1.6, 2.8, 0.9],
    desc: { en: 'A small tiled roof on four posts over the well.', id: 'Atap genteng kecil di atas empat tiang yang menaungi sumur.' }, fn: { en: 'Keeps leaves and rain out of the well and shades whoever draws water.', id: 'Mencegah daun dan air hujan masuk ke sumur serta meneduhi orang yang menimba.' },
    meaning: { en: 'A small, useful shelter.', id: 'Naungan kecil yang berguna.' },
    specs: [{ en: '4 posts', id: '4 tiang' }, { en: 'Clay tiles', id: 'Genteng tanah liat' }],
  },
];

export default { build, categories: CATEGORIES, parts: PARTS, sectionY: 1.0, views: { inside: { pos: [0, 1.6, 3.2], target: [-1.6, 0.8, 0] } } };
