// Shared image viewer: opens fitted to the screen, then zooms by pinch, double tap, click or button.
const PageViewer = (() => {
  const MAX_SCALE = 5;
  const pad = number => String(number).padStart(2, '0');

  const viewer = document.createElement('dialog');
  viewer.id = 'page-viewer';
  viewer.tabIndex = -1;
  viewer.setAttribute('aria-labelledby', 'page-viewer-title');
  viewer.innerHTML = `
    <div class="viewer-bar">
      <span class="viewer-count" id="page-viewer-count"></span>
      <span id="page-viewer-title"></span>
      <div class="viewer-actions">
        <button type="button" id="page-fit" aria-pressed="false" data-i18n="viewer.zoom"></button>
        <button type="button" id="page-close" data-i18n="viewer.close"></button>
      </div>
    </div>
    <div class="page-viewer-canvas"><img id="page-viewer-image" alt=""></div>
    <div class="viewer-foot">
      <button type="button" id="page-prev" data-i18n-attr="aria-label:viewer.prev">←</button>
      <div class="viewer-text">
        <p id="page-viewer-desc"></p>
        <p class="viewer-hint" id="page-viewer-hint"></p>
      </div>
      <button type="button" id="page-next" data-i18n-attr="aria-label:viewer.next">→</button>
    </div>`;
  document.body.append(viewer);
  I18N.apply(viewer);

  const canvas = viewer.querySelector('.page-viewer-canvas');
  const image = viewer.querySelector('#page-viewer-image');
  const fitButton = viewer.querySelector('#page-fit');
  const prevButton = viewer.querySelector('#page-prev');
  const nextButton = viewer.querySelector('#page-next');
  const titleText = viewer.querySelector('#page-viewer-title');
  const countText = viewer.querySelector('#page-viewer-count');
  const descText = viewer.querySelector('#page-viewer-desc');
  const hintText = viewer.querySelector('#page-viewer-hint');

  let items = [];
  let index = 0;
  let ratio = 1;
  let scale = 1;
  let onClose = null;
  let pinch = null;
  let touch = null;
  let lastTap = 0;
  let lastTouchAt = -1000;

  const fitWidth = () => Math.min(canvas.clientWidth, canvas.clientHeight * ratio);

  // Keeps the point under the fingers or cursor in place while the image grows.
  function applyScale(next, originX = canvas.clientWidth / 2, originY = canvas.clientHeight / 2) {
    const box = canvas.getBoundingClientRect();
    const before = image.getBoundingClientRect();
    const pointX = before.width ? (box.left + originX - before.left) / before.width : .5;
    const pointY = before.height ? (box.top + originY - before.top) / before.height : .5;
    scale = Math.min(MAX_SCALE, Math.max(1, next));
    const width = fitWidth() * scale;
    image.style.width = width + 'px';
    canvas.scrollLeft = pointX * width - originX;
    canvas.scrollTop = pointY * (width / ratio) - originY;
    const zoomed = scale > 1.01;
    canvas.classList.toggle('is-zoomed', zoomed);
    if (zoomed) viewer.classList.add('has-zoomed');
    fitButton.textContent = I18N.t(zoomed ? 'viewer.fit' : 'viewer.zoom');
    fitButton.setAttribute('aria-pressed', String(zoomed));
  }

  function toggleZoom(originX, originY) {
    const reading = Math.max(1.6, Math.min(1100 / fitWidth(), 3));
    applyScale(scale > 1.01 ? 1 : reading, originX, originY);
  }

  function show(nextIndex) {
    index = nextIndex;
    const item = items[index];
    ratio = item.ratio;
    image.src = item.src;
    image.alt = item.alt;
    image.style.aspectRatio = String(ratio);
    titleText.textContent = item.title;
    countText.textContent = pad(index + 1) + ' / ' + pad(items.length);
    descText.textContent = item.desc || '';
    hintText.textContent = item.hint || '';
    prevButton.disabled = index === 0;
    nextButton.disabled = index === items.length - 1;
    applyScale(1);
    canvas.scrollTo(0, 0);
    [index - 1, index + 1].forEach(neighbour => {
      if (items[neighbour]) new Image().src = items[neighbour].src;
    });
  }

  const step = direction => {
    const target = index + direction;
    if (items[target]) show(target);
  };

  // The image grows out of the thumbnail that was pressed.
  function growFrom(origin) {
    if (!origin || !image.animate || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const end = image.getBoundingClientRect();
    if (!end.width) return;
    const start = origin.getBoundingClientRect();
    image.animate([
      {transformOrigin: '0 0', transform: `translate(${start.left - end.left}px, ${start.top - end.top}px) scale(${start.width / end.width})`},
      {transformOrigin: '0 0', transform: 'none'},
    ], {duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)'});
  }

  function dismiss() {
    if (!viewer.open) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      viewer.close();
      return;
    }
    viewer.classList.add('is-closing');
    setTimeout(() => {
      viewer.classList.remove('is-closing');
      viewer.close();
    }, 150);
  }

  function open(nextItems, startIndex, closed, origin) {
    items = nextItems;
    onClose = closed;
    viewer.showModal();
    viewer.focus();
    document.body.classList.add('viewer-open');
    show(startIndex);
    growFrom(origin);
    // The phone back button should close the viewer, not leave the page.
    history.pushState({viewer: true}, '');
  }

  fitButton.addEventListener('click', () => toggleZoom());
  prevButton.addEventListener('click', () => step(-1));
  nextButton.addEventListener('click', () => step(1));
  viewer.querySelector('#page-close').addEventListener('click', dismiss);
  viewer.addEventListener('cancel', event => {
    event.preventDefault();
    dismiss();
  });
  window.addEventListener('popstate', () => { if (viewer.open) viewer.close(); });

  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') step(-1);
    if (event.key === 'ArrowRight') step(1);
  });

  viewer.addEventListener('close', () => {
    document.body.classList.remove('viewer-open');
    if (history.state?.viewer) history.back();
    onClose?.(index);
  });

  image.addEventListener('click', event => {
    if (event.timeStamp - lastTouchAt < 700) return;
    const box = canvas.getBoundingClientRect();
    toggleZoom(event.clientX - box.left, event.clientY - box.top);
  });

  canvas.addEventListener('wheel', event => {
    if (!event.ctrlKey) return;
    event.preventDefault();
    const box = canvas.getBoundingClientRect();
    applyScale(scale * Math.exp(-event.deltaY / 200), event.clientX - box.left, event.clientY - box.top);
  }, {passive: false});

  const fingerGap = touches => Math.hypot(
    touches[0].clientX - touches[1].clientX,
    touches[0].clientY - touches[1].clientY);

  canvas.addEventListener('touchstart', event => {
    lastTouchAt = event.timeStamp;
    if (event.touches.length === 2) {
      const box = canvas.getBoundingClientRect();
      touch = null;
      pinch = {
        gap: fingerGap(event.touches),
        scale,
        x: (event.touches[0].clientX + event.touches[1].clientX) / 2 - box.left,
        y: (event.touches[0].clientY + event.touches[1].clientY) / 2 - box.top,
      };
    } else if (event.touches.length === 1 && !pinch) {
      touch = {x: event.touches[0].clientX, y: event.touches[0].clientY};
    }
  }, {passive: true});

  canvas.addEventListener('touchmove', event => {
    if (!pinch || event.touches.length !== 2) return;
    event.preventDefault();
    applyScale(pinch.scale * fingerGap(event.touches) / pinch.gap, pinch.x, pinch.y);
  }, {passive: false});

  canvas.addEventListener('touchend', event => {
    lastTouchAt = event.timeStamp;
    if (pinch) {
      if (event.touches.length === 0) pinch = null;
      return;
    }
    if (!touch) return;
    const finger = event.changedTouches[0];
    const moveX = finger.clientX - touch.x;
    const moveY = finger.clientY - touch.y;
    touch = null;
    if (Math.abs(moveX) < 10 && Math.abs(moveY) < 10) {
      if (event.timeStamp - lastTap < 320) {
        const box = canvas.getBoundingClientRect();
        toggleZoom(finger.clientX - box.left, finger.clientY - box.top);
        lastTap = 0;
      } else {
        lastTap = event.timeStamp;
      }
    } else if (scale <= 1.01 && Math.abs(moveX) > 48 && Math.abs(moveX) > Math.abs(moveY) * 1.5) {
      step(moveX < 0 ? 1 : -1);
    }
  });

  // Rotating the phone changes the fitted size, so the image is measured again.
  window.addEventListener('resize', () => { if (viewer.open) applyScale(scale); });

  return {open};
})();

