// Pendapa: the open reception pavilion at the front of the joglo compound.
// Local coordinates: ridge along x, front (towards the regol) facing +z.
import { reseed, partStore, box } from '../../../lib/geometry.js';
import { jogloStructure } from '../structure.js';
import { CATEGORIES, COMPONENTS } from './pendapa-parts.js';

function build() {
  reseed(20240917);
  const { parts, P } = partStore();

  // ── Bebatur: plinth, tiled floor, steps front and back
  P('bebatur')
    .add('stone', box(16.6, 0.5, 14.6, 0, 0.25, 0, 'stone', 1.5))
    .add('stone', box(16.95, 0.14, 14.95, 0, 0.07, 0, 'stone', 1.5))
    .add('floor', box(16.4, 0.1, 14.4, 0, 0.55, 0, 'world', 1));
  for (const s of [1, -1]) {
    P('bebatur').add('stone', box(4.6, 0.4, 0.42, 0, 0.2, s * (7.3 + 0.21), 'stone', 1.5));
    P('bebatur').add('stone', box(4.6, 0.2, 0.42, 0, 0.1, s * (7.3 + 0.63), 'stone', 1.5));
  }

  const counts = jogloStructure(P);
  return { parts, counts };
}

export default {
  build,
  categories: CATEGORIES,
  parts: COMPONENTS,
  sectionY: 3.2,
  views: { inside: { pos: [0.8, 1.7, 4.4], target: [0, 7.3, 0] } },
};
