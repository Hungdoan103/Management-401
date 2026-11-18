import { HandCoins, Link2, Recycle, Scale, Sun, Wind } from 'lucide-react'
import { Card, Row, Slide, Stat } from '../ui/Slide'
import type { SlideComponentProps } from '.'

export default function Slide08({ leaving }: SlideComponentProps) {
  return (
    <Slide
      n={8}
      leaving={leaving}
      footer="Sources: Wesfarmers Limited (2025); Fritz (2022); Arian et al. (2023); Zhang and Liu (2023)."
      hint="Hover a figure to see it on the planet"
    >
      <div className="col">
        <Row cols={3}>
          <Stat
            id="s8-emissions"
            i={3}
            value="50.2%"
            label="Market-based Scope 1 & 2 emissions reduction"
            icon={Wind}
            tone="sky"
            meter={50.2}
            className="stat-center stat-tall"
          />
          <Stat
            id="s8-waste"
            i={4}
            value="60.8%"
            label="Operational waste diverted"
            icon={Recycle}
            tone="lime"
            meter={60.8}
            className="stat-center stat-tall"
          />
          <Stat
            id="s8-community"
            i={5}
            value="A$67.9m"
            label="Community contributions"
            icon={HandCoins}
            tone="amber"
            className="stat-center stat-tall"
          />
        </Row>
        <Card id="s8-initiatives" i={6} icon={Sun} title="Environmental and CSR Initiatives">
          Renewable electricity, recycling, waste reduction and community partnerships (Wesfarmers Limited, 2025).
        </Card>
        <Card id="s8-frameworks" i={7} icon={Link2} title="Sustainable Supply Chain and CSR Frameworks" tone="lime">
          Supply-chain coordination and CSR support stakeholder relationships and brand value (Fritz, 2022; Arian et
          al., 2023; Zhang &amp; Liu, 2023).
        </Card>
        <Card id="s8-judge" i={8} icon={Scale} title="Critical Judgement" tone="amber">
          Strong operational emissions progress, but waste-diversion gains remain modest and wider supply-chain impacts
          require attention.
        </Card>
      </div>
    </Slide>
  )
}
