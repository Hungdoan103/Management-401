import { ArrowDownRight, ArrowUpRight, HardHat, HeartPulse, Sprout, Users, UsersRound } from 'lucide-react'
import { Card, Row, Slide, Stat } from '../ui/Slide'
import type { SlideComponentProps } from '.'

export default function Slide07({ leaving }: SlideComponentProps) {
  return (
    <Slide
      n={7}
      leaving={leaving}
      footer="Sources: Wesfarmers Limited (2025); Pham et al. (2024)."
      hint="Illustration · hover a pillar · drag to tilt"
    >
      <div className="col">
        <Card id="s7-inclusive" i={3} icon={Users} title="Inclusive management & diversity pillars">
          Three pillars: <b>gender equality</b> (more women in executive and store management); <b>mental-health
          support</b> via EAP and flexible work; <b>non-discrimination</b> across age, gender, religion and cultural
          origin (Wesfarmers Limited, 2025).
        </Card>
        <Row cols={2}>
          <Stat
            id="s7-injury"
            i={4}
            eyebrow="Total recordable injury frequency (TRIFR)"
            value="13.7"
            label=""
            note="Sharp fall through stronger training and safer store processes"
            noteIcon={ArrowDownRight}
            icon={HardHat}
            tone="lime"
            className="stat-center"
          />
          <Stat
            id="s7-indigenous"
            i={5}
            eyebrow="First Nations employees"
            value="1,742"
            label=""
            note="Hired and developed — advancing cultural diversity and reconciliation"
            noteIcon={ArrowUpRight}
            icon={UsersRound}
            tone="amber"
            className="stat-center"
          />
        </Row>
        <Card id="s7-wellbeing" i={6} icon={HeartPulse} title="Employee wellbeing & EAP" tone="coral">
          Employee Assistance Programmes and flexible-work policies support mental health alongside physical injury
          prevention — safety is both body and mind on the warehouse floor.
        </Card>
        <Card id="s7-capability" i={7} icon={Sprout} title="Inclusion as organisational capability" tone="lime">
          Representation, engagement and inclusive leadership are treated as capability investments, not soft HR
          extras — cohesion across a multinational workforce underpins service quality (Pham et al., 2024).
        </Card>
      </div>
    </Slide>
  )
}
