import { useEffect, useRef, useState } from 'react'
import { CreatureCutout } from './components/CreatureCutout'
import type { SceneMode } from './utils/cutout'

type Theme = 'light' | 'dark'

function initialTheme(): Theme {
  try {
    return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(initialTheme)
  const [sound, setSound] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const scene: SceneMode = theme === 'dark' ? 'jelly' : 'koi'

  const toggleSound = () => {
    const next = !sound
    const video = videoRef.current
    if (video) {
      video.muted = !next
      video.volume = 1
      void video.play()
    }
    setSound(next)
  }

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    const color = theme === 'dark' ? '#000000' : '#960204'
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color)
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* ignore private-mode storage failures */
    }
  }, [theme])

  return (
    <main>
      <section className="stage" aria-label="Living color">
        <header className="mark">
          <span>abrish</span>
        </header>
        <div className="theme-switch" role="group" aria-label="Color mode">
          <button
            type="button"
            aria-label="Light mode"
            aria-pressed={theme === 'light'}
            onClick={() => setTheme('light')}
          >
            <SunIcon />
          </button>
          <button
            type="button"
            aria-label="Dark mode"
            aria-pressed={theme === 'dark'}
            onClick={() => setTheme('dark')}
          >
            <MoonIcon />
          </button>
        </div>
        <h1>
          <span className="word">LIVING</span>
          <span className="daily">
            <span className="byline">light</span>
            <span className="word">COLOR</span>
            <span className="role">dark</span>
          </span>
        </h1>
        <CreatureCutout key={scene} mode={scene} sound={sound} videoRef={videoRef} />
        <button
          type="button"
          className="volume"
          aria-label={sound ? 'Turn volume off' : 'Turn volume on'}
          aria-pressed={sound}
          onClick={toggleSound}
        >
          {sound ? <VolumeOnIcon /> : <VolumeOffIcon />}
        </button>
        <div className="actions">
          <a href="#work">View work</a>
          <a href="#about">About me</a>
        </div>
      </section>
      <section id="work" className="panel">
        <h2>Work</h2>
        <p>A painted koi in the light. A luminous jellyfish in the dark.</p>
      </section>
      <section id="about" className="panel">
        <h2>About</h2>
        <p>abrish. Interface design, made to be looked at closely.</p>
      </section>
    </main>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path
        d="M12 2.5v2.2M12 19.3v2.2M4.8 4.8l1.6 1.6M17.6 17.6l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.8 19.2l1.6-1.6M17.6 6.4l1.6-1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

function VolumeOnIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4.2 9.6c0-.8.6-1.4 1.4-1.4h2.2l3.7-3.1c.5-.4 1.2-.1 1.2.6v12.6c0 .7-.7 1-1.2.6l-3.7-3.1H5.6c-.8 0-1.4-.6-1.4-1.4V9.6z"
        fill="currentColor"
      />
      <path
        d="M15.4 9.5a3.1 3.1 0 0 1 0 5M17.7 7.3a6 6 0 0 1 0 9.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function VolumeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4.2 9.6c0-.8.6-1.4 1.4-1.4h2.2l3.7-3.1c.5-.4 1.2-.1 1.2.6v12.6c0 .7-.7 1-1.2.6l-3.7-3.1H5.6c-.8 0-1.4-.6-1.4-1.4V9.6z"
        fill="currentColor"
      />
      <path
        d="M16.2 10.1l3.6 3.8M19.8 10.1l-3.6 3.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M15.5 3.2a8.2 8.2 0 1 0 5.3 12.6A7 7 0 0 1 15.5 3.2z"
        fill="currentColor"
      />
    </svg>
  )
}
