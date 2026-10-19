# RealEstate World — Clean Rebuild (Rigged Humanoid)

This folder is a complete deployable project for the current game code and its required avatar asset. It avoids the large, unrigged scanned character files that caused upload issues.

## Included

- `index.html` — the existing game with a shared rigged humanoid avatar pipeline, creator controls, NPCs, career UI, and multiplayer client.
- `server.js` — Express + Socket.IO server and asset routing.
- `package.json` — runtime dependencies and start command.
- `public/assets/human-base-rigged.glb` — the only GLB required by this build (about 4.8 MB).

This build intentionally does not require `woman.glb`, `man.glb`, `businessman.glb`, or `idle-standing-maya-3d-person-animated.glb`; the code loads the rigged human base only. The other uploaded GLBs are not required for the current procedural world and avatar implementation.

## Upload to GitHub

1. Extract this ZIP on your computer. **Do not upload the ZIP as a repository file.**
2. In `https://github.com/Nushi12/RE`, add these extracted files/folders to the repository root, replacing existing `index.html` and `server.js`:
   - `index.html`
   - `server.js`
   - `package.json`
   - `.gitignore`
   - `README.md`
   - `public/assets/human-base-rigged.glb`
3. Keep the `public/assets` path exactly as written. The GLB is under GitHub's browser upload size limit; the whole ZIP is also small.
4. Commit the upload. Wait for the correct Render service to deploy.

Do not upload the model to the repository root only; this project expects it at `public/assets/human-base-rigged.glb`.

## Render settings

The existing Render build command `yarn` can install these dependencies from `package.json`, as your logs showed. If you want a matching npm setup instead, use build command `npm install` and start command `npm start`. Start command `node server.js` also works.

After deployment, verify the service URL shown in that Render service's dashboard:

- `/version` should display `REW-HUMANOID-BASE-2026-10-18`
- `/healthz` should return JSON with `"status":"ok"`
- `/assets/human-base-rigged.glb` should load or download the 3D model

The screenshots shared earlier showed more than one Render URL, so use the URL shown on the same service you deploy.

## Important limitations

This is a first procedural character creator, not a finished asset-based wardrobe. The supplied human base is rigged but contains no animation clips or built-in body/face morph targets. The page creates body-presentation/build variations and clothing surfaces in code and drives a basic walking gait. Realistic standalone clothing meshes, high-quality male/female anatomy variants, and a polished walk animation still require compatible 3D assets or more Blender work. Test the result in the browser before treating the avatar work as complete.
