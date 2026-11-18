import { Fragment } from 'react'
import { Anchor, Eye, Gem, MessageSquareQuote, Scale, ThumbsUp, TriangleAlert } from 'lucide-react'
import { Callout, Card, Row, Slide } from '../ui/Slide'
import type { SlideComponentProps } from '.'

const VALUES = ['Integrity', 'Respect', 'Teamwork', 'Achievement', 'Innovation']

export default function Slide09({ leaving }: SlideComponentProps) {
  return (
    <Slide
      n={9}
      leaving={leaving}
      footer="Sources: Wesfarmers Limited (2025); Pham et al. (2024); Enbaia et al. (2024); Khan and Badulescu (2025)."
      hint="The culture iceberg · hover a layer"
    >
      <div className="col">
        <Card id="s9-values" i={3} icon={Gem} title="Core Organisational Values" className="card-tight">
          <span className="values">
            {VALUES.map((v, k) => (
              <Fragment key={v}>
                {k > 0 && <i aria-hidden> • </i>}
                <b>{v}</b>
              </Fragment>
            ))}
          </span>{' '}
          (Wesfarmers Limited, 2025).
        </Card>
        <Card id="s9-artefacts" i={4} icon={Eye} title="Artefacts" tone="cream" className="card-tight">
          Warehouse stores, employee uniforms and community activities.
        </Card>
        <Card id="s9-espoused" i={5} icon={MessageSquareQuote} title="Espoused Values" tone="sky" className="card-tight">
          Integrity, teamwork, customer service and responsible conduct.
        </Card>
        <Card id="s9-assumptions" i={6} icon={Anchor} title="Underlying Assumptions" tone="lime" className="card-tight">
          Customer value, operational efficiency and workplace safety (interpretive).
        </Card>
        <Row cols={2}>
          <Card id="s9-strengths" i={7} icon={ThumbsUp} title="Cultural Strengths" tone="lime" className="card-tight card-top">
            Teamwork and innovation support customer experience and engagement (Pham et al., 2024; Enbaia et al.,
            2024).
          </Card>
          <Card
            id="s9-challenges"
            i={8}
            icon={TriangleAlert}
            title="Cultural Challenges"
            tone="coral"
            className="card-tight card-top"
          >
            Cost pressures can conflict with wellbeing and sustainability (Khan &amp; Badulescu, 2025).
          </Card>
        </Row>
        <Callout id="s9-judge" i={9} label="Critical judgement:" icon={Scale}>
          Leadership accountability and training help translate values into consistent practice.
        </Callout>
      </div>
    </Slide>
  )
}
