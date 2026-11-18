import { Building, CircleDollarSign, ListChecks, Store, Target, Users } from 'lucide-react'
import { Card, Row, Slide, Stat } from '../ui/Slide'
import type { SlideComponentProps } from '.'

export default function Slide02({ leaving }: SlideComponentProps) {
  return (
    <Slide
      n={2}
      leaving={leaving}
      footer="Sources: Wesfarmers Limited (2025); Mahajan et al. (2023)."
      hint="Illustrative store network · drag to rotate"
    >
      <div className="col">
        <Row cols={3}>
          <Stat id="s2-stores" i={3} value="511" label="Stores" icon={Store} tone="lime" />
          <Stat id="s2-employees" i={4} value="53,000+" label="Employees" icon={Users} tone="mint" />
          <Stat id="s2-revenue" i={5} value="A$19.595bn" label="FY2025 Revenue" icon={CircleDollarSign} tone="amber" />
        </Row>
        <Card id="s2-context" i={6} icon={Building} title="Organisation and Case Context">
          Leading home improvement and lifestyle retailer in Australia and New Zealand; a Wesfarmers division
          (Wesfarmers Limited, 2025).
        </Card>
        <Card id="s2-issues" i={7} icon={ListChecks} title="Key Management Issues" tone="amber">
          Low-price competitiveness; digital pressures; ethical sourcing; environmental sustainability; workforce
          inclusion and culture.
        </Card>
        <Card id="s2-why" i={8} icon={Target} title="Why These Issues Matter" tone="lime">
          These issues shape profitability, competitive advantage, stakeholder trust and long-term resilience (Mahajan
          et al., 2023).
        </Card>
      </div>
    </Slide>
  )
}
