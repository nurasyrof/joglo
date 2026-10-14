// The huta: the earth rampart (parik) planted with bamboo, the gate (bahal), the banyan
// before it, and the yard (alaman) between the row of houses and the row of barns.
// Built in site coordinates: houses along −z, barns along +z, the gate at the +x end.
import * as THREE from 'three';
import { V, reseed, rand, partStore, box, beam } from '../../lib/geometry.js';

export const HUTA = { x: 21, z: 19, gate: 1.6 };
const BANK = { h: 1.5, w: 2.2 };

const stone = (len, h, w, x, y, z, rot = 0) => box(len, h, w, 0, y, 0, 'stone', 1.2).rotateY(rot).translate(x, 0, z);

function bamboo(part, x, z) {
  for (let k = 0; k < 5; k++) {
    const a = rand() * Math.PI * 2, d = rand() * 0.45, h = 3.4 + rand() * 1.8, lean = (rand() - 0.5) * 0.25;
    const base = V(x + Math.cos(a) * d, BANK.h - 0.1, z + Math.sin(a) * d), top = V(base.x + lean * h * 0.4, BANK.h + h, base.z + (rand() - 0.5) * 0.9);
    part.add('bamboo', beam(base, top, 0.06, 0.06));
    part.add('leaf', new THREE.ConeGeometry(0.3, 1.1, 5).translate(top.x, top.y - 0.25, top.z));
  }
}

function buildParik() {
  reseed(701);
  const { parts, P } = partStore();
  const { x: X, z: Z, gate } = HUTA;
  const B = P('parik');
  for (const s of [-1, 1]) {
    B.add('earth', stone(2 * X + BANK.w, BANK.h, BANK.w, 0, BANK.h / 2, s * Z));
    B.add('stone', stone(2 * X + BANK.w + 0.2, 0.5, BANK.w + 0.3, 0, 0.25, s * Z));
  }
  B.add('earth', stone(BANK.w, BANK.h, 2 * Z, -X, BANK.h / 2, 0));
  B.add('stone', stone(BANK.w + 0.3, 0.5, 2 * Z, -X, 0.25, 0));
  for (const s of [-1, 1]) {
    const len = Z - gate, c = s * (gate + len / 2);
    B.add('earth', stone(BANK.w, BANK.h, len, X, BANK.h / 2, c));
    B.add('stone', stone(BANK.w + 0.3, 0.5, len, X, 0.25, c));
  }
  let clumps = 0;
  for (let x = -X + 2; x <= X - 1; x += 4.4) for (const s of [-1, 1]) { bamboo(P('bambu'), x, s * Z); clumps++; }
  for (let z = -Z + 3; z <= Z - 2; z += 4.4) {
    bamboo(P('bambu'), -X, z); clumps++;
    if (Math.abs(z) > gate + 1.5) { bamboo(P('bambu'), X, z); clumps++; }
  }

  // Bahal: a narrow gateway of stone through the rampart
  const G = P('bahal');
  for (const s of [-1, 1]) {
    G.add('stone', stone(BANK.w + 0.6, 2.3, 0.7, X, 1.15, s * (gate + 0.2)));
    G.add('stone', stone(0.9, 0.35, 0.9, X - 0.9, 2.45, s * (gate + 0.2)));
  }
  G.add('stone', stone(0.5, 0.22, 2 * gate, X + 0.4, 0.11, 0));

  // Hariara: the banyan planted outside the gate
  const H = P('hariara');
  const tx = X + 7, tz = 5;
  H.add('wood', new THREE.CylinderGeometry(0.55, 0.9, 5, 10).translate(tx, 2.5, tz));
  for (const [dx, dz, dy] of [[1.6, 0.4, 5.6], [-1.3, 1.2, 5.9], [0.2, -1.6, 5.4], [-0.6, -0.4, 6.6]]) H.add('wood', beam(V(tx, 4.2, tz), V(tx + dx, dy, tz + dz), 0.3, 0.3));
  for (const [dx, dy, dz, r] of [[0, 8.6, 0, 3.4], [2.6, 7.4, 0.8, 2.5], [-2.4, 7.7, 1.6, 2.6], [0.4, 7.2, -2.6, 2.4], [-1.2, 9.6, -0.8, 2.3], [1.6, 9.2, -1.4, 2.0]]) {
    H.add('leaf', new THREE.IcosahedronGeometry(r, 1).scale(1, 0.72, 1).translate(tx + dx, dy, tz + dz));
  }
  return { parts, counts: { clumps } };
}

function buildYard() {
  reseed(702);
  const { parts, P } = partStore();
  const { x: X, z: Z } = HUTA;
  P('alaman').add('yard', box(2 * X - BANK.w, 0.04, 2 * Z - BANK.w, 0, 0.02, 0, 'world', 3));
  P('alaman').add('ground', box(2 * X + 22, 0.03, 2 * Z + 10, 4, 0.01, 0, 'world', 3));
  return { parts, counts: {} };
}

