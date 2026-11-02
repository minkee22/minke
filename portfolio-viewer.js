const viewer = document.querySelector('#page-viewer');
const canvas = viewer.querySelector('.page-viewer-canvas');
const image = document.querySelector('#page-viewer-image');
const fitButton = document.querySelector('#page-fit');
let opener;
function setZoom(zoomed) {
  canvas.classList.toggle('is-zoomed', zoomed);
  fitButton.textContent = zoomed ? '화면에 맞춤' : '확대 +';
  fitButton.setAttribute('aria-pressed', String(zoomed));
  canvas.scrollTo(0, 0);
}
document.querySelector('.slide-portfolio').addEventListener('click', event => {
  const link = event.target.closest('a[href$="-page.webp"]');
  if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  opener = link;
  image.src = link.getAttribute('href');
  image.alt = link.dataset.title + ' 전체 PPT 페이지';
  document.querySelector('#page-viewer-title').textContent = link.dataset.title;
  setZoom(true);
  viewer.showModal();
  document.body.classList.add('viewer-open');
});
fitButton.addEventListener('click', () => setZoom(!canvas.classList.contains('is-zoomed')));
image.addEventListener('click', () => setZoom(!canvas.classList.contains('is-zoomed')));
document.querySelector('#page-close').addEventListener('click', () => viewer.close());
viewer.addEventListener('close', () => {
  document.body.classList.remove('viewer-open');
  opener?.focus({preventScroll:true});
});

// Each portfolio row scrolls independently; native touch/trackpad scrolling stays intact.
document.querySelectorAll('.horizontal-portfolio').forEach(section => {
  const track = section.querySelector('.folio-track');
  const cards = [...track.querySelectorAll('.folio-card')];
  const previous = section.querySelector('[data-direction="-1"]');
  const next = section.querySelector('[data-direction="1"]');
  const counter = section.querySelector('.folio-count');
  const current = () => cards.reduce((best, card, i) =>
    Math.abs(card.offsetLeft - cards[0].offsetLeft - track.scrollLeft) <
    Math.abs(cards[best].offsetLeft - cards[0].offsetLeft - track.scrollLeft) ? i : best, 0);
  const update = () => {
    const index = current();
    counter.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(cards.length).padStart(2, '0');
    previous.disabled = track.scrollLeft < 2;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
  };
  const move = direction => {
    const index = Math.max(0, Math.min(cards.length - 1, current() + direction));
    track.scrollTo({left: cards[index].offsetLeft - cards[0].offsetLeft,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  };
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('keydown', event => {
    if (event.target === track && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  track.addEventListener('scroll', update, {passive: true});
  window.addEventListener('resize', update);
  update();
});
