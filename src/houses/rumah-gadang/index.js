// Rumah Gadang (West Sumatra) house definition for the viewer.
import { build } from './build.js';
import { CATEGORIES, COMPONENTS, ABOUT } from './parts.js';

export default {
  build,
  categories: CATEGORIES,
  parts: COMPONENTS,
  about: ABOUT,
  loading: 'Raising the gonjong…',
  sectionY: 3.3,
  views: { inside: { pos: [-4.5, 3.5, 2.4], target: [1.5, 6.6, -0.6] } },

  slots: [
    { id: 'wood', label: 'Timber', tex: 'wood' },
    { id: 'ukiran', label: 'Ukiran', tex: 'ukiran' },
    { id: 'accent', label: 'Shutters', tex: 'wood' },
    { id: 'thatch', label: 'Ijuk', tex: 'thatch', clay: '#d9d2c6' },
    { id: 'metal', label: 'Finials', tex: null, glossy: true, clay: '#d6cdbf' },
    { id: 'bamboo', label: 'Sasak', tex: 'bamboo' },
    { id: 'stone', label: 'Stone', tex: 'stone', clay: '#d2cdc5' },
    { id: 'plank', label: 'Floor', tex: 'wood' },
  ],
  presets: {
    tradisional: {
      label: 'Tradisional · ijuk & ukiran', rough: 0.82, metal: { metal: 0.75 },
      colors: { wood: '#4b2e20', ukiran: '#ffffff', accent: '#8f2b1e', thatch: '#3b332d', metal: '#b9953f', bamboo: '#c9a773', stone: '#8a857c', plank: '#6e4a31' },
    },
    seng: {
      label: 'Atap seng · zinc roof', rough: 0.6, metal: { metal: 0.75, thatch: 0.6 }, tex: { thatch: null },
      colors: { wood: '#5a3a28', ukiran: '#f3eadf', accent: '#7a2a20', thatch: '#8d949b', metal: '#a9adb2', bamboo: '#c9a773', stone: '#8a857c', plank: '#7a5238' },
    },
    istano: {
      label: 'Istano · gilded carving', rough: 0.5, metal: { metal: 0.85, accent: 0.5 },
      colors: { wood: '#3a2016', ukiran: '#ffe6b3', accent: '#b88a2e', thatch: '#2c2622', metal: '#d4ab4c', bamboo: '#b89260', stone: '#77736c', plank: '#5b3a26' },
    },
  },
};
