import type { CSSProperties } from 'react'
import { Boxes, Network, PiggyBank, Star, Tag, Warehouse } from 'lucide-react'
import { Card, Row, Slide } from '../ui/Slide'
import type { SlideComponentProps } from '.'

export default function Slide03({ leaving }: SlideComponentProps) {
  return (
    <Slide
      n={3}
      leaving={leaving}
      footer="Source: Wesfarmers Limited (2025). Cost-leadership framing."
      hint="Hover a pillar · drag to rotate"
    >
      <div className="col">
        <h2 className="subhead reveal" style={{ '--i': 3 } as CSSProperties}>
          Three strategic pillars of cost leadership
        </h2>
        <Row cols={3}>
          <Card id="s3-p1" i={4} icon={Tag} title="Lowest Prices" tone="amber" className="card-pillar">
            Everyday Low Prices (EDLP) with a 5–10% price-beat / refund promise when a rival is cheaper.
          </Card>
          <Card id="s3-p2" i={5} icon={Boxes} title="Widest Range" tone="lime" className="card-pillar">
            45,000+ DIY SKUs — home repair equipment, garden plants and building materials under one roof.
          </Card>
          <Card id="s3-p3" i={6} icon={Star} title="Best Experience" tone="sky" className="card-pillar">
            Expert staff advice, kids’ play areas so parents can shop with confidence, and community Sausage Sizzle
            events.
          </Card>
        </Row>
        <Card id="s3-cost" i={7} icon={PiggyBank} title="How the low-cost advantage is sustained" tone="amber">
          Four reinforcing mechanisms: (1) big-box format with selling floor and storage on site; (2) enormous buy-scale
          — the “core technology” of supplier price negotiation at home and abroad; (3) omnichannel parity so whatever
          is offline is also online for B2B partners; (4) a fast, seamless logistics network that pulls customers from
          rivals.
        </Card>
        <Row cols={2}>
          <Card id="s3-corp" i={8} icon={Warehouse} title="Big-box retail format" tone="mint">
            Trading area and warehousing are optimised in the same footprint, cutting handling cost and protecting
            availability.
          </Card>
          <Card id="s3-diff" i={9} icon={Network} title="Omnichannel sales network" tone="sky">
            Mobile app, website and stores stay synchronised — offline stock mirrors online offer so partners can trade
            conveniently.
          </Card>
        </Row>
      </div>
    </Slide>
  )
}
