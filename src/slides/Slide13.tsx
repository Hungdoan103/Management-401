import type { CSSProperties } from 'react'
import { MessageCircleQuestion } from 'lucide-react'
import { Card, Slide } from '../ui/Slide'
import type { SlideComponentProps } from '.'

const i = (n: number) => ({ '--i': n }) as CSSProperties

export default function Slide13({ leaving }: SlideComponentProps) {
  return (
    <Slide n={13} leaving={leaving} hint="Thank you · drag to rotate" bare>
      <h1 className="title">
        <span className="w">
          <span style={{ '--w': 0 } as CSSProperties}>Thank</span>
        </span>{' '}
        <span className="w">
          <span style={{ '--w': 1 } as CSSProperties}>You</span>
        </span>
      </h1>
      <p className="subtitle reveal" style={i(4)}>
        Questions and Discussion (Q&amp;A)
      </p>
      <div className="rule reveal" style={i(5)} />
      <Card id="s13-team" i={6} icon={MessageCircleQuestion} title="MGMT401 Case Study Research Team" className="card-feature">
        Canterbury Institute of Management — we welcome your questions on strategy, ethics, culture and the Bunnings
        Group case.
      </Card>
      <p className="tagline reveal" style={i(8)}>
        Manohar Kumar Singh · Katherine Pui · Dhiraj Thapa · Xuan Hung Doan
      </p>
    </Slide>
  )
}
