import { ArrowDownRight, ArrowUpRight, HardHat, HeartPulse, Sprout, Users, UsersRound } from 'lucide-react'
import { Card, Row, Slide, Stat } from '../ui/Slide'
import type { SlideComponentProps } from '.'

export default function Slide07({ leaving }: SlideComponentProps) {
  return (
    <Slide
      n={7}
      leaving={leaving}
      footer="Sources: Wesfarmers Limited (2025); Pham et al. (2024)."
      hint="An inclusive team around safety and wellbeing"
    >
      <div className="col">
        <Card id="s7-inclusive" i={3} icon={Users} title="Inclusive Management Practices">
          Workforce diversity, development, workplace safety and inclusive employment (Wesfarmers Limited, 2025).
        </Card>
        <Row cols={2}>
          <Stat
            id="s7-injury"
            i={4}
            eyebrow="FY2025 Injury Frequency Rate"
            value="13.7"
            label=""
            note="Down from 17.0"
            noteIcon={ArrowDownRight}
            icon={HardHat}
            tone="lime"
            className="stat-center"
          />
          <Stat
            id="s7-indigenous"
            i={5}
            eyebrow="Aboriginal and Torres Strait Islander Employees"
            value="1,742"
            label=""
            note="Up from 1,531"
            noteIcon={ArrowUpRight}
            icon={UsersRound}
            tone="amber"
            className="stat-center"
          />
        </Row>
        <Card id="s7-wellbeing" i={6} icon={HeartPulse} title="Employee Wellbeing" tone="coral">
          Improved safety outcomes can support employee wellbeing.
        </Card>
        <Card id="s7-capability" i={7} icon={Sprout} title="Inclusion and Organisational Capability" tone="lime">
          Representation, engagement and inclusive leadership require continued attention (Pham et al., 2024).
        </Card>
      </div>
    </Slide>
  )
}
