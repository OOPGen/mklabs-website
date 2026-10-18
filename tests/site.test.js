import { describe, expect, it } from 'vitest'
import { contact, waLink, whatsappPhone } from '../src/data/site.js'

describe('contact numbers', () => {
  it('lists the main business number first', () => {
    expect(contact.phones[0].label).toBe('0718 621 427')
  })

  it('labels the WhatsApp buttons with the number they actually open', () => {
    expect(whatsappPhone.wa).toBe(contact.whatsapp)
    expect(waLink('Hi')).toBe(`https://wa.me/${whatsappPhone.wa}?text=Hi`)
  })
})
