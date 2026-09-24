/**
 * The logo's light, spilled onto a dark section: cyan rising from the bottom
 * left, magenta from the top right — the same sweep as the logo's border —
 * with faint lines at the angle of its strokes.
 *
 * Decorative only. Under Reduce Motion the glows stop drifting but stay put,
 * so the section still looks finished.
 */
export default function BrandGlow({ slant = true, strength = 'normal' }) {
  const strong = strength === 'strong'

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className={`orb-a absolute -bottom-[30%] -left-[15%] h-[min(720px,110vw)] w-[min(720px,110vw)] rounded-full blur-3xl ${
          strong
            ? 'bg-[radial-gradient(circle,rgba(18,161,255,0.34),transparent_68%)]'
            : 'bg-[radial-gradient(circle,rgba(18,161,255,0.22),transparent_68%)]'
        }`}
      />
      <div
        className={`orb-b absolute -right-[12%] -top-[35%] h-[min(760px,115vw)] w-[min(760px,115vw)] rounded-full blur-3xl ${
          strong
            ? 'bg-[radial-gradient(circle,rgba(204,97,252,0.32),transparent_68%)]'
            : 'bg-[radial-gradient(circle,rgba(204,97,252,0.2),transparent_68%)]'
        }`}
      />
      <div className="absolute left-1/2 top-1/2 h-[min(520px,90vw)] w-[min(520px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(116,67,247,0.14),transparent_70%)] blur-3xl" />
      {slant && <div className="logo-slant absolute inset-0" />}
    </div>
  )
}
