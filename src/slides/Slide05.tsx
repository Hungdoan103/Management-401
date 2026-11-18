import { BadgeDollarSign, Scale, TrendingUp } from 'lucide-react'
import { Callout, Card, Row, Slide, Stat } from '../ui/Slide'
import type { SlideComponentProps } from '.'

export default function Slide05({ leaving }: SlideComponentProps) {
  return (
    <Slide
      n={5}
      leaving={leaving}
      footer="Source: Wesfarmers Limited (2025). VRIO interpretation."
      hint="Each VRIO step · drag to rotate"
    >
      <div className="col">
        <Card id="s5-v" i={3} badge="V" title="Brand & reputation — Valuable · Rare · Hard to imitate" tone="mint" className="card-tight">
          Passes V, R and I → <b>sustained competitive advantage</b> through trusted brand equity with households and
          trade customers.
        </Card>
        <Card id="s5-r" i={4} badge="R" title="Warehouse store network (AU & NZ) — Valuable · Rare · Hard to imitate" tone="lime" className="card-tight">
          Dense geographic footprint creates a <b>very high barrier to entry</b> that new rivals struggle to match.
        </Card>
        <Card id="s5-i" i={5} badge="I" title="Purchasing / price-negotiation power — Valuable · Rare · Difficult" tone="sky" className="card-tight">
          Scale buying keeps <b>everyday low-price leadership</b> and multi-tier customer access across consumer and
          trade segments.
        </Card>
        <Card id="s5-o" i={6} badge="O" title="Omnichannel system & PowerPass — Valuable · Rare · Moderately imitable" tone="amber" className="card-tight">
          Organised digital–store capabilities deepen <b>B2B and B2C engagement</b>; imitability is only moderate, so
          continuous investment matters.
        </Card>
        <Row cols={2}>
          <Stat id="s5-rev" i={7} inline value="A$19.595bn" label="FY2025 revenue (+3.3% YoY)" icon={TrendingUp} tone="amber" />
          <Stat id="s5-earn" i={8} inline value="ROCE 64.2%" label="EBIT A$2.338bn (+3.8%)" icon={BadgeDollarSign} tone="lime" />
        </Row>
        <Callout id="s5-judge" i={9} label="Supporting finance (FY2025):" icon={Scale}>
          Revenue A$19.595bn (+3.3%), EBIT A$2.338bn (+3.8%) and ROCE 64.2% reinforce that VRIO advantages are converting
          into returns.
        </Callout>
      </div>
    </Slide>
  )
}
