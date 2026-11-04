# KYUNGEUN MIN Portfolio

Live: https://minkee22.github.io/minke/

The homepage uses the Pinned Pages design: ivory paper, soft shadows and safety
pins joining each sheet to the next. It is static HTML, CSS and a small script,
with no build step.

## Pages

- `index.html`: SELECTED. AI case slides, previews of the collections and artwork, Sian Studio, contact.
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
- `project.html`, `project.css`, `project.js`, `details.js`, `projects.js`, `main.js`, `style.css`: retained earlier implementations; no current page loads or links to them.

## Preview and deployment

Serve this directory with any static HTTP server. GitHub Pages publishes the
repository's configured source; there is no dependency installation or build step.