export const parik = {
  build: buildParik,
  categories: [{ id: 'batas', label: { en: 'Boundary', id: 'Batas kampung' }, local: 'Parik', color: '#8d8a82' }],
  parts: [
    {
      id: 'parik', cat: 'batas', name: 'Parik', alias: 'Benteng tanah', en: { en: 'Rampart', id: 'Benteng kampung' },
      explode: [0, 0, 0], anchor: [-HUTA.x, 2.2, 6], focusDir: [-1, 0.4, 0.5],
      desc: { en: 'A bank of earth, here footed with stone, built right round the village in a rectangle.', id: 'Tanggul tanah, di sini berkaki batu, yang dibangun mengelilingi kampung membentuk persegi panjang.' },
      fn: { en: 'It closes the village in and makes it defensible.', id: 'Benteng ini melingkupi kampung dan membuatnya dapat dipertahankan.' },
      meaning: { en: 'A huta was its own small state, with its own founders and its own law, and the rampart marked where that began. At Huta Siallagan the wall is of stacked stone, 1.5 to 2 m high.', id: 'Sebuah huta adalah negeri kecil tersendiri, dengan pendiri dan hukumnya sendiri, dan benteng menandai tempat ia bermula. Di Huta Siallagan temboknya dari batu yang disusun, setinggi 1,5 sampai 2 m.' },
      specs: [{ en: `${2 * HUTA.x} × ${2 * HUTA.z} m`, id: `${2 * HUTA.x} × ${2 * HUTA.z} m` }, { en: `${BANK.h} m high`, id: `Tinggi ${BANK.h} m` }],
    },
    {
      id: 'bambu', cat: 'batas', name: 'Bambu', alias: 'Pagar bambu hidup', en: { en: 'Bamboo', id: 'Rumpun bambu' },
      explode: [0, 1.2, 0], anchor: [-8, 7, -HUTA.z], focusDir: [0.3, 0.4, -1],
      desc: { en: 'Clumps of bamboo planted along the top of the rampart.', id: 'Rumpun-rumpun bambu yang ditanam di sepanjang puncak benteng.' },
      fn: { en: 'A living fence above the bank that hides the village and is hard to get through.', id: 'Pagar hidup di atas tanggul yang menyembunyikan kampung dan sulit ditembus.' },
      meaning: { en: 'From outside an old huta looked like a thicket of bamboo with roof peaks rising out of it.', id: 'Dari luar, huta lama tampak seperti rimbunan bambu dengan puncak-puncak atap yang menyembul di atasnya.' }, interp: true,
      specs: [{ en: '{clumps} clumps', id: '{clumps} rumpun' }],
    },
    {
      id: 'bahal', cat: 'batas', name: 'Bahal', alias: 'Gerbang huta', en: { en: 'Gate', id: 'Gerbang' },
      explode: [0, 1.2, 0], anchor: [HUTA.x, 3.2, 0], focusDir: [1, 0.3, 0.4],
      desc: { en: 'The gateway through the rampart, a narrow passage between two stone piers.', id: 'Gerbang yang menembus benteng, lorong sempit di antara dua pilar batu.' },
      fn: { en: 'The way into the village.', id: 'Jalan masuk ke kampung.' },
      meaning: { en: 'Trees held to have power are always planted before it.', id: 'Di mukanya selalu ditanam pohon-pohon yang dianggap bertuah.' },
      specs: [{ en: '1 gate', id: '1 gerbang' }],
    },
    {
      id: 'hariara', cat: 'batas', name: 'Hariara', alias: 'Pohon bertuah', en: { en: 'Banyan tree', id: 'Pohon hariara' },
      explode: [0, 1.2, 0], anchor: [HUTA.x + 7, 12.5, 5], focusDir: [1, 0.3, 0.5],
      desc: { en: 'A great fig tree standing outside the gate.', id: 'Pohon ara besar yang berdiri di luar gerbang.' },
      fn: { en: 'One of the trees planted in front of the gate of a huta, with the bintatar and the beringin.', id: 'Salah satu pohon yang ditanam di muka gerbang huta, bersama bintatar dan beringin.' },
      meaning: { en: 'It is held to bring good fortune to the village it stands before.', id: 'Pohon ini dianggap membawa tuah bagi kampung di belakangnya.' },
      specs: [{ en: 'Outside the gate', id: 'Di luar gerbang' }],
    },
  ],
  sectionY: 1.4,
  views: { inside: { pos: [HUTA.x + 12, 1.7, -5], target: [0, 3, 0] } },
};

export const alaman = {
  build: buildYard,
  categories: [{ id: 'tanah', label: { en: 'Ground', id: 'Tanah' }, local: 'Alaman', color: '#7f8a6a' }],
  parts: [
    {
      id: 'alaman', cat: 'tanah', name: 'Alaman', alias: 'Halaman huta', en: { en: 'Village yard', id: 'Halaman kampung' }, pick: false,
      explode: [0, 0, 0], anchor: [-6, 0.4, 0],
      desc: { en: 'The wide open ground between the row of houses and the row of barns.', id: 'Pelataran lebar di antara deretan rumah dan deretan lumbung.' },
      fn: { en: 'Children play here, crops are dried here, and the village holds its feasts and its funerals here.', id: 'Anak-anak bermain di sini, hasil ladang dijemur di sini, dan di sinilah kampung mengadakan acara suka dan duka.' },
      meaning: { en: 'The empty ground behind the houses and barns is used for gardens.', id: 'Tanah kosong di belakang rumah dan lumbung dijadikan kebun.' },
      specs: [{ en: 'Between the two rows', id: 'Di antara dua deret' }],
    },
  ],
  sectionY: 0.5,
  views: { inside: { pos: [HUTA.x - 4, 1.7, 0], target: [0, 3, 0] } },
};
