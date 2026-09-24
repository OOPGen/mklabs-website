import Button from '../components/Button.jsx'
import BrandGlow from '../components/BrandGlow.jsx'
import { Container } from '../components/Section.jsx'

export default function NotFound() {
  return (
    <section className="relative -mt-20 overflow-hidden bg-void px-5 pb-28 pt-48 text-center text-lavender sm:pb-40 sm:pt-60">
      <BrandGlow strength="strong" />
      <Container className="relative">
        <div className="logo-gradient-text text-7xl font-bold sm:text-8xl">404</div>
        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">That page has moved on.</h1>
        <p className="mx-auto mt-3 max-w-sm text-base text-lavender/65">
          The link may be old. Everything MKLabs builds is still one tap away.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button to="/" variant="brand">Back to home</Button>
          <Button to="/products" variant="glass">
            See our products
          </Button>
        </div>
      </Container>
    </section>
  )
}