// Homepage slides open in the viewer as one sequence, in the current language.
const slideRow = document.querySelector('.slide-portfolio');
if (slideRow) {
  const cards = [...slideRow.querySelectorAll('.folio-card')];
  const slideId = card => card.querySelector('.folio-paper').id.replace('page-', '');
  const slideFile = (id, size = '') => `assets/slides/folio-${id}-page${size}${I18N.language === 'en' ? '-en' : ''}.webp`;

  const showSlides = () => cards.forEach(card => {
    const id = slideId(card);
    const image = card.querySelector('.page-thumbnail');
    image.srcset = `${slideFile(id, '-1200')} 1200w, ${slideFile(id)} 2508w`;
    image.src = slideFile(id, '-1200');
    card.querySelectorAll('a').forEach(link => link.setAttribute('href', slideFile(id)));
  });

  const slideItems = () => cards.map(card => {
    const id = slideId(card);
    return {
      src: slideFile(id),
      ratio: 2508 / 1412,
      alt: I18N.t(`work.${id}.alt`),
      title: I18N.t(`work.${id}.title`),
      desc: I18N.t(`work.${id}.desc`),
      hint: I18N.t('viewer.hintSlide'),
    };
  });

  slideRow.addEventListener('click', event => {
    const link = event.target.closest('.folio-card a');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    PageViewer.open(slideItems(), cards.indexOf(link.closest('.folio-card')), last => {
      slideRow.dispatchEvent(new CustomEvent('reveal', {detail: last}));
      cards[last].querySelector('.folio-paper').focus({preventScroll: true});
    }, link.closest('.folio-card').querySelector('.page-thumbnail'));
  });

  document.addEventListener('languagechange', showSlides);
  showSlides();
}

