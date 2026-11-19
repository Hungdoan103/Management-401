import { Bot, Gauge } from 'lucide-react'
import { Callout, Card, Slide } from '../ui/Slide'
import type { SlideComponentProps } from '.'

export default function Slide10({ leaving }: SlideComponentProps) {
  return (
    <Slide n={10} leaving={leaving} hint="Illustration · four levers · drag to tilt">
      <div className="col">
        <Card id="s10-r1" i={3} badge="01" title="Integrate AI & digital technology" tone="sky" className="card-tight">
          Push AI into store–warehouse collaboration; personalise journeys for loyal customers; and optimise e-commerce
          fulfilment so digital scale matches big-box cost leadership.
        </Card>
        <Card id="s10-r2" i={4} badge="02" title="Tighten supply-chain oversight (incl. blockchain)" tone="amber" className="card-tight">
          Expand partner audits toward <b>100% coverage</b>; apply blockchain to trace sustainable timber so shoppers
          can see the origin of materials in products they buy.
        </Card>
        <Card id="s10-r3" i={5} badge="03" title="Accelerate Scope 3 decarbonisation" tone="lime" className="card-tight">
          Work tightly with logistics partners and manufacturers to cut <b>indirect</b> emissions across the full
          operating chain — beyond the Scope 1 &amp; 2 gains already booked.
        </Card>
        <Card id="s10-r4" i={6} badge="04" title="Develop inclusive leadership" tone="coral" className="card-tight">
          Train managers for multicultural capability and build equitable, lasting engagement so inclusion scales with
          store growth (Pham et al., 2024).
        </Card>
        <Card id="s10-insight" i={7} icon={Bot} title="Overall direction" className="card-feature">
          Pair cost leadership with digital, ethical and inclusive upgrades so advantage stays durable — technology
          without accountability will not hold (Wesfarmers Limited, 2025; Liu &amp; Song, 2024).
        </Card>
        <Callout id="s10-kpi" i={8} label="Managerial implication:" icon={Gauge}>
          Track financial, supplier-audit, Scope 3 and people KPIs on one dashboard — each lever fails if measured in
          isolation.
        </Callout>
      </div>
    </Slide>
  )
}
