// Joglo (Yogyakarta) house definition for the viewer.
import { build } from './build.js';
import { CATEGORIES, COMPONENTS, ABOUT } from './parts.js';

export default {
  build,
  categories: CATEGORIES,
  parts: COMPONENTS,
  about: ABOUT,
  loading: 'Raising the saka guru…',
  sectionY: 3.2,
  views: { inside: { pos: [0.8, 1.7, 4.4], target: [0, 7.3, 0] } },

  // Material slots: `tex` names a texture in viewer/materials.js; `ui: false` hides the colour picker.
  slots: [
    { id: 'wood', label: 'Teak', tex: 'wood' },
    { id: 'carved', label: 'Carving', tex: 'wood' },
    { id: 'accent', label: 'Prada', tex: 'wood', glossy: true },
    { id: 'roof', label: 'Tiles', tex: 'tile', clay: '#dcd4c8' },
    { id: 'ornament', label: 'Crowns', tex: null, clay: '#d6cdbf' },
    { id: 'stone', label: 'Stone', tex: 'stone', clay: '#d2cdc5' },
    { id: 'floor', label: 'Floor', tex: 'floor', clay: '#f3f0ea' },
    { id: 'plank', label: 'Planks', tex: 'wood', ui: false },
  ],
  presets: {
    natural: {
      label: 'Jati alami · natural teak', rough: 0.72, metal: { accent: 0.1 },
      colors: { wood: '#8b5a32', carved: '#7a4a28', accent: '#a8773f', roof: '#b4603f', ornament: '#9c4a30', stone: '#8a857c', floor: '#c2ae90', plank: '#9c7049' },
    },
    kraton: {
      label: 'Kraton · painted & gilded', rough: 0.55, metal: { accent: 0.8 },
      colors: { wood: '#5e3a22', carved: '#2d5a44', accent: '#d8aa4c', roof: '#9a4a32', ornament: '#c99a3c', stone: '#6d6a64', floor: '#dcd4c4', plank: '#77553c' },
    },
    aged: {
      label: 'Sepuh · weathered', rough: 0.92, metal: {},
      colors: { wood: '#6d5a48', carved: '#5c4c3e', accent: '#7a6650', roof: '#6e5046', ornament: '#6e5046', stone: '#5f625e', floor: '#8f877a', plank: '#83705b' },
    },
    modern: {
      label: 'Kontemporer · dark stain', rough: 0.6, metal: { accent: 0.3 },
      colors: { wood: '#3a2a20', carved: '#33251c', accent: '#b08a55', roof: '#4a4f55', ornament: '#4a4f55', stone: '#a3a39e', floor: '#e6e3dd', plank: '#59483b' },
    },
  },
};
