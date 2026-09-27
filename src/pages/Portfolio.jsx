import { portfolio as me } from '../data/portfolio.js'
import { waLink } from '../data/site.js'

import BrandGlow from '../components/BrandGlow.jsx'
import Button from '../components/Button.jsx'
import Reveal from '../components/Reveal.jsx'
import Section, { Container, SectionHead } from '../components/Section.jsx'

/**
 * Michael's personal portfolio, for employers and recruiters. Linked from the
 * founder story on the About page rather than the main menu, so the company
 * pages stay about MKLabs' clients. All content is in src/data/portfolio.js.
 */

const chip =
  'rounded-full border border-night/10 bg-night/[0.03] px-3 py-1 text-xs font-medium text-night/75 ' +
  'dark:border-white/12 dark:bg-white/5 dark:text-lavender/80'

const firstName = me.name.split(' ')[0]
const hireMessage = `Hello ${firstName}, I saw your portfolio on mklabs.co.zw and would like to talk about a role.`
const links = me.links.filter((link) => link.url)

function ContactButtons({ onDark = true }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button href={me.cv} variant={onDark ? 'brand' : 'solid'} download>
        ⬇ Download CV
      </Button>
      <Button href={`mailto:${me.email}?subject=${encodeURIComponent('Opportunity for ' + me.name)}`} variant={onDark ? 'glass' : 'ghost'}>
        ✉️ Email me
      </Button>
      <Button href={waLink(hireMessage, me.whatsapp)} variant="whatsapp">
        💬 WhatsApp
      </Button>
    </div>
  )
}

