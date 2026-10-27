# Shinobi Missions

An unofficial Naruto-inspired cooperative browser arena prototype. Node.js 20+ is the only requirement; no package installation, credentials, database, or external assets are required. Optional Google Fonts fall back to system fonts.

Run `npm start` from this directory. The server listens on port 3000 (override with PORT). Open the server address in a browser, choose a character or enter any Naruto character name, and join a room. Friends join the same server and room code, up to eight players. WASD/arrows move, J attacks, K uses a chakra burst. Defeat every enemy and select Next mission. A defeated squad can retry. Characters currently use the same combat abilities.

Rooms are ephemeral and reset after all connected players leave or the server restarts. This development prototype has no accounts, matchmaking, persistence, or production abuse protection. For remote play use a shared reachable server; separate server instances do not share rooms.
