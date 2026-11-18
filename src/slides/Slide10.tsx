import { Gauge, Lightbulb } from 'lucide-react'
import { Callout, Card, Slide } from '../ui/Slide'
import type { SlideComponentProps } from '.'

export default function Slide10({ leaving }: SlideComponentProps) {
  return (
    <Slide n={10} leaving={leaving} hint="Four levers that only work when they turn together">
      <div className="col">
        <Card id="s10-insight" i={3} icon={Lightbulb} title="Overall Management Insight" className="card-feature">
          Balance cost leadership and omnichannel innovation with ethical and sustainable stakeholder responsibilities
          (Wesfarmers Limited, 2025; Mahajan et al., 2023).
        </Card>
        <Card id="s10-r1" i={4} badge="01" title="Strengthen Digital Integration" tone="sky" className="card-tight">
          Improve omnichannel coordination and logistics efficiency (Liu &amp; Song, 2024).
        </Card>
        <Card id="s10-r2" i={5} badge="02" title="Enhance Ethical Supply Chains" tone="amber" className="card-tight">
          Strengthen risk-based supplier monitoring and corrective actions (Siems et al., 2023).
        </Card>
        <Card id="s10-r3" i={6} badge="03" title="Accelerate Sustainability" tone="lime" className="card-tight">
          Improve waste diversion and measurable environmental outcomes (Fritz, 2022).
        </Card>
        <Card id="s10-r4" i={7} badge="04" title="Develop Inclusive Leadership" tone="coral" className="card-tight">
          Strengthen participation, wellbeing and sustainability training (Pham et al., 2024; Khan &amp; Badulescu,
          2025).
        </Card>
        <Callout id="s10-kpi" i={8} label="Managerial implication:" icon={Gauge}>
          Track financial, employee, supplier and environmental KPIs together.
        </Callout>
      </div>
    </Slide>
  )
}
