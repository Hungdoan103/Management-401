import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Leaf, MonitorSmartphone, Tag, UsersRound, type LucideIcon } from 'lucide-react'
import { DragRotate, Glow, Hero, Medallion, PAL, Part, Pedestal, useFocus } from '../kit'

const LESSONS: Array<{ id: string; icon: LucideIcon; color: string; angle: number }> = [
  { id: 's11-c1', icon: Tag, color: PAL.amber, angle: 45 },
  { id: 's11-c2', icon: MonitorSmartphone, color: PAL.sky, angle: 135 },
  { id: 's11-c3', icon: Leaf, color: PAL.lime, angle: 225 },
  { id: 's11-assess', icon: UsersRound, color: PAL.coral, angle: 315 },
]

function LessonOrb({ id, icon, color, angle }: (typeof LESSONS)[number]) {
  const g = useRef<THREE.Group>(null!)
  const mat = useRef<THREE.MeshStandardMaterial>(null!)
  const focus = useFocus(id)
  const tint = useMemo(() => new THREE.Color(color), [color])
  const a0 = THREE.MathUtils.degToRad(angle)

  useFrame((state) => {
    const { on, dim } = focus.current
    const bob = Math.sin(state.clock.elapsedTime * 1.5 + angle) * 0.08
    const r = 1.35 - on * 0.25
    g.current.position.set(Math.cos(a0) * r, bob + on * 0.12, Math.sin(a0) * r)
    g.current.scale.setScalar(1 + on * 0.28)
    mat.current.emissiveIntensity = 0.2 + on * 1.1 - dim * 0.15
    mat.current.color.copy(tint).multiplyScalar(1 - dim * 0.4)
  })

  return (
    <Part id={id}>
      <group ref={g}>
        <mesh>
          <icosahedronGeometry args={[0.32, 1]} />
          <meshStandardMaterial ref={mat} color={color} emissive={color} emissiveIntensity={0.2} roughness={0.35} metalness={0.25} flatShading />
        </mesh>
        <Medallion icon={icon} color={color} radius={0.18} focusId={id} position={[0, 0, 0.36]} />
      </group>
    </Part>
  )
}

/** Core formula: innovation + ethics + inclusion + ESG = lasting leadership */
function CoreAdvantage() {
  const core = useRef<THREE.Mesh>(null!)
  const ring = useRef<THREE.Mesh>(null!)
  const mat = useRef<THREE.MeshBasicMaterial>(null!)
  const focus = useFocus('s11-key')

  useFrame((state, dt) => {
    const { on } = focus.current
    core.current.rotation.y += dt * (0.6 + on * 1.4)
    core.current.rotation.x += dt * 0.25
    core.current.scale.setScalar(1 + on * 0.35 + Math.sin(state.clock.elapsedTime * 2) * 0.04)
    ring.current.rotation.z -= dt * 0.4
    const k = 1.2 + on * 2.2
    mat.current.color.setRGB(0.83 * k, 0.95 * k, 0.42 * k)
  })

  return (
    <Part id="s11-key">
      <mesh ref={core}>
        <octahedronGeometry args={[0.42, 0]} />
        <meshBasicMaterial ref={mat} toneMapped={false} />
      </mesh>
      <mesh ref={ring} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.72, 0.018, 10, 64]} />
        <meshBasicMaterial color={PAL.lime} transparent opacity={0.45} toneMapped={false} />
      </mesh>
    </Part>
  )
}

/** Slide 11 — four management lessons orbiting the lasting-leadership core. */
export default function Scene11() {
  return (
    <Hero position={[3.3, -0.2, 0]}>
      <DragRotate sway={0.4} tilt={0.1} radius={2.3}>
        <CoreAdvantage />
        {LESSONS.map((l) => (
          <LessonOrb key={l.id} {...l} />
        ))}
      </DragRotate>
      <Pedestal y={-2.0} r={1.7} />
      <Glow position={[0, 0.1, -1]} size={9} opacity={0.2} color="#58c98a" />
    </Hero>
  )
}
