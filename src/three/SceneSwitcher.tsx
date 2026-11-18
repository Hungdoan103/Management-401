import { useEffect, useRef, useState, type ComponentType } from 'react'
import { useDeck } from '../store'
import { SceneShell } from './kit'
import Scene01 from './scenes/Scene01'
import Scene02 from './scenes/Scene02'
import Scene03 from './scenes/Scene03'
import Scene04 from './scenes/Scene04'
import Scene05 from './scenes/Scene05'
import Scene06 from './scenes/Scene06'
import Scene07 from './scenes/Scene07'
import Scene08 from './scenes/Scene08'
import Scene09 from './scenes/Scene09'
import Scene10 from './scenes/Scene10'
import Scene11 from './scenes/Scene11'
import Scene12 from './scenes/Scene12'
import Scene13 from './scenes/Scene13'

const SCENES: ComponentType[] = [
  Scene01,
  Scene02,
  Scene03,
  Scene04,
  Scene05,
  Scene06,
  Scene07,
  Scene08,
  Scene09,
  Scene10,
  Scene11,
  Scene12,
  Scene13,
]

interface Mounted {
  key: number
  index: number
  phase: 'in' | 'out'
  dir: 1 | -1
}

const EXIT_MS = 700

/** Mounts the 3D model of the current slide and lets the previous one fly out. */
export default function SceneSwitcher() {
  const index = useDeck((s) => s.index)
  const serial = useRef(1)
  const [mounted, setMounted] = useState<Mounted[]>(() => [{ key: 0, index, phase: 'in', dir: 1 }])

  useEffect(() => {
    const dir = useDeck.getState().dir
    setMounted((list) => {
      if (list.some((m) => m.index === index && m.phase === 'in')) return list
      return [
        ...list.filter((m) => m.index !== index).map((m): Mounted => ({ ...m, phase: 'out', dir })),
        { key: serial.current++, index, phase: 'in', dir },
      ]
    })
    const t = window.setTimeout(() => setMounted((list) => list.filter((m) => m.phase === 'in')), EXIT_MS)
    return () => window.clearTimeout(t)
  }, [index])

  return (
    <>
      {mounted.map((m) => {
        const Scene = SCENES[m.index]
        return (
          <SceneShell key={m.key} phase={m.phase} dir={m.dir}>
            <Scene />
          </SceneShell>
        )
      })}
    </>
  )
}
