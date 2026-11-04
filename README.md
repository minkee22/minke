# KYUNGEUN MIN Portfolio

Live: https://minkee22.github.io/minke/

The homepage uses the Pinned Pages design: ivory paper, soft shadows and safety
pins joining each sheet to the next. It is static HTML, CSS and a small script,
with no build step.

## Pages

- `index.html`: SELECTED. AI case slides, previews of the collections and artwork, Sian Studio and contact details.
- `artwork.html`: ARTWORK. Styles and sketches by category. `artwork.html#outer` opens one category.
- `collections.html`: COLLECTIONS. Capsule and collaboration projects. `collections.html#vbyk` opens one project.
- `about.html`: ABOUT. Introduction and contact details.

## Editing

- `archive-data.js`: section titles, notes, stories and image lists for ARTWORK and COLLECTIONS. Each image is `[file, width, height, caption]`, and each inner list is one paper sheet.
- `archive/<section>/NNN.webp` is the full image used in the viewer; `archive/<section>/t/NNN.webp` is the thumbnail. Add both when adding an image. Section covers live in `archive/covers/`.
- `archive.js`, `archive.css`: rendering and styles for ARTWORK, COLLECTIONS and ABOUT.
- `pinned.css`: shared type, header, footer, paper effects and the homepage.
- `portfolio-viewer.js`: the image viewer and the homepage gallery rows.
- `fonts/pretendard/`: self-hosted Pretendard Variable (SIL OFL). Browsers download only the subsets a page needs.
- `folio-NN-page.webp` is the full slide used in the viewer; `folio-NN-page-1200.webp` is the lighter copy used on the homepage. Update both when a slide changes.
- `og-cover.jpg`: the preview image shown when the link is shared.
- `project.*`, `details.js`, `projects.js`, `main.js`, `style.css`, `case-study.css`, `case-study.js`, `portfolio-data.js`: retained earlier implementations; no current page loads or links to them.
- Bump the `?v=` values in the HTML files after changing CSS or JS.

Working rules, design decisions and open items are in [AGENTS.md](AGENTS.md). Read it before changing the site.

## Preview and deployment

Run `python3 -m http.server 4173` here and open http://127.0.0.1:4173/.
GitHub Pages publishes `main`, so a push to `main` goes live right away. There is
no dependency installation or build step.
