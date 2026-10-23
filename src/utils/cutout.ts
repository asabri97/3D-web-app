export type Rgb = { r: number; g: number; b: number }

export type SceneMode = 'koi' | 'jelly'

const CROPS = {
  koi: { x: 528, y: 0, width: 863, height: 1080 },
  jelly: { x: 539, y: 0, width: 840, height: 1080 },
}

export function videoCrop(mode: SceneMode = 'koi') {
  return CROPS[mode]
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

export function edgeFade(x: number, width: number) {
  const fromSide = Math.min(x, width - 1 - x) / width
  return smoothstep(0, 0.16, fromSide)
}

export function cutoutAlpha(r: number, g: number, b: number, mode: SceneMode = 'koi') {
  if (mode === 'jelly') {
    const flatBlack = r < 18 && g < 18 && b < 24 && r + g + b < 42
    return flatBlack ? 0 : 255
  }
  const flatField = r > 105 && r < 185 && g < 18 && b < 20 && g + b < 30
  return flatField ? 0 : 255
}

export function sampleKey(data: Uint8ClampedArray, width: number, height: number): Rgb {
  const spots = [
    [4, 4],
    [width - 5, 4],
    [4, height - 5],
    [width - 5, height - 5],
    [Math.floor(width / 2), 4],
  ]
  let best: Rgb = { r: 150, g: 2, b: 4 }
  let score = -Infinity
  for (const [x, y] of spots) {
    const i = (y * width + x) * 4
    const r = data[i] ?? 0
    const g = data[i + 1] ?? 0
    const b = data[i + 2] ?? 0
    const next = r - g * 1.4 - b * 1.4
    if (next > score) {
      score = next
      best = { r, g, b }
    }
  }
  return best
}
