import { platform, products } from '../data/products.js'
import { waLink } from '../data/site.js'
import Button from '../components/Button.jsx'
import Logo from '../components/Logo.jsx'
import AmbientOffice from '../components/AmbientOffice.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Reveal from '../components/Reveal.jsx'
import Section, { Container, SectionHead } from '../components/Section.jsx'
import { photoSrcSet } from '../components/responsive.js'

export default function Products() {
  return (
    <>
      {/* -mt-20 lets the dark hero run up behind the floating bar */}
      <header className="relative -mt-20 overflow-hidden bg-void px-5 pb-16 pt-32 text-lavender sm:px-8 sm:pb-24 sm:pt-40 short:pb-10 short:pt-24">
        <AmbientOffice intensity="strong" priority />
        <Container className="relative">
          <SectionHead
            tone="dark"
            level="h1"
            kicker={platform.name}
            title={<>One platform. <span className="logo-gradient-text">Three systems</span> that run a business.</>}
            lead="POS for shops, Accounting for businesses without a till, and School for schools. They share one sign-in, one set of books and one support line — and every one starts with a free trial."
          />
          <Reveal delay={200} className="mt-8 flex flex-wrap gap-3">
            <Button href={platform.signup} variant="brand">
              Start a free trial ↗
            </Button>
            <Button href={platform.url} variant="glass">
              Sign in at {platform.label} ↗
            </Button>
          </Reveal>
        </Container>
      </header>

      <Section>
        <Container>
          <h2 className="sr-only">MKLabs products</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <Reveal key={product.slug} delay={index * 80}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>

          {/* detail rows */}
          <div className="mt-20 grid gap-16">
            {products.map((product, index) => (
              <Reveal
                key={product.slug}
                delay={60}
                className={`grid items-center gap-8 lg:grid-cols-2 ${index % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}
              >
                <img
                  src={product.clientImage}
                  srcSet={photoSrcSet(product.clientImage)}
                  sizes="(min-width: 1152px) 544px, (min-width: 1024px) 45vw, 100vw"
                  alt={product.clientCaption}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full rounded-2xl border border-night/10 object-cover shadow-xl shadow-night/10 dark:border-white/10"
                />

                <div>
                  <Logo src={product.logo} size="md" />
                  <span className="mt-4 block text-[11px] font-bold uppercase tracking-wider text-purple dark:text-iris">
                    {product.category}
                  </span>
                  <h3 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">{product.tagline}</h3>
                  <p className="mt-3 text-base leading-relaxed text-night/65 dark:text-lavender/65">
                    {product.summary}
                  </p>

                  <ul className="mt-5 grid gap-2">
                    {product.features.slice(0, 3).map((feature) => (
                      <li key={feature.title} className="flex items-start gap-2.5 text-sm">
                        <span className="mt-0.5 text-purple dark:text-iris">✓</span>
                        <span className="font-semibold">{feature.title}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Button to={`/products/${product.slug}`}>See {product.name} in detail →</Button>
                    <Button
                      href={waLink(`Hello MKLabs! I would like a ${product.name} demo.`)}
                      variant="whatsapp"
                    >
                      💬 Book a demo
                    </Button>
                    <Button href={product.signup} variant="ghost">
                      Start free ↗
                    </Button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------- PRICES */}
      <Section tone="tint" id="pricing">
        <Container>
          <SectionHead
            center
            kicker="Pricing"
            title="Simple prices. Everything included."
            lead="No modules to buy separately and no hardware to buy. Start free, then pay for what you use."
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {products.map((product, index) => (
              <Reveal
                key={product.slug}
                delay={index * 80}
                className="flex h-full flex-col rounded-2xl border border-night/10 bg-white p-6 dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <Logo src={product.logo} size="sm" />
                  <h3 className="text-lg font-bold">{product.name}</h3>
                </div>
                <p className="mt-5">
                  <span className="text-4xl font-bold tracking-tight">{product.price.amount}</span>{' '}
                  <span className="text-sm text-night/60 dark:text-lavender/60">{product.price.per}</span>
                </p>
                <p className="mt-1 text-sm text-night/60 dark:text-lavender/60">{product.price.note}</p>
                <ul className="mt-5 grid flex-1 content-start gap-2">
                  {product.price.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 text-purple dark:text-iris">✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
                <Button href={product.signup} className="mt-7">
                  Start free ↗
                </Button>
              </Reveal>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-xl text-center text-sm text-night/65 dark:text-lavender/60">
            Running a lodge or guest house? A lodge system is on the way.{' '}
            <a
              href={waLink('Hello MKLabs! I run a lodge and would like to hear about the lodge system.')}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-purple underline decoration-iris/50 underline-offset-4 dark:text-iris"
            >
              Talk to us on WhatsApp
            </a>{' '}
            and we will put something together for you.
          </p>
        </Container>
      </Section>
    </>
  )
}
