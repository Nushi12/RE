RealEstate World — NPC GLB authored-scale preservation patch
Date: 2026-10-21

What changed
- Updated attachNpcModel() in index.html to preserve each GLB's authored root transform.
- Removed automatic Box3-based uniform scaling and ground-offset calculations from the NPC path because undeformed skinned-mesh bounds are not a reliable standing-height measurement.
- Kept NPC animation selection, texture/materials, interaction wiring, and fallback behavior unchanged.
- Adjusted NPC label/marker heights to sit just above the expected character height.

Validation
- JavaScript syntax checked locally with Node.js (node --check) for all inline script blocks.
- This is an offline source patch only. It has NOT been deployed to Render or visually verified in a live browser. Check character size/foot placement in the game before treating it as final.
- This package contains index.html only; it does not include server.js, package.json, or GLB assets.

Upload
1. Back up the current index.html in GitHub.
2. Replace the repository's matching index.html with this file.
3. Commit the change and let Render deploy.
4. Test a few different NPC GLBs in the live scene before proceeding further.
