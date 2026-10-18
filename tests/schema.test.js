import { describe, expect, it } from 'vitest'
import { structuredDataFor } from '../src/data/schema.js'
import { prerenderRoutes, metaFor } from '../src/data/seo.js'

describe('structuredDataFor', () => {
  it('describes MKLabs on every indexable page', () => {
    for (const route of prerenderRoutes.filter((path) => !metaFor(path).noindex)) {
      const data = structuredDataFor(route)
      expect(data, route).not.toBeNull()
      const org = data['@graph'].find((node) => node['@id'] === 'https://mklabs.co.zw/#organization')
      expect(org, route).toMatchObject({ name: 'MKLabs', address: { addressLocality: 'Bulawayo', addressCountry: 'ZW' } })
    }
  })

  it('leaves private and missing pages without any', () => {
    expect(structuredDataFor('/admin')).toBeNull()
    expect(structuredDataFor('/nope')).toBeNull()
  })

  it('marks each product page up as software with a breadcrumb trail', () => {
    for (const slug of ['pos', 'accounting', 'school']) {
      const types = structuredDataFor(`/products/${slug}`)['@graph'].map((node) => node['@type'])
      expect(types, slug).toContain('SoftwareApplication')
      expect(types, slug).toContain('BreadcrumbList')
    }
  })

  it('gives each product the price its page shows, in US dollars, and its sign-up page', () => {
    const app = (slug) => structuredDataFor(`/products/${slug}`)['@graph'].find((node) => node['@type'] === 'SoftwareApplication')
    expect(app('pos').offers).toMatchObject({ price: '25', priceCurrency: 'USD' })
    expect(app('accounting').offers).toMatchObject({ price: '5', priceCurrency: 'USD' })
    expect(app('school').offers).toMatchObject({ price: '0.50', priceCurrency: 'USD' })
    expect(app('school').installUrl).toBe('https://core.mklabs.co.zw/signup?product=School')
    expect(app('pos').isPartOf.name).toBe('MKLabs Core ERP')
  })

  it('names MKLabs as the Zimbabwe company, apart from others with the same name', () => {
    const graph = structuredDataFor('/')['@graph']
    for (const type of ['WebSite', 'ProfessionalService']) {
      const node = graph.find((entry) => [].concat(entry['@type']).includes(type))
      expect(node.alternateName).toEqual(expect.arrayContaining(['MKLabs Zimbabwe', 'MKLabs Bulawayo']))
    }
  })

  it("describes Michael on his portfolio page and links him to MKLabs", () => {
    const graph = structuredDataFor('/michael')['@graph']
    const person = graph.find((node) => node['@type'] === 'Person')
    expect(person).toMatchObject({ name: 'Michael Junior Jere', worksFor: { '@id': 'https://mklabs.co.zw/#organization' } })
    expect(graph.find((node) => node['@type'] === 'ProfilePage').mainEntity['@id']).toBe(person['@id'])
    expect(graph[0].founder['@id']).toBe(person['@id'])
  })

  it('gives the same hours as the site and the Business Profile: open 24 hours, every day', () => {
    const hours = structuredDataFor('/')['@graph'][0].openingHoursSpecification
    expect(hours.dayOfWeek).toHaveLength(7)
    expect(hours).toMatchObject({ opens: '00:00', closes: '23:59' })
  })

  it('gives the main business number first, the same as the Google Business Profile', () => {
    const org = structuredDataFor('/')['@graph'][0]
    expect(org.telephone).toBe('+263718621427')
  })

  it('never lists an empty social profile', () => {
    const org = structuredDataFor('/')['@graph'][0]
    for (const url of org.sameAs || []) expect(url).toMatch(/^https:\/\//)
  })
})
