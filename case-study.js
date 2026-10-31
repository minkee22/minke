const requested = new URLSearchParams(location.search).get('id');
const current = portfolio.findIndex(item => item.id === requested);
const item = portfolio[current];
const main = document.querySelector('#case');
if (!item) {
  main.innerHTML = '<h1>프로젝트를 찾을 수 없습니다.</h1><a href="index.html#work">전체 작업 보기 ↗</a>';
} else {
  document.title = `${item.title} — KYUNGEUN MIN`;
  const previous = portfolio[current - 1], next = portfolio[current + 1];
  main.innerHTML = `
    <section class="case-heading"><div><p class="case-index">SELECTED WORK / ${item.id} — 07</p><h1>${item.title}</h1></div><div class="case-description"><h2>${item.ko}</h2><p>${item.desc}</p></div></section>
    <section class="case-role"><h2>ROLE & PROCESS</h2><div><p>${item.role}</p>${item.note ? `<p class="note">${item.note}</p>` : ''}</div></section>
    <section class="project-gallery count-${item.images.length}" aria-label="프로젝트 이미지">${item.images.map((pic,index)=>`<figure><button class="artwork" type="button" data-image="${pic.src}" data-label="${pic.alt}" aria-label="${pic.alt} 확대 보기"><img src="${pic.src}" alt="${pic.alt}" ${index>1?'loading="lazy"':''}></button><figcaption>${String(index+1).padStart(2,'0')} / ${pic.alt}<span>이미지 확대 ↗</span></figcaption></figure>`).join('')}</section>
    <details class="original"><summary>PDF 원본 페이지 보기 ↗</summary><button class="artwork" type="button" data-image="folio-${item.id}-page.webp" data-label="${item.ko} — PDF 원본 페이지" aria-label="PDF 원본 페이지 확대"><img src="folio-${item.id}-page.webp" alt="${item.ko} — PDF 원본 페이지" loading="lazy"></button></details>
    <nav class="case-pagination" aria-label="프로젝트 이동">${previous?`<a href="case-study.html?id=${previous.id}">← ${previous.title}</a>`:'<a href="index.html#work">← 전체 작업</a>'}${next?`<a href="case-study.html?id=${next.id}">${next.title} →</a>`:'<a href="index.html#archive">전체 작업 →</a>'}</nav>`;
}
const dialog = document.querySelector('dialog');
let opener;
main.addEventListener('click', event => {
  const button = event.target.closest('[data-image]');
  if (!button) return;
  opener = button;
  const image = document.querySelector('#enlarged');
  image.src = button.dataset.image;
  image.alt = button.dataset.label;
  document.querySelector('#viewer-label').textContent = button.dataset.label;
  dialog.showModal();
  document.querySelector('.viewer-image').scrollTo(0,0);
  document.body.classList.add('viewer-open');
});
document.querySelector('#close-viewer').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.body.classList.remove('viewer-open');opener?.focus();});
