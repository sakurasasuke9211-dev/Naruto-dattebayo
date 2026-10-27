# Shinobi Missions: 3v3

Unofficial Naruto-inspired browser multiplayer prototype. Requires Node.js 20+. No dependencies, credentials, or database are required. Run `npm start` and open the server address on port 3000 (override with PORT). Run `npm test` for combat rules and multiplayer HTTP validation.

Six human players join the same server and room code. Fixed teams are **Team 7** (Naruto, Sasuke, Sakura) and **Ino–Shika–Cho** (Ino, Shikamaru, Choji). Select your team and an unused character. Combat begins only when all six slots are filled. Eliminate the opposing trio to win; leaving during combat forfeits the match for your team. All remaining players must vote for a rematch. A depleted room returns to waiting after the vote.

WASD/arrows move, J attacks the nearest opponent within melee range, K uses a signature technique. There is no friendly fire. Technique ranges appear as colored circles; single-target abilities automatically select the nearest living opponent in range.

| Character | Technique | Effect | Chakra | Cooldown |
|---|---|---|---|---|
| Naruto | Rasengan | 38 damage, single target | 30 | 2.2s |
| Sasuke | Chidori | 32 damage, longer reach | 30 | 2.4s |
| Sakura | Cherry Blossom Impact | 28 damage plus 22 healing to nearby living teammates | 35 | 3.5s |
| Ino | Mind Transfer | 12 damage and 2.4s stun | 35 | 4.5s |
| Shikamaru | Shadow Possession | 10 damage and 2s bind to nearby opponents | 30 | 4s |
| Choji | Human Boulder | 30 area damage | 35 | 3s |

These are simplified game adaptations. Basic attacks deal 12 damage. Chakra regenerates during combat. Eliminated players spectate until the rematch; healing cannot revive them. Abilities consume chakra even when no enemy is in range.

Rooms live in server memory and reset after everyone disconnects or the server restarts. This prototype has no accounts, matchmaking, persistent progression, or production abuse protection. Friends must reach the same server; separate server instances do not share rooms. Google Fonts are optional and fall back to system fonts. No official artwork or audio is included.
