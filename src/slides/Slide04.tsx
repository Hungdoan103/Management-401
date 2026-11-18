import { ArrowRight, Boxes, MonitorSmartphone, Network, TrendingDown } from 'lucide-react'
import { Card, Slide } from '../ui/Slide'
import type { SlideComponentProps } from '.'

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
      hint="Pressure → solution → impact · hover a card"
    >
      <div className="col">
        <Card
          id="s4-economic"
          i={3}
          icon={TrendingDown}
          tone="amber"
          title={<Flow from="Inflation & living costs" to="Cost discipline + EDLP" />}
        >
          <b>Solution:</b> tighten operating costs, cut non-core activity and reinvest in core products and experience
          while holding Everyday Low Prices. <b>Impact:</b> share gains by reading shopper psychology in recession and
          tight-spending periods.
        </Card>
        <Card
          id="s4-digital"
          i={4}
          icon={MonitorSmartphone}
          tone="sky"
          title={<Flow from="Digital behaviour shift" to="Click & Collect + delivery" />}
        >
          <b>Solution:</b> Click &amp; Collect, door-to-door fulfilment, the B2B PowerPass app, and partnerships with
          major courier/logistics players for on-demand shipping. <b>Impact:</b> wider Trade customer base and higher
          online revenue.
        </Card>
        <Card
          id="s4-customer"
          i={5}
          icon={Boxes}
          tone="coral"
          title={<Flow from="Trade & online growth" to="Competitive gap" />}
        >
          <b>Solution:</b> grow the commercial (Trade) segment and digital sales mix. <b>Impact:</b> widen the revenue
          gap versus rivals and buy time to prepare for the next disruption.
        </Card>
        <Card
          id="s4-sustain"
          i={6}
          icon={Network}
          tone="lime"
          title={<Flow from="Global supply risk" to="Diversified stock & digitised warehousing" />}
        >
          <b>Solution:</b> diversify supply sources, raise strategic inventory buffers and digitise warehousing.{' '}
          <b>Impact:</b> high stock availability maintained in every store.
        </Card>
        <Card id="s4-omni" i={8} icon={Network} title="Omnichannel integration" className="card-feature">
          Physical stores + online shopping + digital tools (PowerPass) + coordinated logistics form one response system
          (Liu &amp; Song, 2023, 2024).
        </Card>
      </div>
    </Slide>
  )
}
