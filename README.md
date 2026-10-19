# RealEstate World — Male 2 Animation and Hair Color Test

Build marker: `REW-MALE2-ROOTMOTION-HAIR-COLOR-2026-10-19`

## Included changes
- Keeps the existing two-step FEMALE / MALE selection flow and the current cartoon/procedural city NPC, client, and landlord avatars. It does not assign the four player GLBs to NPCs.
- Fixes the second male’s animation preference. The model contains both `Walking` and `walking_2`; the latter has substantial forward hip/root translation, so the old preference could make the character advance toward the camera and leave the expected position. The code now prefers the near-in-place `Walking` clip for the second male and leaves extra framing room in its selection card.
- Adds a hair-color row with Original, Black, Espresso, Chestnut, Auburn, Blonde, Silver, and Platinum choices, persisted locally and passed to the multiplayer server.
- Keeps the experimental skin and outfit color controls. The GLBs use baked single-atlas textures, not separate skin/clothing/hair materials; tinting uses conservative per-model pixel masks and may also tint eyebrows/beard or shaded details. Please treat hair tint as a test, not a perfected salon system.
- Uses the same model paths (`public/assets/male-agent-1.glb` and `public/assets/male-agent-2.glb`) as the previous package.

## Deploy
1. Replace root `index.html` and `server.js` with the files in this package.
2. Keep the existing `public/assets` folder and female model files. Ensure the two male files are present at `public/assets/male-agent-1.glb` and `public/assets/male-agent-2.glb`. The full ZIP includes these two male GLBs as a convenience. Upload the individual GLBs to GitHub, not the ZIP.
3. Commit changes to `main` and wait for Render to redeploy.
4. Check `/version`; it should return `REW-MALE2-ROOTMOTION-HAIR-COLOR-2026-10-19`.
5. Test both male previews, move with the second male in the city, then test each hair swatch. If hair coloring affects non-hair areas too strongly, switch Hair color back to Original and send a screenshot so the mask can be narrowed.

The code passed JavaScript syntax validation and the included model files were checked. This package has not been deployed to Render or tested interactively in the live browser.
