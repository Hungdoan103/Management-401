import * as THREE from 'three'
import { useMemo, useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { Leaf, Target, Users } from 'lucide-react'
import { useDeck } from '../../store'
import { DragRotate, Hero, Medallion, PAL, Part, Pedestal, Rod, damp, getHeartGeometry, useFocus } from '../kit'

const PIVOT_Y = 0.95
const ARM = 1.32
const DROP = 0.95
const PAN_R = 0.52

function Pan({ id, color, children }: { id: string; color: string; children: ReactNode }) {
  const material = useRef<THREE.MeshStandardMaterial>(null!)
  const rim = useRef<THREE.MeshBasicMaterial>(null!)
  const focus = useFocus(id)
  const all = useFocus(['s11-assess', 's11-key'])
  const tint = useMemo(() => new THREE.Color(color), [color])

  useFrame(() => {
    const on = Math.max(focus.current.on, all.current.on * 0.7)
    material.current.emissiveIntensity = 0.12 + on * 0.6
    rim.current.color.copy(tint).multiplyScalar(1.1 + on * 2.2 - focus.current.dim * (1 - all.current.on) * 0.5)
  })

  const strings = [0, 1, 2].map((k) => {
    const a = (k / 3) * Math.PI * 2 + Math.PI / 2
    return [Math.cos(a) * PAN_R * 0.94, -DROP, Math.sin(a) * PAN_R * 0.94] as [number, number, number]
  })

  return (
    <>
      {strings.map((to, k) => (
        <Rod key={k} from={[0, 0, 0]} to={to} radius={0.008}>
          <meshStandardMaterial color={PAL.cream} roughness={0.4} metalness={0.6} />
        </Rod>
      ))}
      <group position-y={-DROP}>
        <mesh position-y={-0.02}>
          <cylinderGeometry args={[PAN_R, PAN_R * 0.82, 0.05, 48]} />
          <meshStandardMaterial ref={material} color="#1d5c40" emissive={color} emissiveIntensity={0.12} roughness={0.35} metalness={0.5} />
        </mesh>
        <mesh rotation-x={Math.PI / 2}>
          <torusGeometry args={[PAN_R, 0.018, 10, 72]} />
          <meshBasicMaterial ref={rim} toneMapped={false} />
        </mesh>
        {children}
      </group>
    </>
  )
}

/** Stacks of coins: price, range, competitiveness. */
function Coins() {
  const stacks: Array<[number, number, number]> = [
    [-0.17, 0.1, 6],
    [0.16, 0.13, 4],
    [0.02, -0.2, 5],
  ]
  return (
    <>
      {stacks.map(([x, z, n], s) =>
        Array.from({ length: n }, (_, i) => (
          <mesh key={`${s}-${i}`} position={[x + Math.sin(i * 2.1 + s) * 0.012, 0.03 + i * 0.045, z + Math.cos(i * 1.7 + s) * 0.012]}>
            <cylinderGeometry args={[0.115, 0.115, 0.036, 28]} />
            <meshStandardMaterial color={PAL.amber} emissive={PAL.amber} emissiveIntensity={0.28} roughness={0.25} metalness={0.85} />
          </mesh>
        )),
      )}
    </>
  )
}

/** A small living world with a heart: people, planet, responsibility. */
function Responsibility() {
  const heart = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    heart.current.rotation.y = state.clock.elapsedTime * 0.9
    heart.current.position.y = 0.6 + Math.sin(state.clock.elapsedTime * 1.6) * 0.03
  })
  return (
    <>
      <mesh position={[0, 0.24, 0]}>
        <icosahedronGeometry args={[0.24, 1]} />
        <meshStandardMaterial color={PAL.leaf} emissive={PAL.lime} emissiveIntensity={0.18} roughness={0.6} flatShading />
      </mesh>
      {[
        [0.2, 0.36, 0.1],
        [-0.16, 0.4, -0.08],
        [0.02, 0.44, -0.18],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <coneGeometry args={[0.055, 0.15, 6]} />
          <meshStandardMaterial color="#8be0a2" roughness={0.7} flatShading />
        </mesh>
      ))}
      <mesh ref={heart} geometry={getHeartGeometry()} position-y={0.6} scale={0.17}>
        <meshStandardMaterial color={PAL.coral} emissive={PAL.coral} emissiveIntensity={0.9} roughness={0.3} />
      </mesh>
    </>
  )
}

