import { Fragment, type CSSProperties } from 'react'
import { Leaf, MonitorSmartphone, Tag, UsersRound } from 'lucide-react'
import { Card, Slide } from '../ui/Slide'
import { useDeck, useIsActive } from '../store'
import type { SlideComponentProps } from '.'

const TERMS = ['Omnichannel innovation', 'ethical accountability', 'workforce inclusion', 'measurable ESG']

function KeyMessage() {
  const id = 's11-key'
  const isActive = useIsActive(id)
  const { setActive, clearActive } = useDeck.getState()
  return (
    <aside
      className={`keymsg reveal${isActive ? ' is-active' : ''}`}
      style={{ '--i': 3 } as CSSProperties}
      onPointerEnter={() => setActive(id)}
      onPointerLeave={() => clearActive(id)}
    >
      <span className="keymsg-label">CORE TECHNOLOGY / SUSTAINED ADVANTAGE</span>
      <span className="keymsg-sep">|</span>
      <span className="keymsg-eq">
        {TERMS.map((t, k) => (
          <Fragment key={t}>
            {k > 0 && <i> + </i>}
            <span>{t}</span>
          </Fragment>
        ))}
        <i> = </i>
        <strong>lasting leadership</strong>
      </span>
    </aside>
  )
}

export default function Slide11({ leaving }: SlideComponentProps) {
  return (
    <Slide n={11} leaving={leaving} hint="Hover a lesson · drag to rotate">
      <div className="col">
        <KeyMessage />
        <Card id="s11-c1" i={4} icon={Tag} title="Low price ≠ weak ethics or quality" tone="amber">
          Cost leadership need not mean cutting product quality or ignoring supply ethics — Bunnings shows everyday low
          prices can still sit beside responsible governance.
        </Card>
        <Card id="s11-c2" i={5} icon={MonitorSmartphone} title="Digital change must be customer- & partner-centred" tone="sky">
          PowerPass and Click &amp; Collect succeed because they solve real pain points for households and Trade
          partners — not because “digital” was a slogan.
        </Card>
        <Card id="s11-c3" i={6} icon={Leaf} title="ESG creates value, not just compliance" tone="lime">
          Clean energy and waste control lower long-run operating cost while meeting stakeholder expectations — ESG is
          strategy, not a checklist.
        </Card>
        <Card id="s11-assess" i={7} icon={UsersRound} title="Multicultural community bonding is a hidden barrier" tone="coral">
          Loyalty built through Sausage Sizzle and local belonging is a distinctive, hard-to-copy advantage rivals
          struggle to imitate.
        </Card>
      </div>
    </Slide>
  )
}
