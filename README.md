# RealEstate World — full code update

This package contains the complete `index.html` and `server.js` for the current game source with the eight player avatar IDs restored.

## Included
- Four female and four male avatar model definitions, matching filenames in `public/assets/`.
- Server allowlist updated for all eight avatar IDs so multiplayer accepts every choice.
- Removes the visible “Stability test” banner only; it does not add skin-tone controls.
- Naomi's GLB stays visible in its authored pose. Voice narration no longer calls `stopAllAction()`.
- Keeps the existing licensing/exam and firm-selection code in the supplied index.html.
- NPCs remain disabled and recoloring remains paused.

## Install
1. Keep all nine GLB files in `public/assets/` with exact filenames shown in the GitHub assets folder.
2. Replace the repository root `index.html` and `server.js` with these two files.
3. Commit both files and let Render deploy.
4. Check `/version`; it should show `REW-8-AGENTS-NAOMI-FRAME-2026-10-21`.

This is syntax-checked but not live-tested against Render. If a model filename differs from the listed canonical filename, update the matching `file` property or rename the asset consistently.
