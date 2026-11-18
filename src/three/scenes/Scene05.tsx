import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { DragRotate, Hero, PAL, Part, Pedestal, TextLabel, useFocus } from '../kit'

const FLOOR = -1.5
const STEPS = [
  { id: 's5-v', letter: 'V', color: PAL.mint },
  { id: 's5-r', letter: 'R', color: PAL.lime },
  { id: 's5-i', letter: 'I', color: PAL.sky },
  { id: 's5-o', letter: 'O', color: PAL.amber },
].map((s, i) => ({ ...s, x: -1.2 + i * 0.8, h: 0.5 + i * 0.45 }))

const WIDTH = 0.76
const DEPTH = 1.1

function Step({ step }: { step: (typeof STEPS)[number] }) {
  const group = useRef<THREE.Group>(null!)
  const body = useRef<THREE.MeshStandardMaterial>(null!)
  const cap = useRef<THREE.MeshBasicMaterial>(null!)
  const focus = useFocus(step.id)
  const tint = useMemo(() => new THREE.Color(step.color), [step.color])

  useFrame(() => {
    const { on, dim } = focus.current
    group.current.position.y = on * 0.09
    body.current.emissiveIntensity = 0.06 + on * 0.6
    body.current.color.set('#1d5c40').multiplyScalar(1 - dim * 0.4)
    cap.current.color.copy(tint).multiplyScalar(1.15 + on * 1.9 - dim * 0.6)
  })

  return (
    <Part id={step.id} position={[step.x, FLOOR, 0]}>
      <group ref={group}>
        <mesh position-y={step.h / 2}>
          <boxGeometry args={[WIDTH, step.h, DEPTH]} />
          <meshStandardMaterial ref={body} color="#1d5c40" emissive={step.color} emissiveIntensity={0.06} roughness={0.5} metalness={0.1} />
        </mesh>
        {/* glowing tread */}
        <mesh position-y={step.h + 0.012}>
          <boxGeometry args={[WIDTH, 0.024, DEPTH]} />
          <meshBasicMaterial ref={cap} toneMapped={false} />
        </mesh>
        <TextLabel text={step.letter} height={0.42} color={step.color} weight={600} position={[0, step.h - 0.27, DEPTH / 2 + 0.004]} />
      </group>
    </Part>
  )
}

/** A ball that climbs V -> R -> I -> O and reaches the prize: sustained advantage. */
function Climber() {
  const ball = useRef<THREE.Mesh>(null!)
  const gem = useRef<THREE.Mesh>(null!)
  const gemMat = useRef<THREE.MeshBasicMaterial>(null!)
  const points = useMemo(
    () => [new THREE.Vector2(-2.0, FLOOR), ...STEPS.map((s) => new THREE.Vector2(s.x, FLOOR + s.h + 0.024))],
    [],
  )
  const HOP = 0.75
  const REST = 1.5
  const CYCLE = HOP * 4 + REST

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime % CYCLE
    const seg = Math.min(Math.floor(t / HOP), 3)
    const u = seg < 3 || t < HOP * 4 ? THREE.MathUtils.clamp(t / HOP - seg, 0, 1) : 1
    const a = points[seg]
    const b = points[seg + 1]
    const arrived = t >= HOP * 4
    const x = arrived ? points[4].x : THREE.MathUtils.lerp(a.x, b.x, u)
    const y = arrived ? points[4].y : THREE.MathUtils.lerp(a.y, b.y, u) + 4 * 0.38 * u * (1 - u)
    const restT = arrived ? (t - HOP * 4) / REST : 0
    const fade = arrived ? 1 - THREE.MathUtils.smoothstep(restT, 0.55, 1) : THREE.MathUtils.smoothstep(t, 0, 0.25)
    ball.current.position.set(x, y + 0.1, 0.12)
    ball.current.scale.setScalar(Math.max(fade, 0.0001))

    const flash = arrived ? Math.sin(Math.min(restT * 2.2, 1) * Math.PI) : 0
    gem.current.rotation.y += dt * (0.9 + flash * 5)
    gem.current.position.y = points[4].y + 0.78 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05
    gem.current.scale.setScalar(1 + flash * 0.45)
    gemMat.current.color.setRGB(1.5 + flash * 2.6, 1.15 + flash * 1.9, 0.5 + flash * 0.7)
  })

  return (
    <>
      <mesh ref={ball} raycast={() => null}>
        <sphereGeometry args={[0.1, 24, 18]} />
        <meshBasicMaterial color={[2.2, 2.1, 1.7]} toneMapped={false} />
      </mesh>
      <mesh ref={gem} position={[points[4].x, 0, 0]} raycast={() => null}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshBasicMaterial ref={gemMat} toneMapped={false} />
      </mesh>
    </>
  )
}

/** Upward arrow whose height is proportional to the growth figure it carries. */
function GrowthArrow({ id, label, value, color, x, y }: { id: string; label: string; value: number; color: string; x: number; y: number }) {
  const group = useRef<THREE.Group>(null!)
  const material = useRef<THREE.MeshBasicMaterial>(null!)
  const focus = useFocus(id)
  const tint = useMemo(() => new THREE.Color(color), [color])
  const height = value * 0.27
  const geometry = useMemo(() => {
    const s = new THREE.Shape()
    const w = 0.065
    const head = 0.19
    const neck = height - 0.24
    s.moveTo(-w, 0)
    s.lineTo(w, 0)
    s.lineTo(w, neck)
    s.lineTo(head, neck)
    s.lineTo(0, height)
    s.lineTo(-head, neck)
    s.lineTo(-w, neck)
    s.closePath()
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: false })
    g.translate(0, 0, -0.025)
    return g
  }, [height])

  useFrame((state) => {
    const { on, dim } = focus.current
    group.current.position.y = y + Math.sin(state.clock.elapsedTime * 1.3 + x * 3) * 0.04
    group.current.scale.setScalar(1 + on * 0.22)
    material.current.color.copy(tint).multiplyScalar(1.05 + on * 1.7 - dim * 0.55)
  })

  return (
    <Part id={id} position={[x, 0, -0.2]}>
      <group ref={group}>
        <mesh geometry={geometry}>
          <meshBasicMaterial ref={material} toneMapped={false} />
        </mesh>
        <TextLabel text={label} height={0.21} color={color} family="Manrope" weight={800} position={[0, height + 0.17, 0]} />
      </group>
    </Part>
  )
}

/** Slide 5 - the VRIO staircase to sustained competitive advantage. */
export default function Scene05() {
  return (
    <Hero position={[3.3, -0.3, 0]}>
      <DragRotate sway={0.42} tilt={0.2} yaw={-0.25} radius={2.2}>
        {STEPS.map((s) => (
          <Step key={s.id} step={s} />
        ))}
        <Climber />
        <GrowthArrow id="s5-rev" label="+3.3%" value={3.3} color={PAL.amber} x={-1.42} y={-0.72} />
        <GrowthArrow id="s5-earn" label="+3.8%" value={3.8} color={PAL.lime} x={-0.72} y={-0.26} />
      </DragRotate>
      <Pedestal y={-1.95} r={1.8} />
    </Hero>
  )
}
