import { products } from '../data/products.js'
import { services } from '../data/services.js'
import { contact, waLink } from '../data/site.js'

import AmbientOffice from '../components/AmbientOffice.jsx'
import Button from '../components/Button.jsx'
import ClientGallery from '../components/ClientGallery.jsx'
import Logo from '../components/Logo.jsx'
import Marquee from '../components/Marquee.jsx'
import Orbs from '../components/Orbs.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Promotions from '../components/Promotions.jsx'
import Reveal from '../components/Reveal.jsx'
import Section, { Container, SectionHead } from '../components/Section.jsx'

const stats = [
  { value: '4', label: 'Flagship products' },
  { value: '6', label: 'Service areas' },
  { value: 'Bulawayo', label: 'Based & on call' },
]

const devices = [
  { image: '/device-phone-pos.webp', title: 'Phone · at the till', body: 'Offline-first POS that keeps selling when the line drops.' },
  { image: '/device-tablet-learn.webp', title: 'Tablet · classroom & warehouse', body: 'Touch-first screens for registers, stock counts and check-ins.' },
  { image: '/device-laptop-finance.webp', title: 'Laptop · the office', body: 'Full dashboards, reports and everything worth presenting.' },
]

export default function Home() {
  return (
    <>
      {/* ---------------------------------------------------------- HERO */}
      <header className="relative overflow-hidden bg-night px-5 pb-20 pt-14 text-lavender sm:px-8 sm:pb-28 sm:pt-20">
        <AmbientOffice cycle />

        <Container className="relative">
          <div className="max-w-3xl">
            <Reveal
              as="span"
              className="glass-dark inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-lilac"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Bulawayo · Available for new projects
            </Reveal>

            <Reveal as="h1" delay={80} className="mt-6 text-[38px] font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
              Technology that <span className="brand-gradient">moves your business</span> forward.
            </Reveal>

            <Reveal as="p" delay={180} className="mt-6 max-w-xl text-base leading-relaxed text-lavender/70 sm:text-lg">
              MKLabs builds point-of-sale, accounting, school and lodge software — plus the websites,
              networks and support behind them — for organisations across Zimbabwe.
            </Reveal>

            <Reveal delay={260} className="mt-8 flex flex-wrap gap-3">
              <Button to="/products">Explore our products →</Button>
              <Button to="/contact" variant="ghost" className="!text-lavender !border-white/25">
                Talk to MKLabs
              </Button>
            </Reveal>

            <Reveal delay={340} className="mt-7 flex flex-wrap gap-2">
              {contact.phones.map((phone) => (
                <a
                  key={phone.tel}
                  href={waLink('Hello MKLabs!', phone.wa)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-dark inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 text-sm text-lavender/90 transition-colors hover:bg-white/15"
                >
                  💬 {phone.label}
                </a>
              ))}
              <a
                href={`mailto:${contact.emails[0].address}`}
                className="glass-dark inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 text-sm text-lavender/90 transition-colors hover:bg-white/15"
              >
                ✉️ {contact.emails[0].address}
              </a>
            </Reveal>

            <Reveal delay={420} className="glass-dark mt-10 flex flex-wrap gap-x-10 gap-y-5 rounded-2xl px-6 py-5">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold sm:text-3xl">{stat.value}</div>
                  <div className="text-xs text-lavender/55">{stat.label}</div>
                </div>
              ))}
            </Reveal>
          </div>
        </Container>
      </header>

      <Marquee />

      {/* Only renders when there is a live offer — managed from /admin */}
      <Promotions />

      {/* ------------------------------------------------------ PRODUCTS */}
      <Section>
        <Container>
          <SectionHead
            center
            kicker="Our products"
            title="Four systems, built for how Zimbabwe actually works."
            lead="Pick the one that matches your business. Each has its own page with screens, features and a demo you can book on WhatsApp."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => (
              <Reveal key={product.slug} delay={index * 80}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* -------------------------------------------------- ANY DEVICE */}
      <Section tone="tint">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHead
                kicker="📱 💻 Any device"
                title="Phone at the till. Tablet in the class. Laptop in the office."
                lead="Everything syncs to the same account, so the person at the counter and the person doing the books are always looking at the same numbers."
              />

              <div className="mt-8 grid gap-3">
                {devices.map((device, index) => (
                  <Reveal
                    key={device.title}
                    direction="left"
                    delay={index * 90}
                    className="flex items-start gap-4 rounded-2xl border border-night/10 bg-white p-4 dark:border-white/10 dark:bg-white/5"
                  >
                    <img
                      src={device.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-14 w-14 shrink-0 rounded-xl object-cover"
                    />
                    <div>
                      <div className="text-[15px] font-bold">{device.title}</div>
                      <p className="mt-0.5 text-sm text-night/60 dark:text-lavender/60">{device.body}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal direction="zoom" delay={160} className="grid grid-cols-2 gap-4">
              <img
                src="/device-laptop-finance.webp"
                width={1408}
                height={768}
                alt="FinanceFlow dashboard on a laptop"
                loading="lazy"
                decoding="async"
                className="col-span-2 w-full rounded-2xl border border-night/10 object-cover shadow-2xl shadow-night/15 dark:border-white/10"
              />
              <img
                src="/device-tablet-learn.webp"
                width={1408}
                height={768}
                alt="LearnCloud on a tablet"
                loading="lazy"
                decoding="async"
                className="w-full rounded-2xl border border-night/10 object-cover shadow-xl shadow-night/10 dark:border-white/10"
              />
              <img
                src="/device-phone-pos.webp"
                width={1408}
                height={768}
                alt="MKLabs POS on a phone"
                loading="lazy"
                decoding="async"
                className="w-full rounded-2xl border border-night/10 object-cover shadow-xl shadow-night/10 dark:border-white/10"
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------- IN THE WILD */}
      <Section tone="dark">
        <Orbs />
        <Container className="relative">
          <SectionHead
            center
            tone="dark"
            kicker="🎬 Clients in action"
            title="See the software in real businesses."
            lead="Boardrooms, classrooms, tills and lodge receptions — running in Bulawayo right now."
          />

          <Reveal direction="zoom" delay={140} className="mt-12">
            <ClientGallery />
          </Reveal>
        </Container>
      </Section>

      {/* ------------------------------------------------------ SERVICES */}
      <Section>
        <Container>
          <SectionHead
            center
            kicker="Beyond the products"
            title="Whatever you need built, connected or supported."
            lead="We handle the whole job end to end — from the first conversation to training your staff."
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Reveal
                key={service.id}
                delay={index * 70}
                className="flex items-start gap-4 rounded-2xl border border-night/10 bg-white p-5 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/5"
              >
                <Logo src={service.logo} size="sm" tone={service.dark ? 'dark' : 'light'} />
                <div>
                  <h3 className="text-[15px] font-bold">{service.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-night/60 dark:text-lavender/60">{service.blurb}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ----------------------------------------------------------- CTA */}
      <Section tone="light" className="!pt-0">
        <Container>
          <Reveal
            direction="zoom"
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple via-night to-midnight px-6 py-14 text-center text-white sm:px-12 sm:py-20"
          >
            <Orbs />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Have a problem technology can solve?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-base text-white/70">
                Tell us what is slowing your business down. We will tell you honestly whether we can fix it.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button to="/contact" variant="white">
                  Start a project →
                </Button>
                <Button href={waLink('Hello MKLabs! I have a project in mind.')} variant="whatsapp">
                  💬 WhatsApp us
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  )
}
