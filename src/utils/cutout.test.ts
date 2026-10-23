import { describe, expect, it } from 'vitest'
import { cutoutAlpha, edgeFade, sampleKey } from './cutout'

describe('cutoutAlpha', () => {
  it('removes the flat red field', () => {
    expect(cutoutAlpha(148, 4, 6)).toBe(0)
  })

  it('keeps every painted fish pixel fully opaque', () => {
    expect(cutoutAlpha(244, 70, 18)).toBe(255)
    expect(cutoutAlpha(210, 40, 22)).toBe(255)
    expect(cutoutAlpha(180, 22, 16)).toBe(255)
    expect(cutoutAlpha(40, 90, 80)).toBe(255)
    expect(cutoutAlpha(245, 230, 200)).toBe(255)
  })

  it('removes the black field and keeps the jellyfish solid', () => {
    expect(cutoutAlpha(0, 0, 0, 'jelly')).toBe(0)
    expect(cutoutAlpha(8, 6, 12, 'jelly')).toBe(0)
    expect(cutoutAlpha(80, 160, 255, 'jelly')).toBe(255)
    expect(cutoutAlpha(180, 90, 240, 'jelly')).toBe(255)
    expect(cutoutAlpha(20, 40, 90, 'jelly')).toBe(255)
  })
})

describe('edgeFade', () => {
  const width = 200

  it('feathers the side crop and leaves the body solid', () => {
    expect(edgeFade(0, width)).toBe(0)
    expect(edgeFade(width - 1, width)).toBe(0)
    expect(edgeFade(Math.floor(width * 0.08), width)).toBeGreaterThan(0)
    expect(edgeFade(Math.floor(width * 0.08), width)).toBeLessThan(1)
    expect(edgeFade(Math.floor(width * 0.2), width)).toBe(1)
    expect(edgeFade(Math.floor(width / 2), width)).toBe(1)
  })
})

describe('sampleKey', () => {
  it('picks the reddest corner instead of a pale scale', () => {
    const width = 8
    const height = 8
    const data = new Uint8ClampedArray(width * height * 4)
    data.fill(255)
    const red = (4 * width + 4) * 4
    data[red] = 150
    data[red + 1] = 2
    data[red + 2] = 4
    data[red + 3] = 255
    expect(sampleKey(data, width, height)).toEqual({ r: 150, g: 2, b: 4 })
  })
})
