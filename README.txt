RealEstate World — realistic avatar integration (first pass)

Files included
- index.html: current game with GLTFLoader, realistic rigged avatar replacement, appearance tinting, animation updates, and Naomi browser voice narration.
- server.js: current Socket.IO server with /assets static-file hosting.
- public/assets/idle-standing-maya-3d-person-animated.glb: supplied clothed, textured, rigged human with Idle_Standing animation; used as the first visible human template.
- public/assets/human-base-rigged.glb: supplied 53-bone anatomical base rig, included for the upcoming modular body/clothing system. It has no clothes or animation clip, so it is not displayed as a naked character in this pass.

What this pass does
- Replaces procedural bodies with the realistic Maya character after the GLB loads, retaining a procedural fallback if loading fails.
- Uses skeleton-safe cloning for players, NPCs, pedestrians, preview, and senior agent.
- Runs the supplied idle animation. Adds a light bone-based stride overlay while characters move; a dedicated walk clip would improve foot contact.
- Applies per-character skin, hair, top, and trouser color tints so players/NPCs are not all tinted the same. Current GLB provides one clothing silhouette and one hairstyle mesh, so full garment/hairstyle swaps require additional compatible assets.
- Naomi reads the same training fact/question/feedback text shown in the career/training panel using browser speech, with small head/neck gestures during narration. Browser speech and voices vary by device; mouth lip-sync is not included because this GLB has no jaw/lip rig.

Deploy
1. Replace your existing index.html and server.js with these files.
2. Copy the included public/assets folder beside server.js.
3. Keep your existing package.json and dependencies (express and socket.io).
4. Commit and push to GitHub; Render should redeploy the service.

The change does not modify your existing movement, Socket.IO messages, career state, licensing quiz, firm selection, or dashboard workflow. Test locally before deploying.