export default function Portfolio() {
  return (
    <>
      {/* ---------------------------------------------------------- INTRO */}
      {/* -mt-20 lets the dark hero run up behind the floating bar */}
      <header className="relative -mt-20 overflow-hidden bg-void px-5 pb-16 pt-32 text-lavender sm:px-8 sm:pb-24 sm:pt-36 short:pb-10 short:pt-24">
        <BrandGlow strength="strong" />
        <Container className="relative">
          <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
            <div className="order-2 lg:order-1">
              {me.openToWork && (
                <Reveal
                  as="span"
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-lilac"
                >
                  <span className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_12px] shadow-cyan" />
                  Open to new roles · {me.location}
                </Reveal>
              )}

              <Reveal as="h1" delay={80} className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                {me.name}
                <span className="mt-3 block text-2xl sm:text-3xl">
                  <span className="logo-gradient-text">{me.title}</span>
                </span>
              </Reveal>

              <Reveal as="p" delay={140} className="mt-4 text-sm font-semibold tracking-wide text-lavender/70 sm:text-base">
                {me.headline}
              </Reveal>

              <Reveal as="p" delay={200} className="mt-6 max-w-xl text-base leading-relaxed text-lavender/75 sm:text-lg">
                {me.summary[0]}
              </Reveal>

              <Reveal delay={260} className="mt-8">
                <ContactButtons />
              </Reveal>
            </div>

            <Reveal direction="zoom" className="order-1 mx-auto w-full max-w-[200px] sm:max-w-[320px] lg:order-2 lg:max-w-none">
              <div className="rounded-[2rem] bg-gradient-to-br from-cyan via-violet to-magenta p-[2px] shadow-2xl shadow-violet/30">
                <img
                  src={me.photo.large}
                  srcSet={`${me.photo.small} 480w, ${me.photo.large} 960w`}
                  sizes="(min-width: 1024px) 420px, (min-width: 640px) 320px, 200px"
                  width={me.photo.width}
                  height={me.photo.height}
                  alt={`${me.name}, ${me.title}`}
                  fetchPriority="high"
                  decoding="async"
                  className="block aspect-[5/6] w-full rounded-[calc(2rem-2px)] bg-white object-cover"
                />
              </div>
            </Reveal>
          </div>

          {/* at a glance */}
          <div className="mt-14 grid gap-3 sm:grid-cols-3">
            {me.highlights.map((item, index) => (
              <Reveal
                key={item.label}
                delay={index * 80}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4"
              >
                <div className="text-2xl font-bold text-white">{item.value}</div>
                <div className="mt-0.5 text-sm text-lavender/70">{item.label}</div>
              </Reveal>
            ))}
          </div>
        </Container>
      </header>

      {/* ---------------------------------------------------------- PROFILE */}
      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <SectionHead kicker="Profile" title="Software that fits how businesses actually work." />
            <div className="space-y-4 lg:pt-12">
              {me.summary.slice(1).map((paragraph) => (
                <Reveal as="p" key={paragraph} className="text-base leading-relaxed text-night/75 dark:text-lavender/75 sm:text-lg">
                  {paragraph}
                </Reveal>
              ))}
              <Reveal className="flex flex-wrap gap-2 pt-2">
                {me.strengths.map((strength) => (
                  <span key={strength} className={chip}>
                    ✓ {strength}
                  </span>
                ))}
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------- PROJECTS */}
      <Section tone="tint" id="projects">
        <Container>
          <SectionHead kicker="Selected work" title="Live systems, built and run end to end." />

          <div className="mt-12 grid gap-8">
            {me.projects.map((project, index) => (
              <Reveal
                as="article"
                key={project.name}
                className="grid overflow-hidden rounded-3xl border border-night/10 bg-white shadow-xl shadow-night/5 dark:border-white/10 dark:bg-white/5 lg:grid-cols-[1fr_1.2fr]"
              >
                <div className={`relative min-h-[220px] bg-ink ${index % 2 ? 'lg:order-2' : ''}`}>
                  <img
                    src={project.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>

                <div className="p-6 sm:p-8">
                  <h3 className="text-xl font-bold leading-snug sm:text-2xl">{project.name}</h3>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="-my-2 inline-flex min-h-[44px] items-center text-sm font-semibold text-purple hover:underline dark:text-iris"
                  >
                    {project.urlLabel} ↗
                  </a>

                  <dl className="mt-4 grid gap-3 text-[15px] leading-relaxed">
                    {[
                      ['Problem', project.problem],
                      ['Solution', project.solution],
                      ['Result', project.result],
                    ].map(([term, text]) => (
                      <div key={term}>
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-purple dark:text-iris">{term}</dt>
                        <dd className="mt-0.5 text-night/75 dark:text-lavender/75">{text}</dd>
                      </div>
                    ))}
                  </dl>

                  <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
                    {project.stack.map((tech) => (
                      <li key={tech} className={chip}>
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------- EXPERIENCE */}
      <Section>
        <Container>
          <SectionHead kicker="Experience" title="From the till to the codebase." />

          <ol className="mt-12 grid gap-6 border-l border-night/10 pl-6 dark:border-white/10 sm:pl-8">
            {me.experience.map((job) => (
              <Reveal as="li" key={job.role + job.period} className="relative">
                <span
                  className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-gradient-to-br from-cyan to-magenta ring-4 ring-paper dark:ring-ink sm:-left-[39px]"
                  aria-hidden="true"
                />
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-lg font-bold sm:text-xl">{job.role}</h3>
                  <span className="text-sm font-semibold text-purple dark:text-iris">{job.period}</span>
                </div>
                <div className="mt-0.5 text-sm font-medium text-night/70 dark:text-lavender/70">
                  {job.org}
                  {job.note && <> · {job.note}</>}
                </div>
                <ul className="mt-3 grid gap-2 text-[15px] leading-relaxed text-night/75 dark:text-lavender/75">
                  {job.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-iris" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ---------------------------------------------------------- SKILLS */}
      <Section tone="tint">
        <Container>
          <SectionHead kicker="Skills" title="The tools I build with." />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {me.skills.map((group, index) => (
              <Reveal
                key={group.group}
                delay={index * 60}
                className="rounded-2xl border border-night/10 bg-white p-5 dark:border-white/10 dark:bg-white/5"
              >
                <h3 className="text-sm font-bold uppercase tracking-wider text-purple dark:text-iris">{group.group}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item} className={chip}>
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}

            <Reveal className="rounded-2xl border border-night/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple dark:text-iris">Spoken languages</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {me.languages.map((language) => (
                  <li key={language} className={chip}>
                    {language}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------- EDUCATION */}
      <Section>
        <Container>
          <SectionHead kicker="Education" title="Always learning." />

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {me.education.map((course) => (
              <Reveal
                key={course.name}
                className="rounded-2xl border border-night/10 bg-white p-6 dark:border-white/10 dark:bg-white/5"
              >
                <h3 className="text-lg font-bold">{course.name}</h3>
                <div className="mt-1 text-sm text-night/70 dark:text-lavender/70">{course.org}</div>
                <div className="mt-3 text-sm font-semibold text-purple dark:text-iris">{course.period}</div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------- CONTACT */}
      <Section tone="void" id="hire">
        <BrandGlow />
        <Container className="relative">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <SectionHead
                tone="dark"
                kicker={me.openToWork ? 'Available' : 'Get in touch'}
                title={<>Let&apos;s build <span className="logo-gradient-text">something together.</span></>}
                lead="Hiring for a developer role, or need a system built? I reply the same day."
              />
              <Reveal delay={200} className="mt-8">
                <ContactButtons />
              </Reveal>
            </div>

            <Reveal className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-lavender sm:p-8">
              {me.openToWork && (
                <>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-lilac">Availability</h3>
                  <ul className="mt-3 grid gap-2">
                    {me.availability.map((item) => (
                      <li key={item} className="flex gap-3 text-[15px]">
                        <span className="text-cyan" aria-hidden="true">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <h3 className={`${me.openToWork ? 'mt-7' : ''} text-[11px] font-bold uppercase tracking-wider text-lilac`}>Contact</h3>
              <ul className="mt-2 grid text-[15px]">
                <li>
                  <a href={`mailto:${me.email}`} className="inline-flex min-h-[44px] items-center break-all hover:text-white">
                    {me.email}
                  </a>
                </li>
                {me.phones.map((phone) => (
                  <li key={phone.tel}>
                    <a href={`tel:${phone.tel}`} className="inline-flex min-h-[44px] items-center hover:text-white">
                      {phone.label}
                    </a>
                  </li>
                ))}
                {links.map((link) => (
                  <li key={link.url}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center hover:text-white">
                      {link.label} ↗
                    </a>
                  </li>
                ))}
                <li className="pt-2 text-sm text-lavender/65">{me.location}</li>
              </ul>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  )
}
