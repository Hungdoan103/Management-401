import { SLIDE_MEDIA } from './mediaMap'

const warmed = new Set<string>()

function warmImage(url: string) {
  if (warmed.has(url)) return
  warmed.add(url)
  const img = new Image()
  img.decoding = 'async'
  img.src = url
}

function warmVideo(url: string) {
  if (warmed.has(url)) return
  warmed.add(url)
  // Low-priority fetch fills the HTTP cache so the next slide's <video> starts instantly.
  void fetch(url, { method: 'GET', mode: 'cors', credentials: 'omit', cache: 'force-cache' }).catch(() => {
    warmed.delete(url)
  })
}

/** Warm current + nearby posters/clips while the presenter reads the slide. */
export function prefetchMediaAround(index: number) {
  for (const i of [index, index + 1, index + 2, index - 1]) {
    const media = SLIDE_MEDIA[i]
    if (!media) continue
    warmImage(media.image)
    if (media.video) warmVideo(media.video)
  }
}
