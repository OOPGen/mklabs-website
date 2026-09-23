import { products } from '../data/products.js'
import { waLink } from '../data/site.js'
import Button from '../components/Button.jsx'
import Logo from '../components/Logo.jsx'
import AmbientOffice from '../components/AmbientOffice.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Reveal from '../components/Reveal.jsx'
import Section, { Container, SectionHead } from '../components/Section.jsx'

export default function Products() {
  return (
    <>
      <header className="relative overflow-hidden bg-night px-5 py-16 text-lavender sm:px-8 sm:py-24">
        <AmbientOffice intensity="strong" />
        <Container className="relative">
          <SectionHead
            tone="dark"
            kicker="Product ecosystem"
            title="One partner. Four systems that run a business."
            lead="Each product solves one job properly. They share the same account, the same look and the same support line."
          />
        </Container>
      </header>

      <Section>
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
