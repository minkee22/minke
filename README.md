# EUNBYN AN — Portfolio

Live: **https://evaan-portfolio.vercel.app**

A fashion designer's portfolio built as a set of physical objects rather than web pages.
The landing page is a photographed pinboard; each pinned card opens a project rendered in
a different physical metaphor — a spiral notebook, an album sleeve, a wall of envelopes,
a coverflow rail, a case study spread, an Instagram profile.

## Structure

| File | Role |
| --- | --- |
| `index.html` · `style.css` · `main.js` | Landing pinboard (4×4 grid, photo cards pinned to a wall) |
| `projects.js` | **Which card sits in which slot, and where it links.** Edit here to add a project. |
| `project.html` · `project.css` · `project.js` | One file renders all six project layouts, chosen by `?id=` |
| `details.js` | **All project content** — photos, captions, order, layout settings |

## The six layouts

| `?id=` | Layout | Interaction |
| --- | --- | --- |
| `trashion` | Spiral notebook | Page turn, cover peel on hover |
| `clo3d` | Coverflow rail | Cursor position drives scroll speed; centre item is sharp, sides blur |
| `duvetica` | Envelope wall | Envelopes open and close independently, cards rise out |
| `model` | Album sleeve | 3–4 photos per sleeve page, arrow zones inside the paper |
| `designer` | Case study | Long vertical scroll, black hero renders against light process strips |
| `habit` | Instagram profile | 12 looping 360° garment videos, staggered so they never spin in sync |
| `st60` | Case study | Sergio Tacchini 60th capsule — deck pages (process) against the shipped product photos (hero/grid), full deck linked from the header |

## Editing

Everything a non-developer needs to change lives in two files.

**Add or move a card on the board** — `projects.js`:

```js
{ slot: 7, image: "landing photo/model1.png", title: "model", href: "project.html?id=model" },
```

`slot` is 1–16 reading left to right, top to bottom. `image: null` leaves the card blank —
the blank cards are deliberate, they are what makes the board read as a wall rather than a gallery.

**Change a project's contents** — `details.js`. Each layout has its own block with its
photo list, captions and geometry. Reordering pages means reordering lines.

## Notes

- No framework, no build step. Plain HTML, CSS and JavaScript.
- Fonts are self-hosted so text metrics match on macOS and Windows.
- Card positions on the board are measured from the board photograph itself, not hand-placed,
  so photos sit inside the paper on any screen size.
- The 360° videos are transcoded down from 240 MB of HEVC masters to 3.5 MB of H.264.
