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

## Publish on GitHub Pages

1. Create a GitHub repository, for example `seoul-station-finder`. A public repository works with GitHub Free.
2. Upload **the contents of this folder** to the repository root. `index.html` must sit directly at the root, alongside `styles.css`, `search.js`, and `app.js`. Do not upload only the ZIP file or leave everything inside an extra enclosing folder.
3. Commit the files to your `main` branch.
4. Open the repository's **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select **main** and **/(root)**, then **Save**.
7. Wait for GitHub's deployment to finish. The Pages settings will show your website link, normally `https://YOUR-USERNAME.github.io/seoul-station-finder/`.

The included `.nojekyll` file tells Pages to serve the static site directly. All links to site files are relative, so a repository subpath works without configuration. If your branch has a different name, select that branch instead of `main`.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

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
- `.nojekyll` — GitHub Pages static-site marker
- `README.md` — these instructions and map attribution

Edit the `aliases` object in `search.js` to add alternate spellings or nicknames. Its keys must match the English station labels on the map exactly. Replacing the map requires preserving or updating the foreground label selectors used in `app.js`; the source map's `name_en` and `name_en_overlap` groups are the station index.

An optional, feature-detected WebMCP interface exposes `search_stations` and `show_station` in supporting browsers. Normal website use requires no WebMCP support. Native WebMCP integration was not available for validation in the local test browser.

## Validation

Checked in Chrome at desktop and phone widths: station lookup, 11 exact/alias/typo examples, keyboard selection, empty search results, zoom controls, full-map view, recentering, dragging, geometry for all 657 labels, and direct local-file opening. No browser runtime errors were found.
