import type { CSSProperties } from 'react'
import { Slide } from '../ui/Slide'
import { useDeck, useIsActive } from '../store'
import type { SlideComponentProps } from '.'

/** [text before the link, link] - reproduced verbatim from the source deck (APA 7th). */
const REFERENCES: Array<[text: string, url: string]> = [
  [
    'Arian, A., Sands, J., & Tooley, S. (2023). Industry and stakeholder impacts on corporate social responsibility (CSR) and financial performance: Consumer vs. industrial sectors. Sustainability, 15(16), 12254.',
    'https://doi.org/10.3390/su151612254',
  ],
  [
    'Enbaia, E., Alzubi, A., Iyiola, K., & Aljuhmani, H. Y. (2024). The interplay between environmental ethics and sustainable performance: Does organizational green culture and green innovation really matter? Sustainability, 16(23), 10230.',
    'https://doi.org/10.3390/su162310230',
  ],
  [
    'Fritz, M. M. (2022). A supply chain view of sustainability management. Cleaner Production Letters, 3, 100023.',
    'https://doi.org/10.1016/j.clpl.2022.100023',
  ],
  [
    'Khan, F. U., & Badulescu, D. (2025). Sustainability pressures unveiled: Navigating the role of organizational sustainable culture in promoting sustainability performance. Sustainability, 17(3), 1322.',
    'https://doi.org/10.3390/su17031322',
  ],
  [
    'Liu, Y., & Song, G. (2023). Role of logistics integration capability in enhancing performance in omni-channel retailing: Supply chain integration as mediator. Sustainability, 15(11), 9053.',
    'https://doi.org/10.3390/su15119053',
  ],
  [
    'Liu, Y., & Song, G. (2024). Factors affecting supply chain integration in omni-channel retailing. Sustainability, 16(8), 3445.',
    'https://doi.org/10.3390/su16083445',
  ],
  [
    'Mahajan, R., Lim, W. M., Sareen, M., Kumar, S., & Panwar, R. (2023). Stakeholder theory. Journal of Business Research, 166, 114104.',
    'https://doi.org/10.1016/j.jbusres.2023.114104',
  ],
  [
    'Pham, V. K., Vu, T. N. Q., Phan, T. T., & Nguyen, N. A. (2024). The impact of organizational culture on employee performance: A case study at foreign-invested logistics service enterprises approaching sustainability development. Sustainability, 16(15), 6366.',
    'https://doi.org/10.3390/su16156366',
  ],
  [
    'Siems, E., Seuring, S., & Schilling, L. (2023). Stakeholder roles in sustainable supply chain management: A literature review. Journal of Business Economics, 93(4), 747–775.',
    'https://doi.org/10.1007/s11573-022-01117-5',
  ],
  ['Wesfarmers Limited. (2025). Annual report 2025.', 'https://www.wesfarmers.com.au'],
  [
    'Zhang, J., & Liu, Z. (2023). The impact of corporate social responsibility on financial performance and brand value. Sustainability, 15(24), 16864.',
    'https://doi.org/10.3390/su152416864',
  ],
]

/** the source deck splits the list 6 / 5 across two columns */
const SPLIT = 6

function Reference({ at }: { at: number }) {
  const id = `s12-r${at}`
  const isActive = useIsActive(id)
  const { setActive, clearActive } = useDeck.getState()
  const [text, url] = REFERENCES[at]
  return (
    <li
      className={`ref reveal${isActive ? ' is-active' : ''}`}
      style={{ '--i': 4 + at * 0.6 } as CSSProperties}
      onPointerEnter={() => setActive(id)}
      onPointerLeave={() => clearActive(id)}
    >
      {text}{' '}
      <a href={url} target="_blank" rel="noreferrer">
        {url}
      </a>
    </li>
  )
}

export default function Slide12({ leaving }: SlideComponentProps) {
  return (
    <Slide
      n={12}
      leaving={leaving}
      footer="Academic references and organisational reporting used in the Bunnings Group case analysis."
      hint="Hover a reference"
    >
      <p className="refs-sub reveal" style={{ '--i': 3 } as CSSProperties}>
        APA 7th Edition <i>|</i> Sources cited throughout Slides 2–11
      </p>
      <div className="refs">
        <ol>
          {REFERENCES.slice(0, SPLIT).map((_, k) => (
            <Reference key={k} at={k} />
          ))}
        </ol>
        <ol>
          {REFERENCES.slice(SPLIT).map((_, k) => (
            <Reference key={k} at={SPLIT + k} />
          ))}
        </ol>
      </div>
    </Slide>
  )
}
