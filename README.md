# RealEstate World — male model, color test, NPC and city artifact update

This update is designed to preserve the existing RealEstate World career flow while correcting the avatar problems being tested.

## What's included

1. **Male character files:** Includes the two missing male GLBs at the exact names and paths the game requests: `public/assets/male-agent-1.glb` and `public/assets/male-agent-2.glb`.
2. **Better male framing:** Normalizes the character origin in X/Y/Z and automatically frames each card preview based on its actual width and height, including wide arm poses.
3. **Animated previews:** Character cards play an embedded walking animation when the GLB has an appropriate in-place/short walk clip; otherwise, an available fallback animation is used.
4. **Skin and outfit color test:** Adds swatches for skin tone and outfit color. Updates live on the selection cards and selected character preview, and preferences are stored for the session and sent to the multiplayer server. This is a first test using color masks over each model's baked texture atlas. As skin and clothing share one texture/material, some nearby pixels can tint together; check each model separately. Choose **Original** to reset either color.
5. **NPC separation:** Clients, landlords, Naomi, and ambient pedestrians do not reuse any of the four selectable player GLBs. They use varied procedural human characters instead, with different hair, skin, clothing, height/build choices, and simple walking movement.
6. **Black city artifact mitigation:** Disables the global shadow map and imported-agent shadow reception/casting to help remove oversized black shadow patches. This needs a visual check in the deployed game; if a black shape remains, it is likely a separate city mesh/material issue requiring a closer look.

## Install to GitHub / Render

1. Replace the repository root `index.html` and `server.js` with those from this package.
2. Extract the two male GLBs from `public/assets/` and upload them to the GitHub folder `public/assets/` with these exact lowercase, hyphenated names:
   - `male-agent-1.glb`
   - `male-agent-2.glb`
3. Do **not** upload the ZIP itself into `public/assets`; the two `.glb` files must be uploaded separately.
4. Commit all changes to `main` and wait for Render to redeploy.

The expected build marker is `REW-MALE-COLOR-NPC-FIX-2026-10-19`. After deployment, the `/version` page should show that exact string.

## Verify after deployment

- `https://YOUR-RENDER-DOMAIN/assets/male-agent-1.glb` should return the first male file rather than 404.
- `https://YOUR-RENDER-DOMAIN/assets/male-agent-2.glb` should return the second male file rather than 404.
- Open the male selection page and check that both animated characters stay in-frame.
- Try each skin and outfit swatch on all four choices, then continue through licensing and into the city to check whether the appearance persists and is visible to another player.
- Check the city for black patches. If any remain after redeployment, capture a screenshot and inspect the responsible city geometry/material next.
