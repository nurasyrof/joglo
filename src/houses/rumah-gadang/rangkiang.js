// Rangkiang: the rice barns in front of the Rumah Gadang. One builder, four kinds.
// Local coordinates: small door facing +z (towards the yard).
import * as THREE from 'three';
import { V, reseed, partStore, box, hexa, saddleRoof } from '../../lib/geometry.js';
import { finials } from './house.js';

export function makeRangkiang({ w = 1.6, d = 1.6, posts = 2, postH = 1.5, bodyH = 1.5, flare = 0.26, roofH = 1.3, carved = true, gonjong = true, seed = 1 } = {}) {
  const tx = w / 2 + flare;   // half-width of the body at the top
  function build() {
    reseed(seed);
    const { parts, P } = partStore();
    const T = P('tiang');
    const xs = Array.from({ length: posts }, (_, i) => -w / 2 + 0.1 + ((w - 0.2) * i) / Math.max(1, posts - 1));
    for (const x of xs) for (const z of [-d / 2 + 0.1, d / 2 - 0.1]) {
      T.add('stone', box(0.36, 0.12, 0.36, x, 0.06, z, 'stone', 1));
      T.add('wood', new THREE.CylinderGeometry(0.09, 0.1, postH, 8).translate(x, 0.12 + postH / 2, z));
    }
    const y0 = postH + 0.12, y1 = y0 + bodyH;
    T.add('wood', box(w + 0.15, 0.1, d + 0.15, 0, y0 - 0.05, 0));

    // Body flaring outward as it rises, like the house itself
    const bx = w / 2, bz = d / 2, tz = bz + flare;
    P('badan').add(carved ? 'ukiran' : 'bamboo', hexa(
      [V(-bx, y0, -bz), V(bx, y0, -bz), V(bx, y0, bz), V(-bx, y0, bz)],
      [V(-tx, y1, -tz), V(tx, y1, -tz), V(tx, y1, tz), V(-tx, y1, tz)],
      (p) => [(p.x + p.z) / 1.2, p.y / 1.2]));
    // Small door high on the front, reached by a ladder at harvest time
    const dy = y1 - 0.55, dz = bz + flare * ((dy - y0) / bodyH) + 0.04;
    P('badan').add('accent', box(0.5, 0.6, 0.05, 0, dy, dz)).add('wood', box(0.64, 0.74, 0.03, 0, dy, dz - 0.02));

    const roof = saddleRoof({
      axis: 'x', cx: 0, cz: 0, len: tx + 0.55, yR: y1 + roofH * 0.75, yE: y1, H: gonjong ? roofH : 0,
      d0: tz + 0.35, ends: 'both', t: 0.15, nu: 28, nv: 10,
      ...(gonjong ? {} : { pinch: 0, converge: false }),
    });
    P('atap').add('thatch', roof.main);
    if (roof.horn) P(gonjong ? 'gonjong' : 'atap').add('thatch', roof.horn);
    if (gonjong) finials(P('gonjong'), roof, 0.5);
    return { parts, counts: {} };
  }

  const PARTS = [
    {
      id: 'tiang', cat: 'base', name: 'Tiang', alias: 'Tiang rangkiang', en: 'Posts and platform',
      explode: [0, 0, 0], anchor: [w / 2, postH * 0.6, d / 2],
      desc: 'Timber posts standing on flat stones, carrying the floor of the barn well above the ground.',
      fn: 'Keep the rice dry and out of reach of rats and damp.',
      meaning: 'Like the house, the barn rests on stones rather than in the ground.',
      specs: [`${posts * 2} posts`],
    },
    {
      id: 'badan', cat: 'body', name: 'Badan', alias: 'Dinding rangkiang', en: 'Body and door',
      explode: [0, 1.1, 0], anchor: [-w / 2, postH + bodyH * 0.6, d / 2],
      desc: carved
        ? 'A closed body of carved, painted panels that flares outward as it rises, with a small door high on the front.'
        : 'A small, plain body with a door high on the front.',
      fn: 'Rice is poured in and taken out through the small door, reached by a ladder.',
      meaning: 'The flared, carved body echoes the walls of the Rumah Gadang it stands in front of.',
      specs: [carved ? 'Painted carving' : 'Plain walls'],
    },
    {
      id: 'atap', cat: 'roof', name: 'Atap', alias: 'Atap ijuak', en: 'Thatched roof', roof: true,
      explode: [0, 2.2, 0], anchor: [0, postH + bodyH + roofH * 0.5, d / 2 + 0.3],
      desc: gonjong ? 'An ijuk thatch roof sweeping up into horns at both ends.' : 'A simple saddle roof of ijuk thatch, without horns.',
      fn: 'Keeps rain off the stored rice.',
      meaning: gonjong ? 'A small copy of the house’s gonjong roof.' : 'Plainer than the other barns, matching its humbler role.',
      specs: ['Ijuk thatch'],
    },
    ...(gonjong ? [{
      id: 'gonjong', cat: 'roof', name: 'Gonjong', alias: 'Gonjong rangkiang', en: 'Horned roof ends', roof: true,
      explode: [0, 2.8, 0], anchor: [tx + 0.6, postH + bodyH + roofH * 1.3, 0],
      desc: 'The upswept ends of the barn’s roof, tipped with metal finials.',
      fn: 'Throw rainwater clear of the walls.',
      meaning: 'The same buffalo-horn form that crowns the house.',
      specs: ['2 gonjong'],
    }] : []),
  ];

  return {
    build,
    categories: [
      { id: 'base', label: 'Base', local: 'Tiang', color: '#9a948a' },
      { id: 'body', label: 'Body', local: 'Badan', color: '#dcab52' },
      { id: 'roof', label: 'Roof', local: 'Atap', color: '#cf5b3f' },
    ],
    parts: PARTS,
    sectionY: postH + 0.6,
    views: { inside: { pos: [w + 1.8, 1.6, d + 2.4], target: [0, postH + bodyH * 0.6, 0] } },
  };
}
