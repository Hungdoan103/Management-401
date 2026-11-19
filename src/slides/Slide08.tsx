import { HandCoins, Link2, Recycle, Scale, Sun, Wind } from 'lucide-react'
import { Card, Row, Slide, Stat } from '../ui/Slide'
import type { SlideComponentProps } from '.'

export default function Slide08({ leaving }: SlideComponentProps) {
  return (
    <Slide
      n={8}
      leaving={leaving}
      footer="Sources: Wesfarmers Limited (2025); Fritz (2022); Arian et al. (2023); Zhang and Liu (2023)."
      hint="Illustration · hover a figure · drag to tilt"
    >
      <div className="col">
        <Row cols={3}>
          <Stat
            id="s8-emissions"
            i={3}
            value="−50.2%"
            label="Scope 1 & 2 emissions cut vs prior years — solar and domestic clean energy"
            icon={Wind}
            tone="sky"
            meter={50.2}
            className="stat-center stat-tall"
          />
          <Stat
            id="s8-waste"
            i={4}
            value="60.8%"
            label="Operational waste recycled / diverted from landfill under defined processes"
            icon={Recycle}
            tone="lime"
            meter={60.8}
            className="stat-center stat-tall"
          />
          <Stat
            id="s8-community"
            i={5}
            value="A$67.9m"
            label="Community & charity value — including traditional Sausage Sizzle fundraising"
            icon={HandCoins}
            tone="amber"
            className="stat-center stat-tall"
          />
        </Row>
        <Card id="s8-initiatives" i={6} icon={Sun} title="Renewable energy & community initiatives" tone="amber">
          Rooftop solar across Bunnings warehouse stores in Australia; pathway toward <b>100% renewable electricity</b>{' '}
          in store operations (target year 2025). Community Sausage Sizzle events support local sports clubs and charity
          funds (Wesfarmers Limited, 2025).
        </Card>
        <Card id="s8-frameworks" i={7} icon={Link2} title="Sustainable supply chain & CSR frameworks" tone="lime">
          Coordinated supply-chain and CSR programmes strengthen stakeholder relationships and brand value — ESG is
          managed as strategy, not only disclosure (Fritz, 2022; Arian et al., 2023; Zhang &amp; Liu, 2023).
        </Card>
        <Card id="s8-judge" i={8} icon={Scale} title="Critical judgement" tone="coral">
          Strong operational emissions progress, yet waste-diversion gains remain partial and wider Scope 3 /
          supply-chain impacts still need faster action to match the Scope 1 &amp; 2 story.
        </Card>
      </div>
    </Slide>
  )
}
