/**
 * Renders a brand poster inside a fixed tile.
 *
 * The source files in /public are portrait posters (roughly 364×440) with an
 * opaque background baked in — white for the product logos, night navy for the
 * MKLabs one. Two consequences this component handles:
 *
 *   1. An <img> placed directly in a `flex-col` parent gets stretched by
 *      `align-items: stretch`, which silently defeats `w-auto`. The tile is
 *      `shrink-0` with a fixed width, so that can't happen.
 *   2. The opaque background needs something to sit on, or it reads as a stray
 *      white rectangle on a dark card. `tone` matches the tile to the artwork —
 *      except `bare`, for the MKLabs logo, which is already a finished tile.
 */

import { logoSrcSet } from './responsive.js'

const sizes = {
  xs: 'h-9 w-9 rounded-lg p-1',
  sm: 'h-11 w-11 rounded-xl p-1',
  md: 'h-16 w-16 rounded-xl p-1.5',
  lg: 'h-24 w-20 rounded-2xl p-2',
}

/* the picture's width inside each tile, for choosing a file from the srcset */
const renderedWidth = { xs: '28px', sm: '36px', md: '52px', lg: '64px' }

const tones = {
  light: 'bg-white ring-1 ring-night/10',
  dark: 'bg-ink ring-1 ring-white/15',
  // the MKLabs logo is its own rounded tile — no backing, no padding
  bare: '!p-0 !rounded-[22%]',
}

/** `loading="eager"` for a logo that is on screen as the page opens. */
export default function Logo({ src, alt = '', size = 'sm', tone = 'light', className = '', loading = 'lazy' }) {
  return (
    <span className={`grid shrink-0 place-items-center overflow-hidden ${sizes[size]} ${tones[tone]} ${className}`}>
      <img
        src={src}
        srcSet={logoSrcSet(src)}
        sizes={logoSrcSet(src) && renderedWidth[size]}
        alt={alt}
        loading={loading}
        decoding="async"
        className="h-full w-full object-contain"
      />
    </span>
  )
}
