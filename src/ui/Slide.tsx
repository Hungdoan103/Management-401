import { Fragment, useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { Rotate3d, type LucideIcon } from 'lucide-react'
import { SLIDE_COUNT, useDeck, useIsActive } from '../store'
import { SLIDES, pad2 } from '../meta'

export type Tone = 'mint' | 'lime' | 'amber' | 'sky' | 'coral' | 'cream'

/** reveal order -> css variable used for the staggered entrance */
const order = (i: number) => ({ '--i': i }) as CSSProperties

/** Hovering a card spotlights it AND its counterpart inside the 3D model. */
function useSpot(id?: string) {
  const isActive = useIsActive(id)
  if (!id) return { isActive, handlers: {} }
  const { setActive, clearActive } = useDeck.getState()
  return {
    isActive,
    handlers: {
      onPointerEnter: () => setActive(id),
      onPointerLeave: () => clearActive(id),
    },
  }
}

/* -------------------------------------------------------------------------- */
/* Slide frame                                                                 */
/* -------------------------------------------------------------------------- */

interface SlideProps {
  n: number
  leaving?: boolean
  footer?: ReactNode
  /** small caption under the 3D model explaining what it is */
  hint?: string
  className?: string
  children: ReactNode
  /** render a custom header instead of the standard kicker + title */
  bare?: boolean
}

export function Slide({ n, leaving, footer, hint, className = '', children, bare }: SlideProps) {
  const meta = SLIDES[n - 1]
  const dir = useDeck((s) => s.dir)
  const hasActive = useDeck((s) => !!s.active && meta.spot.includes(s.active))
  return (
    <section
      className={`slide slide-${n} ${className}${leaving ? ' leaving' : ''}${hasActive ? ' has-active' : ''}`}
      style={{ '--dir': dir } as CSSProperties}
      aria-hidden={leaving}
    >
      <header className="top">
        <div className="kicker reveal" style={order(0)}>
          <span className="kicker-mark" />
          <span>{meta.section}</span>
          {meta.part && (
            <>
              <span className="kicker-sep">|</span>
              <span className="kicker-part">{meta.part}</span>
            </>
          )}
        </div>
        <div className="pageno reveal" style={order(0)}>
          {pad2(n)} <i>/ {SLIDE_COUNT}</i>
        </div>
      </header>
      {!bare && (
        <h1 className="title">
          <SplitWords text={meta.title} />
        </h1>
      )}
      <div className="body">{children}</div>
      {footer && (
        <footer className="source reveal" style={order(12)}>
          {footer}
        </footer>
      )}
      {hint && (
        <div className="hero-hint reveal" style={order(14)}>
          <Rotate3d size={14} strokeWidth={1.6} />
          <span>{hint}</span>
        </div>
      )}
    </section>
  )
}

/** Splits a heading into words that rise into place one after another. */
export function SplitWords({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <Fragment key={i}>
          <span className="w">
            <span style={{ '--w': i } as CSSProperties}>{word}</span>
          </span>{' '}
        </Fragment>
      ))}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Content blocks                                                              */
/* -------------------------------------------------------------------------- */

interface CardProps {
  id?: string
  i: number
  icon?: LucideIcon
  /** short text shown instead of an icon, e.g. "V" or "01" */
  badge?: string
  title: ReactNode
  tone?: Tone
  className?: string
  children?: ReactNode
}

export function Card({ id, i, icon: Icon, badge, title, tone = 'mint', className = '', children }: CardProps) {
  const { isActive, handlers } = useSpot(id)
  return (
    <article className={`card reveal t-${tone} ${className}${isActive ? ' is-active' : ''}`} style={order(i)} {...handlers}>
      <div className={`tile${badge ? ' tile-badge' : ''}`}>
        {badge ? badge : Icon ? <Icon size={22} strokeWidth={1.7} /> : null}
      </div>
      <div className="card-text">
        <h3>{title}</h3>
        {children && <p>{children}</p>}
      </div>
    </article>
  )
}

