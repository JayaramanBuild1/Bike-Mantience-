# Meteor 350 Rider Garage — Main Version 6

A static GitHub Pages motorcycle logbook for Jayaraman’s Royal Enfield Meteor 350, Stellar Blue.

## Main Version 6 fixes
- Converts the three supplied original recordings to MP3 and plays them in order: engine start → throttle → pump/idle.
- Audio playback starts only after the Sound button is tapped. Skip loading stops playback.
- Uses exact lowercase paths under `assets/audio/`: `engine-start.mp3`, `power-throttle.mp3`, `pump-start.mp3`.
- Corrects the dashboard greeting dynamically using India Standard Time: morning (5 AM–11:59 AM), afternoon (12 PM–4:59 PM), evening (5 PM–4:59 AM).
- Adds a final image-sizing override so the full approved blue side-profile motorcycle image remains visible without cropping or unintended zoom in loading, welcome, and dashboard layouts.
- Keeps the nine garage sections and existing V5 data structure, including the 13 imported fuel entries.

## Exact repository layout
Upload the contents of this ZIP to the repository root. Keep the `assets` folder plural and preserve this structure:

```text
index.html
style.css
script.js
parts-index.json
fuel-history-import.json
README.md
assets/
  jayaraman-meteor-350.png
  meteor-350-logo.png
  royal-enfield-wordmark.jpg
  audio/
    engine-start.mp3
    power-throttle.mp3
    pump-start.mp3
```

Do not upload the old `.m4a` files. The MP3 recordings are already included in this ZIP.

## Safe publishing steps
1. On the currently working website, export a JSON backup before replacing anything.
2. Download and extract this ZIP.
3. Upload all files and folders inside the extracted folder to the GitHub repository root (not an extra nested folder).
4. Preserve `assets/` and `assets/audio/` exactly as shown above.
5. Commit the changes and wait for GitHub Pages to finish deploying.
6. Open the site in a private/incognito tab or hard-refresh. Tap **Sound on** once to test audio.

## Important limits
- This package has passed JavaScript syntax, ZIP integrity, and local asset-path checks. It has not been live-tested on your GitHub Pages domain or every phone/browser. No one can honestly guarantee zero bugs without those tests.
- Browser-local storage belongs to one browser/device and does not sync between devices. Export backups regularly.
- A static GitHub Pages site cannot provide production-secure server-side admin authentication. The local admin gate is not suitable for protecting secrets.
- The current service history contains recovery notes that need reconciliation against the original scanned bills. Do not treat uncertain amounts, dates, or odometer readings as verified.
- The user-confirmed dashboard odometer is 17,109.8 km. Older workshop odometer values remain separate and must not silently overwrite it.
- The personal service reminder is every 3,500 km or 4 months, whichever comes first; it is separate from the official manufacturer schedule.
- Imported fuel entries retain unknown full/partial fill status; do not infer full-to-full mileage from them.
