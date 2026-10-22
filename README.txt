REAL ESTATE WORLD — WHOLE-GAME CONVERSATION UPDATE

What changed
- Replaces the Leo-only conversation example with one shared conversational structure for every client/landlord profile.
- Uses context-sensitive conversation prompts for sales and rentals, with three response choices, trust changes, and client reactions.
- Extends turn-taking dialogue to prospective buyers/tenants: agent asks about budget/income, bedroom needs, and timing; the character responds with their generated profile details.
- Makes buyer/tenant feedback at an apartment showing sound more like a reaction to fit rather than a fixed announcement.
- Uses existing speech synthesis and conversation-audio hooks; no music file was added. Browser speech synthesis depends on browser/device voice support and a user interaction to unlock audio.
- Leaves the existing apartment, avatar models/scales, save, career, brokerage, and deal systems in the supplied source rather than replacing those systems.

Validation
- Inline JavaScript passes `node --check`.
- Not browser-tested and not deployed to Render. Please back up your current index.html and test this version locally first.
- This package is an updated index.html, not a full server/assets deployment. Keep the existing project files, GLB assets, package files, and server configuration.
