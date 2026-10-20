# RealEstate World — 8 Avatar + Naomi Talk Test Build

Build marker: `REW-OPENING-8-AVATARS-NAOMI-TALK-2026-10-20`

## Scope
- Keeps the opening flow only: choose FEMALE/MALE, choose a player avatar, licensing with the real Naomi GLB, pass the exam, choose a firm.
- Adds all eight player avatar IDs to the client and server allowlist.
- Keeps client/landlord NPC spawning disabled. This package intentionally does not integrate the NPC roster yet.
- Naomi loops the embedded `Talk_Passionately` animation during licensing. Her GLB stays at its authored rig scale; no cartoon fallback is used.
- Retains the existing original-texture stability mode. Skin/outfit/hair recoloring remains paused in this build rather than risking the previous shader errors.
- Existing multiplayer Socket.IO behavior and player avatar ID synchronization are preserved.

## Required files under `public/assets/`
Use the exact filename casing:
- `Female-rigged-agent.glb`
- `Female-rigged-agent1.glb`
- `Male-rigged-agent.glb`
- `Male-rigged-agent1.glb`
- `female-rigged-agent2.glb`
- `female-agent-3.glb`
- `male-rigged-agent2.glb`
- `male-rigged-agent3.glb`
- `naomi-senior-agent.glb`

The loader tries a small set of known casing/duplicate-name aliases for the new uploads, but the canonical names above are recommended. Do not upload `(2)` duplicates if the canonical names are already present.

## Install
1. Back up current root `index.html` and `server.js`.
2. Replace those two files with the ones in this package.
3. Leave `package.json` and the existing `public/assets/` folder in place. Upload any missing GLBs individually into `public/assets/`.
4. Commit to `main` and wait for Render to redeploy.
5. Check `/version` — it should show `REW-OPENING-8-AVATARS-NAOMI-TALK-2026-10-20`.

## Test
1. Select FEMALE and verify four previews; then select MALE and verify four previews.
2. Check that previews do not drift out of frame. New models with authored root scales are not auto-scaled from misleading static bounds.
3. Continue to licensing. Confirm Naomi is the real GLB and her `Talk_Passionately` clip is playing.
4. Complete the exam and choose a firm.
5. Open a second browser to verify the selected avatar appears in multiplayer.

## Validation and limitations
JavaScript syntax was checked with Node.js and the package ZIP was verified. This is offline validation only; it has not been visually tested in a browser or deployed to Render. GLB rendering and animation must be confirmed in the live browser. Recoloring is still intentionally paused in this stability pass.
