import { Link, Navigate, useParams } from 'react-router-dom'

import { getProduct, products } from '../data/products.js'
import { waLink } from '../data/site.js'

import AmbientOffice from '../components/AmbientOffice.jsx'
import Button from '../components/Button.jsx'
import DashboardPreview from '../components/DashboardPreview.jsx'
import Logo from '../components/Logo.jsx'
import Orbs from '../components/Orbs.jsx'
import Reveal from '../components/Reveal.jsx'
import Section, { Container, SectionHead } from '../components/Section.jsx'
import { photoSrcSet } from '../components/responsive.js'

export default function ProductDetail() {
  const { slug } = useParams()
  const product = getProduct(slug)

  if (!product) return <Navigate to="/products" replace />

  const others = products.filter((item) => item.slug !== product.slug)
  const demoLink = waLink(`Hello MKLabs! I would like a ${product.name} demo.`)

  return (
    <>
      {/* ---------------------------------------------------------- HERO */}
      {/* -mt-20 lets the dark hero run up behind the floating bar */}
      <header className="relative -mt-20 overflow-hidden bg-void px-5 pb-14 pt-32 text-lavender sm:px-8 sm:pb-20 sm:pt-36 short:pb-10 short:pt-24">
        <AmbientOffice intensity="strong" src={product.clientImage} priority />

        <Container className="relative">
          <Reveal as="nav" className="flex items-center gap-2 text-sm text-lavender/50">
            <Link to="/products" className="-my-3 -ml-2 inline-flex min-h-[44px] items-center px-2 transition-colors hover:text-lavender">
              Products
            </Link>
            <span>/</span>
            <span className="text-lavender/80">{product.name}</span>
          </Reveal>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Reveal className="flex items-center gap-3">
                <Logo src={product.logo} size="md" loading="eager" />
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-lilac">
                  {product.category}
                </span>
              </Reveal>

              <Reveal as="h1" delay={80} className="mt-6 text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl">
                {/* the product and what it is, as shown in the badge above */}
                <span className="sr-only">
                  {product.name}, {product.seo.keyword} for Zimbabwe:{' '}
                </span>
                {product.tagline}
              </Reveal>

              <Reveal as="p" delay={160} className="mt-5 text-base leading-relaxed text-lavender/70 sm:text-lg">
                {product.summary}
              </Reveal>

              <Reveal delay={240} className="mt-8 flex flex-wrap gap-3">
                <Button href={demoLink} variant="whatsapp">
                  💬 Book a free demo
                </Button>
                <Button to="/contact" variant="glass">
                  Request a quote
                </Button>
                {product.site && (
                  <Button href={product.site.url} variant="glass">
                    Visit the {product.name} site ↗
                  </Button>
                )}
              </Reveal>
            </div>

            {/* the dashboard is the first thing a customer sees */}
            <Reveal direction="zoom" delay={200}>
              <DashboardPreview dashboard={product.dashboard} logo={product.logo} />
            </Reveal>
          </div>
        </Container>
      </header>

      {/* ------------------------------------------------------- IN USE */}
      <Section>
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal direction="left">
              <img
                src={product.clientImage}
                srcSet={photoSrcSet(product.clientImage)}
                sizes="(min-width: 1152px) 544px, (min-width: 1024px) 45vw, 100vw"
                alt={product.clientCaption}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full rounded-3xl border border-night/10 object-cover shadow-2xl shadow-night/15 dark:border-white/10"
              />
              <p className="mt-3 text-sm text-night/65 dark:text-lavender/55">{product.clientCaption}</p>
            </Reveal>

            <Reveal direction="right" delay={120}>
              <SectionHead kicker="Who it is for" title={`Built for the people who run the day.`} />

              <ul className="mt-7 grid gap-3">
                {product.audience.map((item) => (
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

              <div className="mt-7 flex items-center gap-3 rounded-2xl border border-iris/25 bg-iris/8 p-4">
                <img src={product.deviceImage} alt="" className="h-16 w-16 rounded-xl object-cover" loading="lazy" />
                <div>
                  <div className="text-sm font-bold">{product.deviceCaption}</div>
                  <p className="text-xs text-night/60 dark:text-lavender/60">
                    Runs on the device your team already has.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ----------------------------------------------------- FEATURES */}
      <Section tone="tint">
        <Container>
          <SectionHead
            center
            kicker="What you get"
            title={`Everything ${product.name} does for you.`}
            lead="No modules to buy separately. This is the whole system."
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.features.map((feature, index) => (
              <Reveal
                key={feature.title}
                delay={index * 70}
                className="rounded-2xl border border-night/10 bg-white p-5 dark:border-white/10 dark:bg-white/5"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple/10 text-lg text-purple dark:bg-iris/15 dark:text-iris">
                  {product.icon}
                </div>
                <h3 className="mt-4 text-[15px] font-bold">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-night/60 dark:text-lavender/60">{feature.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------- CTA */}
      <Section tone="dark">
        <Orbs />
        <Container className="relative text-center">
          <Reveal as="h2" className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Want to see {product.name} with your own numbers in it?
          </Reveal>
          <Reveal as="p" delay={100} className="mx-auto mt-4 max-w-lg text-base text-lavender/70">
            Send us a message and we will walk you through it — no charge, no pressure.
          </Reveal>
          <Reveal delay={180} className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href={demoLink} variant="whatsapp">
              💬 Book a free demo
            </Button>
            <Button to="/contact" variant="white">
              Send an enquiry
            </Button>
          </Reveal>
        </Container>
      </Section>

      {/* --------------------------------------------------- OTHER PRODUCTS */}
      <Section>
        <Container>
          <h2 className="text-xl font-bold">Also from MKLabs</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {others.map((item) => (
              <Link
                key={item.slug}
                to={`/products/${item.slug}`}
                className="group flex items-center gap-3 rounded-2xl border border-night/10 bg-white p-4 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/5"
              >
                <Logo src={item.logo} size="sm" />
                <span className="min-w-0">
                  <span className="block text-[15px] font-bold">{item.name}</span>
                  <span className="block truncate text-xs text-night/65 dark:text-lavender/55">{item.category}</span>
                </span>
                <span className="ml-auto text-purple transition-transform group-hover:translate-x-1 dark:text-iris">→</span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
