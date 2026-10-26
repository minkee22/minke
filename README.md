# KYUNGEUN MIN — Portfolio

Live: https://minkee22.github.io/evaan-portfolio/

The homepage uses the approved Pinned Pages design: ivory paper, soft shadows,
safety-pin connectors and a three-project opening spread. It is static HTML and
CSS, with no build step or JavaScript required for homepage navigation.

## Editing

- `index.html`: homepage copy, project cards, contact and document links.
- `pinned.css`: homepage layout, paper effects, responsive styles.
- Homepage image areas are intentionally empty. Add images inside `.sheet` and replace `.empty-image` when ready; existing image files are retained for detail pages.
- `project.html`, `project.css`, `project.js`: existing project detail experiences.
- `details.js`: detail-page project content.
- `projects.js`, `main.js`, `style.css`: retained legacy pinboard implementation;
  the new homepage does not load these files.

All seven project pages, the wedding gift deck, CV and portfolio PDF remain linked.
The relative links support GitHub Pages hosting under `/evaan-portfolio/`.

## Preview and deployment

Serve this directory with any static HTTP server. GitHub Pages publishes the
repository's configured source; there is no dependency installation or build step.