// Each portfolio row scrolls independently; native touch and trackpad scrolling stay intact.
document.querySelectorAll('.horizontal-portfolio').forEach(section => {
  const pad = number => String(number).padStart(2, '0');
  const track = section.querySelector('.folio-track');
  const cards = [...track.querySelectorAll('.folio-card')];
  const previous = section.querySelector('[data-direction="-1"]');
  const next = section.querySelector('[data-direction="1"]');
  const counter = section.querySelector('.folio-count');
  const fill = section.querySelector('.folio-progress span');
  const leftOf = card => card.offsetLeft - cards[0].offsetLeft;
  const current = () => {
    const distance = card => Math.abs(leftOf(card) - track.scrollLeft);
    return cards.reduce((best, card, i) => distance(card) < distance(cards[best]) ? i : best, 0);
  };
  const update = () => {
    const room = track.scrollWidth - track.clientWidth;
    section.classList.toggle('is-static', room <= 2);
    counter.textContent = pad(current() + 1) + ' / ' + pad(cards.length);
    previous.disabled = track.scrollLeft < 2;
    next.disabled = track.scrollLeft >= room - 2;
    const first = 1 / cards.length;
    fill.style.width = (first + (1 - first) * (room > 0 ? track.scrollLeft / room : 0)) * 100 + '%';
  };
  const motion = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
  const move = direction => {
    const target = Math.max(0, Math.min(cards.length - 1, current() + direction));
    track.scrollTo({left: leftOf(cards[target]), behavior: motion()});
  };
  let queued = false;
  const queueUpdate = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; update(); });
  };
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('keydown', event => {
    if (event.target === track && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  // After the viewer closes, the row shows the slide the visitor stopped on.
  section.addEventListener('reveal', event => {
    track.scrollTo({left: leftOf(cards[event.detail]), behavior: 'instant'});
  });
  track.addEventListener('scroll', queueUpdate, {passive: true});
  window.addEventListener('resize', queueUpdate);
  update();
});
