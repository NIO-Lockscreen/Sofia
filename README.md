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
- `sw.js` – service worker (offline support)
- `manifest.webmanifest` – installable app metadata (name, icons, colors)
- `icon.svg` / `icon-square.svg` – icon sources; `icon-*.png` + `apple-touch-icon.png` are generated from them
- `vercel.json` – static hosting config + security/privacy headers
- `scripts/gen-icons.mjs` – regenerates the PNG icons (`npm run icons`)
- `tests/smoke.spec.js` + `playwright.config.js` – Playwright smoke tests (`npm test`)
- `.github/workflows/ci.yml` – runs the smoke tests on every push/PR
- `package.json` – project metadata + test/icon scripts

## Personvern (privacy)

The app is **100 % local**: there is no backend, no analytics, no third-party
requests, and no account. The child's name, saved spelling words, rounds and
streaks are stored only in the browser's `localStorage` on the device.
`vercel.json` ships a Content-Security-Policy with `connect-src 'self'`, so the
page cannot send data anywhere, plus a `Permissions-Policy` that disables the
camera, microphone and geolocation.

## Offline / Add to Home Screen

`sw.js` caches the app shell, so once it has been opened once it works fully
offline (planes, cars, weak Wi-Fi). The manifest provides crisp icons
(including a maskable one) and an `apple-touch-icon` for a proper home-screen
icon on iPad/iPhone. When you ship a change, bump `CACHE` in `sw.js` so devices
pick up the new version.

## First-boot name + parental gate

- On the very first launch the app shows an optional **"Legg inn barnets navn"**
  dialog. Saving a name makes the celebrations cheer for the child by name;
  skipping keeps the praise generic. The name can always be changed later in the
  adult menu.
- The **Voksenmeny** is now behind a small math gate (a simple addition with
  three answer choices), following the platform convention for kids' apps, so a
  child can't accidentally reset progress or delete saved words.

## Accessibility

- The screen-reader live region is scoped to the status message only (it used to
  wrap the whole app and announce every card re-render).
- `prefers-reduced-motion` is honored: confetti and the emoji burst are skipped
  and transitions are reduced for users who ask for less motion.
- Muted text color was darkened for better contrast.

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
- In **Emoji-staving**, the **"Si igjen"** button now helps her spell: it says the word and then each letter sound slowly (same as tapping the emoji), instead of repeating the task prompt.
- **Zoom is now disabled** (viewport lock + blocked pinch/double-tap gestures) so stray touches can't zoom the screen and make the game unplayable.
- New tap-to-hear helpers in spelling mode:
  - **Easy mode on:** tapping a letter in the shown word (e.g. the red next letter) voices that letter's sound.
  - **Easy mode off:** tapping the shown word spells the whole word — the word then each letter ("ost … o, s, t").
  - Tapping the answer slots reads back what she has entered so far (the incomplete word, e.g. "os").

## Launch hardening (this update)

- **10 new words** for ages 3–6 with broad letter/reading coverage (new initial
  letters d, f, i, j, u, ø and extra practice on rare letters y/ø):
  `fisk 🐟, is 🍦, dør 🚪, jul 🎄, øye 👁️, fly ✈️, eple 🍎, sky ☁️, løve 🦁, ulv 🐺`.
- **Offline support** via a service worker + proper installable icons.
- **First-boot name dialog** (optional) and a **math parental gate** on the adult menu.
- **Privacy/security headers** (CSP, Permissions-Policy) guaranteeing nothing leaves the device.
- **Accessibility:** scoped live region, `prefers-reduced-motion`, higher contrast.
- **TTS robustness:** periodic `resume()` to avoid the speech-synthesis stall, and a
  hint in the adult menu when no Norwegian voice is installed.
- **Safe storage:** `saveState` no longer throws in private mode / when storage is full,
  and old saved data is migrated forward on version bumps instead of being wiped.
- **Tests + CI:** Playwright smoke tests run on every push/PR.
