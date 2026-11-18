import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useDeck } from '../../store'
import { DragRotate, Hero, PAL, Part, Pedestal, damp, getShieldGeometry, mulberry32, useFocus } from '../kit'

const N = 10 // 10 x 10 tiles: each tile stands for 1% of supplier sites
const PITCH = 0.27
const FY25 = 71
const HIGH_RISK = 18 // amber tiles when modern-slavery / stakeholder risk is spotlighted

const LIT = new THREE.Color(PAL.lime)
const GAP = new THREE.Color(PAL.amber) // the tiles that were monitored in FY2024 but not in FY2025
const OFF = new THREE.Color('#0d2c1f')

/**
 * 100 supplier-site tiles. 71 are lit (FY2025 coverage); spotlighting the FY2024 figure
 * lights 77, making the six-point drop visible.
 */
function SiteGrid() {
  const towers = useRef<THREE.InstancedMesh>(null!)
  const lamps = useRef<THREE.InstancedMesh>(null!)
  const scanner = useRef<THREE.Mesh>(null!)
  const scannerMat = useRef<THREE.MeshBasicMaterial>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])
  const sourcing = useFocus('s6-sourcing')
  const stake = useFocus('s6-stake')
  const coverage = useRef(0)
  const scan = useRef(0)

  // each tile gets a rank 0..99; a tile is monitored when rank < coverage
  const tiles = useMemo(() => {
    const rnd = mulberry32(77)
    const ranks = Array.from({ length: N * N }, (_, i) => i)
    for (let i = ranks.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1))
      ;[ranks[i], ranks[j]] = [ranks[j], ranks[i]]
    }
    return ranks.map((rank, i) => ({
      rank,
      x: ((i % N) - (N - 1) / 2) * PITCH,
      z: (Math.floor(i / N) - (N - 1) / 2) * PITCH,
    }))
  }, [])

  useFrame((state, dt) => {
    const active = useDeck.getState().active
    const t = state.clock.elapsedTime
    // Always show 71% monitored sites; risk spots flag the remaining uncovered tiles
    coverage.current = damp(coverage.current, FY25, 3.2, dt)
    const showGap = Math.max(stake.current.on, active === 's6-fy24' ? 1 : 0)

    scan.current += dt * (0.32 + sourcing.current.on * 0.7 + (active === 's6-ethics' ? 0.55 : 0))
    const half = (N * PITCH) / 2 + 0.1
    const scanZ = THREE.MathUtils.lerp(-half, half, (scan.current % 1.25) / 1.0)
    scanner.current.position.z = scanZ
    scanner.current.visible = scanZ <= half
    scannerMat.current.opacity = 0.2 + sourcing.current.on * 0.4

    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i]
      const level = THREE.MathUtils.clamp(coverage.current - tile.rank, 0, 1)
      const atRisk = tile.rank >= FY25 && tile.rank < FY25 + HIGH_RISK
      const sweep = Math.exp(-Math.pow((tile.z - scanZ) / 0.16, 2)) * (scanner.current.visible ? 1 : 0)
      const h = 0.06 + level * 0.2 + sweep * 0.05

      dummy.position.set(tile.x, h / 2, tile.z)
      dummy.scale.set(1, h, 1)
      dummy.updateMatrix()
      towers.current.setMatrixAt(i, dummy.matrix)
      dummy.position.set(tile.x, h + 0.008, tile.z)
      dummy.scale.set(1, 1, 1)
      dummy.updateMatrix()
      lamps.current.setMatrixAt(i, dummy.matrix)

      // lit = monitored; uncovered/high-risk flash amber on modern-slavery / stakeholder focus
      if (atRisk && showGap > 0.05) {
        const blink = 0.55 + 0.45 * Math.sin(t * 5)
        color.copy(OFF).lerp(GAP, showGap * blink)
        color.multiplyScalar(1 + showGap * blink * 1.1 + sweep)
      } else {
        color.copy(OFF).lerp(LIT, level)
        color.multiplyScalar(1 + level * (0.75 + sweep * 1.6 + sourcing.current.on * 0.5) + sweep * 0.6)
      }
      lamps.current.setColorAt(i, color)
    }
    towers.current.instanceMatrix.needsUpdate = true
    lamps.current.instanceMatrix.needsUpdate = true
    if (lamps.current.instanceColor) lamps.current.instanceColor.needsUpdate = true
  })

  const size = N * PITCH + 0.24
  return (
    <group>
      {/* board */}
      <mesh position-y={-0.05}>
        <boxGeometry args={[size, 0.1, size]} />
        <meshStandardMaterial color="#123b29" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position-y={0.004} rotation-x={-Math.PI / 2} raycast={() => null}>
        <ringGeometry args={[size * 0.695, size * 0.707, 4, 1, Math.PI / 4]} />
        <meshBasicMaterial color={[0.8, 1.8, 1.1]} toneMapped={false} />
      </mesh>

      <instancedMesh ref={towers} args={[undefined, undefined, N * N]} frustumCulled={false}>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial color="#1f6f4a" roughness={0.45} metalness={0.15} />
      </instancedMesh>
      <instancedMesh ref={lamps} args={[undefined, undefined, N * N]} frustumCulled={false} raycast={() => null}>
        <boxGeometry args={[0.2, 0.016, 0.2]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* audit scanner sweeping across the sites */}
      <mesh ref={scanner} position-y={0.3} raycast={() => null}>
        <boxGeometry args={[size, 0.6, 0.012]} />
        <meshBasicMaterial ref={scannerMat} color={[0.6, 1.6, 1]} transparent opacity={0.2} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}

