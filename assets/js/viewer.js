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
        <button type="button" id="page-fit" aria-pressed="false">확대 +</button>
        <button type="button" id="page-close">닫기 ×</button>
      </div>
    </div>
    <div class="page-viewer-canvas"><img id="page-viewer-image" alt=""></div>
    <div class="viewer-foot">
      <button type="button" id="page-prev" aria-label="이전 이미지">←</button>
      <div class="viewer-text">
        <p id="page-viewer-desc"></p>
        <p class="viewer-hint" id="page-viewer-hint"></p>
      </div>
      <button type="button" id="page-next" aria-label="다음 이미지">→</button>
    </div>`;
  document.body.append(viewer);

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
    fitButton.textContent = zoomed ? '화면에 맞춤' : '확대 +';
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

  function open(nextItems, startIndex, closed) {
    items = nextItems;
    onClose = closed;
    viewer.showModal();
    viewer.focus();
    document.body.classList.add('viewer-open');
    show(startIndex);
    // The phone back button should close the viewer, not leave the page.
    history.pushState({viewer: true}, '');
  }

  fitButton.addEventListener('click', () => toggleZoom());
  prevButton.addEventListener('click', () => step(-1));
  nextButton.addEventListener('click', () => step(1));
  viewer.querySelector('#page-close').addEventListener('click', () => viewer.close());
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

// Homepage slides open in the viewer as one sequence.
const slideRow = document.querySelector('.slide-portfolio');
if (slideRow) {
  const pages = [...slideRow.querySelectorAll('.folio-paper')];
  const slides = pages.map(link => ({
    src: link.getAttribute('href'),
    ratio: 2508 / 1412,
    alt: link.dataset.title + ' 슬라이드',
    title: link.dataset.title,
    desc: link.closest('.folio-card').querySelector('.folio-caption p').textContent,
    hint: '두 손가락으로 벌리거나 두 번 탭하면 확대됩니다. 가로로 돌리면 더 크게 보입니다.',
  }));
  slideRow.addEventListener('click', event => {
    const link = event.target.closest('a[href$="-page.webp"]');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const start = pages.findIndex(page => page.getAttribute('href') === link.getAttribute('href'));
    PageViewer.open(slides, start, last => {
      slideRow.dispatchEvent(new CustomEvent('reveal', {detail: last}));
      pages[last].focus({preventScroll: true});
    });
  });
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
