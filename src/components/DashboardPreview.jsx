/**
 * A styled preview of a product's dashboard, built from the numbers in
 * products.js. This is what lets a customer picture the software before
 * they ever book a demo.
 */
import Logo from './Logo.jsx'

export default function DashboardPreview({ dashboard, logo }) {
  if (!dashboard) return null

  // sets its own text colour: it sits on dark heroes, whose pale text it would otherwise inherit
  return (
    <div className="overflow-hidden rounded-2xl border border-night/10 bg-white text-night shadow-2xl shadow-night/10 dark:border-white/10 dark:bg-ink-2 dark:text-lavender">
      {/* window bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-night/10 bg-lavender/40 px-4 py-3 dark:border-white/10 dark:bg-white/5">
        <div className="flex min-w-0 items-center gap-2.5">
          {logo && <Logo src={logo} size="xs" />}
          <span className="truncate text-[13px] font-bold">{dashboard.title}</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {dashboard.live}
        </span>
      </div>

      <div className="p-4 sm:p-5">
        {/* stat tiles */}
        <div className="grid grid-cols-3 gap-2.5">
          {dashboard.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-night/8 bg-lavender/30 p-3 dark:border-white/10 dark:bg-white/5"
            >
              <div className="text-[11px] font-semibold uppercase tracking-wider text-night/65 dark:text-lavender/50">
                {stat.label}
              </div>
              <div
                className={`mt-1 text-base font-bold leading-tight sm:text-lg ${
                  stat.good ? 'text-emerald-700 dark:text-emerald-400' : ''
                } ${stat.warn ? 'text-amber-700 dark:text-amber-400' : ''}`}
              >
                {stat.value}
              </div>
              {stat.trend && (
                <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">▲ {stat.trend}</div>
              )}
            </div>
          ))}
        </div>

        {/* trend line */}
        <div className="mt-3 rounded-xl border border-night/8 bg-lavender/30 p-3 dark:border-white/10 dark:bg-white/5">
          <div className="text-[11px] font-bold">Trend · last 6 periods</div>
          <svg viewBox="0 0 320 60" preserveAspectRatio="none" className="mt-2 h-12 w-full" aria-hidden="true">
            <path
              d="M0 48 Q40 36 80 26 T160 22 T240 14 T320 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="text-purple dark:text-iris"
            />
          </svg>
        </div>

        {/* row list */}
        <div className="mt-3 grid gap-2">
          {dashboard.items.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-3 rounded-xl border border-night/8 bg-white px-3 py-2.5 dark:border-white/10 dark:bg-white/5"
            >
              <span className="truncate text-[13px] font-semibold">{item.name}</span>
              <span className="shrink-0 text-[11px] text-night/65 dark:text-lavender/55">{item.meta}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
