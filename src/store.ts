import { create } from 'zustand'
import { SLIDES } from './meta'

export const SLIDE_COUNT = SLIDES.length

interface DeckState {
  /** zero-based index of the slide on screen */
  index: number
  /** direction of the last navigation: 1 = forward, -1 = back */
  dir: 1 | -1
  /** id of the spotlighted content item (shared by the HTML cards and the 3D parts) */
  active: string | null
  overview: boolean
  quality: 'high' | 'low'
  go: (i: number) => void
  next: () => void
  prev: () => void
  setActive: (id: string | null) => void
  clearActive: (id: string) => void
  spot: (step: 1 | -1) => void
  setOverview: (v: boolean) => void
  toggleQuality: () => void
}

const fromHash = () => {
  const n = parseInt(window.location.hash.replace(/[^0-9]/g, ''), 10)
  return Number.isFinite(n) ? Math.min(Math.max(n - 1, 0), SLIDES.length - 1) : 0
}

export const useDeck = create<DeckState>((set, get) => ({
  index: fromHash(),
  dir: 1,
  active: null,
  overview: false,
  quality: 'high',
  go: (i) => {
    const { index } = get()
    const target = Math.min(Math.max(i, 0), SLIDE_COUNT - 1)
    if (target === index) {
      set({ overview: false })
      return
    }
    set({ index: target, dir: target > index ? 1 : -1, active: null, overview: false })
  },
  next: () => get().go(get().index + 1),
  prev: () => get().go(get().index - 1),
  setActive: (id) => {
    if (get().active !== id) set({ active: id })
  },
  clearActive: (id) => {
    if (get().active === id) set({ active: null })
  },
  spot: (step) => {
    const { index, active } = get()
    const ids = SLIDES[index].spot
    if (!ids.length) return
    const at = active ? ids.indexOf(active) : -1
    const nextAt = at === -1 ? (step === 1 ? 0 : ids.length - 1) : at + step
    set({ active: nextAt < 0 || nextAt >= ids.length ? null : ids[nextAt] })
  },
  setOverview: (v) => set({ overview: v }),
  toggleQuality: () => set({ quality: get().quality === 'high' ? 'low' : 'high' }),
}))

/** true while `id` is the spotlighted item */
export const useIsActive = (id?: string) => useDeck((s) => !!id && s.active === id)
