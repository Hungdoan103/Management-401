import { ClipboardCheck, Scale, ScanSearch, ShieldCheck } from 'lucide-react'
import { Card, Row, Slide, Stat } from '../ui/Slide'
import type { SlideComponentProps } from '.'

export default function Slide06({ leaving }: SlideComponentProps) {
  return (
    <Slide
      n={6}
      leaving={leaving}
      footer="Sources: Wesfarmers Limited (2025); Mahajan et al. (2023); Siems et al. (2023)."
      hint="Each tile = 1% of supplier sites · hover FY2024 / FY2025"
    >
      <div className="col">
        <Card id="s6-ethics" i={3} icon={ShieldCheck} title="Ethical Management and Human Rights">
          Integrity, workplace safety, responsible procurement and supplier accountability (Wesfarmers Limited, 2025).
        </Card>
        <Row cols={2}>
          <Stat
            id="s6-fy24"
            i={4}
            value="77%"
            label="FY2024 Sites Monitored"
            icon={ScanSearch}
            tone="lime"
            meter={77}
            className="stat-center"
          />
          <Stat
            id="s6-fy25"
            i={5}
            value="71%"
            label="FY2025 Sites Monitored"
            icon={ScanSearch}
            tone="amber"
            meter={71}
            className="stat-center"
          />
        </Row>
        <Card id="s6-sourcing" i={6} icon={ClipboardCheck} title="Responsible Sourcing" tone="lime">
          Supplier monitoring, audits and corrective actions help manage labour and modern-slavery risks.
        </Card>
        <Card id="s6-stake" i={7} icon={Scale} title="Stakeholder Theory — Critical Evaluation" tone="amber">
          Reduced monitoring coverage warrants review of oversight effectiveness; it does not itself prove more
          violations (Mahajan et al., 2023; Siems et al., 2023).
        </Card>
      </div>
    </Slide>
  )
}
