import { describe, expect, it } from 'vitest'
import { isValidEmail, toWhatsAppNumber } from '../functions/_lib/enquiry.js'

describe('toWhatsAppNumber', () => {
  it.each([
    ['0786 233 766', '263786233766'],
    ['786233766', '263786233766'],
    ['+263 78 623 3766', '263786233766'],
    ['00263786233766', '263786233766'],
    ['+44 7700 900123', '447700900123'],
    ['447700900123', '447700900123'],
  ])('links %s as %s', (input, expected) => {
    expect(toWhatsAppNumber(input)).toBe(expected)
  })

  it.each(['07700 900123', '123', '', null, '+1 23'])('refuses to guess the country of %s', (input) => {
    expect(toWhatsAppNumber(input)).toBe('')
  })
})

describe('isValidEmail', () => {
  it('accepts ordinary addresses', () => {
    expect(isValidEmail('info@mklabs.co.zw')).toBe(true)
    expect(isValidEmail('first.last+tag@example.com')).toBe(true)
  })

  it.each(['x" href="evil@a.com', 'a@b', 'a b@c.com', '<a@b.com>', 'a@b.c', '', `${'a'.repeat(250)}@b.com`])(
    'rejects %s',
    (input) => expect(isValidEmail(input)).toBe(false)
  )
})
