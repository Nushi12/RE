# RealEstate World — neighbourhood assets integration

This package integrates the whole-game conversational dialogue update with the eight newly supplied GLB assets. New uploaded filenames with `(1)` or other upload numbering have been copied to canonical filenames without suffixes, and the code references those canonical names.

## New assets integrated into the neighbourhood
- `park-bench.glb` — placed in the park area
- `man.glb`, `woman.glb`, `businessman.glb` — placed as static environmental pedestrians
- `classic-car-light.glb` — parked parallel to the north-south road on the right-hand side, inside the curb line
- `trash-bag-pile.glb` — placed near a building/service area
- `bike-rack.glb` — placed near the office
- `bus-stop-shelter.glb` — placed beside the road

The three newly supplied human models do not contain animation clips, so they are static for now. Existing client/walker GLBs retain their existing animation selection behavior. Each new model is loaded from `/assets/<canonical-name>` and reused from a cache between neighbourhood changes.

## Showing layouts and save system
- Apartment showings rebuild the interior for the selected property and choose one of three distinct room zoning/partition variants, rather than permanently reusing a single built scene.
- The car is scaled down and rotated parallel to the north-south road; placement is intended to keep it in the right-hand lane-side parking area. Confirm visual orientation in the browser because GLB model forward axes can differ.
- Career progress automatically saves to this browser's local storage periodically and when the tab is hidden/closed. The existing **Save game** and **Load saved game** buttons remain available. Saves are local to this browser/device, not cloud synced.

## Validation
- Inline JavaScript passes `node --check`.
- All eight new GLBs are individually below 25 MB.
- The three human models are about 15–20 MB each; all new assets total about 60 MB before compression.
- Syntax-checked only; not browser-tested or deployed to Render. Please test the car's final orientation, apartment collision/walkability, auto-save reload, and asset loading before deploying.

## Deploy/merge notes
1. Back up the current repository first.
2. Merge this `index.html`, `server.js`, and `public/assets` into the existing repository.
3. Preserve the existing eight selectable player-avatar GLBs and any other assets already in your repository. They are not replaced by this package.
4. Deploy and verify `/healthz` and `/version`; then inspect each neighbourhood for model placement and scale.
