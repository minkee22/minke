// Discourage casual saving. Public images remain accessible through their URLs.
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('dragstart', event => {
  if (event.target.closest('img, .hero-sheet, .cover-card, .sheet-photo')) event.preventDefault();
});