/** Slide 11 - competitiveness and responsibility in balance, held up by culture. */
export default function Scene11() {
  const beam = useRef<THREE.Group>(null!)
  const left = useRef<THREE.Group>(null!)
  const right = useRef<THREE.Group>(null!)
  const column = useRef<THREE.MeshStandardMaterial>(null!)
  const jewel = useRef<THREE.Mesh>(null!)
  const jewelMat = useRef<THREE.MeshBasicMaterial>(null!)
  const culture = useFocus('s11-c3')
  const key = useFocus('s11-key')
  const angle = useRef(0)

  useFrame((state, dt) => {
    const active = useDeck.getState().active
    const t = state.clock.elapsedTime
    // idle: a slow search for balance. Spotlighting a side adds weight to it.
    let target = Math.sin(t * 0.9) * 0.06
    if (active === 's11-c1') target = 0.17
    else if (active === 's11-c2') target = -0.17
    else if (active === 's11-key' || active === 's11-c3') target = 0
    angle.current = damp(angle.current, target, 3, dt)

    beam.current.rotation.z = angle.current
    const c = Math.cos(angle.current)
    const s = Math.sin(angle.current)
    left.current.position.set(-ARM * c, PIVOT_Y - ARM * s, 0)
    right.current.position.set(ARM * c, PIVOT_Y + ARM * s, 0)

    column.current.emissiveIntensity = 0.1 + culture.current.on * 1.0 + key.current.on * 0.35
    jewel.current.rotation.y += dt * (0.8 + key.current.on * 2.5)
    jewel.current.scale.setScalar(1 + key.current.on * 0.5)
    const k = 1.3 + key.current.on * 2.4
    jewelMat.current.color.setRGB(0.83 * k, 0.95 * k, 0.42 * k)
  })

  return (
    <Hero position={[3.3, -0.35, 0]} scale={0.98}>
      <DragRotate sway={0.42} tilt={0.14} radius={2.25}>
        {/* culture: the base and column everything rests on */}
        <Part id="s11-c3">
          <mesh position-y={-1.62}>
            <cylinderGeometry args={[0.78, 0.86, 0.12, 48]} />
            <meshStandardMaterial color="#164a33" roughness={0.5} metalness={0.3} />
          </mesh>
          <mesh position-y={-1.5}>
            <cylinderGeometry args={[0.46, 0.56, 0.12, 40]} />
            <meshStandardMaterial color="#1d5c40" roughness={0.45} metalness={0.3} />
          </mesh>
          <mesh position-y={-0.28}>
            <cylinderGeometry args={[0.065, 0.1, 2.34, 20]} />
            <meshStandardMaterial ref={column} color={PAL.cream} emissive={PAL.sky} emissiveIntensity={0.1} roughness={0.3} metalness={0.6} />
          </mesh>
          <Medallion icon={Users} color={PAL.sky} radius={0.2} focusId="s11-c3" position={[0, -1.0, 0.3]} />
        </Part>

        {/* the lasting advantage that balance produces */}
        <Part id="s11-key">
          <mesh ref={jewel} position-y={PIVOT_Y + 0.34}>
            <octahedronGeometry args={[0.17, 0]} />
            <meshBasicMaterial ref={jewelMat} toneMapped={false} />
          </mesh>
        </Part>

        <group ref={beam} position-y={PIVOT_Y}>
          <mesh>
            <boxGeometry args={[ARM * 2 + 0.16, 0.07, 0.1]} />
            <meshStandardMaterial color={PAL.cream} roughness={0.3} metalness={0.6} />
          </mesh>
          <mesh rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.11, 0.11, 0.16, 24]} />
            <meshStandardMaterial color={PAL.amber} roughness={0.25} metalness={0.8} />
          </mesh>
        </group>

        <group ref={left}>
          <Part id="s11-c1">
            <Pan id="s11-c1" color={PAL.amber}>
              <Coins />
              <Medallion icon={Target} color={PAL.amber} radius={0.17} focusId="s11-c1" position={[0, -0.36, 0]} />
            </Pan>
          </Part>
        </group>
        <group ref={right}>
          <Part id="s11-c2">
            <Pan id="s11-c2" color={PAL.lime}>
              <Responsibility />
              <Medallion icon={Leaf} color={PAL.lime} radius={0.17} focusId="s11-c2" position={[0, -0.36, 0]} />
            </Pan>
          </Part>
        </group>
      </DragRotate>
      <Pedestal y={-1.9} r={1.8} />
    </Hero>
  )
}
