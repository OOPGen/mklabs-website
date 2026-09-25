/**
 * srcset strings for the pictures that have smaller copies in /public, so a
 * phone downloads a phone-sized file. Regenerate the copies (same names, same
 * widths) whenever an original is replaced.
 */

/* the client photographs: 1408px originals, plus 640px and 960px copies */
export const photoSrcSet = (src) =>
  src.replace(/\.webp$/, (ext) => `-640${ext} 640w, ${src.replace(ext, `-960${ext}`)} 960w, ${src} 1408w`)

/* product and service logos: 208px, plus a 104px copy for the small tiles */
export const logoSrcSet = (src) =>
  /^\/logo-[a-z]+\.webp$/.test(src) ? src.replace(/\.webp$/, '-104.webp 104w, ') + `${src} 208w` : undefined
