// The ground of the silimo: the long yard, the two fences around it, the gate, and the
// banana garden between the fences. Built in site coordinates; the gate is at the +z end
// and the pilamo stands at the −z end, looking down the yard at it.
import * as THREE from 'three';
import { reseed, rand, partStore, box } from '../../lib/geometry.js';
import { cyl, plankLine } from './kit.js';

const GATE = 1.0;                       // half-width of the way in
// Both fences are drawn from one side of the gate round to the other; the ends narrow a little.
export const INNER = [[GATE, 12.5], [7, 10.5], [7, -8.5], [2.6, -11.6], [-2.6, -11.6], [-7, -8.5], [-7, 10.5], [-GATE, 12.5]];
export const OUTER = [[GATE + 0.3, 17], [11.5, 14.5], [11.5, -12.5], [4, -16.5], [-4, -16.5], [-11.5, -12.5], [-11.5, 14.5], [-GATE - 0.3, 17]];
export const BOUNDS = { x: 11.5, z0: -16.5, z1: 17 };

const BANANAS = [
  [9.3, -9], [9.4, -4], [9.2, 1.2], [9.4, 6.3], [9.2, 11.2], [-9.3, -8.6], [-9.4, -3.4], [-9.2, 1.8], [-9.4, 6.8], [-9.2, 11.6],
  [5.2, -12.9], [-5.2, -12.9], [0.4, -14.1], [6, 13.3], [-6, 13.3], [3.5, 14.2], [-3.6, 14.4],
];

// A flat piece of ground with the given outline ([x, z] points).
function ground(points, y, scale) {
  const g = new THREE.ShapeGeometry(new THREE.Shape(points.map(([x, z]) => new THREE.Vector2(x, -z))));
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / scale, uv.getY(i) / scale);
  return g.rotateX(-Math.PI / 2).translate(0, y, 0);
}

function fence(part, points, h) {
  let n = 0;
  for (let k = 0; k < points.length - 1; k++) n += plankLine(part, 'wood', points[k], points[k + 1], h, { step: 0.2, t: 0.06, jitter: 0.14, rail: h - 0.3, railSlot: 'rope' });
  return n;
}

// Two posts and a lintel, with a board across the bottom to step over.
function gateway(part, z, half) {
  for (const s of [-1, 1]) part.add('wood', cyl(0.09, 1.9, s * (half + 0.05), 0, z, 8));
  part.add('wood', box(2 * half + 0.6, 0.12, 0.14, 0, 1.84, z));
  part.add('wood', box(2 * half, 0.34, 0.06, 0, 0.17, z));
}

function banana(part, x, z) {
  const h = 1.2 + rand() * 0.7, turn = rand() * Math.PI;
  part.add('stem', cyl(0.085, h, x, 0, z, 8));
  for (let k = 0; k < 6; k++) {
    const len = 1.2 + rand() * 0.6;
    const g = new THREE.PlaneGeometry(0.58, len, 1, 5).translate(0, len / 2, 0);
    const p = g.attributes.position;
    // Lean the blade outwards and let it droop towards the tip
    for (let i = 0; i < p.count; i++) {
      const t = p.getY(i) / len;
      p.setXYZ(i, p.getX(i) * (1 - 0.4 * t * t * t), len * (0.98 * t - 0.42 * t * t), len * (0.22 * t + 0.42 * t * t));
    }
    g.computeVertexNormals();
    part.add('leaf', g.rotateY(turn + (k / 6) * Math.PI * 2 + rand() * 0.4).translate(x, h - 0.1 + (k % 2) * 0.12, z));
  }
}

function buildFences() {
  reseed(401);
  const { parts, P } = partStore();
  const inner = fence(P('leget'), INNER, 1.25);
  const outer = fence(P('pagar_luar'), OUTER, 1.4);
  gateway(P('gapura'), INNER[0][1], GATE);
  gateway(P('gapura'), OUTER[0][1], GATE + 0.3);
  return { parts, counts: { inner, outer } };
}

function buildYard() {
  reseed(402);
  const { parts, P } = partStore();
  P('kebun').add('ground', ground(OUTER, 0.012, 3));
  P('halaman').add('yard', ground(INNER, 0.03, 3));
  for (const [x, z] of BANANAS) banana(P('kebun'), x, z);
  return { parts, counts: { bananas: BANANAS.length } };
}

