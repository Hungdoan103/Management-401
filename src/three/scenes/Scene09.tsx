import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useDeck } from '../../store'
import { DragRotate, Hero, PAL, Part, Pedestal, damp, useFocus } from '../kit'

/** Roughens a smooth primitive into a faceted chunk of ice (same input point -> same offset, so no cracks). */
function chisel(geometry: THREE.BufferGeometry, amount: number, seed: number) {
  const pos = geometry.attributes.position as THREE.BufferAttribute
  const v = new THREE.Vector3()
  const hash = (x: number, y: number, z: number) => {
    const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + seed) * 43758.5453
    return s - Math.floor(s)
  }
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const kx = Math.round(v.x * 1000)
    const ky = Math.round(v.y * 1000)
    const kz = Math.round(v.z * 1000)
    const radial = 1 + (hash(kx, ky, kz) - 0.5) * amount
    const dy = (hash(kz, kx, ky) - 0.5) * amount * 0.35
    pos.setXYZ(i, v.x * radial, v.y + dy, v.z * radial)
  }
  geometry.computeVertexNormals()
  return geometry
}

interface LayerProps {
  id: string
  geometry: THREE.BufferGeometry
  y: number
  color: string
  glow: string
  /** how far the layer slides when spotlighted */
  shift: number
}

function Layer({ id, geometry, y, color, glow, shift }: LayerProps) {
  const mesh = useRef<THREE.Mesh>(null!)
  const material = useRef<THREE.MeshPhysicalMaterial>(null!)
  const focus = useFocus(id)
  const strengths = useFocus('s9-strengths')
  const challenges = useFocus('s9-challenges')
  const tint = useMemo(() => new THREE.Color(glow), [glow])
  const base = useMemo(() => new THREE.Color(color), [color])

  useFrame(() => {
    const { on, dim } = focus.current
    // the whole iceberg reacts to "strengths" / "challenges", so nothing is dimmed then
    const mood = Math.max(strengths.current.on, challenges.current.on)
    const dimmed = dim * (1 - mood)
    mesh.current.position.y = y + on * shift
    material.current.color.copy(base).multiplyScalar(1 - dimmed * 0.5)
    material.current.emissive.copy(tint).lerp(GOOD, strengths.current.on * 0.7).lerp(WARN, challenges.current.on * 0.8)
    material.current.emissiveIntensity = 0.16 + on * 0.85 + strengths.current.on * 0.45 + challenges.current.on * 0.5 - dimmed * 0.1
  })

  return (
    <Part id={id}>
      <mesh ref={mesh} geometry={geometry} position-y={y}>
        <meshPhysicalMaterial
          ref={material}
          color={color}
          emissive={glow}
          emissiveIntensity={0.16}
          roughness={0.22}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.15}
          flatShading
        />
      </mesh>
    </Part>
  )
}

const WARN = new THREE.Color(PAL.coral)
const GOOD = new THREE.Color(PAL.lime)
const VALUE_TONES = [PAL.mint, PAL.amber, PAL.sky, PAL.lime, PAL.coral]

/** The five stated values, circling the visible tip. */
function Values() {
  const ring = useRef<THREE.Group>(null!)
  const gems = useRef<THREE.Mesh[]>([])
  const focus = useFocus(['s9-values', 's9-strengths'])
  const tones = VALUE_TONES
  const mats = useMemo(() => VALUE_TONES.map(() => new THREE.MeshBasicMaterial({ toneMapped: false })), [])
  const base = useMemo(() => VALUE_TONES.map((c) => new THREE.Color(c)), [])

  useFrame((state, dt) => {
    const { on, dim } = focus.current
    ring.current.rotation.y += dt * (0.5 + on * 1.3)
    gems.current.forEach((g, i) => {
      g.rotation.y += dt * 1.6
      g.position.y = Math.sin(state.clock.elapsedTime * 1.6 + i * 1.3) * 0.06
      g.scale.setScalar(1 + on * 0.55)
      mats[i].color.copy(base[i]).multiplyScalar(1.3 + on * 2 - dim * 0.6)
    })
  })

  return (
    <Part id="s9-values" position-y={0.78}>
      <group ref={ring}>
        {tones.map((_, i) => {
          const a = (i / tones.length) * Math.PI * 2
          return (
            <mesh
              key={i}
              ref={(m) => void (m && (gems.current[i] = m))}
              material={mats[i]}
              position={[Math.cos(a) * 1.02, 0, Math.sin(a) * 1.02]}
            >
              <octahedronGeometry args={[0.095, 0]} />
            </mesh>
          )
        })}
      </group>
    </Part>
  )
}

