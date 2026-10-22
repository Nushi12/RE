# RealEstate World — neighbourhood assets integration

This package integrates the whole-game conversational dialogue update with the eight newly supplied GLB assets. New uploaded filenames with `(1)` or other upload numbering have been copied to canonical filenames without suffixes, and the code references those canonical names.

## New assets integrated into the neighbourhood
- `park-bench.glb` — placed in the park area
- `man.glb`, `woman.glb`, `businessman.glb` — placed as static environmental pedestrians
- `classic-car-light.glb` — placed beside a road
- `trash-bag-pile.glb` — placed near a building/service area
- `bike-rack.glb` — placed near the office
- `bus-stop-shelter.glb` — placed beside the road

The three newly supplied human models do not contain animation clips, so they are static for now. Existing client/walker GLBs retain their existing animation selection behavior. Each new model is loaded from `/assets/<canonical-name>` and reused from a cache between neighbourhood changes.

## Validation
- Inline JavaScript passes `node --check`.
- All eight new GLBs are individually below 25 MB.
- The three human models are about 15–20 MB each; all new assets total about 60 MB before compression.
- Not browser-tested or deployed to Render. Please test asset loading and visual scale in the browser before deploying.

## Deploy/merge notes
1. Back up the current repository first.
2. Merge this `index.html`, `server.js`, and `public/assets` into the existing repository.
3. Preserve the existing eight selectable player-avatar GLBs and any other assets already in your repository. They are not replaced by this package.
4. Deploy and verify `/healthz` and `/version`; then inspect each neighbourhood for model placement and scale.
