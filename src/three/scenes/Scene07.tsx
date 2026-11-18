import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { DragRotate, Hero, PAL, Part, Pedestal, getHeartGeometry, getShieldGeometry, useFocus } from '../kit'

const COUNT = 10
const RADIUS = 1.32
const FLOOR = -1.05
const TONES = [PAL.mint, PAL.cream, PAL.sky, PAL.amber, PAL.violet, PAL.lime, PAL.amber, PAL.coral, PAL.mint, PAL.amber]
/** figures highlighted for the Aboriginal and Torres Strait Islander employment figure */
const FEATURED = new Set([3, 6, 9])

function Person({ i }: { i: number }) {
  const group = useRef<THREE.Group>(null!)
  const material = useRef<THREE.MeshStandardMaterial>(null!)
  const halo = useRef<THREE.MeshBasicMaterial>(null!)
  const inclusive = useFocus('s7-inclusive')
  const featured = FEATURED.has(i)
  const indigenous = useFocus('s7-indigenous')
  const angle = (i / COUNT) * Math.PI * 2
  const height = 0.88 + ((i * 37) % 10) / 40 // people come in different sizes

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const wave = Math.max(0, Math.sin(t * 2.4 - i * 0.63))
    const lift = wave * (0.035 + inclusive.current.on * 0.2) + (featured ? indigenous.current.on * 0.14 : 0)
    group.current.position.y = FLOOR + lift
    const mine = featured ? indigenous.current.on : 0
    group.current.scale.setScalar(height * (1 + mine * 0.16))
    const dim = featured ? 0 : indigenous.current.on * 0.55
    material.current.emissiveIntensity = 0.22 + inclusive.current.on * 0.35 + mine * 0.9 - dim * 0.2
    material.current.opacity = 1 - dim * 0.5
    if (halo.current) {
      const k = 0.9 + mine * 2.4
      halo.current.color.setRGB(0.96 * k, 0.76 * k, 0.35 * k)
      halo.current.opacity = 0.45 + mine * 0.55
    }
  })

  return (
    <group position={[Math.cos(angle) * RADIUS, 0, Math.sin(angle) * RADIUS]}>
      <group ref={group} position-y={FLOOR}>
        <mesh position-y={0.36}>
          <capsuleGeometry args={[0.15, 0.36, 6, 16]} />
          <meshStandardMaterial ref={material} color={TONES[i]} emissive={TONES[i]} emissiveIntensity={0.22} roughness={0.45} transparent />
        </mesh>
        <mesh position-y={0.83}>
          <sphereGeometry args={[0.125, 20, 16]} />
          <meshStandardMaterial color={TONES[i]} emissive={TONES[i]} emissiveIntensity={0.22} roughness={0.45} />
        </mesh>
      </group>
      {featured && (
        <mesh position-y={FLOOR + 0.012} rotation-x={-Math.PI / 2} raycast={() => null}>
          <ringGeometry args={[0.22, 0.27, 40]} />
          <meshBasicMaterial ref={halo} transparent toneMapped={false} />
        </mesh>
      )}
    </group>
  )
}

