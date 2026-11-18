import { useEffect, useRef, useState, type ComponentType } from 'react'
import { useDeck } from '../store'
import Slide01 from './Slide01'
import Slide02 from './Slide02'
import Slide03 from './Slide03'
import Slide04 from './Slide04'
import Slide05 from './Slide05'
import Slide06 from './Slide06'
import Slide07 from './Slide07'
import Slide08 from './Slide08'
import Slide09 from './Slide09'
import Slide10 from './Slide10'
import Slide11 from './Slide11'
import Slide12 from './Slide12'
import Slide13 from './Slide13'

export interface SlideComponentProps {
  leaving?: boolean
}

const ALL: ComponentType<SlideComponentProps>[] = [
  Slide01,
  Slide02,
  Slide03,
  Slide04,
  Slide05,
  Slide06,
  Slide07,
  Slide08,
  Slide09,
  Slide10,
  Slide11,
  Slide12,
  Slide13,
]

const LEAVE_MS = 460

/** Renders the current slide, plus the previous one for the short time it takes to animate out. */
export function Deck() {
  const index = useDeck((s) => s.index)
  const [leaving, setLeaving] = useState<number | null>(null)
  const shown = useRef(index)

  useEffect(() => {
    if (shown.current === index) return
    setLeaving(shown.current)
    shown.current = index
    const t = window.setTimeout(() => setLeaving(null), LEAVE_MS)
    return () => window.clearTimeout(t)
  }, [index])

  const visible = leaving !== null && leaving !== index ? [leaving, index] : [index]
  return (
    <>
      {visible.map((i) => {
        const Comp = ALL[i]
        return <Comp key={i} leaving={i !== index} />
      })}
    </>
  )
}
