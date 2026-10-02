# rumahadat.id

An interactive 3D directory of Indonesia's traditional houses (rumah adat), built with Three.js. Live at [rumahadat.id](https://rumahadat.id). Each house can be exploded, cut through, restyled and downloaded, and every part explains what it is and what it means.

Made by [nurasyrof](https://nurasyrof.com).

## Run locally

Built with Vite, React, Tailwind CSS and [shadcn/ui](https://ui.shadcn.com); the 3D engine is plain Three.js.

```bash
npm install
npm run dev
```

Then open http://localhost:5173. `npm run build` writes the static site to `dist/`.

Routes are hash-based: `#/joglo` opens a house, `#/joglo/dalem` one building of a compound. The directory landing page (`#/`) is built but switched off until there are 10–15 houses in 3D: set `SHOW_DIRECTORY` in `src/config.js` to launch it.

**Deploying (Cloudflare):** build command `npm run build`, output directory `dist`.

## Structure

```
index.html              Vite entry
src/
  main.jsx · App.jsx    React entry, theme provider, routing
  config.js             site name, credit, directory flag, default house
  index.css             Tailwind + shadcn theme tokens (light default, dark)
  components/ui/        shadcn/ui components (generated, safe to edit)
  ui/                   app UI: header, panels, cards, walk, dock, directory
  engine/               headless 3D engine (Three.js), no UI code
    engine.js           scene, camera, picking, modes, walk; exposes actions + snapshots
    materials.js        procedural textures + material factory
    exporter.js         GLB / OBJ / STL / USDZ download
  houses/
    index.js            registry: every house, its metadata and silhouette
    joglo/              a compound: several buildings on one site
    rumah-gadang/       a compound: house, four rangkiang, surau and yard
    uma-mbatangu/       a village: clan houses around a plaza of stone tombs
    pekarangan-bali/    a Balinese compound laid out by the Sanga Mandala
    tongkonan/          a Toraja row of houses facing their rice barns, and the rante
  lib/
    geometry.js · kit.js  procedural building blocks
    utils.js            shadcn `cn` helper
```

The engine never touches the page UI. React subscribes to its state with `useSyncExternalStore` and calls its actions (`select`, `setStyle`, `setSection`, `startWalk`…). Labels in the 3D scene are the only DOM the engine creates.

Light mode is the default; the theme menu offers light, dark and system, and the 3D sky follows it.

## Houses, sites and buildings

A house is either **a single building** or **a site** (a compound) with several buildings.

- **Single building**: `index.js` exports `build`, `parts`, `categories`, `slots`, `presets`, `about`, `views` and `sectionY`. It opens straight into building view. (No house uses this at the moment, but it is still supported.)
- **Site**: `index.js` exports `slots`, `presets`, `about` and a `site` with `buildings`, `categories` (zones), `views`, `sectionY` and an optional `overlay`. Each building entry has `id`, `name`, `zone`, `at: [x, z]`, `rot`, its card text (`desc`, `fn`, `meaning`, `specs`) and a `def` with `build`, `parts`, `categories`, `views` and `sectionY`. Example: `joglo`.

In a site, the viewer opens on the whole compound (`#/joglo`). Click a building for its card, and **Enter** (or double-click) to open its anatomy (`#/joglo/dalem`). Roofs lift and fade in site view, and the overlay draws the zones and axis. Parts in the `roof` category are the ones that lift.

A site can also have a **guided walk** (`site.walk.stops`). Each stop has a `title`, `local` subtitle and `text`, a camera `pos` and `target` in site coordinates (or a named `view` such as `'top'`), and optionally `via` waypoints to steer the camera through doorways, `buildings` to highlight (use only for views from outside) and `overlay: true` to show the site-logic overlay.

## Adding a house

1. **List it** in `src/houses/index.js` with its metadata and a 120 × 72 SVG silhouette. Leave `status: 'soon'` until the model is ready.
2. **Create `src/houses/<id>/`** as a single building or a site (see above). Every `build()` returns `{ parts, counts }`: use `partStore()` from `lib/geometry.js` and add geometry per part and material slot, e.g. `P('tiang').add('wood', …)`. Every part id needs an entry in the building's `parts` with `explode`, `anchor`, `desc`, `fn`, `meaning` and `specs` (specs can use `{count}` placeholders filled from `counts`).
3. **Switch it on** by setting `status: 'ready'` and `load: () => import('./<id>/index.js')` in the registry.

The camera views, section ranges and shadows are calculated from each model's size, so nothing in the viewer needs changing. Loading houses modelled in Blender (GLB with mesh names matching part ids) isn't supported yet; it would need a small loader that returns the same `{ parts }` shape as `build()`.

Check part names and descriptions against published sources before switching a house on.