/** Slide 7 - a diverse team standing together around safety (shield) and wellbeing (heart). */
export default function Scene07() {
  const shield = useRef<THREE.Group>(null!)
  const shieldMat = useRef<THREE.MeshPhysicalMaterial>(null!)
  const heart = useRef<THREE.Mesh>(null!)
  const heartMat = useRef<THREE.MeshStandardMaterial>(null!)
  const link = useRef<THREE.MeshBasicMaterial>(null!)
  const injury = useFocus('s7-injury')
  const wellbeing = useFocus('s7-wellbeing')
  const capability = useFocus(['s7-capability', 's7-inclusive'])
  const plusMaterial = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false }), [])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    shield.current.rotation.y += dt * (0.45 + injury.current.on)
    shield.current.scale.setScalar(0.78 + injury.current.on * 0.2)
    shieldMat.current.emissiveIntensity = 0.3 + injury.current.on * 1.1 - injury.current.dim * 0.15
    const p = 1.5 + injury.current.on * 2.2
    plusMaterial.color.setRGB(0.83 * p, 0.95 * p, 0.42 * p)

    // heartbeat: two quick pulses, then rest
    const beat = (t * (1.1 + wellbeing.current.on * 0.5)) % 1
    const pulse = Math.max(Math.exp(-Math.pow((beat - 0.12) / 0.06, 2)), 0.7 * Math.exp(-Math.pow((beat - 0.32) / 0.06, 2)))
    heart.current.scale.setScalar(0.42 * (1 + pulse * 0.16 + wellbeing.current.on * 0.35))
    heart.current.rotation.y = Math.sin(t * 0.8) * 0.5
    heartMat.current.emissiveIntensity = 0.6 + pulse * 0.6 + wellbeing.current.on * 1.5 - wellbeing.current.dim * 0.3

    const k = 0.9 + capability.current.on * 2.4 - capability.current.dim * 0.35
    link.current.color.setRGB(0.66 * k, 0.9 * k, 0.71 * k)
  })

  return (
    <Hero position={[3.3, -0.5, 0]}>
      <DragRotate auto={0.17} tilt={0.36} radius={2.15}>
        {/* platform */}
        <mesh position-y={FLOOR - 0.07}>
          <cylinderGeometry args={[1.78, 1.68, 0.14, 48]} />
          <meshStandardMaterial color="#164a33" roughness={0.6} metalness={0.15} />
        </mesh>
        <mesh position-y={FLOOR + 0.004} rotation-x={-Math.PI / 2} raycast={() => null}>
          <ringGeometry args={[1.7, 1.74, 96]} />
          <meshBasicMaterial color={[0.8, 1.8, 1.1]} toneMapped={false} />
        </mesh>

        {/* everyone linked in one circle */}
        <Part id="s7-capability">
          <mesh position-y={FLOOR + 0.42} rotation-x={Math.PI / 2}>
            <torusGeometry args={[RADIUS, 0.022, 10, 120]} />
            <meshBasicMaterial ref={link} toneMapped={false} />
          </mesh>
        </Part>
        <Part id="s7-indigenous">
          {[3, 6, 9].map((i) => (
            <Person key={i} i={i} />
          ))}
        </Part>
        <Part id="s7-inclusive">
          {[0, 1, 2, 4, 5, 7, 8].map((i) => (
            <Person key={i} i={i} />
          ))}
        </Part>

        {/* safety */}
        <Part id="s7-injury">
          <group ref={shield} position-y={FLOOR + 0.62}>
            <mesh geometry={getShieldGeometry()}>
              <meshPhysicalMaterial ref={shieldMat} color="#2f8f5b" emissive={PAL.lime} emissiveIntensity={0.3} roughness={0.25} metalness={0.4} clearcoat={1} />
            </mesh>
            {[0.09, -0.09].map((z) => (
              <group key={z} position={[0, 0.02, z]}>
                <mesh material={plusMaterial}>
                  <boxGeometry args={[0.38, 0.11, 0.02]} />
                </mesh>
                <mesh material={plusMaterial}>
                  <boxGeometry args={[0.11, 0.38, 0.02]} />
                </mesh>
              </group>
            ))}
          </group>
        </Part>

        {/* wellbeing */}
        <Part id="s7-wellbeing">
          <mesh ref={heart} geometry={getHeartGeometry()} position-y={FLOOR + 1.62} scale={0.42}>
            <meshStandardMaterial ref={heartMat} color={PAL.coral} emissive={PAL.coral} emissiveIntensity={0.6} roughness={0.3} />
          </mesh>
        </Part>
      </DragRotate>
      <Pedestal y={-1.75} r={1.85} />
    </Hero>
  )
}
