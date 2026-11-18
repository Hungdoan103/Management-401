import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Scale, Sun, Zap } from 'lucide-react'
import { DragRotate, Hero, Medallion, PAL, Part, Pedestal, getHeartGeometry, useFocus } from '../kit'

const R = 1.12
const UP = new THREE.Vector3(0, 1, 0)

/** cheap, deterministic "continents": > 0 is land */
function terrain(p: THREE.Vector3) {
  return (
    Math.sin(p.x * 2.3 + 0.7) * Math.cos(p.y * 2.1 - 0.4) +
    0.6 * Math.sin(p.z * 3.1 + p.x * 1.7 + 1.9) +
    0.35 * Math.cos(p.y * 4.3 + p.z * 2.2) -
    0.12
  )
}

/** evenly spread directions that fall well inside a continent - used to plant things */
function landSites(count: number, minGap: number) {
  const sites: THREE.Vector3[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < 600 && sites.length < count; i++) {
    const y = 1 - ((i * 7) % 600) / 299.5
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const dir = new THREE.Vector3(Math.cos(golden * i * 7) * r, y, Math.sin(golden * i * 7) * r)
    if (Math.abs(dir.y) > 0.82 || terrain(dir) < 0.42) continue
    if (sites.some((s) => s.distanceTo(dir) < minGap)) continue
    sites.push(dir)
  }
  return sites
}

function Planet() {
  const geometry = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(R, 7)
    const pos = g.attributes.position as THREE.BufferAttribute
    const colors = new Float32Array(pos.count * 3)
    const v = new THREE.Vector3()
    const centroid = new THREE.Vector3()
    const color = new THREE.Color()
    const sea = [new THREE.Color('#0d4a4a'), new THREE.Color('#136a62')]
    const land = [new THREE.Color('#2f8f5b'), new THREE.Color('#7fd08a'), new THREE.Color('#d8cd8e')]

    // colour each triangle from its centre, then raise the land slightly
    for (let f = 0; f < pos.count; f += 3) {
      centroid.set(0, 0, 0)
      for (let k = 0; k < 3; k++) centroid.add(v.fromBufferAttribute(pos, f + k))
      centroid.normalize()
      const h = terrain(centroid)
      if (h > 0) {
        if (h < 0.1) color.copy(land[2])
        else color.copy(land[0]).lerp(land[1], THREE.MathUtils.clamp((h - 0.1) / 0.9, 0, 1))
        if (Math.abs(centroid.y) > 0.9) color.set('#eafff3')
      } else {
        color.copy(sea[0]).lerp(sea[1], THREE.MathUtils.clamp(1 + h * 1.4, 0, 1))
      }
      for (let k = 0; k < 3; k++) color.toArray(colors, (f + k) * 3)
    }
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).normalize()
      const h = terrain(v)
      v.multiplyScalar(R * (1 + (h > 0 ? 0.012 + Math.min(h, 1) * 0.04 : 0)))
      pos.setXYZ(i, v.x, v.y, v.z)
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    g.computeVertexNormals()
    return g
  }, [])

  return (
    <>
      <mesh geometry={geometry}>
        <meshStandardMaterial vertexColors flatShading roughness={0.7} metalness={0.05} />
      </mesh>
      {/* atmosphere */}
      <mesh raycast={() => null}>
        <sphereGeometry args={[R * 1.16, 48, 32]} />
        <meshBasicMaterial color="#7fe8c0" transparent opacity={0.09} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </>
  )
}

/** Wind turbines + trees: renewable electricity and lower operational emissions. */
function CleanEnergy() {
  const focus = useFocus('s8-emissions')
  const rotors = useRef<THREE.Group[]>([])
  const blade = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false }), [])
  const sites = useMemo(() => landSites(12, 0.42), [])
  const place = (dir: THREE.Vector3, lift = 0.03) => ({
    position: dir.clone().multiplyScalar(R * 1.03 + lift),
    quaternion: new THREE.Quaternion().setFromUnitVectors(UP, dir),
  })

  useFrame((_, dt) => {
    const { on, dim } = focus.current
    rotors.current.forEach((r, i) => (r.rotation.z += dt * (1.6 + i * 0.3 + on * 7)))
    const k = 1.25 + on * 2.2 - dim * 0.5
    blade.color.setRGB(0.6 * k, 0.9 * k, 0.95 * k)
  })

  return (
    <Part id="s8-emissions">
      {sites.slice(0, 4).map((dir, i) => (
        <group key={i} {...place(dir, 0)}>
          <mesh position-y={0.2}>
            <cylinderGeometry args={[0.012, 0.02, 0.4, 8]} />
            <meshStandardMaterial color={PAL.cream} roughness={0.4} />
          </mesh>
          <group position={[0, 0.4, 0.03]} ref={(g) => void (g && (rotors.current[i] = g))}>
            <mesh material={blade}>
              <sphereGeometry args={[0.03, 10, 8]} />
            </mesh>
            {[0, 1, 2].map((b) => (
              <group key={b} rotation-z={(b * Math.PI * 2) / 3}>
                <mesh position-y={0.12} material={blade}>
                  <boxGeometry args={[0.03, 0.22, 0.008]} />
                </mesh>
              </group>
            ))}
          </group>
        </group>
      ))}
      {sites.slice(4).map((dir, i) => (
        <group key={i} {...place(dir, 0)}>
          <mesh position-y={0.1}>
            <coneGeometry args={[0.07, 0.2, 6]} />
            <meshStandardMaterial color={i % 2 ? '#6fd08c' : '#3fa66a'} roughness={0.8} flatShading />
          </mesh>
        </group>
      ))}
    </Part>
  )
}

