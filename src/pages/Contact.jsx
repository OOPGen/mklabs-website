import { contact, site, waLink } from '../data/site.js'
import ContactForm from '../components/ContactForm.jsx'
import AmbientOffice from '../components/AmbientOffice.jsx'
import Reveal from '../components/Reveal.jsx'
import Section, { Container, SectionHead } from '../components/Section.jsx'

export default function Contact() {
  return (
    <>
      {/* -mt-20 lets the dark hero run up behind the floating bar */}
      <header className="relative -mt-20 overflow-hidden bg-void px-5 pb-16 pt-32 text-lavender sm:px-8 sm:pb-20 sm:pt-36 short:pb-10 short:pt-24">
        <AmbientOffice intensity="strong" />
        <Container className="relative">
          <SectionHead
            tone="dark"
            level="h1"
            kicker="Contact MKLabs"
            title={<>Let&apos;s build <span className="logo-gradient-text">something better.</span></>}
            lead="Tell us what you need built, fixed or supported. We reply within one working day."
          />
        </Container>
      </header>

      <Section>
        <Container>
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.15fr]">
            {/* details */}
            <div className="grid gap-3">
              <Reveal
                direction="left"
                className="rounded-2xl border border-night/10 bg-white p-5 dark:border-white/10 dark:bg-white/5"
              >
                <div className="text-[11px] font-bold uppercase tracking-wider text-night/45 dark:text-lavender/45">
                  Phone · WhatsApp
                </div>
                <div className="mt-2 grid gap-1">
                  {contact.phones.map((phone) => (
                    <a key={phone.tel} href={`tel:${phone.tel}`} className="inline-flex min-h-[44px] items-center text-lg font-bold hover:underline">
                      {phone.label}
                    </a>
                  ))}
                </div>
                <a
                  href={waLink('Hello MKLabs!')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-whatsapp px-5 text-sm font-semibold text-white"
                >
                  💬 Open WhatsApp
                </a>
              </Reveal>

              {contact.emails.map((email, index) => (
                <Reveal
                  key={email.address}
                  direction="left"
                  delay={80 + index * 80}
                  className="rounded-2xl border border-night/10 bg-white p-5 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="text-[11px] font-bold uppercase tracking-wider text-night/45 dark:text-lavender/45">
                    {index === 0 ? 'General enquiries' : 'Technical support'}
                  </div>
                  <a href={`mailto:${email.address}`} className="mt-0.5 flex min-h-[44px] items-center text-base font-bold hover:underline">
                    {email.address}
                  </a>
                  <p className="mt-1 text-sm text-night/55 dark:text-lavender/55">{email.note}</p>
                </Reveal>
              ))}

              <Reveal
                direction="left"
                delay={240}
                className="rounded-2xl border border-night/10 bg-white p-5 dark:border-white/10 dark:bg-white/5"
              >
                <div className="text-[11px] font-bold uppercase tracking-wider text-night/45 dark:text-lavender/45">
                  Office
                </div>
                <div className="mt-1.5 text-base font-bold">
                  {site.city}, {site.country}
                </div>
                <p className="mt-1 text-sm text-night/55 dark:text-lavender/55">{site.hours}</p>
              </Reveal>

              <Reveal direction="left" delay={320} className="overflow-hidden rounded-2xl border border-night/10 dark:border-white/10">
                <iframe
                  src={contact.mapEmbed}
                  title={`MKLabs location in ${site.city}`}
                  className="h-56 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </Reveal>
            </div>

            {/* form */}
            <Reveal direction="right" delay={120}>
              <ContactForm />
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  )
}