export const fences = {
  build: buildFences,
  categories: [{ id: 'pagar', label: { en: 'Fences and gate', id: 'Pagar dan gerbang' }, local: 'Leget', color: '#8a7a5c' }],
  parts: [
    {
      id: 'leget', cat: 'pagar', name: 'Leget', alias: 'Pagar dalam', en: { en: 'Inner fence', id: 'Pagar dalam' },
      explode: [0, 0.8, 0], anchor: [7, 1.6, 2], focusDir: [1, 0.4, 0.6],
      desc: { en: 'A fence of rough split timber round the yard, closing the gaps between the buildings.', id: 'Pagar dari belahan kayu kasar yang mengelilingi halaman dan menutup celah di antara bangunan.' },
      fn: { en: 'Keeps the pigs in the yard and makes the gate the only way in.', id: 'Menahan babi tetap di halaman dan menjadikan gerbang satu-satunya jalan masuk.' },
      meaning: { en: 'In the Hubula language the inner fence is the leget: the sign that this ground belongs to someone.', id: 'Dalam bahasa Hubula pagar dalam disebut leget: tanda bahwa tanah ini ada pemiliknya.' },
      specs: [{ en: '{inner} stakes', id: '{inner} tonggak' }, { en: 'Split timber', id: 'Kayu belah' }],
    },
    {
      id: 'pagar_luar', cat: 'pagar', name: 'Pagar Luar', alias: 'Pagar lapis kedua', en: { en: 'Outer fence', id: 'Pagar luar' },
      explode: [0, 0.4, 0], anchor: [11.5, 1.7, -2], focusDir: [1, 0.4, 0.6],
      desc: { en: 'A second fence a few metres outside the first, taking in the garden behind the houses.', id: 'Pagar kedua beberapa meter di luar pagar pertama, yang melingkupi kebun di belakang rumah-rumah.' },
      fn: { en: 'Anyone coming to the compound has to cross two fences, in sight of the men’s house.', id: 'Siapa pun yang mendatangi kompleks ini harus melewati dua pagar, dalam pandangan dari rumah laki-laki.' },
      meaning: { en: 'The silimo was laid out in a time of warfare between clans, and the double fence is part of its defence.', id: 'Silimo ditata pada masa perang antarklen, dan pagar dua lapis itu adalah bagian dari pertahanannya.' },
      specs: [{ en: '{outer} stakes', id: '{outer} tonggak' }],
    },
    {
      id: 'gapura', cat: 'pagar', name: 'Gapura', alias: 'Gerbang silimo', en: { en: 'Gate', id: 'Gerbang' },
      explode: [0, 1.6, 0], anchor: [1.3, 2.2, 12.5], focusDir: [0.5, 0.3, 1],
      desc: { en: 'The single way into the compound, through both fences, with a board across it to step over.', id: 'Satu-satunya jalan masuk ke kompleks, menembus kedua pagar, dengan papan melintang yang harus dilangkahi.' },
      fn: { en: 'It is watched by the men: everyone who comes in is seen, kin or enemy.', id: 'Gerbang ini dijaga para lelaki: setiap orang yang masuk terlihat, kerabat ataupun musuh.' },
      meaning: { en: 'The gate stands in line with the door of the pilamo at the far end of the yard.', id: 'Gerbang berdiri segaris dengan pintu pilamo di ujung halaman yang jauh.' },
      specs: [{ en: '1 way in', id: '1 jalan masuk' }, { en: '2 gateways', id: '2 gapura' }],
    },
  ],
  sectionY: 1.0,
  views: { inside: { pos: [0, 1.6, 19.5], target: [0, 1.2, 0] } },
};

export const yard = {
  build: buildYard,
  categories: [{ id: 'tanah', label: { en: 'Ground', id: 'Tanah' }, local: 'Silimo', color: '#7f8a6a' }],
  parts: [
    {
      id: 'halaman', cat: 'tanah', name: 'Halaman', alias: 'Halaman silimo', en: { en: 'Yard', id: 'Halaman' }, pick: false,
      explode: [0, 0, 0], anchor: [0, 0.4, 3],
      desc: { en: 'The long open ground in the middle of the compound, narrowing a little at both ends.', id: 'Tanah lapang memanjang di tengah kompleks, sedikit menyempit di kedua ujungnya.' },
      fn: { en: 'Every door opens onto it. Daily work is done here, and it is where ceremonies are held.', id: 'Semua pintu membuka ke halaman ini. Pekerjaan sehari-hari dilakukan di sini, dan di sinilah upacara diadakan.' },
      meaning: { en: 'With the kitchen, the yard is the shared ground of the silimo, where men and women meet.', id: 'Bersama dapur, halaman adalah ruang bersama silimo, tempat laki-laki dan perempuan bertemu.' },
      specs: ['14 × 24 m'],
    },
    {
      id: 'kebun', cat: 'tanah', name: 'Kebun Pisang', alias: 'Kebun pekarangan', en: { en: 'Banana garden', id: 'Kebun pisang' },
      explode: [0, 0, 0], anchor: [9.3, 2.6, 1.2], focusDir: [1, 0.4, 0.5],
      desc: { en: 'The strip of ground between the two fences, planted with bananas and other household crops.', id: 'Jalur tanah di antara kedua pagar, ditanami pisang dan tanaman pekarangan lainnya.' },
      fn: { en: 'A small garden next to the houses. The main sweet-potato gardens lie outside the compound.', id: 'Kebun kecil di dekat rumah. Kebun ubi jalar yang utama berada di luar kompleks.' },
      meaning: { en: 'The gardens are the women’s work, and a silimo is sited to keep them close and safe.', id: 'Kebun adalah pekerjaan perempuan, dan lokasi silimo dipilih agar kebun tetap dekat dan aman.' },
      specs: [{ en: '{bananas} banana plants', id: '{bananas} rumpun pisang' }],
    },
  ],
  sectionY: 0.6,
  views: { inside: { pos: [0, 1.6, 11], target: [0, 1.2, -8] } },
};
