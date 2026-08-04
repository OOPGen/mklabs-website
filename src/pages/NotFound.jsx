import Button from '../components/Button.jsx'
import Orbs from '../components/Orbs.jsx'
import { Container } from '../components/Section.jsx'

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-night px-5 py-28 text-center text-lavender sm:py-40">
      <Orbs />
      <Container className="relative">
        <div className="text-6xl font-bold">404</div>
        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">That page has moved on.</h1>
        <p className="mx-auto mt-3 max-w-sm text-base text-lavender/65">
          The link may be old. Everything MKLabs builds is still one tap away.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button to="/">Back to home</Button>
          <Button to="/products" variant="ghost" className="!text-lavender !border-white/25">
            See our products
          </Button>
        </div>
      </Container>
    </section>
  )
}
