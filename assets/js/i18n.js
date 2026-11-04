// Language switch. Text lives in assets/data/i18n-data.js, one [Korean, English] pair per key.
// A visitor's choice is remembered, and ?lang=en or ?lang=ko opens a page in that language.
const I18N = (() => {
  const STORAGE_KEY = 'language';
  const LANGUAGES = ['ko', 'en'];

  const stored = () => {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  };
  const browserLanguage = () => ((navigator.language || 'ko').toLowerCase().startsWith('ko') ? 'ko' : 'en');
  const requested = new URLSearchParams(location.search).get('lang');

  let language = [requested, stored(), browserLanguage()].find(value => LANGUAGES.includes(value));

  const t = key => {
    const pair = I18N_STRINGS[key];
    return pair ? pair[LANGUAGES.indexOf(language)] : key;
  };

  const count = number => t('count.images').replace('{n}', number);

  function caption(text) {
    if (language === 'ko' || !text) return text;
    return Object.entries(I18N_GARMENTS).reduce((result, [ko, en]) => result.replace(ko, en), text);
  }

  function apply(root = document) {
    document.documentElement.lang = language;
    root.querySelectorAll('[data-i18n]').forEach(element => {
      element.textContent = t(element.dataset.i18n);
    });
    root.querySelectorAll('[data-i18n-attr]').forEach(element => {
      element.dataset.i18nAttr.split(';').forEach(pair => {
        const [attribute, key] = pair.split(':');
        element.setAttribute(attribute, t(key));
      });
    });
    root.querySelectorAll('[data-i18n-count]').forEach(element => {
      element.textContent = count(element.dataset.i18nCount);
    });
    const pageTitle = document.documentElement.dataset.i18nTitle;
    if (root === document && pageTitle) document.title = t(pageTitle);
  }

  function setLanguage(next) {
    language = next;
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* Private browsing can block storage. */ }
    apply();
    document.dispatchEvent(new CustomEvent('languagechange'));
  }

  apply();
  document.querySelectorAll('.lang-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => setLanguage(language === 'ko' ? 'en' : 'ko'));
  });

  return {t, count, caption, apply, get language() { return language; }};
})();
