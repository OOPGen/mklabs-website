import { describe, expect, it } from 'vitest'
import { socials } from '../src/data/site.js'

describe('social links', () => {
  it('lists Facebook, X, Instagram and TikTok', () => {
    expect(socials.map((social) => social.id)).toEqual(['facebook', 'x', 'instagram', 'tiktok'])
  })

  it('only ever links to a full https address (or nothing yet)', () => {
    for (const social of socials) {
      if (social.url) expect(social.url).toMatch(/^https:\/\/[^\s]+$/)
    }
  })
})