/** Shield with a tick: ethical governance watching over the supply base. */
function Guardian() {
  const group = useRef<THREE.Group>(null!)
  const body = useRef<THREE.MeshPhysicalMaterial>(null!)
  const tick = useRef<THREE.MeshBasicMaterial>(null!)
  const focus = useFocus('s6-ethics')
  const check = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      [new THREE.Vector3(-0.2, 0.0, 0), new THREE.Vector3(-0.06, -0.16, 0), new THREE.Vector3(0.22, 0.2, 0)],
      false,
      'catmullrom',
      0,
    )
    return new THREE.TubeGeometry(curve, 24, 0.038, 10, false)
  }, [])

  useFrame((state, dt) => {
    const { on, dim } = focus.current
    group.current.rotation.y += dt * (0.5 + on * 1.2)
    group.current.position.y = 1.2 + Math.sin(state.clock.elapsedTime * 1.4) * 0.06
    group.current.scale.setScalar(0.92 + on * 0.25)
    body.current.emissiveIntensity = 0.3 + on * 1.1 - dim * 0.15
    const k = 1.6 + on * 2
    tick.current.color.setRGB(0.83 * k, 0.95 * k, 0.42 * k)
  })

  return (
    <Part id="s6-ethics">
      <group ref={group} position-y={1.2}>
        <mesh geometry={getShieldGeometry()}>
          <meshPhysicalMaterial ref={body} color="#2f8f5b" emissive={PAL.mint} emissiveIntensity={0.3} roughness={0.25} metalness={0.4} clearcoat={1} />
        </mesh>
        {[0.085, -0.085].map((z) => (
          <mesh key={z} geometry={check} position={[0, 0, z]}>
            <meshBasicMaterial ref={z > 0 ? tick : undefined} color={[1.4, 1.6, 0.7]} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </Part>
  )
}

/** Slide 6 - 71% supplier monitoring grid under an ethical-governance shield. */
export default function Scene06() {
  return (
    <Hero position={[3.3, -0.55, 0]} scale={0.92}>
      <DragRotate sway={0.3} tilt={0.72} yaw={-0.55} radius={2.3}>
        <group position-y={-0.35}>
          <SiteGrid />
          <Guardian />
        </group>
      </DragRotate>
      <Pedestal y={-1.9} r={1.9} />
    </Hero>
  )
}
