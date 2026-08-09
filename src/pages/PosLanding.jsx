import { getProduct } from '../data/products.js'
import { contact, site, waLink } from '../data/site.js'

import AmbientOffice from '../components/AmbientOffice.jsx'
import Button from '../components/Button.jsx'
import ContactForm from '../components/ContactForm.jsx'
import DashboardPreview from '../components/DashboardPreview.jsx'
import Logo from '../components/Logo.jsx'
import Promotions from '../components/Promotions.jsx'
import Reveal from '../components/Reveal.jsx'
import Section, { Container, SectionHead } from '../components/Section.jsx'
import usePageTitle from '../components/usePageTitle.js'

const demoLink = waLink('Hello MKLabs! I would like a demo of MKLabs POS for my shop.')

/** The three objections that actually stop a Bulawayo retailer from buying. */
const objections = [
  {
    icon: '⚡',
    worry: '"What happens when the power or network goes?"',
    answer:
      'Nothing. Sales are written to the device and sync the moment you are back online. The queue keeps moving through a load-shedding block.',
  },
  {
    icon: '🧾',
    worry: '"My staff are not computer people."',
    answer:
      'Tap a category, tap a product, take payment. Most cashiers are serving customers unsupervised inside an afternoon, and we train your team on site.',
  },
  {
    icon: '📦',
    worry: '"I never know what stock I actually have."',
    answer:
      'Every sale updates stock instantly, and you get a low-stock warning before a fast mover runs out — not after a customer asks for it.',
  },
]

