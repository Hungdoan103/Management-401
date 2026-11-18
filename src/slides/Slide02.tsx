import { CircleDollarSign, Leaf, MonitorSmartphone, ShieldAlert, Store, Tag, Users, UsersRound } from 'lucide-react'
import { Card, Row, Slide, Stat } from '../ui/Slide'
import type { SlideComponentProps } from '.'

export default function Slide02({ leaving }: SlideComponentProps) {
  return (
    <Slide
      n={2}
      leaving={leaving}
      footer="Source: Wesfarmers Limited (2025)."
      hint="Hover a challenge · drag the map"
    >
      <div className="col">
        <Row cols={3}>
          <Stat
            id="s2-stores"
            i={3}
            value="511"
            label="Stores — Warehouse, Trade and smaller formats across Australia and New Zealand"
            icon={Store}
            tone="lime"
          />
          <Stat
            id="s2-employees"
            i={4}
            value="53,000+"
            label="Employees — a diverse workforce with strong team cohesion"
            icon={Users}
            tone="mint"
          />
          <Stat
            id="s2-revenue"
            i={5}
            value="A$19.595bn"
            label="FY2025 revenue (+3.3% YoY) · EBIT A$2.338bn"
            icon={CircleDollarSign}
            tone="amber"
          />
        </Row>
        <Card id="s2-price" i={6} icon={Tag} title="Core challenge — Low prices & inflation" tone="amber">
          Higher living costs force structural change: Bunnings must keep everyday low prices while redesigning cost
          structures so competitiveness survives a tighter spending climate.
        </Card>
        <Card id="s2-digital" i={7} icon={MonitorSmartphone} title="Core challenge — Digital & omnichannel retail" tone="sky">
          Combining in-store shopping with online channels reaches customers far from physical stores and keeps the
          assortment consistent across every touchpoint.
        </Card>
        <Card id="s2-supply" i={8} icon={ShieldAlert} title="Core challenge — Supply-chain oversight" tone="coral">
          Product provenance and marketplace stall management must stay transparent so ethical and quality standards
          hold across domestic and overseas suppliers.
        </Card>
        <Card id="s2-esg" i={9} icon={Leaf} title="Core challenge — Environmental responsibility (ESG)" tone="lime">
          Scope 1 &amp; 2 carbon-neutrality goals and waste cuts from trading operations are pursued in line with United
          Nations expectations.
        </Card>
        <Card id="s2-culture" i={10} icon={UsersRound} title="Core challenge — Inclusive & safe culture" tone="mint">
          Respect for the workplace and cohesion across a multinational employee community remain central people
          challenges for managers.
        </Card>
      </div>
    </Slide>
  )
}
