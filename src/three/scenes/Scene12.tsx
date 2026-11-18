import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { DragRotate, Hero, PAL, Part, Pedestal, useFocus } from '../kit'

const COUNT = 11 // one book per reference
const W = 1.26
const H = 0.185
const D = 0.92
const PITCH = 0.212
const BASE_Y = -1.5
const COVERS = [PAL.green, PAL.amber, PAL.sky, PAL.coral, PAL.mint, PAL.lime, '#3fa66a', PAL.violet, PAL.amber, PAL.cream, PAL.sky]

function Book({ i }: { i: number }) {
  const slide = useRef<THREE.Group>(null!)
  const cover = useRef<THREE.MeshStandardMaterial>(null!)
  const focus = useFocus(`s12-r${i}`)
  const color = COVERS[i]
  const turn = i * 0.47 + Math.sin(i * 12.9) * 0.12

  useFrame(() => {
    const { on, dim } = focus.current
    slide.current.position.x = on * 0.42 // the cited book slides out of the stack
    cover.current.emissiveIntensity = 0.1 + on * 0.85
    cover.current.color.set(color).multiplyScalar(1 - dim * 0.5)
  })

  return (
    <Part id={`s12-r${i}`} position-y={BASE_Y + i * PITCH} rotation-y={turn}>
      <group ref={slide}>
        {/* pages */}
        <mesh position={[0.02, 0, 0]}>
          <boxGeometry args={[W - 0.07, H - 0.04, D - 0.05]} />
          <meshStandardMaterial color="#f6f1e3" roughness={0.9} />
        </mesh>
        {/* hard cover: top, bottom and spine share one material */}
        <mesh position-y={H / 2 - 0.011}>
          <boxGeometry args={[W, 0.022, D]} />
          <meshStandardMaterial ref={cover} color={color} emissive={color} emissiveIntensity={0.1} roughness={0.5} metalness={0.05} />
        </mesh>
        <mesh position-y={-H / 2 + 0.011}>
          <boxGeometry args={[W, 0.022, D]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
        <mesh position-x={-W / 2 + 0.012}>
          <boxGeometry args={[0.024, H, D]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.15} roughness={0.5} />
        </mesh>
        {/* title band on the spine */}
        <mesh position={[-W / 2 - 0.001, 0, 0]} rotation-y={-Math.PI / 2}>
          <planeGeometry args={[D * 0.5, H * 0.32]} />
          <meshBasicMaterial color="#0b2219" transparent opacity={0.55} />
        </mesh>
      </group>
    </Part>
  )
}

function Mortarboard() {
  const group = useRef<THREE.Group>(null!)
  useFrame((_, dt) => {
    group.current.rotation.y += dt * 0.5
  })
  return (
    <Float speed={2} rotationIntensity={0.25} floatIntensity={0.6}>
      <group ref={group} position-y={BASE_Y + COUNT * PITCH + 0.42} rotation-z={0.14}>
        <mesh position-y={-0.09}>
          <cylinderGeometry args={[0.27, 0.3, 0.2, 28]} />
          <meshStandardMaterial color="#123b29" roughness={0.5} />
        </mesh>
        <mesh rotation-y={Math.PI / 4}>
          <boxGeometry args={[0.82, 0.035, 0.82]} />
          <meshStandardMaterial color="#1d5c40" roughness={0.45} metalness={0.1} />
        </mesh>
        <mesh position-y={0.035}>
          <sphereGeometry args={[0.04, 14, 10]} />
          <meshBasicMaterial color={[2.2, 1.7, 0.7]} toneMapped={false} />
        </mesh>
        {/* tassel */}
        <mesh position={[0.24, 0.03, 0]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.008, 0.008, 0.48, 6]} />
          <meshBasicMaterial color={[2.2, 1.7, 0.7]} toneMapped={false} />
        </mesh>
        <mesh position={[0.48, -0.11, 0]}>
          <coneGeometry args={[0.04, 0.26, 10]} />
          <meshBasicMaterial color={[2.2, 1.7, 0.7]} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  )
}

/** Slide 12 - the reading list as a stack of eleven books. */
export default function Scene12() {
  return (
    <Hero position={[4.05, -0.45, 0]} scale={0.84}>
      <DragRotate auto={0.22} tilt={0.2} radius={1.9}>
        {Array.from({ length: COUNT }, (_, i) => (
          <Book key={i} i={i} />
        ))}
        <Mortarboard />
      </DragRotate>
      <Pedestal y={-1.95} r={1.25} />
    </Hero>
  )
}
