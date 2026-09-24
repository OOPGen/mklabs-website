export const site = {
  name: 'MKLabs',
  tagline: 'Technology that opens doors.',
  city: 'Bulawayo',
  country: 'Zimbabwe',
  domain: 'mklabs.co.zw',
  url: 'https://mklabs.co.zw',
  hours: 'Monday – Friday, 8am – 5pm (CAT)',
}

export const contact = {
  phones: [
    { label: '0786 233 766', tel: '+263786233766', wa: '263786233766' },
    { label: '0718 621 427', tel: '+263718621427', wa: '263718621427' },
  ],
  emails: [
    { label: 'info@mklabs.co.zw', address: 'info@mklabs.co.zw', note: 'General enquiries, partnerships' },
    { label: 'support@mklabs.co.zw', address: 'support@mklabs.co.zw', note: 'Technical support for existing clients' },
  ],
  whatsapp: '263786233766',
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19096.12823605702!2d28.56006179553784!3d-20.15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1eb558d8ecc8c015%3A0x9d4cf33e71536410!2sBulawayo%2C%20Zimbabwe!5e0!3m2!1sen!2szw!4v1700000000000!5m2!1sen!2szw',
}

/**
 * MKLabs on social media. Paste each page's full address into `url` — an
 * empty url shows the icon as "coming soon" instead of a link, so nobody is
 * sent to a missing page.
 */
export const socials = [
  { id: 'facebook', label: 'Facebook', url: '' },
  { id: 'x', label: 'X (Twitter)', url: '' },
  { id: 'instagram', label: 'Instagram', url: '' },
  { id: 'tiktok', label: 'TikTok', url: '' },
]

export const founder = {
  name: 'Michael Junior Jere',
  role: 'Founder & Lead Developer',
  initials: 'MJJ',
  image: '/mklabs-enter-door-brand.webp',
  belief: 'Technology should make business easier, not more complicated.',
  bio: [
    'I build practical technology that solves real problems — point of sale for retail, school management, lodge systems — designed to fit how organisations in Bulawayo actually work.',
    'No fake promises and no jargon. Just honest work, delivered locally, built to a global standard.',
  ],
  why: 'Local understanding, global standards. You deal directly with the person who builds your system.',
}

/** WhatsApp deep link with a prefilled message */
export function waLink(message = 'Hello MKLabs!', number = contact.whatsapp) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
