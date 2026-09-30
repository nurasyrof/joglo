// Export the joglo as a downloadable 3D file (GLB, OBJ, STL or USDZ).
import * as THREE from 'three';

export const FORMATS = {
  glb:  { ext: 'glb',  note: 'Blender, SketchUp, Unity, web viewers. Keeps materials and textures, one node per part.' },
  obj:  { ext: 'obj',  note: 'Works in almost any 3D app. Geometry with named parts, no materials.' },
  stl:  { ext: 'stl',  note: 'For 3D printing: 1:100 scale in millimetres, Z-up, single colour.' },
  usdz: { ext: 'usdz', note: 'AR Quick Look on iPhone and iPad. Keeps materials and textures.' },
};

// Loads exporters on demand so they don't slow down the first page load.
const loaders = {
  glb: () => import('three/addons/exporters/GLTFExporter.js').then((m) => m.GLTFExporter),
  obj: () => import('three/addons/exporters/OBJExporter.js').then((m) => m.OBJExporter),
  stl: () => import('three/addons/exporters/STLExporter.js').then((m) => m.STLExporter),
  usdz: () => import('three/addons/exporters/USDZExporter.js').then((m) => m.USDZExporter),
};

// Builds a clean export scene: no edges, labels, clipping or display-only transparency.
function buildExportScene(comps, { onlyVisible, exploded, material, slotName, title }) {
  const mats = {};
  const matFor = (slot) => (mats[slot] ||= material(slot, slotName(slot)));
  const scene = new THREE.Scene();
  const root = new THREE.Group();
  root.name = title;
  scene.add(root);
  for (const c of comps) {
    if (onlyVisible && !c.group.visible) continue;
    const g = new THREE.Group();
    g.name = c.name;
    g.userData = { id: c.id, local: c.alias, english: c.en };
    if (exploded) g.position.copy(c.group.position);
    for (const mesh of c.meshes) {
      const m = new THREE.Mesh(mesh.geometry, matFor(mesh.userData.slot));
      m.name = `${c.name} · ${slotName(mesh.userData.slot)}`;
      g.add(m);
    }
    root.add(g);
  }
  scene.updateMatrixWorld(true);
  return { scene, root, dispose: () => Object.values(mats).forEach((m) => m.dispose()) };
}

export async function export3D(format, comps, opts) {
  const Exporter = await loaders[format]();
  const { scene, root, dispose } = buildExportScene(comps, opts);
  if (!root.children.length) { dispose(); throw new Error('No visible parts to export.'); }
  let data, type;
  try {
    if (format === 'glb') {
      data = await new Exporter().parseAsync(scene, { binary: true, onlyVisible: true });
      type = 'model/gltf-binary';
    } else if (format === 'obj') {
      data = new Exporter().parse(scene);
      type = 'text/plain';
    } else if (format === 'stl') {
      // Slicers read STL units as millimetres and expect Z-up: 1 m → 10 mm gives a 1:100 model.
      root.scale.setScalar(10);
      root.rotation.x = Math.PI / 2;
      scene.updateMatrixWorld(true);
      data = new Exporter().parse(scene, { binary: true });
      type = 'model/stl';
    } else if (format === 'usdz') {
      data = await new Exporter().parseAsync(scene);
      type = 'model/vnd.usdz+zip';
    }
  } finally {
    dispose();
  }
  const blob = new Blob([data], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${opts.filename}${opts.exploded ? '-exploded' : ''}.${FORMATS[format].ext}`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  return blob.size;
}
