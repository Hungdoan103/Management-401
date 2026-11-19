/** Hero media for slides that use illustrated / animated art instead of procedural 3D.
 *  Source files live in `datas/Bunning/` and are served from `public/media/bunning/`.
 */
export type MediaSpec = {
  image: string
  video?: string
}

/** Prefer root-absolute paths so Three/useTexture resolves reliably under Vite. */
const base = '/media/bunning'

/** Index 0 = slide 1. Null keeps the procedural 3D scene. */
export const SLIDE_MEDIA: Array<MediaSpec | null> = [
  null, // 1 — title (no Bunning asset)
  { image: `${base}/slide-02.jpg`, video: `${base}/slide-02.mp4` }, // Slide 2.jpg + Slide 2.mp4
  { image: `${base}/slide-03.jpg`, video: `${base}/slide-03.mp4` }, // Slide 3.jpg + Slide 3.mp4
  { image: `${base}/slide-04.jpg`, video: `${base}/slide-04.mp4` }, // Slide 4.jpg + slide 4.mp4
  { image: `${base}/slide-05.jpg`, video: `${base}/slide-05.mp4` }, // Slide 5.jpg + Slide 5.mp4
  { image: `${base}/slide-06.jpg` }, // Slide 6.jpg (no mp4 in datas)
  { image: `${base}/slide-07.jpg`, video: `${base}/slide-07.mp4` }, // Slide 7.jpg + Slide 7.mp4
  { image: `${base}/slide-08.jpg`, video: `${base}/slide-08.mp4` }, // slide 8.jpg + Slide 8.mp4
  { image: `${base}/slide-09.jpg`, video: `${base}/slide-09.mp4` }, // Slide 9.jpg + Slide 9.mp4
  { image: `${base}/slide-10.jpg`, video: `${base}/slide-10.mp4` }, // Slide 10.jpg + slide 10.mp4
  null, // 11 — conclusion
  null, // 12 — references
  null, // 13 — Q&A
]
