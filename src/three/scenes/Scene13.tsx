import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { MessageCircleQuestion } from 'lucide-react'
import { DragRotate, Glow, Hero, Medallion, PAL, Part, Pedestal } from '../kit'

function Bubble({
  position,
  scale = 1,
  delay = 0,
}: {
  position: [number, number, number]
  scale?: number
  delay?: number
}) {
  const g = useRef<THREE.Group>(null!)
  useFrame((state) => {
    const t = state.clock.elapsedTime + delay
    g.current.position.y = position[1] + Math.sin(t * 1.4) * 0.12
    g.current.rotation.y = Math.sin(t * 0.6) * 0.25
  })
  return (
    <group ref={g} position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.38, 28, 20]} />
        <meshStandardMaterial color={PAL.cream} roughness={0.35} metalness={0.05} />
      </mesh>
      <mesh position={[0.18, -0.32, 0.05]} rotation={[0.4, 0.5, 0.2]}>
        <coneGeometry args={[0.14, 0.22, 4]} />
        <meshStandardMaterial color={PAL.cream} roughness={0.35} />
      </mesh>
      {/* simple "?" mark */}
      <mesh position={[0, 0.06, 0.36]}>
        <torusGeometry args={[0.1, 0.035, 10, 20, Math.PI * 1.4]} />
        <meshStandardMaterial color={PAL.forest} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.12, 0.36]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color={PAL.forest} roughness={0.4} />
      </mesh>
    </group>
  )
}

/** Closing Q&A — floating question bubbles. */
export default function Scene13() {
  return (
    <Hero>
      <DragRotate auto={0.1} yaw={-0.2} tilt={0.06} radius={2.3}>
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
          <Part id="s13-team">
            <Bubble position={[0, 0.35, 0]} scale={1.15} />
            <Bubble position={[-1.05, 0.1, 0.35]} scale={0.72} delay={0.7} />
            <Bubble position={[1.1, -0.05, 0.2]} scale={0.65} delay={1.3} />
            <Medallion icon={MessageCircleQuestion} color={PAL.lime} radius={0.28} position={[0, -0.85, 0.5]} />
          </Part>
        </Float>
      </DragRotate>
      <Pedestal y={-2.05} r={1.55} color={PAL.mint} />
      <Glow position={[0, 0.1, -1.1]} size={9} opacity={0.22} color="#58c98a" />
    </Hero>
  )
}
