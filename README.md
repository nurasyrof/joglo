# Rumah Nusantara

An interactive 3D directory of Indonesia's traditional houses, built with Three.js. Each house can be exploded, cut through, restyled and downloaded, and every part explains what it is and what it means.

Made by [nurasyrof](https://nurasyrof.com).

## Run locally

It's plain static files with no build step:

```bash
python3 -m http.server 5173
```

Then open http://localhost:5173. Routes are hash-based: `#/joglo` opens a house.

The directory landing page (`#/`) is built but switched off until there are 10–15 houses in 3D. While `SHOW_DIRECTORY` in `src/main.js` is `false`, the site opens on `DEFAULT_HOUSE` and the title switcher is the way to browse. Set it to `true` to launch the directory.

## Structure

```
index.html              directory + viewer markup
styles.css
src/
  main.js               routing, directory page, title house switcher
  houses/
    index.js            registry: every house, its metadata and silhouette
    joglo/              one folder per modelled house
      index.js          house definition (slots, presets, views)
      parts.js          anatomy: names, explode offsets, descriptions
      build.js          procedural geometry
    rumah-gadang/
  lib/geometry.js       shared building blocks (beams, hipped and saddle roofs, gables…)
  viewer/               the 3D engine, shared by every house
    viewer.js
    materials.js        procedural textures + material factory
    exporter.js         GLB / OBJ / STL / USDZ download
```

The directory page doesn't load Three.js. The viewer and each house load only when opened.

## Adding a house

1. **List it** in `src/houses/index.js` with its metadata and a 120 × 72 SVG silhouette. Leave `status: 'soon'` until the model is ready.
2. **Create `src/houses/<id>/`** with three files:
   - `build.js` exports `build()`, which returns `{ parts, counts }`. Use `partStore()` from `lib/geometry.js` and add geometry per part and material slot, e.g. `P('tiang').add('wood', …)`.
   - `parts.js` exports `CATEGORIES`, `COMPONENTS` and `ABOUT`. Every part id in `build()` needs an entry in `COMPONENTS` with `explode`, `anchor`, `desc`, `fn`, `meaning` and `specs` (specs can use `{count}` placeholders filled from `counts`).
   - `index.js` exports the definition: `slots` (each material slot and its texture), `presets`, `views.inside`, `sectionY` and a `loading` line.
3. **Switch it on** by setting `status: 'ready'` and `load: () => import('./<id>/index.js')` in the registry.

The camera views, section ranges and shadows are calculated from the model's size, so nothing in the viewer needs changing. Loading houses modelled in Blender (GLB with mesh names matching part ids) isn't supported yet; it would need a small loader that returns the same `{ parts }` shape as `build()`.

Check part names and descriptions against published sources before switching a house on.
