import { Ban, ClipboardCheck, Scale, ScanSearch, ShieldCheck } from 'lucide-react'
import { Card, Slide, Stat } from '../ui/Slide'
import type { SlideComponentProps } from '.'

export default function Slide06({ leaving }: SlideComponentProps) {
  return (
    <Slide
      n={6}
      leaving={leaving}
      footer="Sources: Wesfarmers Limited (2025); Mahajan et al. (2023); Siems et al. (2023)."
      hint="Illustration · hover a policy · drag to tilt"
    >
      <div className="col">
        <Card id="s6-ethics" i={3} icon={ShieldCheck} title="Ethical governance & human rights">
          Integrity, workplace safety, responsible procurement and supplier accountability frame how Bunnings oversees
          its supply base — including long-term partners under strict ethical standards (Wesfarmers Limited, 2025).
        </Card>
        <Stat
          id="s6-fy25"
          i={4}
          value="71%"
          label="Direct monitoring of supplier sites — with rigorous audits and corrective actions when risks appear"
          icon={ScanSearch}
          tone="lime"
          meter={71}
          className="stat-center"
        />
        <Card id="s6-sourcing" i={5} icon={ClipboardCheck} title="Ethical Sourcing Code & core policies" tone="mint">
          No labour-rights violations; fair wages and cultural respect. <b>Timber:</b> 100% of wood &amp; paper products
          verified for clear origin under Australian rules. <b>Training:</b> staff capability to detect and escalate
          commercial ethics breaches.
        </Card>
        <Card id="s6-stake" i={6} icon={Ban} title="Modern Slavery Act & high-risk regions" tone="coral">
          Transparent disclosure of global supply-chain slavery risks under Australian law; tight oversight and
          cooperation with authorities for suppliers in higher-risk regions (Siems et al., 2023).
        </Card>
        <Card id="s6-fy24" i={7} icon={Scale} title="Critical evaluation — monitoring coverage" tone="amber">
          71% monitored coverage still leaves uncovered sites. Managers should treat intensity of oversight as a living
          KPI, not a finished compliance badge (Mahajan et al., 2023).
        </Card>
      </div>
    </Slide>
  )
}
