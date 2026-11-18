import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { HeartHandshake, Leaf, MonitorSmartphone, TrendingDown, type LucideIcon } from 'lucide-react'
import { useDeck } from '../../store'
import { DragRotate, Hero, Medallion, PAL, Part, Pedestal, damp, useFocus } from '../kit'

interface Pressure {
  id: string
  color: string
  icon: LucideIcon
  /** direction the pressure arrives from, in degrees */
  angle: number
}

const PRESSURES: Pressure[] = [
  { id: 's4-economic', color: PAL.amber, icon: TrendingDown, angle: 135 },
  { id: 's4-digital', color: PAL.sky, icon: MonitorSmartphone, angle: 45 },
  { id: 's4-customer', color: PAL.coral, icon: HeartHandshake, angle: -45 },
  { id: 's4-sustain', color: PAL.lime, icon: Leaf, angle: -135 },
]

const R_OUT = 1.72
const PER_STREAM = 16

/** Particles streaming from a pressure into the organisation at the centre. */
function Stream({ pressure }: { pressure: Pressure }) {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const material = useRef<THREE.MeshBasicMaterial>(null!)
  const focus = useFocus(pressure.id)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const tint = useMemo(() => new THREE.Color(pressure.color), [pressure.color])
  const flow = useRef(0)
  const a0 = THREE.MathUtils.degToRad(pressure.angle)

  useFrame((_, dt) => {
    const { on, dim } = focus.current
    flow.current += dt * (0.22 + on * 0.5)
    for (let i = 0; i < PER_STREAM; i++) {
      const u = (flow.current + i / PER_STREAM) % 1 // 0 = at the source, 1 = absorbed
      const r = THREE.MathUtils.lerp(R_OUT - 0.34, 0.6, u)
      const a = a0 - u * 0.65 // spiral inwards like a pinwheel
      dummy.position.set(Math.cos(a) * r, Math.sin(a) * r, Math.sin(u * Math.PI) * 0.28)
      dummy.scale.setScalar((0.02 + 0.035 * Math.sin(u * Math.PI)) * (1 + on * 0.7))
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
    material.current.color.copy(tint).multiplyScalar(1.5 + on * 2 - dim * 1.05)
  })

  return (
    <Part id={pressure.id}>
      <instancedMesh ref={mesh} args={[undefined, undefined, PER_STREAM]} frustumCulled={false}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshBasicMaterial ref={material} toneMapped={false} />
      </instancedMesh>
      <Medallion
        icon={pressure.icon}
        color={pressure.color}
        radius={0.27}
        focusId={pressure.id}
        position={[Math.cos(a0) * R_OUT, Math.sin(a0) * R_OUT, 0]}
      />
    </Part>
  )
}

/** The organisation: a faceted core that takes on the colour of whatever it is responding to. */
function Core() {
  const core = useRef<THREE.Mesh>(null!)
  const cage = useRef<THREE.Mesh>(null!)
  const material = useRef<THREE.MeshPhysicalMaterial>(null!)
  const tints = useMemo(() => Object.fromEntries(PRESSURES.map((p) => [p.id, new THREE.Color(p.color)])), [])
  const rest = useMemo(() => new THREE.Color(PAL.mint), [])
  const target = useMemo(() => new THREE.Color(), [])
  const glow = useRef(0)

  useFrame((state, dt) => {
    const active = useDeck.getState().active
    target.copy(active && tints[active] ? tints[active] : rest)
    material.current.emissive.lerp(target, 1 - Math.exp(-6 * dt))
    glow.current = damp(glow.current, active ? 1 : 0, 6, dt)
    const pulse = 0.5 + 0.5 * Math.sin(state.clock.elapsedTime * 2.2)
    material.current.emissiveIntensity = 0.55 + pulse * 0.25 + glow.current * 0.9
    core.current.rotation.y += dt * 0.35
    core.current.rotation.x += dt * 0.18
    core.current.scale.setScalar(1 + pulse * 0.03 + glow.current * 0.06)
    cage.current.rotation.y -= dt * 0.22
    cage.current.rotation.z += dt * 0.12
  })

  return (
    <>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.56, 1]} />
        <meshPhysicalMaterial ref={material} color="#1f6f4a" emissive={PAL.mint} roughness={0.25} metalness={0.35} clearcoat={1} flatShading />
      </mesh>
      <mesh ref={cage} raycast={() => null}>
        <icosahedronGeometry args={[0.78, 1]} />
        <meshBasicMaterial color={[0.9, 1.9, 1.2]} wireframe transparent opacity={0.28} toneMapped={false} />
      </mesh>
    </>
  )
}

/** Orbit rings with four channel nodes - the integrated omnichannel response. */
function Omnichannel() {
  const a = useRef<THREE.Group>(null!)
  const b = useRef<THREE.Group>(null!)
  const mats = useRef<THREE.MeshBasicMaterial[]>([])
  const focus = useFocus('s4-omni')
  const speed = useRef(0.35)

  useFrame((_, dt) => {
    const { on, dim } = focus.current
    speed.current = 0.35 + on * 1.3
    a.current.rotation.z += dt * speed.current
    b.current.rotation.z -= dt * speed.current * 0.8
    const k = 1.1 + on * 2.6 - dim * 0.6
    mats.current.forEach((m) => m.color.setRGB(0.66 * k, 0.9 * k, 0.71 * k))
  })
  const keep = (i: number) => (m: THREE.MeshBasicMaterial | null) => {
    if (m) mats.current[i] = m
  }

  return (
    <Part id="s4-omni">
      <group rotation={[1.18, 0.2, 0]}>
        <group ref={a}>
          <mesh>
            <torusGeometry args={[1.08, 0.012, 8, 96]} />
            <meshBasicMaterial ref={keep(0)} toneMapped={false} />
          </mesh>
          {[0, Math.PI].map((t) => (
            <mesh key={t} position={[Math.cos(t) * 1.08, Math.sin(t) * 1.08, 0]}>
              <sphereGeometry args={[0.07, 16, 12]} />
              <meshBasicMaterial ref={keep(t === 0 ? 1 : 2)} toneMapped={false} />
            </mesh>
          ))}
        </group>
      </group>
      <group rotation={[1.18, -0.75, 0]}>
        <group ref={b}>
          <mesh>
            <torusGeometry args={[1.26, 0.012, 8, 96]} />
            <meshBasicMaterial ref={keep(3)} toneMapped={false} />
          </mesh>
          {[Math.PI / 2, -Math.PI / 2].map((t) => (
            <mesh key={t} position={[Math.cos(t) * 1.26, Math.sin(t) * 1.26, 0]}>
              <sphereGeometry args={[0.07, 16, 12]} />
              <meshBasicMaterial ref={keep(t > 0 ? 4 : 5)} toneMapped={false} />
            </mesh>
          ))}
        </group>
      </group>
    </Part>
  )
}

/** Slide 4 - four external pressures flowing into one coordinated response. */
export default function Scene04() {
  return (
    <Hero>
      <DragRotate sway={0.38} tilt={0.05} radius={2.1}>
        <Core />
        <Omnichannel />
        {PRESSURES.map((p) => (
          <Stream key={p.id} pressure={p} />
        ))}
      </DragRotate>
      <Pedestal y={-1.95} r={1.7} />
    </Hero>
  )
}
