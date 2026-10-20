# RealEstate World — Naomi Senior Agent GLB integration

This update replaces the procedural cartoon mentor in the licensing/training screen with the supplied `naomi-senior-agent.glb` model. It preserves a cartoon fallback in case the asset cannot load.

## Naomi model facts inspected

- GLB 2.0 file, about 21.1 MB
- One mesh, one material, one skin/rig
- Embedded clips: `Running`, `Walking`, and `Talk_Passionately`
- There is no dedicated idle clip in this file. The model stays in its default rig pose while narration is silent; `Talk_Passionately` plays while browser narration speaks.

## GitHub upload layout

Keep the current four player-avatar GLBs in `public/assets/` and add Naomi here with this exact filename:

`public/assets/naomi-senior-agent.glb`

The code requests it at `/assets/naomi-senior-agent.glb`.

## Install

1. Replace the root-level `index.html` and `server.js` in the `Nushi12/RE` GitHub repository with the copies in this package.
2. Upload `public/assets/naomi-senior-agent.glb` to the same location in GitHub. If it is already uploaded there with that exact spelling, leave it in place.
3. Commit the changes to `main` and wait for Render to redeploy.
4. Visit `/version`. Expected output: `REW-NAOMI-SENIOR-AGENT-GLB-TALK-2026-10-19`.
5. Visit `/assets/naomi-senior-agent.glb`. It should return/download the model, not show a 404.

The updated server maps `/assets/*` to `public/assets/*` explicitly. Player GLB files and other avatar settings are not renamed by this update.
