// Motion for the whole site: paper laid on a table, pinned, and easy to pick up.
// Nothing here is needed to use the site. Hidden states only apply while html.motion is set.
const Motion = (() => {
  const html = document.documentElement;
  const animated = html.classList.contains('motion');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
  window.motionReady = true;

  // Once an element has landed it drops its transition, so hover effects stay quick.
  function markPlaced(element, order = 0) {
    element.style.setProperty('--order', order);
    element.classList.add('is-placed');
    setTimeout(() => element.classList.add('is-settled'), 1400 + order * 80);
  }

  const observer = animated && 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
      let order = 0;
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (entry.target.matches('.folio-track')) {
          [...entry.target.children].forEach((card, i) => markPlaced(card, Math.min(i, 3)));
          return;
        }
        markPlaced(entry.target, Math.min(order, 3));
        order += 1;
      });
    }, {rootMargin: '0px 0px -8% 0px', threshold: .08})
    : null;

  const PLACED = '.folio-heading, .folio-track, .folio-progress, .row-link, .section-head, .archive-story, .cover-card, .sheet, .about-text, .about-lead, .about-sheet';

  function place(root = document, {instant = false} = {}) {
    const items = root.querySelectorAll(PLACED);
    if (!observer || instant) {
      items.forEach(item => {
        item.classList.add('is-placed', 'is-settled');
        if (item.matches('.folio-track')) [...item.children].forEach(card => card.classList.add('is-placed', 'is-settled'));
      });
      return;
    }
    items.forEach(item => observer.observe(item));
  }

  // A fresh table on every visit: the bear stays, the rest are drawn from the model photos.
  function shuffled(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function drawPrints() {
    const picks = [];
    const sections = new Set();
    for (const print of shuffled(HERO_POOL)) {
      if (sections.has(print[1])) continue;
      sections.add(print[1]);
      picks.push(print);
      if (picks.length === 5) break;
    }
    picks.splice(1, 0, HERO_BEAR);
    return picks;
  }

  function printHtml([page, section, file, shape], index) {
    const source = file === 'cover' ? `assets/archive/covers/${section}.webp` : `assets/archive/${section}/t/${file}.webp`;
    const width = file === 'cover' ? 1200 : 640;
    return `<a class="hero-sheet" href="${page}.html#${section}" style="--i:${index}" draggable="false" data-i18n-attr="aria-label:section.${section}.title">
      <img src="${source}" alt="" width="${width}" height="${Math.round(width / shape)}" decoding="async" draggable="false">
    </a>`;
  }

  // Hero: sheets drift with the pointer and the page, and can be picked up.
  const hero = document.querySelector('.hero-sheets');
  if (hero) {
    hero.innerHTML = drawPrints().map(printHtml).join('');
    I18N.apply(hero);
    const sheets = [...hero.querySelectorAll('.hero-sheet')];
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let running = false;

    const frame = () => {
      currentX += (targetX - currentX) * .08;
      currentY += (targetY - currentY) * .08;
      hero.style.setProperty('--px', currentX.toFixed(3));
      hero.style.setProperty('--py', currentY.toFixed(3));
      if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > .002) {
        requestAnimationFrame(frame);
      } else {
        running = false;
      }
    };

    if (animated && finePointer) {
      document.querySelector('.intro').addEventListener('pointermove', event => {
        targetX = (event.clientX / innerWidth - .5) * 2;
        targetY = (event.clientY / innerHeight - .5) * 2;
        if (!running) {
          running = true;
          requestAnimationFrame(frame);
        }
      });
    }

    if (animated) {
      let ticking = false;
      addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          if (scrollY < innerHeight * 1.2) hero.style.setProperty('--sy', (scrollY * .1).toFixed(1));
        });
      }, {passive: true});
    }

    let top = sheets.length + 1;
    sheets.forEach(sheet => {
      let start = null;
      let moved = false;
      let offsetX = 0;
      let offsetY = 0;

      sheet.addEventListener('dragstart', event => event.preventDefault());
      sheet.addEventListener('pointerdown', event => {
        if (event.pointerType !== 'mouse' || event.button !== 0) return;
        start = {x: event.clientX - offsetX, y: event.clientY - offsetY};
        moved = false;
        sheet.setPointerCapture(event.pointerId);
      });
      sheet.addEventListener('pointermove', event => {
        if (!start) return;
        const nextX = event.clientX - start.x;
        const nextY = event.clientY - start.y;
        if (!moved && Math.hypot(nextX - offsetX, nextY - offsetY) < 5) return;
        if (!moved) {
          moved = true;
          top += 1;
          sheet.style.zIndex = top;
          sheet.classList.add('is-held');
        }
        const box = hero.getBoundingClientRect();
        offsetX = clamp(nextX, -box.width * .55, box.width * .55);
        offsetY = clamp(nextY, -box.height * .75, box.height * .75);
        sheet.style.setProperty('--dx', offsetX + 'px');
        sheet.style.setProperty('--dy', offsetY + 'px');
      });
      const drop = () => {
        start = null;
        sheet.classList.remove('is-held');
      };
      sheet.addEventListener('pointerup', drop);
      sheet.addEventListener('pointercancel', drop);
      // A sheet that was moved stays put instead of following its link.
      sheet.addEventListener('click', event => {
        if (moved) event.preventDefault();
        moved = false;
      });
    });
  }

  // Gallery rows: pins lean with speed, and a mouse can drag the row.
  document.querySelectorAll('.folio-track').forEach(track => {
    let last = track.scrollLeft;
    let swing = 0;
    let swinging = false;

    const settle = () => {
      swing *= .88;
      track.style.setProperty('--swing', swing.toFixed(2) + 'deg');
      if (Math.abs(swing) > .05) {
        requestAnimationFrame(settle);
      } else {
        swinging = false;
        track.style.removeProperty('--swing');
      }
    };

    if (animated) {
      track.addEventListener('scroll', () => {
        swing = clamp(swing + (track.scrollLeft - last) * .09, -14, 14);
        last = track.scrollLeft;
        if (!swinging) {
          swinging = true;
          requestAnimationFrame(settle);
        }
      }, {passive: true});
    }

    if (!finePointer) return;
    let press = null;
    let dragged = false;

    track.addEventListener('dragstart', event => event.preventDefault());
    track.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      press = {x: event.clientX, left: track.scrollLeft};
      dragged = false;
    });
    addEventListener('pointermove', event => {
      if (!press) return;
      const moved = event.clientX - press.x;
      if (!dragged && Math.abs(moved) < 6) return;
      dragged = true;
      track.classList.add('is-dragging');
      track.scrollLeft = press.left - moved;
    });
    addEventListener('pointerup', () => {
      if (!press) return;
      press = null;
      if (!dragged) return;
      track.classList.remove('is-dragging');
      const cards = [...track.children];
      const first = cards[0].offsetLeft;
      const nearest = cards.reduce((best, card) => (
        Math.abs(card.offsetLeft - first - track.scrollLeft) < Math.abs(best.offsetLeft - first - track.scrollLeft) ? card : best
      ));
      track.scrollTo({left: nearest.offsetLeft - first, behavior: animated ? 'smooth' : 'instant'});
    });
    // Letting go after a drag should not open the slide underneath.
    track.addEventListener('click', event => {
      if (!dragged) return;
      event.preventDefault();
      event.stopPropagation();
      dragged = false;
    }, true);
  });

  place();
  return {place};
})();
