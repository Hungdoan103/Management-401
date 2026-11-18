import * as THREE from 'three'
import { useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Bot, Link2, UsersRound, Wind, type LucideIcon } from 'lucide-react'
import { DragRotate, Hero, Medallion, PAL, Part, Pedestal, useFocus } from '../kit'

const MODULE = 0.05 // pitch radius per tooth - identical for all gears so they really mesh
const TOOTH = 0.07

interface GearSpec {
  id: string
  teeth: number
  color: string
  icon: LucideIcon
  /** direction (degrees) from this gear to the next one in the train */
  toNext?: number
}

/** AI → blockchain oversight → Scope 3 → inclusive leadership */
const TRAIN: GearSpec[] = [
  { id: 's10-r1', teeth: 18, color: PAL.sky, icon: Bot, toNext: -25 },
  { id: 's10-r2', teeth: 14, color: PAL.amber, icon: Link2, toNext: -125 },
  { id: 's10-r3', teeth: 18, color: PAL.lime, icon: Wind, toNext: -10 },
  { id: 's10-r4', teeth: 12, color: PAL.coral, icon: UsersRound },
]

/** Works out where each gear sits and the phase that makes its teeth interlock with its neighbour. */
function layout() {
  const gears = TRAIN.map((spec) => ({ ...spec, r: spec.teeth * MODULE, x: 0, y: 0, phase: 0, ratio: 1 }))
  for (let i = 1; i < gears.length; i++) {
    const a = gears[i - 1]
    const b = gears[i]
    const phi = THREE.MathUtils.degToRad(a.toNext!)
    b.x = a.x + Math.cos(phi) * (a.r + b.r)
    b.y = a.y + Math.sin(phi) * (a.r + b.r)
    // a tooth of `a` must meet a gap of `b` on the line between their centres
    const ua = ((phi - a.phase) * a.teeth) / (Math.PI * 2)
    b.phase = phi + Math.PI - ((0.5 - ua) * Math.PI * 2) / b.teeth
    b.ratio = (-a.ratio * a.teeth) / b.teeth // neighbours turn in opposite directions
  }
  const xs = gears.map((g) => g.x)
  const ys = gears.map((g) => g.y)
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2
  gears.forEach((g) => {
    g.x -= cx
    g.y -= cy
  })
  return gears
}

function gearGeometry(teeth: number) {
  const r = teeth * MODULE
  const outer = r + TOOTH
  const root = r - TOOTH
  const step = (Math.PI * 2) / teeth
  const shape = new THREE.Shape()
  for (let i = 0; i < teeth; i++) {
    const a = i * step // a tooth is centred on every multiple of `step`
    const pts: Array<[number, number]> = [
      [a - 0.27 * step, root],
      [a - 0.14 * step, outer],
      [a + 0.14 * step, outer],
      [a + 0.27 * step, root],
    ]
    pts.forEach(([ang, rad], k) => {
      const x = Math.cos(ang) * rad
      const y = Math.sin(ang) * rad
      if (i === 0 && k === 0) shape.moveTo(x, y)
      else shape.lineTo(x, y)
    })
  }
  shape.closePath()
  // lightening holes
  const holes = teeth > 13 ? 6 : 5
  for (let i = 0; i < holes; i++) {
    const a = (i / holes) * Math.PI * 2
    const hole = new THREE.Path()
    hole.absarc(Math.cos(a) * r * 0.6, Math.sin(a) * r * 0.6, r * 0.14, 0, Math.PI * 2, true)
    shape.holes.push(hole)
  }
  const g = new THREE.ExtrudeGeometry(shape, { depth: 0.16, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.012, bevelSegments: 2, curveSegments: 20 })
  g.translate(0, 0, -0.08)
  return g
}

function Gear({ gear, drive }: { gear: ReturnType<typeof layout>[number]; drive: RefObject<number> }) {
  const wheel = useRef<THREE.Mesh>(null!)
  const material = useRef<THREE.MeshStandardMaterial>(null!)
  const focus = useFocus(gear.id)
  const all = useFocus(['s10-insight', 's10-kpi'])
  const geometry = useMemo(() => gearGeometry(gear.teeth), [gear.teeth])

  useFrame(() => {
    const { on, dim } = focus.current
    wheel.current.rotation.z = gear.phase + drive.current * gear.ratio
    wheel.current.position.z = on * 0.14
    material.current.emissiveIntensity = 0.16 + on * 0.95 + all.current.on * 0.5 - dim * (1 - all.current.on) * 0.1
  })

  return (
    <Part id={gear.id} position={[gear.x, gear.y, 0]}>
      <mesh ref={wheel} geometry={geometry}>
        <meshStandardMaterial ref={material} color={gear.color} emissive={gear.color} emissiveIntensity={0.16} roughness={0.34} metalness={0.55} />
      </mesh>
      <mesh rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[gear.r * 0.3, gear.r * 0.3, 0.24, 32]} />
        <meshStandardMaterial color="#123b29" roughness={0.4} metalness={0.5} />
      </mesh>
      <Medallion icon={gear.icon} color={gear.color} radius={gear.r * 0.27} focusId={gear.id} billboard={false} position={[0, 0, 0.13]} />
    </Part>
  )
}

/** Slide 10 - four recommendations as one gear train: turn one and they all move. */
export default function Scene10() {
  const gears = useMemo(layout, [])
  const drive = useRef(0)
  const any = useFocus(TRAIN.map((g) => g.id))
  const all = useFocus(['s10-insight', 's10-kpi'])

  useFrame((_, dt) => {
    drive.current += dt * (0.4 + any.current.on * 0.5 + all.current.on * 1.5)
  })

  return (
    <Hero position={[3.3, -0.38, 0]} scale={0.94}>
      <DragRotate sway={0.36} tilt={0.06} yaw={-0.12} radius={2.25}>
        {gears.map((g) => (
          <Gear key={g.id} gear={g} drive={drive} />
        ))}
      </DragRotate>
      <Pedestal y={-2.0} r={1.7} />
    </Hero>
  )
}
