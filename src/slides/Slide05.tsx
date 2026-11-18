import { BadgeDollarSign, Scale, TrendingUp } from 'lucide-react'
import { Callout, Card, Row, Slide, Stat } from '../ui/Slide'
import type { SlideComponentProps } from '.'

export default function Slide05({ leaving }: SlideComponentProps) {
  return (
    <Slide
      n={5}
      leaving={leaving}
      footer="Source: Wesfarmers Limited (2025). VRIO interpretation."
      hint="Each VRIO test passed is a step up"
    >
      <div className="col">
        <Card id="s5-v" i={3} badge="V" title="Value" tone="mint" className="card-tight">
          Brand, purchasing scale and store network.
        </Card>
        <Card id="s5-r" i={4} badge="R" title="Rarity" tone="lime" className="card-tight">
          Scale and integrated capabilities are relatively uncommon.
        </Card>
        <Card id="s5-i" i={5} badge="I" title="Imitability" tone="sky" className="card-tight">
          Established network and relationships are costly to replicate.
        </Card>
        <Card id="s5-o" i={6} badge="O" title="Organisation" tone="amber" className="card-tight">
          Operations coordinate stores, people and logistics.
        </Card>
        <Row cols={2}>
          <Stat id="s5-rev" i={7} inline value="+3.3%" label="FY2025 Revenue Growth" icon={TrendingUp} tone="amber" />
          <Stat
            id="s5-earn"
            i={8}
            inline
            value="+3.8%"
            label="FY2025 Earnings Growth"
            icon={BadgeDollarSign}
            tone="lime"
          />
        </Row>
        <Callout id="s5-judge" i={9} label="Critical judgement:" icon={Scale}>
          Strong positioning, but future advantage depends on innovation, cost discipline and responsible investment.
        </Callout>
      </div>
    </Slide>
  )
}
