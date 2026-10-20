# RealEstate World — Opening Flow Stability Build

This is a focused stability pass for the first part of the game:

**Choose a player avatar → load the real Naomi GLB → take the licensing quiz → choose a firm.**

## What this build changes

- Disables the experimental skin/outfit/hair shader masks for now. The GLBs keep their original baked textures and materials, avoiding the WebGL shader compilation errors and unwanted color bleed. Recoloring can return later with proper texture masks/material separation.
- Fits the four selectable models through a shared helper. The special `Male-rigged-agent1.glb` root transform is preserved rather than deriving a scale from its misleading static skinned-mesh bounds. The second male no longer gets an extra card-camera zoom multiplier.
- Keeps the selection cards in idle/stand clips only; it will not substitute a walking/running clip if an idle clip is missing.
- Removes the selected-player preview from the scene when entering Naomi's training, so it can't overlap the trainer.
- Loads Naomi from `/assets/naomi-senior-agent.glb` without a cartoon fallback. Her nameplate appears only after the real GLB loads. Her rig stays in its authored pose while we isolate geometry/rig issues.
- Keeps the guided/challenge exam buttons disabled until Naomi's GLB loads. If loading fails, the screen explains the required path and offers a Retry button.
- Persists the selected avatar ID on the Socket.IO server so other players can receive the correct avatar selection.
- Keeps procedural/cartoon NPC spawning disabled; client/landlord GLB integration is intentionally out of scope for this pass.
- Uses build ID `REW-OPENING-FLOW-STABLE-2026-10-20` in both the page and `/version` endpoint.

## Required model files

Ensure these exact files exist under `public/assets/` in GitHub:

- `Female_rigged_agent.glb`
- `Female_rigged_agent1.glb`
- `Male-rigged-agent1.glb`
- `Male-rigged-agent.glb`
- `naomi-senior-agent.glb`

The ZIP is **code only**; it does not contain the large GLB files or replace `package.json`.

## Install

1. Replace the root `index.html` and `server.js` in the repository with the two files in this package.
2. Keep all five models in `public/assets/` with the exact filenames above.
3. Commit the two code files to `main` and wait for Render to redeploy.
4. Check `/version`; it should return `REW-OPENING-FLOW-STABLE-2026-10-20`.
5. Test in this order:
   - Choose FEMALE; verify both character previews load and the Continue button enables only after the selected model loads.
   - Choose MALE; verify both previews are fully in frame and idle.
   - Continue to licensing; ensure the player preview disappears and Naomi's real GLB appears.
   - Confirm the guided/challenge buttons unlock only when the Naomi model status says it loaded.
   - Pass the exam and choose a firm.

If Naomi fails, use the on-screen Retry button and verify `/assets/naomi-senior-agent.glb` loads directly. Do not upload the client/landlord GLBs yet; those will be integrated as a separate step after this opening flow is stable.

## Validation status

JavaScript syntax checks, build-marker checks, and ZIP integrity checks passed in the prepared files. This package has not been deployed to or visually tested on the live Render site, so perform the checks above after deployment.