/** Slide 9 - Schein's three levels of culture as an iceberg. */
export default function Scene09() {
  const berg = useRef<THREE.Group>(null!)
  const water = useRef<THREE.MeshPhysicalMaterial>(null!)
  const rim = useRef<THREE.MeshBasicMaterial>(null!)
  const stress = useRef(0)
  const calm = useMemo(() => new THREE.Color('#3fb6a0'), [])
  const tense = useMemo(() => new THREE.Color(PAL.coral), [])

  // artefacts: what you can see / espoused values: at the waterline / assumptions: the hidden mass
  const [tip, mid, deep] = useMemo(
    () => [
      chisel(new THREE.ConeGeometry(0.72, 1.3, 7, 3), 0.34, 1).translate(0, 0.65, 0),
      chisel(new THREE.CylinderGeometry(0.8, 1.08, 0.62, 8, 2), 0.2, 2).translate(0, -0.31, 0),
      chisel(new THREE.CylinderGeometry(1.1, 0.22, 1.72, 8, 4), 0.26, 3).translate(0, -0.86, 0),
    ],
    [],
  )

  useFrame((state, dt) => {
    const active = useDeck.getState().active
    const t = state.clock.elapsedTime
    stress.current = damp(stress.current, active === 's9-challenges' ? 1 : 0, 4, dt)
    // cost pressure rocks the whole iceberg
    berg.current.rotation.z = Math.sin(t * 0.8) * 0.02 + Math.sin(t * 2.6) * 0.085 * stress.current
    berg.current.position.y = Math.sin(t * 0.9) * 0.035
    water.current.color.copy(calm).lerp(tense, stress.current * 0.75)
    const k = 1.2 + stress.current * 1.4
    rim.current.color.setRGB((0.5 + stress.current * 0.5) * k, (0.95 - stress.current * 0.4) * k, (0.75 - stress.current * 0.4) * k)
  })

  return (
    <Hero position={[3.3, -0.4, 0]} scale={0.9}>
      <DragRotate auto={0.13} tilt={0.2} radius={2.35}>
        <group position-y={0.5}>
          <group ref={berg}>
            <Layer id="s9-artefacts" geometry={tip} y={0.17} color="#f2fff8" glow={PAL.cream} shift={0.16} />
            <Layer id="s9-espoused" geometry={mid} y={0.13} color="#a9ead0" glow={PAL.sky} shift={0} />
            <Layer id="s9-assumptions" geometry={deep} y={-0.53} color="#3d9c82" glow={PAL.lime} shift={-0.16} />
            <Values />
          </group>

          {/* waterline */}
          <mesh rotation-x={-Math.PI / 2} raycast={() => null}>
            <circleGeometry args={[2.05, 72]} />
            <meshPhysicalMaterial ref={water} color="#3fb6a0" transparent opacity={0.3} roughness={0.08} metalness={0.1} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          <mesh rotation-x={-Math.PI / 2} raycast={() => null}>
            <ringGeometry args={[2.05, 2.07, 96]} />
            <meshBasicMaterial ref={rim} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </DragRotate>
      <Pedestal y={-2.15} r={1.5} />
    </Hero>
  )
}
