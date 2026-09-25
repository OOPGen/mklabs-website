import { Link } from 'react-router-dom'

import { getProduct, products } from '../data/products.js'
import { services } from '../data/services.js'
import { founder, waLink } from '../data/site.js'

import BrandGlow from '../components/BrandGlow.jsx'
import Button from '../components/Button.jsx'
import ClientGallery from '../components/ClientGallery.jsx'
import DashboardPreview from '../components/DashboardPreview.jsx'
import Icon from '../components/Icon.jsx'
import Logo from '../components/Logo.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Promotions from '../components/Promotions.jsx'
import Reveal from '../components/Reveal.jsx'
import { Container } from '../components/Section.jsx'

const pos = getProduct('pos')

/* the four services the hero strip leads with; the full six follow below */
const highlighted = ['software', 'web', 'cloud', 'support'].map((id) => services.find((service) => service.id === id))

/* why MKLabs — every line is the site's own words, gathered from the founder
   story, the products and the services */
const reasons = [
  {
    icon: 'pin',
    title: 'Local, and accountable',
    body: founder.why,
  },
  {
    icon: 'offline',
    title: 'Keeps working when the line drops',
    body: 'Sales are recorded on the device and sync automatically when the network returns. A power cut or a dead line never stops a sale.',
  },
  {
    icon: 'devices',
    title: 'One account, every device',
    body: 'Everything syncs to the same account, so the person at the counter and the person doing the books are always looking at the same numbers.',
  },
  {
    icon: 'people',
    title: 'Trained and supported',
    body: services.find((service) => service.id === 'support').blurb,
  },
]

/** Small uppercase label over each section's heading, in the logo's gradient. */
function Eyebrow({ children, center = false }) {
  return (
    <Reveal
      as="span"
      className={`block text-[11px] font-semibold uppercase tracking-[0.28em] ${center ? 'text-center' : ''}`}
    >
      <span className="logo-gradient-text">{children}</span>
    </Reveal>
  )
}

/** Moves the page on to the first section — the hero's "Scroll." made real. */
function ScrollCue({ className = '' }) {
  return (
    <a
      href="#services"
      className={`group inline-flex items-center gap-5 text-white/80 transition-colors hover:text-white ${className}`}
    >
      <span className="relative block h-14 w-px overflow-hidden bg-white/15" aria-hidden="true">
        <span className="scroll-cue-light absolute left-0 top-0 block h-6 w-px bg-gradient-to-b from-transparent via-cyan to-transparent" />
      </span>
      <span>
        <span className="block text-3xl font-normal tracking-[0.32em] sm:text-4xl">SCROLL.</span>
        <span className="mt-2 block text-sm tracking-wide text-white/55 transition-colors group-hover:text-white/75">
          The future moves one step at a time.
        </span>
        <span className="sr-only"> Go to what we do.</span>
      </span>
    </a>
  )
}

