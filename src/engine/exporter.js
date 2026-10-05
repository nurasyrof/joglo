// Export the joglo as a downloadable 3D file (GLB, OBJ, STL or USDZ).
import * as THREE from 'three';

export const FORMATS = {
  glb: {
    ext: 'glb',
    note: { en: 'Blender, SketchUp, Unity, web viewers. Keeps materials and textures, one node per part.', id: 'Blender, SketchUp, Unity, penampil web. Material dan tekstur ikut tersimpan, satu node per bagian.' },
  },
  obj: {
    ext: 'obj',
    note: { en: 'Works in almost any 3D app. Geometry with named parts, no materials.', id: 'Bisa dibuka di hampir semua aplikasi 3D. Geometri dengan nama bagian, tanpa material.' },
  },
  stl: {
    ext: 'stl',
    note: { en: 'For 3D printing: 1:100 scale in millimetres, Z-up, single colour.', id: 'Untuk cetak 3D: skala 1:100 dalam milimeter, sumbu Z ke atas, satu warna.' },
  },
  usdz: {
    ext: 'usdz',
    note: { en: 'AR Quick Look on iPhone and iPad. Keeps materials and textures.', id: 'AR Quick Look di iPhone dan iPad. Material dan tekstur ikut tersimpan.' },
  },
};

// Loads exporters on demand so they don't slow down the first page load.
const loaders = {
  glb: () => import('three/addons/exporters/GLTFExporter.js').then((m) => m.GLTFExporter),
  obj: () => import('three/addons/exporters/OBJExporter.js').then((m) => m.OBJExporter),
  stl: () => import('three/addons/exporters/STLExporter.js').then((m) => m.STLExporter),
  usdz: () => import('three/addons/exporters/USDZExporter.js').then((m) => m.USDZExporter),
};

// Builds a clean export scene: no edges, labels, clipping or display-only transparency.
// `transform(c)` gives each part's world matrix (building placement, plus explode if wanted).
function buildExportScene(comps, { onlyVisible, material, slotName, title, transform, nameOf = (c) => c.name }) {
  const mats = {};
  const matFor = (slot) => (mats[slot] ||= material(slot, slotName(slot)));
  const scene = new THREE.Scene();
  const root = new THREE.Group();
  root.name = title;
  scene.add(root);
  for (const c of comps) {
    if (onlyVisible && !c.group.visible) continue;
    const g = new THREE.Group();
    g.name = nameOf(c);
    g.userData = { id: c.id, local: c.alias, english: c.en };
    transform(c).decompose(g.position, g.quaternion, g.scale);
    for (const mesh of c.meshes) {
      const m = new THREE.Mesh(mesh.geometry, matFor(mesh.userData.slot));
      m.name = `${g.name} · ${slotName(mesh.userData.slot)}`;
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
