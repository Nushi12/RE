# RealEstate World — Stable Avatar Baseline

This update consolidates the existing avatar features into a stable baseline without changing the career, licensing, Socket.IO multiplayer, or city gameplay systems.

## Changes
- Corrects the color-mask color-space bug: material texture samples are converted from linear RGB back to sRGB before skin, hair, and outfit classification. This prevents dark hair/shadows from masking the outfit and reduces beige trousers being classified as skin.
- Makes the skin, hair, and outfit masks mutually exclusive in the shader. Each selectable model has its own mask rules.
- Keeps male characters on idle animation while isolating root-motion problems.
- Moves preview framing values into `AVATAR_MODELS`; male 2 gets a wider card camera and a more distant main preview camera to prevent the persistent close crop.
- Keeps the current cartoon pedestrians, clients, and landlords. The four selected player models are not used as NPCs.
- Preserves skin-tone, outfit-color, and hair-color controls and their multiplayer properties.

## Deploy
1. Replace the repository-root `index.html` and `server.js` with the files from this package.
2. Keep the existing `public/assets` folder and its model files. Do not upload the models again for this code-only update. The code tries the current lowercase/hyphen names first and existing underscore/original names as fallbacks.
3. Commit to `main` and wait for Render to redeploy.
4. Open `/version`; it should show `REW-AVATAR-STABLE-COLOR-FRAMING-2026-10-19`.

## Honest limitation
These GLBs each use a baked texture atlas rather than separate skin/clothing/hair materials. The updated shader uses per-character texture-color masks, so recoloring is substantially more selective, but it is not equivalent to separate artist-authored materials. Small shaded details can still be affected. For perfect independent controls, the models would need material-separated meshes or authored mask maps.
