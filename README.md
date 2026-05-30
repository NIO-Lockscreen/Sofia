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


## Norsk TTS
Appen forsøker nå eksplisitt å velge en norsk stemme (`nb-NO`, `no-NO` eller `nn-NO`) fra nettleserens `speechSynthesis`-stemmer før den snakker. Hvis en iPad fortsatt leser med engelsk stemme, må norsk stemme være installert/tilgjengelig på enheten: Settings → Accessibility → Spoken Content → Voices → Norwegian.

## Update in this version

- Added **Stavelek** mode: the parent can write/store a word, and the child builds it from correct and extra wrong letters.
- Added difficulty choices for spelling mode: +1, +3, +5 or +8 extra letters.
- Added a 30-second no-input hint: the next correct letter gets a sparkle effect.
- Fullscreen mode now blurs and hides parent-only text fields and the adult menu, preventing the browser text-input fullscreen warning.

## Newest update

- Spelling now shows the **whole word** (e.g. all of `LAM`) in the slots before the next word appears — the final letter is rendered and held a moment before moving on.
- **Double-tap anywhere** to toggle fullscreen, so you no longer have to open the adult menu. The fullscreen button still works too.
- Hardened the fullscreen text-input warning fix on iPad/iPhone: the app now uses the webkit-prefixed Fullscreen API (detection, request/exit, and the `webkitfullscreenchange` event), and parent text fields are disabled (not just hidden) while in fullscreen, with a focus guard as a safety net.
- Replaced the **Clapping** toggle with an **Easy mode (Lett modus)** toggle. When easy mode is on, the next letter to tap is shown in **red** in the displayed word in spelling mode. (Clapping now always plays as part of the rewards.)
- The spelling **streak reward sound now climbs higher with each combo** — a rising arpeggio that adds notes and pitch the longer the streak, with an octave-up finale, for extra dopamine.
