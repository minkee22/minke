// Keep reading and keyboard navigation in the same order as the mobile layout.
(() => {
  const mobile = matchMedia('(max-width: 640px)');
  const artwork = document.getElementById('artwork');
  const collections = document.getElementById('collections');

  function arrange() {
    if (mobile.matches) collections.before(artwork);
    else artwork.before(collections);
  }

  arrange();
  mobile.addEventListener('change', arrange);
})();
