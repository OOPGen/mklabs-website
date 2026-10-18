import { describe, expect, it } from 'vitest'
import { contact, waLink, whatsappPhone } from '../src/data/site.js'

describe('contact numbers', () => {
  it('lists the main business number first', () => {
    expect(contact.phones[0].label).toBe('0718 621 427')
  })

  it('sends the WhatsApp buttons to the main number, and labels them with it', () => {
    expect(contact.whatsapp).toBe(contact.phones[0].wa)
    expect(whatsappPhone).toBe(contact.phones[0])
    expect(waLink('Hi')).toBe('https://wa.me/263718621427?text=Hi')
  })

  it('can open WhatsApp on either number', () => {
    expect(contact.phones.map((phone) => waLink('Hi', phone.wa))).toEqual([
      'https://wa.me/263718621427?text=Hi',
      'https://wa.me/263786233766?text=Hi',
    ])
  })
})
