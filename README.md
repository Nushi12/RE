# RealEstate World — Four Character Selection Test

This build focuses only on the first avatar checkpoint: choose among four separate complete rigged GLB characters. It preserves the existing RealEstate World career systems, Socket.IO multiplayer, licensing quiz, property listings, and movement code. The creator no longer substitutes the old cartoon while the selected model loads, and it does not deform or recolor the supplied model.

## Included models

- `public/assets/female-agent-1.glb` — source: `Female_rigged_agent.glb` (23.58 MiB)
- `public/assets/female-agent-2.glb` — source: `Female_rigged_agent1.glb` (22.87 MiB)
- `public/assets/male-agent-1.glb` — source: `Male_rigged_agent1.glb` (18.72 MiB)
- `public/assets/male-agent-2.glb` — source: `Male_rigged_agent(1).glb` (24.74 MiB; reduced-clip version)

The duplicated `Female_rigged_agent1(1).glb` and older over-limit `Male_rigged_agent.glb` are omitted. Each included GLB has its own mesh, embedded materials/textures, humanoid skeleton, and animation clips. The test currently uses each model's idle and walking clip. Hair, skin, and clothing recoloring is intentionally not exposed until model selection is confirmed.

## Safest way to apply this update

Do not delete the existing repository or any old model files yet. In `https://github.com/Nushi12/RE`:

1. Replace only the root `index.html` and `server.js` with the versions in this package.
2. Add the four `.glb` files from `public/assets/` to the same `public/assets/` folder in GitHub, using the exact filenames above. Upload them individually if GitHub's browser is unreliable. Do not upload the ZIP itself.
3. Keep the existing `package.json`, `package-lock.json` / `yarn.lock`, and other game files as they are; this patch still uses Express and Socket.IO.
4. Commit the two source files and four assets to `main`. Wait for Render's deployment to complete.

## First test only: avatar selection

1. Open `/version` on the exact Render service shown in its dashboard. It should display `REW-FOUR-RIGGED-AVATAR-SELECTION-TEST-2026-10-19`.
2. Open the game, click **Begin**, and select each of the four avatar cards.
3. Confirm the 3D preview changes to the corresponding character model before clicking Continue.
4. Enter the city and confirm that the same selected character is the player avatar.

Do not test colors or adjust animations until those four selection checks pass. If a model fails to load, record the first red Console error and the failing `/assets/<filename>` URL.

## Notes

- All four individual model files are below 25 MiB for GitHub's browser upload. `male-agent-2.glb` is near the limit, at 24.74 MiB; if GitHub rejects it, ask for a small texture-size optimization rather than removing more animations.
- This source and package have been syntax/structure checked, but not visually tested on the live Render service. The live model-selection test is the next checkpoint.
