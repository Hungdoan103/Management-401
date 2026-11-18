import type { CSSProperties } from 'react'
import { Boxes, Landmark, PiggyBank, Sparkles, Star, Tag } from 'lucide-react'
import { Card, Row, Slide } from '../ui/Slide'
import type { SlideComponentProps } from '.'

export default function Slide03({ leaving }: SlideComponentProps) {
  return (
    <Slide
      n={3}
      leaving={leaving}
      footer="Source: Wesfarmers Limited (2025). Classification applies Porter’s Generic Strategies."
      hint="Hover a pillar · drag to rotate"
    >
      <div className="col">
        <Card id="s3-corp" i={3} icon={Landmark} title="Corporate-Level Strategy">
          Wesfarmers supports Bunnings through capital allocation, operational excellence and long-term growth
          (Wesfarmers Limited, 2025).
        </Card>
        <Row cols={2}>
          <Card id="s3-cost" i={4} icon={PiggyBank} title="Cost Leadership" tone="amber">
            Purchasing scale, cost discipline and everyday low prices.
          </Card>
          <Card id="s3-diff" i={5} icon={Sparkles} title="Supporting Differentiation" tone="sky">
            Broad range, knowledgeable employees and customer experience.
          </Card>
        </Row>

        <h2 className="subhead reveal" style={{ '--i': 6 } as CSSProperties}>
          Three Strategic Pillars
        </h2>
        <Row cols={3}>
          <Card id="s3-p1" i={7} icon={Tag} title="Lowest Prices" tone="amber" className="card-pillar">
            Affordability
          </Card>
          <Card id="s3-p2" i={8} icon={Boxes} title="Widest Range" tone="lime" className="card-pillar">
            Product choice
          </Card>
          <Card id="s3-p3" i={9} icon={Star} title="Best Experience" tone="sky" className="card-pillar">
            Customer service
          </Card>
        </Row>
      </div>
    </Slide>
  )
}
