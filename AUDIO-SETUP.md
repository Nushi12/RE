# RealEstate World audio integration

Audio assets live in `public/assets/audio/` and are served by the existing Express `/assets` static route.

- `background-overboard.mp3`: general city exploration music
- `city-ambience-broadway.mp3`: first conversational street ambience
- `city-ambience-pedestrians-traffic.mp3`: alternating conversational street ambience
- `showing-phases.mp3`: apartment/listing showing music

Playback begins after the user's first pointer or keyboard interaction, as required by common browser autoplay policies. Street ambience fades in during voiced client/NPC lines while the main music is ducked. Entering an apartment showing switches to the showing track; exiting returns to the world track. Audio playback errors are logged to the browser console.

Deploy the whole `rew_asset_update_delta` folder contents together; do not upload just `index.html`, because the MP3 files must also be placed under `public/assets/audio/`. Keep the existing `package.json` and Render configuration from the project if they are maintained elsewhere.