export default function Home() {
  return (
    /* The homepage is designed dark from end to end, like the picture it opens
       on — `dark` switches every shared component inside to its dark styling,
       whatever theme the rest of the site is showing. */
    <div className="dark bg-void text-lavender">
      {/* ---------------------------------------------------------- HERO */}
      {/* -mt-20 lets the picture run up behind the clear top bar */}
      <header className="relative -mt-20 flex min-h-[100svh] flex-col overflow-hidden bg-[#01061f] text-white">
        {/* the picture: full-bleed behind the text on a phone, the right-hand
            two-thirds on a wide screen, always fading into black at its edges */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <img
            src="/hero-portal.webp"
            srcSet="/hero-portal-640.webp 640w, /hero-portal-768.webp 768w, /hero-portal.webp 1024w"
            sizes="(min-width: 1024px) 64vw, (orientation: landscape) and (min-width: 640px) 64vw, 100vw"
            alt=""
            width={1024}
            height={1536}
            fetchPriority="high"
            decoding="async"
            className="hero-in absolute right-0 top-[-9svh] h-[68svh] w-full object-cover object-[45%_30%] wide:top-0 wide:h-full wide:w-[64%] wide:object-[46%_42%]"
          />
          {/* phone: the picture fades out beneath the doorway, where the words begin */}
          <div className="absolute inset-x-0 top-[24svh] h-[36svh] bg-gradient-to-b from-transparent to-[#01061f] wide:hidden" />
          {/* desktop: the picture's left edge melts into the black beside it */}
          <div className="absolute inset-y-0 left-[36%] hidden w-[24%] bg-gradient-to-r from-[#01061f] to-transparent wide:block" />
          {/* below laptop width the words overlap the picture more, so shade it further */}
          <div className="absolute inset-y-0 left-0 hidden w-[62%] bg-gradient-to-r from-[#01061f] via-[#01061f]/80 to-transparent wide:block lg:hidden" />
          {/* the top stays dark under the clear bar */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#01061f]/80 to-transparent" />
          {/* every size: the bottom sinks into the page */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-void to-transparent" />
          {/* the picture's pink-violet floor glow, carried on past its edge */}
          <div className="absolute -bottom-[10%] right-[-10%] hidden h-[min(560px,60vw)] w-[min(560px,60vw)] rounded-full bg-[radial-gradient(circle,rgba(204,97,252,0.16),transparent_68%)] blur-3xl wide:block" />
          {/* a trace of the logo's colour behind the words */}
          <div className="orb-a absolute -bottom-[20%] -left-[15%] h-[min(640px,110vw)] w-[min(640px,110vw)] rounded-full bg-[radial-gradient(circle,rgba(116,67,247,0.22),transparent_68%)] blur-3xl" />
        </div>

        <Container className="relative flex flex-1 flex-col justify-end pb-10 pt-[38svh] wide:justify-center wide:pt-32 short:pb-6 short:pt-24 lg:pb-16">
          <div className="max-w-2xl">
            <Reveal
              as="span"
              className="glass inline-flex items-center gap-2.5 rounded-full short:hidden border border-white/12 bg-white/[0.06] px-4 py-1.5 text-xs font-medium text-white/85"
            >
              <span className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_12px] shadow-cyan" />
              Bulawayo · Available for new projects
            </Reveal>

            <Reveal
              as="h1"
              delay={80}
              className="mt-6 text-[40px] font-bold leading-[1.02] tracking-[-0.02em] max-[359px]:text-[34px] sm:text-6xl lg:text-[80px] short:mt-4 short:text-[40px]"
            >
              {/* what the page is, for search engines and screen readers; the
                  headline carries it for everyone else */}
              <span className="sr-only">MKLabs, software development company in Bulawayo, Zimbabwe: </span>
              Technology that <span className="logo-gradient-text">moves your business</span> forward.
            </Reveal>

            <Reveal as="p" delay={180} className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg short:mt-3 short:max-w-md short:text-sm">
              MKLabs builds point-of-sale, accounting, school and lodge software — plus the websites,
              networks and support behind them — for organisations across Zimbabwe.
            </Reveal>

            <Reveal delay={260} className="mt-9 flex flex-wrap gap-3 short:mt-5">
              <Button to="/products" variant="brand">
                Explore our products <Icon name="arrow" className="h-4 w-4" />
              </Button>
              <Button to="/contact" variant="glass">
                Talk to MKLabs
              </Button>
            </Reveal>
          </div>

          <Reveal delay={400} className="mt-12 lg:hidden short:hidden">
            <ScrollCue />
          </Reveal>
        </Container>

        {/* on a wide screen the cue sits at the right edge of the picture, on the
            dark body of the mouse — clear of the lit staircase */}
        <Reveal delay={600} className="absolute bottom-40 right-8 hidden lg:block xl:right-14">
          <ScrollCue />
        </Reveal>

        {/* what MKLabs does, at a glance — anchors the bottom of the hero */}
        <Container className="relative pb-8">
          <Reveal
            delay={320}
            className="glass grid grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] lg:grid-cols-4"
          >
            {highlighted.map((service, index) => (
              <Link
                key={service.id}
                to="/#services"
                className={`group flex items-center gap-3.5 p-4 transition-colors hover:bg-white/[0.04] sm:p-5 ${
                  index % 2 ? 'border-l border-white/10' : ''
                } ${index > 1 ? 'border-t border-white/10 lg:border-t-0' : ''} ${index === 2 ? 'lg:border-l' : ''}`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-cyan transition-colors group-hover:text-magenta">
                  <Icon name={service.icon} className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-snug text-white">{service.title}</span>
                  <span className="mt-0.5 hidden text-xs text-white/50 sm:block lg:hidden xl:block">{service.short}</span>
                </span>
              </Link>
            ))}
          </Reveal>
        </Container>
      </header>

      {/* Only renders when there is a live offer — managed from /admin */}
      <Promotions />

      {/* ---------------------------------------------------- SERVICES */}
      <section id="services" className="relative overflow-hidden py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Eyebrow>What we do</Eyebrow>
              <Reveal as="h2" delay={80} className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl">
                Whatever you need <span className="logo-gradient-text">built, connected or supported.</span>
              </Reveal>
              <Reveal as="p" delay={160} className="mt-5 max-w-md text-base leading-relaxed text-white/60 sm:text-lg">
                We handle the whole job end to end — from the first conversation to training your staff.
              </Reveal>
              <Reveal delay={240} className="mt-8">
                <Button to="/about" variant="glass">
                  About MKLabs &amp; our services <Icon name="arrow" className="h-4 w-4" />
                </Button>
              </Reveal>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((service, index) => (
                <Reveal
                  key={service.id}
                  delay={index * 60}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors duration-300 hover:border-violet/50 hover:bg-white/[0.05]"
                >
                  {/* a glow that wakes on hover */}
                  <span
                    className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet/0 blur-2xl transition-colors duration-500 group-hover:bg-violet/25"
                    aria-hidden="true"
                  />
                  <span className="logo-border relative grid h-12 w-12 place-items-center rounded-xl text-white [--fill:rgba(12,10,30,0.9)]">
                    <Icon name={service.icon} className="h-[22px] w-[22px]" strokeWidth={1.75} />
                  </span>
                  <h3 className="relative mt-5 text-base font-semibold text-white">{service.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-white/55">{service.blurb}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------- PRODUCTS */}
      <section id="products" className="relative overflow-hidden border-t border-white/[0.06] py-20 sm:py-28">
        <BrandGlow slant={false} />
        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow center>Our products</Eyebrow>
            <Reveal as="h2" delay={80} className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl">
              Four systems, built for how <span className="logo-gradient-text">Zimbabwe actually works.</span>
            </Reveal>
            <Reveal as="p" delay={160} className="mt-5 text-base leading-relaxed text-white/60 sm:text-lg">
              Pick the one that matches your business. Each has its own page with screens, features and a demo
              you can book on WhatsApp.
            </Reveal>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => (
              <Reveal key={product.slug} delay={index * 80}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>

          <div className="mt-20">
            <Reveal as="h3" className="text-center text-2xl font-bold tracking-tight text-white sm:text-3xl">
              See the software in real businesses.
            </Reveal>
            <Reveal as="p" delay={80} className="mx-auto mt-3 max-w-xl text-center text-white/55">
              Boardrooms, classrooms, tills and lodge receptions — running in Bulawayo right now.
            </Reveal>
            <Reveal direction="zoom" delay={140} className="mt-10">
              <ClientGallery />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------ FEATURED: POS */}
      <section className="relative py-20 sm:py-28">
        <Container>
          <Reveal
            direction="zoom"
            className="logo-border relative overflow-hidden rounded-[28px] p-6 [--fill:#08071A] sm:p-10 lg:p-12"
          >
            <BrandGlow strength="strong" slant={false} />

            <div className="relative grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center xl:grid-cols-[0.95fr_1.1fr_0.75fr]">
              {/* the pitch */}
              <div>
                <span className="inline-flex rounded-full border border-magenta/40 bg-magenta/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-magenta">
                  Featured product
                </span>
                <div className="mt-6 flex items-center gap-4">
                  <Logo src={pos.logo} size="md" />
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{pos.name}</h2>
                </div>
                <p className="mt-5 text-xl font-semibold text-white/90">{pos.tagline}</p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">{pos.summary}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button to={`/products/${pos.slug}`} variant="brand">
                    Explore {pos.name} <Icon name="arrow" className="h-4 w-4" />
                  </Button>
                  <Button href={pos.site.url} variant="glass">
                    {pos.site.label} <Icon name="external" className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* the product itself */}
              <div className="relative pb-10 sm:pb-14">
                <DashboardPreview dashboard={pos.dashboard} logo={pos.logo} />
                <img
                  src={pos.deviceImage}
                  alt={`${pos.name} on a phone at the till`}
                  width={1408}
                  height={768}
                  loading="lazy"
                  decoding="async"
                  className="absolute -bottom-2 right-3 w-[58%] rounded-2xl border border-white/15 shadow-2xl shadow-black/60 sm:right-6 sm:w-[52%]"
                />
              </div>

              {/* what it does */}
              <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-2 xl:col-span-1 xl:grid-cols-1">
                {pos.features.map((feature) => (
                  <li key={feature.title} className="flex items-start gap-3 text-sm text-white/80">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-cyan/50 text-cyan">
                      <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {feature.title}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ---------------------------------------------------- WHY MKLABS */}
      <section className="relative overflow-hidden border-t border-white/[0.06] py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <Eyebrow>Why MKLabs</Eyebrow>
              <Reveal as="h2" delay={80} className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl">
                Local understanding. <span className="logo-gradient-text">Global standards.</span>
              </Reveal>
              <Reveal as="p" delay={160} className="mt-5 max-w-md text-base leading-relaxed text-white/60 sm:text-lg">
                {founder.bio[1]}
              </Reveal>

              {/* the founder, in his own words */}
              <Reveal
                as="figure"
                delay={240}
                className="mt-10 max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <blockquote className="text-lg font-medium leading-snug text-white">
                  “{founder.belief}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="logo-gradient grid h-10 w-10 place-items-center rounded-full text-xs font-bold text-white">
                    {founder.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{founder.name}</span>
                    <span className="block text-xs text-white/50">{founder.role}</span>
                  </span>
                </figcaption>
              </Reveal>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {reasons.map((reason, index) => (
                <Reveal
                  key={reason.title}
                  delay={index * 80}
                  className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] p-6"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/[0.06] text-cyan">
                    <Icon name={reason.icon} className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-white">{reason.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{reason.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ----------------------------------------------------------- CTA */}
      <section className="relative pb-24 pt-4 sm:pb-32">
        <Container>
          <Reveal
            direction="zoom"
            className="logo-border relative overflow-hidden rounded-[28px] px-6 py-16 text-center text-white [--fill:#05040F] sm:px-12 sm:py-24"
          >
            <BrandGlow strength="strong" />
            <div className="relative">
              <img
                src="/mklabs-logo-128.webp"
                alt=""
                width={64}
                height={64}
                loading="lazy"
                className="mx-auto h-16 w-16 rounded-[22%] shadow-xl shadow-violet/40"
              />
              <span className="mt-7 block text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50">
                Let&apos;s build something better
              </span>
              <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
                Have a problem <span className="logo-gradient-text">technology can solve?</span>
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-base text-white/65">
                Tell us what is slowing your business down. We will tell you honestly whether we can fix it.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Button to="/contact" variant="brand">
                  Start a project <Icon name="arrow" className="h-4 w-4" />
                </Button>
                <Button href={waLink('Hello MKLabs! I have a project in mind.')} variant="whatsapp">
                  💬 WhatsApp us
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  )
}
