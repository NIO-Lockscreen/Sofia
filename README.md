# MiniMemory – lær ord og tall

A small iPad-friendly Norwegian memory game for learning words, first letters, and counting.

## Deploy on Vercel

1. Upload these files to a GitHub repo.
2. Import the repo in Vercel.
3. Framework preset: **Other**.
4. Build command: leave empty.
5. Output directory: leave empty/default.
6. Deploy.

## Files

- `index.html` – the full app
- `manifest.webmanifest` – lets iPad add it to the home screen
- `vercel.json` – static hosting config
- `package.json` – project metadata only

## Latest fixes

- Counting cards use centered emoji rows instead of a forced grid.
- 5 = 3+2, 6 = 3+3, 7 = 4+3, 8 = 4+4.
- 7 and 8 are smaller only when needed, so emojis do not crop off the card.
- Letter mode avoids duplicate first letters in the same round.
- Letter speech uses clearer pauses: “M. Ordet mus. Starter med M.”
- Page scrolls normally on iPad.
