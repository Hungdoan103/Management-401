import { ArrowRight, HeartHandshake, Leaf, MonitorSmartphone, Network, TrendingDown } from 'lucide-react'
import { Card, Slide } from '../ui/Slide'
import type { SlideComponentProps } from '.'

/** "Pressure → Response" heading; the arrow of the source text is drawn as an animated icon. */
function Flow({ from, to }: { from: string; to: string }) {
  return (
    <span className="flow">
      <span className="flow-from">{from}</span>
      <ArrowRight className="flow-arrow" size={20} strokeWidth={2.2} aria-label="→" />
      <span className="flow-to">{to}</span>
    </span>
  )
}

export default function Slide04({ leaving }: SlideComponentProps) {
  return (
    <Slide
      n={4}
      leaving={leaving}
      footer="Sources: Wesfarmers Limited (2025); Liu and Song (2023, 2024)."
      hint="Four pressures, one coordinated response"
    >
      <div className="col">
        <Card
          id="s4-economic"
          i={3}
          icon={TrendingDown}
          tone="amber"
          title={<Flow from="Economic Pressures" to="Cost Discipline" />}
        >
          Everyday low prices and efficient operations.
        </Card>
        <Card
          id="s4-digital"
          i={4}
          icon={MonitorSmartphone}
          tone="sky"
          title={<Flow from="Digital Competition" to="Omnichannel Retail" />}
        >
          E-commerce, marketplace and integrated fulfilment.
        </Card>
        <Card
          id="s4-customer"
          i={5}
          icon={HeartHandshake}
          tone="coral"
          title={<Flow from="Customer Needs" to="Product and Service Adaptation" />}
        >
          Broader product choices and helpful customer service.
        </Card>
        <Card
          id="s4-sustain"
          i={6}
          icon={Leaf}
          tone="lime"
          title={<Flow from="Sustainability Expectations" to="Responsible Practice" />}
        >
          Ethical sourcing and environmental initiatives.
        </Card>
        <Card id="s4-omni" i={8} icon={Network} title="Omnichannel Integration" className="card-feature">
          Physical stores + online shopping + digital marketplaces + coordinated supply chains (Liu &amp; Song, 2023,
          2024).
        </Card>
      </div>
    </Slide>
  )
}