/** Three chasing arrows orbiting the planet: waste diverted from landfill. */
function RecyclingLoop() {
  const spin = useRef<THREE.Group>(null!)
  const material = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false }), [])
  const focus = useFocus('s8-waste')
  const ORBIT = 1.58
  const ARC = (Math.PI * 2) / 3 - 0.42

  useFrame((_, dt) => {
    const { on, dim } = focus.current
    spin.current.rotation.z -= dt * (0.5 + on * 1.4)
    const k = 1.2 + on * 2.3 - dim * 0.6
    material.color.setRGB(0.83 * k, 0.95 * k, 0.42 * k)
  })

  return (
    <Part id="s8-waste" rotation={[1.2, 0.35, 0]}>
      <group ref={spin}>
        {[0, 1, 2].map((i) => (
          <group key={i} rotation-z={(i * Math.PI * 2) / 3}>
            <mesh material={material}>
              <torusGeometry args={[ORBIT, 0.032, 10, 40, ARC]} />
            </mesh>
            {/* arrow head at the start of the arc, pointing clockwise */}
            <mesh material={material} position={[ORBIT, -0.03, 0]} rotation-z={Math.PI}>
              <coneGeometry args={[0.095, 0.22, 14]} />
            </mesh>
          </group>
        ))}
      </group>
    </Part>
  )
}

/** Hearts in orbit: community contributions. */
function Community() {
  const orbit = useRef<THREE.Group>(null!)
  const hearts = useRef<THREE.Mesh[]>([])
  const shared = useMemo(
    () => new THREE.MeshStandardMaterial({ color: PAL.amber, emissive: new THREE.Color(PAL.amber), emissiveIntensity: 0.6, roughness: 0.3 }),
    [],
  )
  const focus = useFocus('s8-community')

  useFrame((state, dt) => {
    const { on, dim } = focus.current
    orbit.current.rotation.y += dt * (0.35 + on * 0.5)
    shared.emissiveIntensity = 0.6 + on * 1.8 - dim * 0.3
    hearts.current.forEach((h, i) => {
      h.scale.setScalar(0.2 * (1 + on * 0.7 + Math.sin(state.clock.elapsedTime * 2 + i * 2) * 0.08))
      h.rotation.y += dt * 1.1
    })
  })

  return (
    <Part id="s8-community" rotation={[0.3, 0, -0.42]}>
      <group ref={orbit}>
        {[0, 1, 2].map((i) => {
          const a = (i * Math.PI * 2) / 3
          return (
            <mesh
              key={i}
              ref={(m) => void (m && (hearts.current[i] = m))}
              geometry={getHeartGeometry()}
              material={shared}
              position={[Math.cos(a) * 1.72, 0, Math.sin(a) * 1.72]}
              scale={0.2}
            />
          )
        })}
      </group>
    </Part>
  )
}

/** Extra policy satellites linked to the three narrative cards. */
function PolicySatellites() {
  const items = [
    { id: 's8-initiatives', icon: Sun, color: PAL.amber, a: 0.4 },
    { id: 's8-frameworks', icon: Zap, color: PAL.lime, a: 2.5 },
    { id: 's8-judge', icon: Scale, color: PAL.coral, a: 4.5 },
  ] as const
  return (
    <group position-y={1.55}>
      {items.map((it) => (
        <Part key={it.id} id={it.id} position={[Math.cos(it.a) * 1.15, Math.sin(it.a * 1.3) * 0.2, Math.sin(it.a) * 1.15]}>
          <Medallion icon={it.icon} color={it.color} radius={0.2} focusId={it.id} />
        </Part>
      ))}
    </group>
  )
}

/** Slide 8 - planet of emissions / waste / community + policy satellites. */
export default function Scene08() {
  return (
    <Hero>
      <DragRotate auto={0.2} tilt={0.22} radius={2.1}>
        <Planet />
        <CleanEnergy />
        <RecyclingLoop />
        <Community />
        <PolicySatellites />
      </DragRotate>
      <Pedestal y={-1.95} r={1.6} />
    </Hero>
  )
}
