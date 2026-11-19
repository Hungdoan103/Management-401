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
      hint="Illustration · hover a culture layer · drag to tilt"
    >
      <div className="col">
        <Card id="s9-values" i={3} icon={Gem} title="Five core organisational values" className="card-tight">
          <span className="values">
            {VALUES.map((v, k) => (
              <Fragment key={v}>
                {k > 0 && <i aria-hidden> • </i>}
                <b>{v}</b>
              </Fragment>
            ))}
          </span>{' '}
          — the formal value set guiding hiring, ranging and supplier conversations (Wesfarmers Limited, 2025).
        </Card>
        <Card id="s9-artefacts" i={4} icon={Eye} title="Artefacts — visible culture" tone="cream" className="card-tight">
          Distinctive red/green aprons; large warehouse-store format; community Sausage Sizzle events; and a friendly
          service style customers recognise instantly.
        </Card>
        <Card id="s9-espoused" i={5} icon={MessageSquareQuote} title="Espoused values — what is claimed" tone="sky" className="card-tight">
          The five core values above plus customer helpfulness, safety and responsible conduct — what leaders say the
          organisation stands for day to day.
        </Card>
        <Card id="s9-assumptions" i={6} icon={Anchor} title="Underlying assumptions — taken for granted" tone="lime" className="card-tight">
          Core belief: <b>“put people and community at the centre”</b> — Bunnings’ success is assumed to rise with the
          communities it serves (Schein interpretive reading).
        </Card>
        <Row cols={2}>
          <Card id="s9-strengths" i={7} icon={ThumbsUp} title="Cultural strengths" tone="lime" className="card-tight card-top">
            Teamwork and innovation support customer experience; artefacts + community rituals create hard-to-copy
            belonging (Pham et al., 2024; Enbaia et al., 2024).
          </Card>
          <Card
            id="s9-challenges"
            i={8}
            icon={TriangleAlert}
            title="Management tension"
            tone="coral"
            className="card-tight card-top"
          >
            Cost-leadership pressure can collide with high employee benefits and sustainability spend — a live balance
            leaders must hold (Khan &amp; Badulescu, 2025).
          </Card>
        </Row>
        <Callout id="s9-judge" i={9} label="Critical judgement:" icon={Scale}>
          Leadership accountability and ethics/safety training are what translate stated values into consistent practice
          across 511 stores.
        </Callout>
      </div>
    </Slide>
  )
}
