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
    const types = structuredDataFor('/products/learncloud')['@graph'].map((node) => node['@type'])
    expect(types).toContain('SoftwareApplication')
    expect(types).toContain('BreadcrumbList')
  })

  it('points the POS software at its own subdomain', () => {
    const app = structuredDataFor('/', { posHost: true })['@graph'].find((node) => node['@type'] === 'SoftwareApplication')
    expect(app.url).toBe('https://pos.mklabs.co.zw/')
  })

  it('names MKLabs as the Zimbabwe company, apart from others with the same name', () => {
    const graph = structuredDataFor('/')['@graph']
    for (const type of ['WebSite', 'ProfessionalService']) {
      const node = graph.find((entry) => [].concat(entry['@type']).includes(type))
      expect(node.alternateName).toEqual(expect.arrayContaining(['MKLabs Zimbabwe', 'MKLabs Bulawayo']))
    }
  })

  it('never lists an empty social profile', () => {
    const org = structuredDataFor('/')['@graph'][0]
    for (const url of org.sameAs || []) expect(url).toMatch(/^https:\/\//)
  })
})
