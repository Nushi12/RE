# RealEstate World — Male Idle Stability Test

This is a code-only update for the existing RealEstate World repository. Keep the `.glb` model files already committed in `public/assets/`; they are not included in this ZIP.

## What changed

- Both male rigged characters stay on their embedded **idle** animation in the selection preview and during gameplay. This temporarily avoids using the male walking clips, including the second male's `walking_2` clip that contains forward/root movement.
- Female character animation behavior is unchanged.
- Existing skin, outfit, and hair color test controls remain in place.
- Existing cartoon-style NPCs and clients remain as they are.
- Server version marker is updated to `REW-MALE-IDLE-HAIR-COLOR-2026-10-19`.

## How to install

1. Replace the root-level `index.html` and `server.js` in the GitHub repository with the files from this package.
2. Keep `package.json` and the existing `public/assets/` model files unchanged.
3. Commit the two replacement files to `main` and wait for Render to redeploy.
4. Open `/version` on the deployed site. It should show `REW-MALE-IDLE-HAIR-COLOR-2026-10-19`.
5. Test both male characters in the preview and in the city.

## Expected trade-off

While either male avatar moves through the city, its model remains in an idle pose and may visually glide instead of cycling its legs. This is an intentional temporary diagnostic to isolate root-motion problems. It does not change road geometry. Once the male model positions and scale are confirmed, the next step is to add/choose an in-place walk animation.
