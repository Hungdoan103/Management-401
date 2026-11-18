import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Experience from './three/Experience'
import { Deck } from './slides'
import { Controls, Overview, ProgressBar } from './ui/Chrome'
import { useDeck } from './store'
import { toggleFullscreen } from './util'

const STAGE_W = 1600
const STAGE_H = 900

/** The HTML layer is authored on a fixed 1600x900 stage and scaled to fit any screen / projector. */
function useStageScale() {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])
  return scale
}

/** Hides the cursor and the navigation chrome when the pointer rests, so nothing distracts while presenting. */
function useIdle(ms: number) {
  const [idle, setIdle] = useState(false)
  useEffect(() => {
    let timer = 0
    const wake = () => {
      setIdle(false)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setIdle(true), ms)
    }
    wake()
    window.addEventListener('pointermove', wake)
    window.addEventListener('pointerdown', wake)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('pointermove', wake)
      window.removeEventListener('pointerdown', wake)
    }
  }, [ms])
  return idle
}

function useDeckControls() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const deck = useDeck.getState()
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key

      if (deck.overview) {
        if (key === 'Escape' || key === 'o' || key === 'g') deck.setOverview(false)
        else if (key === 'ArrowRight' || key === 'ArrowDown') moveOverviewFocus(1)
        else if (key === 'ArrowLeft' || key === 'ArrowUp') moveOverviewFocus(-1)
        return
      }

      switch (key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
        case 'Enter':
        case 'n':
          e.preventDefault()
          deck.next()
          break
        case 'ArrowLeft':
        case 'PageUp':
        case 'Backspace':
        case 'p':
          e.preventDefault()
          deck.prev()
          break
        case 'ArrowDown':
          e.preventDefault()
          deck.spot(1)
          break
        case 'ArrowUp':
          e.preventDefault()
          deck.spot(-1)
          break
        case 'Home':
          deck.go(0)
          break
        case 'End':
          deck.go(Number.MAX_SAFE_INTEGER)
          break
        case 'Escape':
          deck.setActive(null)
          break
        case 'o':
        case 'g':
          deck.setOverview(true)
          break
        case 'f':
          toggleFullscreen()
          break
        case 'q':
          deck.toggleQuality()
          break
      }
    }

    // Wheel / trackpad: one slide per gesture.
    let acc = 0
    let lockedUntil = 0
    const onWheel = (e: WheelEvent) => {
      const deck = useDeck.getState()
      if (deck.overview) return
      const now = performance.now()
      if (now < lockedUntil) {
        acc = 0
        return
      }
      acc += e.deltaY
      if (Math.abs(acc) > 90) {
        if (acc > 0) deck.next()
        else deck.prev()
        acc = 0
        lockedUntil = now + 1100
      }
    }

    // Touch: horizontal swipe.
    let touchX = 0
    let touchY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchX = e.touches[0].clientX
      touchY = e.touches[0].clientY
    }
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchX
      const dy = e.changedTouches[0].clientY - touchY
      if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.5) return
      // swipes that start on the right-hand 3D zone are for rotating the model
      if (touchX > window.innerWidth * 0.6) return
      const deck = useDeck.getState()
      if (dx < 0) deck.next()
      else deck.prev()
    }

    const onHash = () => {
      const n = parseInt(window.location.hash.replace(/[^0-9]/g, ''), 10)
      if (Number.isFinite(n)) useDeck.getState().go(n - 1)
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('hashchange', onHash)
    // keep the address bar in sync so a refresh returns to the same slide
    const unsub = useDeck.subscribe((s, prev) => {
      if (s.index !== prev.index) history.replaceState(null, '', `#${s.index + 1}`)
    })
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('hashchange', onHash)
      unsub()
    }
  }, [])
}

function moveOverviewFocus(step: number) {
  const tiles = Array.from(document.querySelectorAll<HTMLButtonElement>('.ov-tile'))
  if (!tiles.length) return
  const at = tiles.indexOf(document.activeElement as HTMLButtonElement)
  const next = at === -1 ? useDeck.getState().index : (at + step + tiles.length) % tiles.length
  tiles[next]?.focus()
}

export default function App() {
  const root = useRef<HTMLDivElement>(null!)
  const scale = useStageScale()
  const idle = useIdle(2600)
  const quality = useDeck((s) => s.quality)
  useDeckControls()

  return (
    <div ref={root} className={`app${idle ? ' is-idle' : ''}`} style={{ '--s': scale } as CSSProperties}>
      <Experience eventSource={root} />
      <div className="fx fx-vignette" />
      <div className="fx fx-grain" />
      <div className="overlay">
        <div className="stage">
          <Deck />
          <Controls />
        </div>
      </div>
      <ProgressBar />
      <Overview />
      {quality === 'low' && <div className="quality-flag">Lite graphics · press Q for full quality</div>}
    </div>
  )
}
