import { contact, waLink } from '../data/site.js'

/**
 * The vertical rail down the left edge of the hero — a rotated label, a hairline
 * and the three channels MKLabs actually answers on.
 *
 * Desktop only. It lives in the gutter beside the centred container, so it
 * appears from xl up, where that gutter is wide enough to hold it without
 * crowding the copy. Every channel it offers is repeated in the page body and
 * the footer, so a phone loses decoration, not a way to make contact.
 */

const channels = [
  {
    label: 'WhatsApp',
    href: waLink('Hello MKLabs! I would like a demo of MKLabs POS for my shop.'),
    external: true,
    icon: (
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.43 12.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.48-1.76-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
    ),
  },
  {
    label: `Call ${contact.phones[0].label}`,
    href: `tel:${contact.phones[0].tel}`,
    icon: (
      <path d="M6.6 2.5a1.6 1.6 0 0 1 1.5 1l1 2.4a1.6 1.6 0 0 1-.36 1.77l-1 1a12.6 12.6 0 0 0 5.6 5.6l1-1a1.6 1.6 0 0 1 1.77-.36l2.4 1a1.6 1.6 0 0 1 1 1.5v2.2a1.8 1.8 0 0 1-2 1.8A16.5 16.5 0 0 1 2.5 4.5a1.8 1.8 0 0 1 1.8-2h2.3z" />
    ),
  },
  {
    label: contact.emails[0].address,
    href: `mailto:${contact.emails[0].address}`,
    icon: (
      <path d="M3 5.5h18c.55 0 1 .45 1 1V18c0 .55-.45 1-1 1H3c-.55 0-1-.45-1-1V6.5c0-.55.45-1 1-1zm9 7.1L20 7.4H4l8 5.2z" />
    ),
  },
]

export default function SocialRail() {
  return (
    <div className="pointer-events-none absolute inset-y-0 left-2 z-20 hidden items-center xl:flex">
      <div className="pointer-events-auto flex flex-col items-center gap-5">
        <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-lavender/45 [writing-mode:vertical-rl] rotate-180">
          Our channels
        </span>

        <span className="h-14 w-px bg-gradient-to-b from-lilac/50 to-transparent" aria-hidden="true" />

        {channels.map((channel) => (
          <a
            key={channel.href}
            href={channel.href}
            aria-label={channel.label}
            title={channel.label}
            {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="glass-dark grid h-11 w-11 place-items-center rounded-full text-lavender/70 transition-colors duration-200 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current" aria-hidden="true">
              {channel.icon}
            </svg>
          </a>
        ))}
      </div>
    </div>
  )
}
