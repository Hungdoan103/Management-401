import { useEffect } from 'react'
import {
  Anchor,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Compass,
  Globe,
  HeartHandshake,
  Landmark,
  LayoutGrid,
  Leaf,
  Maximize,
  Radar,
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
  type LucideIcon,
} from 'lucide-react'
import { SLIDE_COUNT, useDeck } from '../store'
import { SLIDES, pad2 } from '../meta'
import { toggleFullscreen } from '../util'

const SLIDE_ICONS: LucideIcon[] = [
  Sparkles,
  Globe,
  Landmark,
  Radar,
  TrendingUp,
  ShieldCheck,
  HeartHandshake,
  Leaf,
  Anchor,
  Compass,
  Scale,
  BookOpen,
]

/** Prev / next / overview / fullscreen buttons. They fade out while the pointer is idle. */
export function Controls() {
  const index = useDeck((s) => s.index)
  const { next, prev, setOverview } = useDeck.getState()
  return (
    <nav className="controls" aria-label="Slide navigation">
      <button onClick={prev} disabled={index === 0} title="Previous (←)" aria-label="Previous slide">
        <ChevronLeft size={18} />
      </button>
      <span className="controls-count">
        {pad2(index + 1)}
        <i> / {SLIDE_COUNT}</i>
      </span>
      <button onClick={next} disabled={index === SLIDE_COUNT - 1} title="Next (→)" aria-label="Next slide">
        <ChevronRight size={18} />
      </button>
      <span className="controls-gap" />
      <button onClick={() => setOverview(true)} title="All slides (O)" aria-label="Slide overview">
        <LayoutGrid size={16} />
      </button>
      <button onClick={toggleFullscreen} title="Fullscreen (F)" aria-label="Toggle fullscreen">
        <Maximize size={16} />
      </button>
    </nav>
  )
}

/** Thin segmented progress line pinned to the bottom edge of the screen. */
export function ProgressBar() {
  const index = useDeck((s) => s.index)
  return (
    <div className="progress" aria-hidden>
      {SLIDES.map((_, i) => (
        <i key={i} className={i < index ? 'done' : i === index ? 'now' : ''} />
      ))}
    </div>
  )
}

/** Grid of all slides (press O) for jumping around during Q&A. */
export function Overview() {
  const open = useDeck((s) => s.overview)
  const index = useDeck((s) => s.index)
  const { go, setOverview } = useDeck.getState()

  useEffect(() => {
    if (open) document.querySelector<HTMLButtonElement>('.ov-tile.is-current')?.focus()
  }, [open])

  return (
    <div className={`overview${open ? ' is-open' : ''}`} aria-hidden={!open} onClick={() => setOverview(false)}>
      <div className="ov-head">
        <span>All slides</span>
        <button onClick={() => setOverview(false)} aria-label="Close overview" tabIndex={open ? 0 : -1}>
          <X size={18} />
        </button>
      </div>
      <div className="ov-grid" onClick={(e) => e.stopPropagation()}>
        {SLIDES.map((s, i) => {
          const Icon = SLIDE_ICONS[i]
          return (
            <button
              key={i}
              className={`ov-tile${i === index ? ' is-current' : ''}`}
              style={{ ['--i' as string]: i }}
              tabIndex={open ? 0 : -1}
              onClick={() => go(i)}
            >
              <span className="ov-no">{pad2(i + 1)}</span>
              <Icon className="ov-icon" size={22} strokeWidth={1.6} />
              <span className="ov-section">{s.section}</span>
              <span className="ov-title">{s.title}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
