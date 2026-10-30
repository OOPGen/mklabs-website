/**
 * A Material-style ripple on every button on the site, in one place.
 *
 * Rather than touch every component, one click listener on the document finds
 * the button that was pressed and drops a circle into it at the point of the
 * click (the middle, for Enter/Space). The circle grows from scale(0) to
 * scale(4) while it fades out, and is removed when the animation ends.
 *   - Most of the site's buttons are links drawn by components/Button.jsx
 *     (inline-flex, rounded-full pills), so those count as buttons too.
 *   - The button only gets position: relative if it was static, and
 *     overflow: hidden only while a ripple is running — both are put back
 *     exactly as they were afterwards.
 *   - The ripple never takes clicks, is hidden from screen readers, and uses
 *     the button's own text colour, so it shows on light and dark buttons.
 *   - Disabled buttons, anything marked data-no-ripple and visitors asking for
 *     reduced motion get no ripple.
 * It only adds the effect; it never changes what a button does.
 */

const BUTTON = 'button, .btn, [role="button"], a.inline-flex.rounded-full'
const CLASS = 'mk-ripple'
const DURATION = 550

const active = new WeakMap()

function injectStyle() {
  if (document.getElementById(`${CLASS}-style`)) return
  const style = document.createElement('style')
  style.id = `${CLASS}-style`
  style.textContent = `
.${CLASS} {
  position: absolute; border-radius: 50%; pointer-events: none;
  background: currentColor; opacity: .45; transform: scale(0);
  animation: ${CLASS} ${DURATION}ms cubic-bezier(.4,0,.2,1) forwards;
}
@keyframes ${CLASS} { to { transform: scale(4); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .${CLASS} { display: none; } }`
  document.head.appendChild(style)
}

function hold(button) {
  const saved = active.get(button)
  if (saved) {
    saved.count++
    return
  }
  active.set(button, { count: 1, position: button.style.position, overflow: button.style.overflow })
  if (getComputedStyle(button).position === 'static') button.style.position = 'relative'
  button.style.overflow = 'hidden'
}

function release(button) {
  const saved = active.get(button)
  if (!saved || --saved.count > 0) return
  active.delete(button)
  button.style.position = saved.position
  button.style.overflow = saved.overflow
}

function onClick(e) {
  const button = e.target?.closest?.(BUTTON)
  if (!button || button.matches(':disabled, [aria-disabled="true"], [data-no-ripple]')) return
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

  const rect = button.getBoundingClientRect()
  if (!rect.width || !rect.height) return
  // A keyboard press (Enter/Space) arrives as a click with detail 0 and no real pointer position: start in the middle.
  const fromPointer = e.detail > 0
  // Page coordinates made relative to the button's padding box (an absolutely positioned child starts inside the border).
  const x = (fromPointer ? e.pageX - (rect.left + window.scrollX) : rect.width / 2) - button.clientLeft
  const y = (fromPointer ? e.pageY - (rect.top + window.scrollY) : rect.height / 2) - button.clientTop
  // scale(4) of this size covers the whole button from any starting point.
  const size = Math.max(rect.width, rect.height) / 2

  const ripple = document.createElement('span')
  ripple.className = CLASS
  ripple.setAttribute('aria-hidden', 'true')
  Object.assign(ripple.style, {
    width: `${size}px`,
    height: `${size}px`,
    left: `${x - size / 2}px`,
    top: `${y - size / 2}px`,
  })

  hold(button)
  button.appendChild(ripple)
  let done = false
  const cleanup = () => {
    if (done) return
    done = true
    ripple.remove()
    release(button)
  }
  ripple.addEventListener('animationend', cleanup, { once: true })
  // Backstop: animationend never fires if the animation is cancelled (the button hidden, the styles not applied).
  setTimeout(cleanup, DURATION + 100)
}

let installed = false

/** Turn on the ripple for every button. Safe to call more than once. */
export function installRipple() {
  if (installed || typeof document === 'undefined') return
  installed = true
  injectStyle()
  document.addEventListener('click', onClick, { capture: true, passive: true })
}
