import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { Hammer } from 'lucide-react'
import { DragRotate, Hero, Medallion, PAL, Pedestal } from '../kit'

const G = -0.62 // ground level of the island

function Tree({ position, s = 1 }: { position: [number, number, number]; s?: number }) {
  return (
    <group position={position} scale={s}>
      <mesh position-y={0.09}>
        <cylinderGeometry args={[0.03, 0.04, 0.18, 6]} />
        <meshStandardMaterial color="#7a5a3a" roughness={0.9} />
      </mesh>
      <mesh position-y={0.3}>
        <coneGeometry args={[0.17, 0.34, 7]} />
        <meshStandardMaterial color={PAL.leaf} roughness={0.8} flatShading />
      </mesh>
      <mesh position-y={0.5}>
        <coneGeometry args={[0.12, 0.28, 7]} />
        <meshStandardMaterial color="#6fd08c" roughness={0.8} flatShading />
      </mesh>
    </group>
  )
}

function Warehouse() {
  const roof = useMemo(() => {
    // shallow gable roof
    const s = new THREE.Shape()
    s.moveTo(-1.1, 0)
    s.lineTo(1.1, 0)
    s.lineTo(0, 0.26)
    s.closePath()
    const g = new THREE.ExtrudeGeometry(s, { depth: 1.3, bevelEnabled: false })
    g.translate(0, 0, -0.65)
    return g
  }, [])

  return (
    <group position={[0, G, -0.15]}>
      {/* main hall */}
      <mesh position-y={0.42}>
        <boxGeometry args={[2.0, 0.84, 1.16]} />
        <meshStandardMaterial color="#1f7a50" roughness={0.55} metalness={0.05} />
      </mesh>
      <mesh geometry={roof} position-y={0.84}>
        <meshStandardMaterial color="#0f3d2a" roughness={0.5} metalness={0.2} flatShading />
      </mesh>
      {/* skylights */}
      {[-0.55, 0, 0.55].map((x) => (
        <mesh key={x} position={[x, 1.108 - Math.abs(x) * 0.236, 0]} rotation-z={x === 0 ? 0 : -Math.sign(x) * 0.232}>
          <boxGeometry args={[0.2, 0.012, 0.9]} />
          <meshBasicMaterial color={[1.6, 2.4, 1.9]} toneMapped={false} />
        </mesh>
      ))}
      {/* fascia + glowing entrance */}
      <mesh position={[0, 0.66, 0.6]}>
        <boxGeometry args={[2.02, 0.24, 0.05]} />
        <meshStandardMaterial color={PAL.cream} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.22, 0.585]}>
        <boxGeometry args={[0.62, 0.44, 0.03]} />
        <meshBasicMaterial color={[2.6, 1.9, 0.75]} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.47, 0.68]}>
        <boxGeometry args={[0.8, 0.03, 0.2]} />
        <meshStandardMaterial color="#0f3d2a" roughness={0.5} />
      </mesh>
      {[-0.72, 0.72].map((x) => (
        <mesh key={x} position={[x, 0.26, 0.585]}>
          <boxGeometry args={[0.36, 0.16, 0.02]} />
          <meshBasicMaterial color={[0.9, 1.7, 1.3]} toneMapped={false} />
        </mesh>
      ))}
      <pointLight position={[0, 0.3, 1.1]} intensity={2.2} distance={2.4} color="#ffcf7a" />
      <Medallion icon={Hammer} color={PAL.lime} radius={0.2} billboard={false} position={[0, 0.98, 0.64]} />

      {/* garden centre annex */}
      <mesh position={[1.33, 0.26, 0.1]}>
        <boxGeometry args={[0.62, 0.52, 0.8]} />
        <meshPhysicalMaterial color="#bff3d0" roughness={0.1} transmission={0.6} thickness={0.4} transparent opacity={0.55} />
      </mesh>
      <mesh position={[1.33, 0.54, 0.1]}>
        <boxGeometry args={[0.68, 0.04, 0.86]} />
        <meshStandardMaterial color="#2f8f5b" roughness={0.5} />
      </mesh>
      <mesh position={[1.33, 0.14, 0.1]}>
        <icosahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial color="#6fd08c" flatShading />
      </mesh>
    </group>
  )
}

