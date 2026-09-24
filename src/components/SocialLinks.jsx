import { socials } from '../data/site.js'

/* the platforms' own marks, drawn on a 24px grid */
const marks = {
  facebook: (
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H7.9v3h2.6V21h3Z" />
  ),
  x: (
    <path d="M17.8 3h3l-6.6 7.6L22 21h-6.1l-4.8-6.3L5.6 21H2.6l7.1-8.1L2.3 3h6.2l4.3 5.7L17.8 3Zm-1 16.2h1.7L7.3 4.7H5.5l11.3 14.5Z" />
  ),
  instagram: (
    <path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Zm6.1-8.1a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM21.4 8c-.1-1.5-.4-2.8-1.5-3.9S17.5 2.7 16 2.6C14.5 2.5 9.5 2.5 8 2.6c-1.5.1-2.8.4-3.9 1.5S2.7 6.5 2.6 8c-.1 1.5-.1 6.5 0 8 .1 1.5.4 2.8 1.5 3.9s2.4 1.4 3.9 1.5c1.5.1 6.5.1 8 0 1.5-.1 2.8-.4 3.9-1.5s1.4-2.4 1.5-3.9c.1-1.5.1-6.5 0-8Zm-2 9.7a3.2 3.2 0 0 1-1.8 1.8c-1.3.5-4.3.4-5.6.4s-4.4.1-5.6-.4a3.2 3.2 0 0 1-1.8-1.8c-.5-1.3-.4-4.3-.4-5.7s-.1-4.4.4-5.6a3.2 3.2 0 0 1 1.8-1.8c1.3-.5 4.3-.4 5.6-.4s4.4-.1 5.6.4a3.2 3.2 0 0 1 1.8 1.8c.5 1.3.4 4.3.4 5.6s.1 4.4-.4 5.7Z" />
  ),
  tiktok: (
    <path d="M16.6 2h-3.3v13.4a2.9 2.9 0 1 1-2-2.8V9.2a6.2 6.2 0 1 0 5.3 6.2V8.6a7.9 7.9 0 0 0 4.6 1.5V6.8a4.7 4.7 0 0 1-4.6-4.8Z" />
  ),
}

/**
 * The four MKLabs social icons. Each becomes a link once its address is set
 * in src/data/site.js; until then it shows, marked "coming soon", but goes
 * nowhere.
 */
export default function SocialLinks({ className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {socials.map((social) => {
        const icon = (
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current" aria-hidden="true">
            {marks[social.id]}
          </svg>
        )
        const shape = 'grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-white/[0.04]'

        return social.url ? (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`MKLabs on ${social.label}`}
            title={social.label}
            className={`${shape} text-white/70 transition-colors hover:border-violet/60 hover:bg-violet/15 hover:text-white`}
          >
            {icon}
          </a>
        ) : (
          <span
            key={social.id}
            role="img"
            aria-label={`MKLabs on ${social.label} — coming soon`}
            title={`${social.label} — coming soon`}
            className={`${shape} cursor-default text-white/45`}
          >
            {icon}
          </span>
        )
      })}
    </div>
  )
}
