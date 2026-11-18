import { Fragment, type CSSProperties } from 'react'
import { ClipboardCheck } from 'lucide-react'
import { Card, Slide } from '../ui/Slide'
import { useDeck, useIsActive } from '../store'
import type { SlideComponentProps } from '.'

const TERMS = ['Innovation', 'ethical accountability', 'inclusion', 'measurable sustainability']

/** "KEY MESSAGE | a + b + c + d = lasting advantage", set as an equation. */
function KeyMessage() {
  const id = 's11-key'
  const isActive = useIsActive(id)
  const { setActive, clearActive } = useDeck.getState()
  return (
    <aside
      className={`keymsg reveal${isActive ? ' is-active' : ''}`}
      style={{ '--i': 8 } as CSSProperties}
      onPointerEnter={() => setActive(id)}
      onPointerLeave={() => clearActive(id)}
    >
      <span className="keymsg-label">KEY MESSAGE</span>
      <span className="keymsg-sep">|</span>
      <span className="keymsg-eq">
        {TERMS.map((t, k) => (
          <Fragment key={t}>
            {k > 0 && <i> + </i>}
            <span>{t}</span>
          </Fragment>
        ))}
        <i> = </i>
        <strong>lasting advantage</strong>
      </span>
    </aside>
  )
}

export default function Slide11({ leaving }: SlideComponentProps) {
  return (
    <Slide n={11} leaving={leaving} hint="Cost leadership balanced with responsibility">
      <div className="col">
        <Card id="s11-assess" i={3} icon={ClipboardCheck} title="Overall Assessment" className="card-feature">
          Strong strategic alignment, operational resilience and stakeholder engagement, but cost leadership must be
          balanced with responsibility (Wesfarmers Limited, 2025; Mahajan et al., 2023).
        </Card>
        <Card id="s11-c1" i={4} badge="01" title="Strategic Competitiveness" tone="amber">
          Low prices, product choice and omnichannel capabilities support advantage (Wesfarmers Limited, 2025).
        </Card>
        <Card id="s11-c2" i={5} badge="02" title="Ethical and Sustainable Performance" tone="lime">
          Progress in safety, emissions and community engagement; supplier monitoring and waste diversion need
          attention.
        </Card>
        <Card id="s11-c3" i={6} badge="03" title="Organisational Culture" tone="sky">
          Integrity, teamwork and innovation support strategy and responsible management (Pham et al., 2024; Enbaia et
          al., 2024).
        </Card>
        <KeyMessage />
      </div>
    </Slide>
  )
}
