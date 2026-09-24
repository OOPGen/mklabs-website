import { describe, expect, it } from 'vitest'
import { cleanLink, isLive, normalise, validate } from '../functions/_lib/promotions.js'

describe('cleanLink', () => {
  it.each([
    ['/contact', '/contact'],
    ['https://wa.me/263786233766', 'https://wa.me/263786233766'],
    ['mailto:info@mklabs.co.zw', 'mailto:info@mklabs.co.zw'],
    ['tel:+263786233766', 'tel:+263786233766'],
  ])('allows %s', (input, expected) => expect(cleanLink(input)).toBe(expected))

  it.each(['javascript:alert(1)', 'data:text/html,hi', '//evil.com', 'not a url', ''])('rejects %s', (input) =>
    expect(cleanLink(input)).toBe('')
  )
})

describe('normalise', () => {
  it('forces unknown input into the known shape', () => {
    const result = normalise({ title: '  Sale  ', ctaHref: 'javascript:x', startsAt: 'soon', extra: 'x' })
    expect(result).toMatchObject({ title: 'Sale', ctaHref: '', startsAt: '', active: true })
    expect(result).not.toHaveProperty('extra')
    expect(result.id).toMatch(/^promo-/)
  })
})

describe('validate', () => {
  const promo = (overrides) => ({ id: 'a', title: 'T', ctaLabel: '', ctaHref: '', startsAt: '', endsAt: '', ...overrides })

  it('accepts a valid list', () => expect(validate([promo()])).toBeNull())
  it('needs a title', () => expect(validate([promo({ title: '' })])).toMatch(/title/))
  it('needs a link for a button', () => expect(validate([promo({ ctaLabel: 'Go' })])).toMatch(/no link/))
  it('rejects end before start', () =>
    expect(validate([promo({ startsAt: '2026-02-01', endsAt: '2026-01-01' })])).toMatch(/ends before/))
  it('rejects duplicate ids', () => expect(validate([promo(), promo()])).toMatch(/share the id/))
  it('rejects too many', () =>
    expect(validate(Array.from({ length: 25 }, (_, i) => promo({ id: `p${i}` })))).toMatch(/At most/))
})

describe('isLive', () => {
  const today = '2026-09-24'
  it('respects the on/off switch', () => expect(isLive({ active: false }, today)).toBe(false))
  it('hides before the start date', () => expect(isLive({ active: true, startsAt: '2026-09-25' }, today)).toBe(false))
  it('hides after the end date', () => expect(isLive({ active: true, endsAt: '2026-09-23' }, today)).toBe(false))
  it('shows on the last day', () => expect(isLive({ active: true, endsAt: today }, today)).toBe(true))
})
