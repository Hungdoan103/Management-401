import type { CSSProperties } from 'react'
import { Slide } from '../ui/Slide'
import type { SlideComponentProps } from '.'

const i = (n: number) => ({ '--i': n }) as CSSProperties

const PRESENTERS = ['Manohar Kumar Singh', 'Katherine Pui', 'Dhiraj Thapa', 'Xuan Hung Doan']

export default function Slide01({ leaving }: SlideComponentProps) {
  return (
    <Slide n={1} leaving={leaving} hint="Drag to rotate">
      <p className="subtitle reveal" style={i(5)}>
        A Critical Case Analysis of Bunnings Group (Wesfarmers)
      </p>
      <div className="rule reveal" style={i(6)} />
      <p className="tagline reveal" style={i(7)}>
        Group Case Analysis and Presentation
      </p>

      <dl className="credits">
        <div className="reveal" style={i(8)}>
          <dt>Presented by:</dt>
          <dd className="people">
            {PRESENTERS.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </dd>
        </div>
        <div className="reveal" style={i(9)}>
          <dt>Course:</dt>
          <dd>MGMT401 Contemporary Management and Leadership</dd>
        </div>
        <div className="reveal" style={i(10)}>
          <dt>Institution:</dt>
          <dd>Canterbury Institute of Management</dd>
        </div>
        <div className="reveal" style={i(11)}>
          <dt>Presentation Date:</dt>
          <dd>
            29<sup>th</sup> Nov. 2026
          </dd>
        </div>
      </dl>

      <div className="keys reveal" style={i(16)}>
        <span>
          <kbd>→</kbd> Next
        </span>
        <span>
          <kbd>↑</kbd>
          <kbd>↓</kbd> Spotlight a point
        </span>
        <span>
          <kbd>O</kbd> All slides
        </span>
        <span>
          <kbd>F</kbd> Fullscreen
        </span>
      </div>
    </Slide>
  )
}
