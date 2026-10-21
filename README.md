# RealEstate World — GLB NPC and Walker-to-Client code update

This targeted code update is based on `REW-NAOMI-OUT-OF-TPOSE-FIX-2026-10-21.zip`.

## What changed
- Preserves the eight player-avatar definitions, licensing/exam flow, firm selection, multiplayer server behavior, and existing Naomi animation code.
- Enables named NPCs to load supplied GLB models and play available animation clips.
- Connects existing neighborhood prospects to GLBs: Maya, Robert, Leo, Priya, Daniel, Nora, Elena, Marcus, and Theo.
- Adds four reusable GLB street walkers. Their positions persist during the current session as the player moves around a neighborhood.
- At career Level 5, approaching a walker and pressing **F** converts that same character/model into a named prospect and opens the existing client/listing workflow.
- Reuses `olivettinpc2.glb` for Nora because a distinct Nora model was not among the uploaded files.
- Keeps three initial sales/rental opportunities in each of the three current neighborhoods (Upper East Side, Midtown, SoHo), plus walker-to-client opportunities.

## Asset files required
Place the following files in the existing repository's `public/assets/` folder using these exact canonical names (do not include upload suffixes like `(1)`):

- `Maya-seller.glb`
- `robert.glb`
- `Leo.glb`
- `priya.glb`
- `Daniel.glb`
- `elena.glb`
- `marcus.glb`
- `theo.glb`
- `marcinpc.glb`
- `adriananpc3.glb`
- `olivettinpc2.glb`
- `kerrynpc1.glb`

Keep the currently working `naomi-senior-agent.glb` and all eight existing player-avatar GLBs. This code patch intentionally does not replace them.

## Deploy
1. Back up the current working repository.
2. Replace root `index.html` and `server.js` with the versions in this ZIP.
3. Copy the 12 uploaded NPC GLBs into `public/assets/` with the exact names above, preserving Naomi and all player avatar files.
4. Commit and deploy on Render.
5. Check `/healthz` and `/version`, then test avatar selection, Naomi's lesson/exam, firm selection, movement, named NPC interactions, and Level 5 walker conversion.

## Scope / not yet included
- This update does not implement account-based save/resume; walker conversion state is session-only.
- It does not add interior apartment environments yet. The existing transaction flow is preserved.
- Code was syntax-checked, but not live-tested against Render or browser-tested with all GLB downloads.


## NPC scale correction (2026-10-21)
The supplied NPC GLBs were appearing approximately 10x too large in the scene. The NPC normalization factor is reduced by 10x and the NPC name/interaction labels are lowered to suit the corrected character size. This targets NPC models only; player avatars and Naomi code are not changed by this scale fix.

This package includes the 12 NPC GLB binaries under `public/assets/` using canonical filenames (without upload suffixes). Merge/replace the package files in the repository, but preserve your existing `public/assets/naomi-senior-agent.glb` and the eight player avatar GLBs.

The scale change is based on the reported live screenshot and has not yet been verified on Render. After deploying, check a named NPC and a walker first; if either is still visibly too large/small, adjust the single NPC scale multiplier in `attachNpcModel()`.


## Corrected NPC normalization
The NPC loader now sets each GLB to a measured target height of 1.72 scene units using the measured bounding box, rather than applying a fixed extra 0.1 multiplier. It recalculates the bounding box after scaling and grounds the model, with labels positioned above a normal human-height character. This is a code correction; it has not been deployed or verified live.