export default function PosLanding() {
  const pos = getProduct('pos')

  usePageTitle(
    'MKLabs POS — Point of sale for Zimbabwean retail',
    'Offline-first point of sale and stock management for shops in Bulawayo. Keeps selling when the internet drops. Book a free demo on WhatsApp.'
  )

  return (
    <>
      {/* ---------------------------------------------------------- HERO */}
      <header className="relative overflow-hidden bg-night px-5 pb-20 pt-14 text-lavender sm:px-8 sm:pb-28 sm:pt-20">
        <AmbientOffice src={pos.clientImage} />

        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Reveal className="flex items-center gap-3">
                <Logo src={pos.logo} size="md" />
                <span className="glass-dark rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-lilac">
                  Point of sale
                </span>
              </Reveal>

              <Reveal as="h1" delay={80} className="mt-6 text-[38px] font-bold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
                Sell fast. <span className="brand-gradient">Even when the internet drops.</span>
              </Reveal>

              <Reveal as="p" delay={160} className="mt-6 max-w-lg text-base leading-relaxed text-lavender/75 sm:text-lg">
                A point-of-sale and stock system built for how shops in {site.city} actually trade —
                through load shedding, patchy lines and a queue that will not wait.
              </Reveal>

              <Reveal delay={240} className="mt-8 flex flex-wrap gap-3">
                <Button href={demoLink} variant="whatsapp">
                  💬 Book a free demo
                </Button>
                <Button href="#features" variant="ghost" className="!text-lavender !border-white/25">
                  See what it does
                </Button>
              </Reveal>

              <Reveal delay={320} className="glass-dark mt-8 flex flex-wrap gap-x-8 gap-y-4 rounded-2xl px-6 py-5">
                <div>
                  <div className="text-xl font-bold sm:text-2xl">Works offline</div>
                  <div className="text-xs text-lavender/55">No connection needed to sell</div>
                </div>
                <div>
                  <div className="text-xl font-bold sm:text-2xl">Same day</div>
                  <div className="text-xs text-lavender/55">Installed and staff trained</div>
                </div>
                <div>
                  <div className="text-xl font-bold sm:text-2xl">{site.city}</div>
                  <div className="text-xs text-lavender/55">Local support, not a call centre</div>
                </div>
              </Reveal>
            </div>

            <Reveal direction="zoom" delay={200}>
              <DashboardPreview dashboard={pos.dashboard} logo={pos.logo} />
            </Reveal>
          </div>
        </Container>
      </header>

      <Promotions />

      {/* ---------------------------------------------------- OBJECTIONS */}
      <Section>
        <Container>
          <SectionHead
            center
            kicker="The honest answers"
            title="What shop owners ask us first."
            lead="Three questions come up in almost every demo. Here is the straight answer to each."
          />

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {objections.map((item, index) => (
              <Reveal
                key={item.worry}
                delay={index * 90}
                className="rounded-2xl border border-night/10 bg-white p-6 dark:border-white/10 dark:bg-white/5"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-purple/10 text-xl dark:bg-iris/15">
                  {item.icon}
                </div>
                <h3 className="mt-4 text-[15px] font-bold italic text-purple dark:text-iris">{item.worry}</h3>
                <p className="mt-2 text-sm leading-relaxed text-night/65 dark:text-lavender/65">{item.answer}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------ FEATURES */}
      <Section tone="tint" id="features">
        <Container>
          <SectionHead
            center
            kicker="What you get"
            title="Everything the shop needs, in one system."
            lead="No modules to buy separately and no per-till licence. This is the whole thing."
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pos.features.map((feature, index) => (
              <Reveal
                key={feature.title}
                delay={index * 70}
                className="rounded-2xl border border-night/10 bg-white p-5 dark:border-white/10 dark:bg-white/5"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple/10 text-lg text-purple dark:bg-iris/15 dark:text-iris">
                  🛒
                </div>
                <h3 className="mt-4 text-[15px] font-bold">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-night/60 dark:text-lavender/60">{feature.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------------- PROOF */}
      <Section>
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal direction="left">
              <img
                src={pos.clientImage}
                alt={pos.clientCaption}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full rounded-3xl border border-night/10 object-cover shadow-2xl shadow-night/15 dark:border-white/10"
              />
              <p className="mt-3 text-sm text-night/55 dark:text-lavender/55">{pos.clientCaption}</p>
            </Reveal>

            <Reveal direction="right" delay={120}>
              <SectionHead kicker="Who it is for" title="Built for the counter, not the boardroom." />

              <ul className="mt-7 grid gap-3">
                {pos.audience.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-night/10 bg-white px-4 py-3.5 text-[15px] font-semibold dark:border-white/10 dark:bg-white/5"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-purple/10 text-sm text-purple dark:bg-iris/15 dark:text-iris">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button href={demoLink} variant="whatsapp">
                  💬 Book a free demo
                </Button>
                <Button href={`tel:${contact.phones[0].tel}`} variant="ghost">
                  📞 {contact.phones[0].label}
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------- ENQUIRE */}
      <Section tone="dark" id="demo">
        <AmbientOffice src={pos.clientImage} intensity="strong" />
        <Container className="relative">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <SectionHead
                tone="dark"
                kicker="Get started"
                title="See it running in your shop."
                lead="Tell us what you sell and we will show you the till set up for your products — free, no obligation."
              />

              <div className="mt-8 grid gap-3">
                <a
                  href={demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-dark flex min-h-[60px] items-center gap-3 rounded-2xl px-5 text-[15px] font-semibold"
                >
                  💬 WhatsApp {contact.phones[0].label}
                </a>
                <a
                  href={`tel:${contact.phones[1].tel}`}
                  className="glass-dark flex min-h-[60px] items-center gap-3 rounded-2xl px-5 text-[15px] font-semibold"
                >
                  📞 Call {contact.phones[1].label}
                </a>
                <a
                  href={`mailto:${contact.emails[0].address}`}
                  className="glass-dark flex min-h-[60px] items-center gap-3 rounded-2xl px-5 text-[15px] font-semibold"
                >
                  ✉️ {contact.emails[0].address}
                </a>
              </div>

              <p className="mt-6 text-sm text-lavender/60">{site.hours}</p>
            </div>

            <Reveal direction="right" delay={120}>
              <ContactForm />
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  )
}
