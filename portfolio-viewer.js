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