interface StatProps {
  id?: string
  i: number
  value: string
  label: ReactNode
  /** line above the number (used when the deck puts the label first) */
  eyebrow?: ReactNode
  /** small trend line under the number, e.g. "Down from 17.0" */
  note?: ReactNode
  noteIcon?: LucideIcon
  icon?: LucideIcon
  tone?: Tone
  /** 0-100: draws a meter under the number */
  meter?: number
  inline?: boolean
  className?: string
}

export function Stat({
  id,
  i,
  value,
  label,
  eyebrow,
  note,
  noteIcon: NoteIcon,
  icon: Icon,
  tone = 'amber',
  meter,
  inline,
  className = '',
}: StatProps) {
  const { isActive, handlers } = useSpot(id)
  const delay = 380 + i * 70
  return (
    <article
      className={`stat reveal t-${tone}${inline ? ' stat-inline' : ''} ${className}${isActive ? ' is-active' : ''}`}
      style={order(i)}
      {...handlers}
    >
      {Icon && <Icon className="stat-icon" size={22} strokeWidth={1.6} />}
      {eyebrow && <div className="stat-eyebrow">{eyebrow}</div>}
      <div className="stat-value">
        <CountUp value={value} delay={delay} />
      </div>
      {label && <div className="stat-label">{label}</div>}
      {note && (
        <div className="stat-note">
          {NoteIcon && <NoteIcon size={15} strokeWidth={2.2} />}
          {note}
        </div>
      )}
      {meter !== undefined && (
        <div className="meter" style={{ '--pct': `${meter}%`, '--d': `${delay}ms` } as CSSProperties}>
          <i />
        </div>
      )}
    </article>
  )
}

/** A one-line verdict ("Critical judgement: ...") set apart from the cards. */
export function Callout({
  id,
  i,
  label,
  icon: Icon,
  tone = 'amber',
  children,
}: {
  id?: string
  i: number
  label: string
  icon?: LucideIcon
  tone?: Tone
  children: ReactNode
}) {
  const { isActive, handlers } = useSpot(id)
  return (
    <aside className={`callout reveal t-${tone}${isActive ? ' is-active' : ''}`} style={order(i)} {...handlers}>
      {Icon && <Icon size={20} strokeWidth={1.7} />}
      <p>
        <b>{label}</b> {children}
      </p>
    </aside>
  )
}

export function Row({ cols, children, className = '' }: { cols: 2 | 3; children: ReactNode; className?: string }) {
  return <div className={`row c${cols} ${className}`}>{children}</div>
}

/* -------------------------------------------------------------------------- */
/* Animated figures                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Counts up to a figure such as "A$19.595bn", "53,000+" or "+3.3%".
 * The final frame is always the exact source string.
 */
export function CountUp({ value, delay = 0, duration = 1600 }: { value: string; delay?: number; duration?: number }) {
  const [text, setText] = useState(value)

  useEffect(() => {
    const m = value.match(/^(\D*)(\d[\d,]*(?:\.\d+)?)(.*)$/)
    if (!m) {
      setText(value)
      return
    }
    const [, pre, num, post] = m
    const target = parseFloat(num.replace(/,/g, ''))
    const decimals = (num.split('.')[1] ?? '').length
    const nf = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: num.includes(','),
    })
    const fmt = (v: number) => pre + nf.format(v) + post

    let raf = 0
    const t0 = performance.now() + delay
    setText(fmt(0))
    const tick = (now: number) => {
      const p = Math.min(Math.max((now - t0) / duration, 0), 1)
      const eased = 1 - Math.pow(1 - p, 4)
      setText(p >= 1 ? value : fmt(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, delay, duration])

  // the hidden copy reserves the final width so the layout never jitters while counting
  return (
    <span className="countup">
      <span className="countup-ghost" aria-hidden>
        {value}
      </span>
      <span className="countup-live">{text}</span>
    </span>
  )
}
