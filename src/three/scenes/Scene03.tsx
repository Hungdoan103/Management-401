import * as THREE from 'three'
import { createContext, useContext, useMemo, useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { Boxes, Network, PiggyBank, Star, Tag, Warehouse, type LucideIcon } from 'lucide-react'
import { DragRotate, Hero, Medallion, PAL, Part, Pedestal, useFocus } from '../kit'

const STONE = new THREE.Color('#e9e4d2')
/** every block of one architectural element shares a material, so it lights up as a whole */
const StoneMaterial = createContext<THREE.Material | null>(null)

/** Architectural element that warms up in its accent colour when spotlighted. */
function Stone({
  id,
  accent,
  lift = 0.07,
  children,
  position,
}: {
  id: string
  accent: string
  lift?: number
  children: ReactNode
  position?: [number, number, number]
}) {
  const group = useRef<THREE.Group>(null!)
  const focus = useFocus(id)
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: STONE,
        roughness: 0.62,
        metalness: 0.02,
        emissive: new THREE.Color(accent),
        emissiveIntensity: 0,
        flatShading: true,
      }),
    [accent],
  )
  useFrame(() => {
    const { on, dim } = focus.current
    material.emissiveIntensity = on * 0.95
    material.color.copy(STONE).multiplyScalar(1 - dim * 0.45)
    group.current.position.y = on * lift
  })
  return (
    <Part id={id} position={position}>
      <group ref={group}>
        <StoneMaterial.Provider value={material}>{children}</StoneMaterial.Provider>
      </group>
    </Part>
  )
}

function Block({ args, position }: { args: [number, number, number]; position?: [number, number, number] }) {
  const material = useContext(StoneMaterial)!
  return (
    <mesh position={position} material={material}>
      <boxGeometry args={args} />
    </mesh>
  )
}

function Pillar({ id, x, accent, icon }: { id: string; x: number; accent: string; icon: LucideIcon }) {
  return (
    <Stone id={id} accent={accent} position={[x, 0, 0]}>
      <Block args={[0.56, 0.1, 0.56]} position={[0, -1.05, 0]} />
      <Shaft />
      <Block args={[0.6, 0.11, 0.6]} position={[0, 0.445, 0]} />
      <Medallion icon={icon} color={accent} radius={0.21} focusId={id} position={[0, -0.3, 0.42]} />
    </Stone>
  )
}

function Shaft() {
  const material = useContext(StoneMaterial)!
  return (
    <mesh position-y={-0.305} material={material}>
      <cylinderGeometry args={[0.185, 0.215, 1.39, 14]} />
    </mesh>
  )
}

function Roof() {
  const material = useContext(StoneMaterial)!
  const geometry = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-1.62, 0)
    s.lineTo(1.62, 0)
    s.lineTo(0, 0.72)
    s.closePath()
    const g = new THREE.ExtrudeGeometry(s, { depth: 1.1, bevelEnabled: false })
    g.translate(0, 0, -0.55)
    return g
  }, [])
  return <mesh geometry={geometry} position-y={0.72} material={material} />
}

/** Slide 3 - the "temple of strategy": corporate roof, three pillars, two-part foundation. */
export default function Scene03() {
  return (
    <Hero position={[3.3, -0.3, 0]} scale={0.98}>
      <DragRotate sway={0.5} tilt={0.14} yaw={-0.12} radius={2.2}>
        <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.3}>
          {/* Big-box format shelters the three price / range / experience pillars */}
          <Stone id="s3-corp" accent={PAL.mint} lift={0.1}>
            <Block args={[3.1, 0.2, 1.14]} position={[0, 0.61, 0]} />
            <Roof />
            <Medallion icon={Warehouse} color={PAL.mint} radius={0.24} focusId="s3-corp" position={[0, 0.98, 0.62]} />
          </Stone>

          <Pillar id="s3-p1" x={-1.05} accent={PAL.amber} icon={Tag} />
          <Pillar id="s3-p2" x={0} accent={PAL.lime} icon={Boxes} />
          <Pillar id="s3-p3" x={1.05} accent={PAL.sky} icon={Star} />

          {/* Cost advantage engines under the pillars */}
          <Stone id="s3-cost" accent={PAL.amber} lift={-0.05} position={[-0.81, -1.25, 0]}>
            <Block args={[1.58, 0.3, 1.36]} />
            <Medallion icon={PiggyBank} color={PAL.amber} radius={0.14} focusId="s3-cost" billboard={false} position={[0, 0, 0.7]} />
          </Stone>
          <Stone id="s3-diff" accent={PAL.sky} lift={-0.05} position={[0.81, -1.25, 0]}>
            <Block args={[1.58, 0.3, 1.36]} />
            <Medallion icon={Network} color={PAL.sky} radius={0.14} focusId="s3-diff" billboard={false} position={[0, 0, 0.7]} />
          </Stone>
        </Float>
      </DragRotate>
      <Pedestal y={-1.85} r={1.8} />
    </Hero>
  )
}
