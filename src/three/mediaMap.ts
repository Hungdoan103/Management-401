/** Hero media for slides that use illustrated / animated art instead of procedural 3D.
 *  Source files live in `datas/Bunning/` and are served from `public/media/bunning/`.
 */
export type MediaSpec = {
  image: string
  video?: string
}

/** Prefer root-absolute paths so Three/useTexture resolves reliably under Vite. */
const base = '/media/bunning'
/** Bump when recompressing assets so browsers skip stale immutable caches. */
const ver = '3'
const asset = (name: string) => `${base}/${name}?v=${ver}`

/** Index 0 = slide 1. Null keeps the procedural 3D scene. */
export const SLIDE_MEDIA: Array<MediaSpec | null> = [
  null, // 1 — title (no Bunning asset)
  { image: asset('slide-02.jpg'), video: asset('slide-02.mp4') },
  { image: asset('slide-03.jpg'), video: asset('slide-03.mp4') },
  { image: asset('slide-04.jpg'), video: asset('slide-04.mp4') },
  { image: asset('slide-05.jpg'), video: asset('slide-05.mp4') },
  { image: asset('slide-06.jpg') }, // no mp4 in datas
  { image: asset('slide-07.jpg'), video: asset('slide-07.mp4') },
  { image: asset('slide-08.jpg'), video: asset('slide-08.mp4') },
  { image: asset('slide-09.jpg'), video: asset('slide-09.mp4') },
  { image: asset('slide-10.jpg'), video: asset('slide-10.mp4') },
  null, // 11 — conclusion
  null, // 12 — references
  null, // 13 — Q&A
]
