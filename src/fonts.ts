// Fonts are bundled (no CDN) so the deck renders identically offline.
import frauncesUrl from '@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2?url'
import manropeUrl from '@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2?url'
import monoUrl from '@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2?url'

const faces: Array<[family: string, url: string, weight: string]> = [
  ['Fraunces', frauncesUrl, '100 900'],
  ['Manrope', manropeUrl, '200 800'],
  ['JetBrains Mono', monoUrl, '100 800'],
]

/** Registers the three typefaces and resolves once they are usable (also by canvas text). */
export async function loadFonts(): Promise<void> {
  const jobs = faces.map(async ([family, url, weight]) => {
    const face = new FontFace(family, `url(${url}) format('woff2')`, { weight, style: 'normal', display: 'block' })
    document.fonts.add(face)
    await face.load()
  })
  // Never block the deck on a font: fall back to system fonts after a short wait.
  await Promise.race([Promise.allSettled(jobs), new Promise((r) => setTimeout(r, 2500))])
}
