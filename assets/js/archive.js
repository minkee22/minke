// Renders ARTWORK and COLLECTIONS from archive-data.js. The address hash selects a section.
(() => {
  const kind = document.body.dataset.archive;
  const sections = ARCHIVE[kind];
  const baseTitle = () => I18N.t(`page.${kind}.title`);
  const copy = (section, field) => I18N.t(`section.${section.id}.${field}`);
  const tabs = document.querySelector('#archive-tabs');
  const view = document.querySelector('#archive-view');

  const escapeHtml = value => String(value).replace(/[&<>"']/g, mark => (
    {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[mark]));
  const imagePath = (section, file) => `assets/archive/${section.id}/${file}.webp`;
  const thumbPath = (section, file) => `assets/archive/${section.id}/t/${file}.webp`;

  function renderTabs() {
    tabs.innerHTML = [`<a href="#" data-tab="">${escapeHtml(I18N.t('archive.all'))}</a>`, ...sections.map(section => (
      `<a href="#${section.id}" data-tab="${section.id}">${escapeHtml(copy(section, 'label'))}<sup>${section.count}</sup></a>`
    ))].join('') + '<i class="tabs-ink" aria-hidden="true"></i>';
  }

  // The marker slides between tabs, and stays still on the first paint.
  function moveInk(animate) {
    const ink = tabs.querySelector('.tabs-ink');
    const active = tabs.querySelector('[aria-current]');
    if (!ink || !active) return;
    ink.style.transition = animate ? '' : 'none';
    ink.style.left = active.offsetLeft + 'px';
    ink.style.width = active.offsetWidth + 'px';
  }

  function coverCard(section) {
    const cover = {outer: 'outer/001.webp', sketch: 'covers/sketch-jacket.jpg'}[section.id] || `covers/${section.id}.webp`;
    const image = `<img src="assets/archive/${cover}" alt="" width="1200" height="676" loading="lazy" decoding="async">`;
    return `<a class="cover-card" href="#${section.id}">
      <span class="cover-paper">${section.id === 'outer' ? `<span class="outer-cover">${image}</span>` : image}</span>
      <span class="cover-title">${escapeHtml(copy(section, 'title'))}</span>
      <span class="cover-count">${escapeHtml(I18N.count(section.count))}</span>
      ${kind === 'collections' ? `<span class="cover-summary">${escapeHtml(copy(section, 'summary'))}</span>` : ''}
    </a>`;
  }

  function sheetHtml(section, sheet, start) {
    const captions = [...new Set(sheet.map(image => I18N.caption(image[3])).filter(Boolean))];
    const photos = sheet.map(([file, width, height], i) => {
      const number = start + i;
      const shape = (width / height).toFixed(3);
      return `<a class="sheet-photo" href="${imagePath(section, file)}" data-index="${number}" style="--shape:${shape}">
        <img src="${thumbPath(section, file)}" alt="${escapeHtml(copy(section, 'title'))} ${number + 1}" width="${width}" height="${height}" loading="lazy" decoding="async">
      </a>`;
    }).join('');
    return `<figure class="sheet">
      <div class="sheet-paper">
        <div class="sheet-photos">${photos}</div>
        ${captions.length ? `<figcaption>${escapeHtml(captions.join(', '))}</figcaption>` : ''}
      </div>
    </figure>`;
  }

  function neighbourLinks(position) {
    const before = sections[position - 1];
    const after = sections[position + 1];
    return `<nav class="archive-pager" aria-label="${escapeHtml(I18N.t('archive.pager'))}">
      ${before ? `<a href="#${before.id}">← ${escapeHtml(copy(before, 'label'))}</a>` : `<a href="#">← ${escapeHtml(I18N.t('archive.all'))}</a>`}
      ${after ? `<a href="#${after.id}">${escapeHtml(copy(after, 'label'))} →</a>` : `<a href="#">${escapeHtml(I18N.t('archive.all'))} →</a>`}
    </nav>`;
  }

  function renderOverview() {
    document.title = baseTitle();
    view.innerHTML = `<div class="cover-grid">${sections.map(coverCard).join('')}</div>`;
  }

  function renderSection(section) {
    const position = sections.indexOf(section);
    const title = copy(section, 'title');
    document.title = `${title} | ${baseTitle()}`;
    let count = 0;
    const sheets = section.sheets.map(sheet => {
      const html = sheetHtml(section, sheet, count);
      count += sheet.length;
      return html;
    }).join('');
    const story = kind === 'collections' && I18N_STRINGS[`section.${section.id}.story`]
      ? `<div class="archive-story"><h3>${escapeHtml(copy(section, 'storyTitle'))}</h3>${copy(section, 'story').map(line => `<p>${escapeHtml(line)}</p>`).join('')}</div>`
      : '';
    const head = `<div class="section-head"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(copy(section, 'note'))}</p></div>`;
    view.innerHTML = `${head}${story}<div class="sheets sheets-${section.layout || 'looks'}">${sheets}</div>${neighbourLinks(position)}`;
    const images = section.sheets.flat().map(([file, width, height, caption], i) => ({
      src: imagePath(section, file),
      ratio: width / height,
      alt: `${title} ${i + 1}`,
      title,
      desc: I18N.caption(caption) || '',
      hint: I18N.t('viewer.hintPhoto'),
    }));
    view.onclick = event => {
      const link = event.target.closest('.sheet-photo');
      if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      PageViewer.open(images, Number(link.dataset.index), last => {
        const target = view.querySelector(`[data-index="${last}"]`);
        target.scrollIntoView({block: 'nearest'});
        target.focus({preventScroll: true});
      }, link.querySelector('img'));
    };
  }

  // A language switch redraws in place, so nothing animates back in.
  let quiet = false;
  let firstPaint = true;

  function render() {
    const id = decodeURIComponent(location.hash.slice(1));
    const section = sections.find(item => item.id === id);
    view.onclick = null;
    if (section) renderSection(section);
    else renderOverview();
    tabs.querySelectorAll('a').forEach(tab => {
      const active = tab.dataset.tab === (section ? section.id : '');
      if (active) {
        tab.setAttribute('aria-current', 'true');
        revealTab(tab);
      } else {
        tab.removeAttribute('aria-current');
      }
    });
    moveInk(!quiet && !firstPaint);
    firstPaint = false;
    if (typeof Motion !== 'undefined') Motion.place(view, {instant: quiet});
  }

  // Scrolls the tab strip only as far as needed, and never moves the page.
  function revealTab(tab) {
    const strip = tabs.getBoundingClientRect();
    const box = tab.getBoundingClientRect();
    const edge = 20;
    if (box.left < strip.left + edge) tabs.scrollLeft -= strip.left + edge - box.left;
    else if (box.right > strip.right - edge) tabs.scrollLeft += box.right - strip.right + edge;
  }

  // The tabs keep their place: a section opens with the tabs where they already are.
  function holdTabs(previousScroll) {
    const stuckAt = tabs.parentElement.querySelector('.page-head').getBoundingClientRect().bottom
      + window.scrollY - parseFloat(getComputedStyle(tabs).top)
      + parseFloat(getComputedStyle(tabs.parentElement.querySelector('.page-head')).marginBottom);
    window.scrollTo({top: Math.min(previousScroll, stuckAt), behavior: 'instant'});
  }

  function openSection(id) {
    const scroll = window.scrollY;
    history.pushState(null, '', location.pathname + location.search + (id ? '#' + id : ''));
    render();
    holdTabs(scroll);
  }

  [tabs, view].forEach(area => area.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    event.preventDefault();
    openSection(link.getAttribute('href').slice(1));
  }));

  // The language toggle redraws the current section in place.
  document.addEventListener('languagechange', () => {
    const scroll = window.scrollY;
    quiet = true;
    renderTabs();
    render();
    quiet = false;
    holdTabs(scroll);
  });
  window.addEventListener('resize', () => moveInk(false));

  // Browser back and forward between sections.
  window.addEventListener('hashchange', () => {
    const scroll = window.scrollY;
    render();
    holdTabs(scroll);
  });
  renderTabs();
  render();
  document.fonts?.ready.then(() => moveInk(false));
})();
