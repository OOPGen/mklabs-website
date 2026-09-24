/*
 * Applies the saved or system theme before the page paints, so dark-mode
 * visitors never see a white flash. Loaded as a blocking <script> in <head>;
 * kept as a file rather than inline so the Content-Security-Policy can forbid
 * inline scripts. Must stay tiny and must never throw.
 */
(function () {
  var saved = null
  try {
    saved = localStorage.getItem('mklabs-theme')
  } catch (error) {
    /* storage blocked — fall back to the system setting */
  }
  var dark =
    saved === 'dark' ||
    (saved !== 'light' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
  if (dark) document.documentElement.classList.add('dark')
})()
