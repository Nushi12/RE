RealEstate World — audio + apartment showing update

Based on the supplied index.html. This update aims to:
- Replace the almost inaudible sustained chord with a repeating synthesized melody.
- Resume AudioContext after browser suspension and fade music out while any client conversation is open.
- Improve browser speech voice selection and retry when speech fails to begin.
- Add a furnished, walkable apartment interior (living room, kitchen, dining area, bedroom, windows, lights).
- Change the buyer/tenant listing action to enter the apartment, then ask for feedback after the walkthrough.
- Preserve existing NPC and player model sizing code and existing dialogue/transaction logic.

Validation performed: extracted main JavaScript passed `node --check`. This is an offline syntax check only. The WebAudio melody, browser speech synthesis, apartment visuals, navigation, and Render deployment have NOT been browser-tested. Browser-generated voices and WebAudio can behave differently by device. The music is a procedural placeholder tune, not a finished recorded soundtrack. Keep a backup of the current working deployment and preserve public/assets.
