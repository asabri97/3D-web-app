import { useEffect, useRef, type RefObject } from 'react'
import { cutoutAlpha, edgeFade, videoCrop, type SceneMode } from '../utils/cutout'

const SOURCES: Record<SceneMode, string> = {
  koi: '/koi.mp4',
  jelly: '/jelly.mp4',
}

type CreatureCutoutProps = {
  mode: SceneMode
  sound: boolean
  videoRef: RefObject<HTMLVideoElement | null>
}

export function CreatureCutout({ mode, sound, videoRef }: CreatureCutoutProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    const view = canvas.getContext('2d')
    if (!view) return
    const crop = videoCrop(mode)
    const source = document.createElement('canvas')
    source.width = crop.width
    source.height = crop.height
    const sourceCtx = source.getContext('2d', { willReadFrequently: true })
    if (!sourceCtx) return

    let frame = 0
    let stopped = false
    let started = false

    const paint = () => {
      if (stopped) return
      const viewWidth = canvas.clientWidth
      const viewHeight = canvas.clientHeight
      if (video.readyState >= 2 && viewWidth > 0 && viewHeight > 0) {
        sourceCtx.drawImage(video, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height)
        const image = sourceCtx.getImageData(0, 0, crop.width, crop.height)
        for (let p = 0; p < crop.width * crop.height; p++) {
          const i = p * 4
          const base = cutoutAlpha(image.data[i], image.data[i + 1], image.data[i + 2], mode)
          const fade = edgeFade(p % crop.width, crop.width)
          image.data[i + 3] = fade === 1 ? base : Math.round(base * fade)
        }
        sourceCtx.putImageData(image, 0, 0)

        const ratio = Math.min(window.devicePixelRatio || 1, 2)
        const width = Math.max(2, Math.round(viewWidth * ratio))
        const height = Math.max(2, Math.round(viewHeight * ratio))
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width
          canvas.height = height
        }
        view.imageSmoothingEnabled = true
        view.imageSmoothingQuality = 'high'
        view.clearRect(0, 0, width, height)
        view.drawImage(source, 0, 0, width, height)
      }
      frame = window.requestAnimationFrame(paint)
    }

    const start = () => {
      if (started) return
      started = true
      video.muted = !sound
      video.volume = 1
      void video.play()?.catch(() => {
        video.muted = true
        void video.play()
      })
      frame = window.requestAnimationFrame(paint)
    }

    video.addEventListener('loadeddata', start)
    if (video.readyState >= 2) start()
    return () => {
      stopped = true
      window.cancelAnimationFrame(frame)
      video.removeEventListener('loadeddata', start)
    }
  }, [mode, videoRef])

  return (
    <div className="creature">
      <video ref={videoRef} src={SOURCES[mode]} muted={!sound} loop playsInline autoPlay preload="auto" />
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
