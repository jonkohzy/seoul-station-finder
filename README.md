# Seoul Station Finder

A small, self-contained English metro station finder, ready for GitHub Pages.

## Use it

Open `index.html` in your browser, or publish the folder as described below.

- Search 657 English station labels across the Seoul metropolitan network.
- Partial names, spaces, punctuation, common aliases, and small spelling mistakes are supported.
- Try `ganganm` → Gangnam, `Hongdae` → Hongik Univ., `myeongdong` → Myeong-dong, or `gimpo airport`.
- Select a result or press Enter to zoom in and highlight its name on the map.
- Drag to pan; scroll, pinch, or use +/− to zoom. The corner-brackets button shows the full map. Recenter returns to the selected station.
- Use Up/Down in search to choose a match. With the map focused, arrow keys pan, +/− zoom, and 0 shows the whole map.
- You can also click station names directly on the map.

There are no API keys, dependencies, build steps, analytics, or runtime network requests. The website works offline when its files are saved locally. A hosted visit still requires a connection to load the files initially; this is not an installable offline PWA.

## Pin stations for trip planning

1. Search for a station and select it, or click its name on the map.
2. Choose one of the seven rainbow colours: **Red, Orange, Yellow, Green, Blue, Indigo, or Violet**.
3. Select **Pin station**. A numbered marker and matching coloured highlight remain on the map as you search for other stops.

Your **Pinned stations** list shows each saved stop, its marker number, and its colour. Select a saved stop or its map marker to bring up its controls. Multiple stations can use the same colour, so you can group stops by day or activity. Numbers identify the pins in your current list; they are not route or travel-order recommendations and may change when a pin is removed.

### Keep your stops visible

- **Keep all pins in view** is enabled by default. Selecting another station frames it together with your saved pins. Adding a pin also adjusts the map to include your saved stops.
- **Show all pins** fits just your pinned stations on the map.
- You can still pan, zoom, or use the full-map button freely. These actions temporarily override automatic framing.
- **Recenter** zooms to the selected station. Selecting another station restores automatic framing if **Keep all pins in view** is enabled.
- Turn the checkbox off to zoom to individual search results while retaining all saved markers. **Show all pins** remains available.

### Change or remove pins

- Select a pinned station, then choose another colour to update it immediately.
- Select **Unpin station**, or use the **×** beside the stop in the pinned list, to remove it.
- The map and list update together. Searching for a new station does not delete earlier pins.

### Saving and privacy

Pins, their colours, and the keep-in-view preference are saved automatically in this browser on this device. They are restored when you reload or revisit the site. No account or server is involved, and your trip is not uploaded or synced between devices or browsers.

Clearing this site's browser data removes its saved pins. A local copy and a GitHub Pages copy have separate browser storage; local-file saving also depends on the browser and file location. If browser storage is unavailable, pinning still works for the current visit and the site displays a saving-unavailable message.

Pins are available on desktop and mobile. On a phone, swipe the pinned-station list horizontally to reach additional stops. Colour choices have text names, and numbered markers match the saved list.

This feature helps mark and group stops; it does not calculate routes, travel times, or an itinerary.

## Map source and scope

The supplied [SlideShare reference](https://www.slideshare.net/slideshow/in-the-zone-78/24189926) informed the English, color-coded schematic presentation. Its image is not redistributed here.

The bundled map is **Seoul subway linemap en.svg** by **IRTC1015**, from Wikimedia Commons, released into the **public domain** by its creator:

https://commons.wikimedia.org/wiki/File:Seoul_subway_linemap_en.svg

Downloaded from:
https://upload.wikimedia.org/wikipedia/commons/2/2f/Seoul_subway_linemap_en.svg

Published revision: **29 June 2025** (the artwork is stamped 250628). Retrieved 24 September 2026.

The original map is embedded as SVG in `index.html`; the site adds selection overlays and uses a local system-font fallback. The English station index is derived from its foreground labels, so highlights stay attached to the source diagram. Highlights identify station **names**, not GPS coordinates. There are separate search results for distinct labels such as the two Sinchon stations.

This is a dated schematic, not a live transit feed. It includes some planned stations marked grey in the source. It does not guarantee current service, station openings, route availability, travel times, or geographic scale. Some names differ from older maps; aliases are provided for several common variants.

## Files and customization

- `index.html` — page and embedded English vector map
- `styles.css` — desktop and mobile appearance
- `search.js` — name normalization, aliases, and approximate matching
- `app.js` — station indexing, zooming, panning, and highlighting
- `pins.js` — rainbow pins, saved-stop controls, automatic framing, and browser storage
- `.nojekyll` — GitHub Pages static-site marker
- `README.md` — these instructions and map attribution

Edit the `aliases` object in `search.js` to add alternate spellings or nicknames. Its keys must match the English station labels on the map exactly. Replacing the map requires preserving or updating the foreground label selectors used in `app.js`; the source map's `name_en` and `name_en_overlap` groups are the station index.

An optional, feature-detected WebMCP interface exposes `search_stations` and `show_station` in supporting browsers. Normal website use requires no WebMCP support. Native WebMCP integration was not available for validation in the local test browser.
