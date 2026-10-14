// The middle of the village: the compang, the round altar of earth and stone that every
// house faces, and the open ground around it. Built in site coordinates, compang at the origin.
import * as THREE from 'three';
import { reseed, rand, partStore } from '../../lib/geometry.js';

export const RING = 32;          // distance from the compang to the centre of each house
export const GROUND = 46;        // radius of the cleared ground

const drum = (r0, r1, h, y, seg = 28) => {
  const g = new THREE.CylinderGeometry(r1, r0, h, seg);
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * r0 * 4, uv.getY(i) * Math.max(1, h));
  return g.translate(0, y + h / 2, 0);
};

function buildCompang() {
  reseed(601);
  const { parts, P } = partStore();
  const C = P('compang');
  C.add('stone', drum(4.4, 4.2, 0.5, 0));
  C.add('stone', drum(3.6, 3.4, 0.5, 0.5));
  C.add('earth', drum(3.3, 3.3, 0.06, 0.98));
  // Loose stones round the rim and a flat offering stone in the middle
  for (let k = 0; k < 26; k++) {
    const a = (k / 26) * Math.PI * 2 + rand() * 0.1, s = 0.16 + rand() * 0.1;
    C.add('stone', new THREE.DodecahedronGeometry(s, 0).scale(1.2, 0.7, 1).rotateY(rand() * 3).translate(Math.cos(a) * 3.35, 1.04 + s * 0.3, Math.sin(a) * 3.35));
  }
  P('batu').add('stone', drum(0.55, 0.5, 0.22, 1.04, 9));
  P('batu').add('stone', new THREE.CylinderGeometry(0.12, 0.16, 0.9, 6).translate(0.75, 1.49, -0.2));
  return { parts, counts: {} };
}

function buildGround() {
  reseed(602);
  const { parts, P } = partStore();
  const g = new THREE.CircleGeometry(GROUND, 72);
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * GROUND * 0.6, uv.getY(i) * GROUND * 0.6);
  P('halaman').add('ground', g.rotateX(-Math.PI / 2).translate(0, 0.015, 0));
  const worn = new THREE.CircleGeometry(RING - 9, 64);
  const uw = worn.attributes.uv;
  for (let i = 0; i < uw.count; i++) uw.setXY(i, uw.getX(i) * 12, uw.getY(i) * 12);
  P('halaman').add('yard', worn.rotateX(-Math.PI / 2).translate(0, 0.03, 0));
  return { parts, counts: {} };
}

export const compang = {
  build: buildCompang,
  categories: [{ id: 'altar', label: { en: 'Altar', id: 'Altar' }, local: 'Compang', color: '#8d8a82' }],
  parts: [
    {
      id: 'compang', cat: 'altar', name: 'Compang', alias: 'Altar batu', en: { en: 'Round altar', id: 'Altar bundar' },
      explode: [0, 0, 0], anchor: [3.4, 1.6, 2], focusDir: [0.6, 0.4, 1],
      desc: { en: 'A round platform of rammed earth faced with stone, standing in the middle of the village.', id: 'Pelataran bundar dari tanah yang dipadatkan dan dilapisi batu, berdiri di tengah kampung.' },
      fn: { en: 'The place for ceremonies that honour God and the ancestors.', id: 'Tempat upacara untuk memuliakan Tuhan dan para leluhur.' },
      meaning: { en: 'It is sacred ground. The houses stand in an open circle around it, and the drum house faces it directly.', id: 'Compang adalah tanah yang sakral. Rumah-rumah berdiri dalam lingkaran terbuka mengelilinginya, dan rumah gendang berhadapan langsung dengannya.' },
      specs: [{ en: 'Earth and stone', id: 'Tanah dan batu' }, { en: 'Ø ≈ 7 m', id: 'Ø ≈ 7 m' }],
    },
    {
      id: 'batu', cat: 'altar', name: 'Batu Sesaji', alias: 'Batu persembahan', en: { en: 'Offering stones', id: 'Batu sesaji' },
      explode: [0, 1.2, 0], anchor: [0.4, 2.3, 0], focusDir: [0.5, 0.5, 1],
      desc: { en: 'A flat stone and an upright one on top of the platform.', id: 'Sebuah batu pipih dan sebuah batu tegak di atas pelataran.' },
      fn: { en: 'Where offerings are laid during ceremonies.', id: 'Tempat sesaji diletakkan saat upacara.' },
      meaning: { en: 'The fixed centre of the village, around which everything else is arranged.', id: 'Pusat kampung yang tetap, tempat segala sesuatu yang lain ditata mengelilinginya.' }, interp: true,
      specs: [{ en: 'Illustrative', id: 'Ilustratif' }],
    },
  ],
  sectionY: 0.8,
  views: { inside: { pos: [7, 1.7, 9], target: [0, 1.2, 0] } },
};

export const ground = {
  build: buildGround,
  categories: [{ id: 'tanah', label: { en: 'Ground', id: 'Tanah' }, local: 'Halaman', color: '#7f8a6a' }],
  parts: [
    {
      id: 'halaman', cat: 'tanah', name: 'Halaman Kampung', alias: 'Lapangan tengah', en: { en: 'Village green', id: 'Halaman kampung' }, pick: false,
      explode: [0, 0, 0], anchor: [10, 0.4, 12],
      desc: { en: 'The open grass between the houses, worn bare in the middle around the compang.', id: 'Rumput terbuka di antara rumah-rumah, gundul di bagian tengah di sekitar compang.' },
      fn: { en: 'The shared ground of daily life, and where the whole village gathers for ceremonies.', id: 'Ruang bersama untuk kehidupan sehari-hari, dan tempat seluruh kampung berkumpul untuk upacara.' },
      meaning: { en: 'The village sits in a hollow about 1,200 m up, with mountains on every side.', id: 'Kampung ini berada di cekungan pada ketinggian sekitar 1.200 m, dikelilingi pegunungan.' },
      specs: [{ en: `Ø ${2 * GROUND} m`, id: `Ø ${2 * GROUND} m` }],
    },
  ],
  sectionY: 0.5,
  views: { inside: { pos: [0, 1.7, 30], target: [0, 5, -20] } },
};