/** DIY objects circling above the store. */
function Orbiters() {
  const ring = useRef<THREE.Group>(null!)
  const items = useRef<THREE.Group[]>([])
  useFrame((state, dt) => {
    ring.current.rotation.y -= dt * 0.35
    items.current.forEach((g, i) => {
      if (!g) return
      g.rotation.x += dt * (0.5 + i * 0.13)
      g.rotation.z += dt * 0.4
      g.position.y = Math.sin(state.clock.elapsedTime * 1.2 + i * 1.7) * 0.12
    })
  })
  const R = 1.62
  const slot = (i: number): [number, number, number] => [Math.cos((i * Math.PI) / 2) * R, 0, Math.sin((i * Math.PI) / 2) * R]
  const put = (i: number) => (g: THREE.Group | null) => {
    if (g) items.current[i] = g
  }

  return (
    <group ref={ring} position-y={G + 1.72}>
      {/* hammer */}
      <group position={slot(0)}>
        <group ref={put(0)} scale={1.15}>
          <mesh>
            <cylinderGeometry args={[0.028, 0.034, 0.52, 10]} />
            <meshStandardMaterial color="#d9a55c" roughness={0.6} />
          </mesh>
          <mesh position={[0.03, 0.27, 0]}>
            <boxGeometry args={[0.3, 0.11, 0.11]} />
            <meshStandardMaterial color="#dfe8e2" roughness={0.25} metalness={0.9} />
          </mesh>
        </group>
      </group>
      {/* paint bucket */}
      <group position={slot(1)}>
        <group ref={put(1)}>
          <mesh>
            <cylinderGeometry args={[0.15, 0.13, 0.26, 20]} />
            <meshStandardMaterial color={PAL.cream} roughness={0.35} metalness={0.3} />
          </mesh>
          <mesh position-y={0.132}>
            <cylinderGeometry args={[0.135, 0.135, 0.01, 20]} />
            <meshBasicMaterial color={[1.5, 2.3, 0.6]} toneMapped={false} />
          </mesh>
        </group>
      </group>
      {/* potted plant */}
      <group position={slot(2)}>
        <group ref={put(2)}>
          <mesh position-y={-0.08}>
            <cylinderGeometry args={[0.12, 0.085, 0.17, 10]} />
            <meshStandardMaterial color={PAL.coral} roughness={0.7} flatShading />
          </mesh>
          <mesh position-y={0.11}>
            <icosahedronGeometry args={[0.17, 0]} />
            <meshStandardMaterial color="#6fd08c" roughness={0.7} flatShading />
          </mesh>
        </group>
      </group>
      {/* hex nut */}
      <group position={slot(3)}>
        <group ref={put(3)}>
          <mesh>
            <torusGeometry args={[0.13, 0.055, 8, 6]} />
            <meshStandardMaterial color={PAL.amber} roughness={0.25} metalness={0.85} flatShading />
          </mesh>
        </group>
      </group>
    </group>
  )
}

/** Slide 1 - a floating home-improvement warehouse. */
export default function Scene01() {
  return (
    <Hero scale={1.06}>
      <DragRotate auto={0.16} tilt={0.3} yaw={-0.5} radius={2.2}>
        <Float speed={1.5} rotationIntensity={0.12} floatIntensity={0.45}>
          {/* island */}
          <mesh position-y={G - 0.17}>
            <cylinderGeometry args={[1.95, 1.75, 0.34, 12]} />
            <meshStandardMaterial color="#1b5a3d" roughness={0.85} flatShading />
          </mesh>
          <mesh position-y={G - 0.84} rotation-x={Math.PI}>
            <coneGeometry args={[1.75, 1.0, 12]} />
            <meshStandardMaterial color="#113525" roughness={0.9} flatShading />
          </mesh>
          <mesh position-y={G + 0.005}>
            <cylinderGeometry args={[1.9, 1.9, 0.02, 12]} />
            <meshStandardMaterial color="#2f8f5b" roughness={0.8} flatShading />
          </mesh>

          {/* car park */}
          <mesh position={[0, G + 0.02, 1.08]}>
            <boxGeometry args={[1.9, 0.012, 0.72]} />
            <meshStandardMaterial color="#143c2c" roughness={0.9} />
          </mesh>
          {[-0.75, -0.45, -0.15, 0.15, 0.45, 0.75].map((x) => (
            <mesh key={x} position={[x, G + 0.03, 1.22]}>
              <boxGeometry args={[0.015, 0.004, 0.3]} />
              <meshBasicMaterial color={PAL.cream} />
            </mesh>
          ))}
          {/* stacked timber + pallets by the door */}
          {(
            [
              [-0.62, 0.07, 0.72, PAL.amber],
              [-0.62, 0.19, 0.72, '#e0a85e'],
              [-0.82, 0.07, 0.78, '#c98e4b'],
              [0.66, 0.07, 0.74, PAL.sky],
            ] as const
          ).map(([x, y, z, c], i) => (
            <mesh key={i} position={[x, G + y, z]}>
              <boxGeometry args={[0.17, 0.12, 0.17]} />
              <meshStandardMaterial color={c} roughness={0.7} />
            </mesh>
          ))}

          <Warehouse />

          <Tree position={[-1.5, G, 0.55]} s={1.15} />
          <Tree position={[-1.35, G, -0.75]} />
          <Tree position={[1.55, G, 0.95]} s={0.9} />
          <Tree position={[0.4, G, -1.45]} s={1.2} />
          <Tree position={[-0.5, G, -1.5]} s={0.85} />
          <Tree position={[1.25, G, -1.1]} s={1.05} />

          <Orbiters />
        </Float>
      </DragRotate>
      <Pedestal y={-2.0} r={1.7} />
    </Hero>
  )
}
