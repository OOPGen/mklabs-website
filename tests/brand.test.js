import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { products } from '../src/data/products.js'

// The brand palette, as defined in @theme in src/index.css.
const palette = [...readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')
  .matchAll(/--color-[\w-]+:\s*(#[0-9A-Fa-f]{6})/g)].map((m) => m[1].toUpperCase())

describe('product colours', () => {
  it('every product accent is a brand palette colour', () => {
    for (const p of products) expect(palette, `${p.name} accent ${p.accent}`).toContain(p.accent.toUpperCase())
  })

  it('POS, Accounting and School use purple, midnight and corn', () => {
    const accent = Object.fromEntries(products.map((p) => [p.slug, p.accent]))
    expect([accent.pos, accent.accounting, accent.school]).toEqual(['#6A3BEF', '#0F1A4A', '#12A1FF'])
  })
})
