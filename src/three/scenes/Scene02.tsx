import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Leaf, MonitorSmartphone, ShieldAlert, Tag, UsersRound, type LucideIcon } from 'lucide-react'
import { DragRotate, Hero, Medallion, PAL, Part, Pedestal, mulberry32, useFocus } from '../kit'

/** Five management challenges orbiting the AU/NZ network. */
const CHALLENGES: Array<{ id: string; icon: LucideIcon; color: string; angle: number }> = [
  { id: 's2-price', icon: Tag, color: PAL.amber, angle: 20 },
  { id: 's2-digital', icon: MonitorSmartphone, color: PAL.sky, angle: 90 },
  { id: 's2-supply', icon: ShieldAlert, color: PAL.coral, angle: 160 },
  { id: 's2-esg', icon: Leaf, color: PAL.lime, angle: 230 },
  { id: 's2-culture', icon: UsersRound, color: PAL.mint, angle: 300 },
]

/* Simplified coastlines as [longitude, latitude] rings - stylised, not survey-grade. */
const AUSTRALIA: Array<[number, number]> = [
  [142.5, -10.7], [143.5, -14.0], [145.3, -15.0], [146.0, -18.0], [148.5, -20.0], [150.8, -22.5],
  [153.0, -25.5], [153.6, -28.5], [152.5, -32.0], [151.3, -33.8], [150.0, -37.2], [148.0, -37.9],
  [146.3, -39.1], [144.5, -38.3], [141.5, -38.4], [139.8, -37.0], [138.5, -35.5], [137.7, -35.2],
  [137.9, -32.8], [136.0, -34.8], [134.2, -32.8], [131.5, -31.5], [129.0, -31.7], [126.0, -32.3],
  [124.0, -33.0], [123.5, -33.9], [120.0, -33.9], [118.0, -35.0], [115.2, -34.3], [115.7, -32.0],
  [114.9, -29.5], [113.5, -26.0], [113.7, -22.5], [116.5, -20.6], [119.0, -20.0], [121.5, -19.0],
  [122.2, -17.5], [123.6, -16.5], [125.5, -14.5], [127.0, -13.9], [128.5, -14.9], [129.6, -14.9],
  [130.0, -12.6], [131.5, -12.2], [132.6, -11.5], [135.0, -12.2], [136.8, -12.2], [136.0, -13.8],
  [135.5, -15.0], [137.5, -16.0], [139.5, -17.5], [140.8, -17.5], [141.5, -15.5], [141.7, -12.8],
]
const TASMANIA: Array<[number, number]> = [
  [144.7, -40.7], [146.5, -41.1], [148.3, -40.9], [148.3, -42.2], [147.5, -43.4], [146.2, -43.6],
  [145.3, -42.8], [144.8, -41.5],
]
const NZ_NORTH: Array<[number, number]> = [
  [172.7, -34.4], [174.3, -35.6], [175.5, -36.6], [176.0, -37.6], [178.5, -37.7], [177.9, -39.1],
  [176.9, -39.6], [176.5, -40.9], [175.2, -41.6], [174.7, -41.2], [175.1, -40.0], [173.8, -39.3],
  [174.6, -38.2], [174.7, -37.0], [173.2, -35.2],
]
const NZ_SOUTH: Array<[number, number]> = [
  [172.7, -40.5], [174.3, -41.7], [173.0, -43.2], [172.8, -43.9], [171.3, -44.3], [170.8, -45.9],
  [169.2, -46.6], [167.5, -46.2], [166.5, -45.8], [168.3, -44.0], [170.5, -42.9], [171.5, -41.8],
  [172.1, -40.8],
]
const LANDS = [AUSTRALIA, TASMANIA, NZ_NORTH, NZ_SOUTH]

/* Population centres used to cluster the pins: [lon, lat, weight]. */
const CITIES: Array<[number, number, number]> = [
  [151.2, -33.87, 85], [144.96, -37.81, 80], [153.03, -27.47, 50], [115.86, -31.95, 40], [138.6, -34.93, 28],
  [153.4, -28.0, 14], [151.78, -32.93, 12], [149.13, -35.28, 10], [153.07, -26.65, 8], [150.89, -34.42, 6],
  [147.33, -42.88, 8], [147.14, -41.43, 3], [130.84, -12.46, 4], [145.77, -16.92, 6], [146.82, -19.26, 6],
  [150.5, -23.4, 5], [144.36, -38.15, 6], [144.0, -37.0, 5], [146.9, -36.1, 3], [151.95, -27.56, 3],
  [133.88, -23.7, 1], [121.47, -30.75, 1], [115.64, -33.33, 3], [114.6, -28.77, 1],
  [174.76, -36.85, 22], [174.78, -41.29, 8], [172.64, -43.53, 10], [175.28, -37.79, 5], [176.17, -37.69, 4],
  [170.5, -45.87, 3], [176.9, -39.5, 2], [175.6, -40.35, 2], [173.28, -41.27, 2], [168.35, -46.4, 1],
]

const STORES = 511 // one pin per store on the slide
const K = 0.06
/** lon/lat -> flat map units (x right, y up) */
const project = (lon: number, lat: number): [number, number] => [(lon - 145.75) * 0.88 * K, (lat + 28.4) * K]

function inside(lon: number, lat: number, ring: Array<[number, number]>) {
  let hit = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) hit = !hit
  }
  return hit
}

function buildPins() {
  const rnd = mulberry32(511)
  const gauss = () => (rnd() + rnd() + rnd() + rnd() - 2) * 0.9
  const total = CITIES.reduce((a, c) => a + c[2], 0)
  const pins: Array<{ x: number; z: number; h: number; phase: number; delay: number }> = []
  let guard = 0
  while (pins.length < STORES && guard++ < 40000) {
    let pick = rnd() * total
    const city = CITIES.find((c) => (pick -= c[2]) <= 0) ?? CITIES[0]
    const spread = 0.35 + Math.sqrt(city[2]) * 0.085
    const lon = city[0] + gauss() * spread
    const lat = city[1] + gauss() * spread
    if (!LANDS.some((ring) => inside(lon, lat, ring))) continue
    const [x, y] = project(lon, lat)
    const [sx, sy] = project(151.2, -33.87)
    pins.push({ x, z: -y, h: 0.07 + rnd() * 0.16, phase: rnd() * 6.28, delay: Math.hypot(x - sx, y - sy) * 0.55 + rnd() * 0.25 })
  }
  return pins
}

function Land() {
  const geometry = useMemo(() => {
    const shapes = LANDS.map((ring) => new THREE.Shape(ring.map(([lon, lat]) => new THREE.Vector2(...project(lon, lat)))))
    const g = new THREE.ExtrudeGeometry(shapes, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.018, bevelSegments: 3 })
    g.rotateX(-Math.PI / 2) // lay the map flat: north points away from the viewer
    return g
  }, [])
  return (
    <>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial color="#2c8a5c" roughness={0.42} metalness={0.1} clearcoat={0.7} clearcoatRoughness={0.3} />
      </mesh>
      {/* glowing under-layer */}
      <mesh geometry={geometry} position-y={-0.085} scale={[1, 0.2, 1]}>
        <meshBasicMaterial color={[0.7, 1.9, 1.1]} toneMapped={false} />
      </mesh>
    </>
  )
}

/** 511 light pins, clustered around population centres. */
function StorePins() {
  const pins = useMemo(buildPins, [])
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const material = useRef<THREE.MeshBasicMaterial>(null!)
  const focus = useFocus('s2-stores')
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const born = useRef(0)

  useFrame((state, dt) => {
    born.current += dt
    const t = state.clock.elapsedTime
    const { on, dim } = focus.current
    for (let i = 0; i < pins.length; i++) {
      const p = pins[i]
      const grow = THREE.MathUtils.smoothstep(born.current - 0.9 - p.delay, 0, 0.7)
      const h = p.h * (0.75 + 0.25 * Math.sin(t * 1.6 + p.phase)) * (1 + on * 1.5) * grow
      dummy.position.set(p.x, 0.125 + h / 2, p.z)
      dummy.scale.set(1 + on * 0.5, Math.max(h, 0.0001), 1 + on * 0.5)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
    const k = 1.25 + on * 1.6 - dim * 0.75
    material.current.color.setRGB(0.83 * k, 0.95 * k, 0.42 * k)
  })

  return (
    <Part id="s2-stores">
      <instancedMesh ref={mesh} args={[undefined, undefined, pins.length]} frustumCulled={false}>
        <boxGeometry args={[0.014, 1, 0.014]} />
        <meshBasicMaterial ref={material} toneMapped={false} />
      </instancedMesh>
    </Part>
  )
}

/** A cloud of small figures drifting over the map - the 53,000+ team members. */
function Team() {
  const COUNT = 260
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const material = useRef<THREE.MeshBasicMaterial>(null!)
  const focus = useFocus('s2-employees')
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const seeds = useMemo(() => {
    const rnd = mulberry32(53000)
    return Array.from({ length: COUNT }, () => ({ a: rnd() * 6.28, r: 0.25 + Math.sqrt(rnd()) * 1.7, y: 0.45 + rnd() * 0.75, s: 0.5 + rnd(), w: 0.1 + rnd() * 0.25 }))
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const { on, dim } = focus.current
    const size = 0.012 + on * 0.02
    for (let i = 0; i < COUNT; i++) {
      const p = seeds[i]
      const a = p.a + t * p.w
      dummy.position.set(Math.cos(a) * p.r, p.y * (0.55 + on * 0.6) + Math.sin(t * p.s + p.a) * 0.05, Math.sin(a) * p.r * 0.62)
      dummy.scale.setScalar(size * p.s)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
    const k = 0.75 + on * 2.2 - dim * 0.5
    material.current.color.setRGB(0.66 * k, 0.9 * k, 0.71 * k)
  })

  return (
    <Part id="s2-employees">
      <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]} frustumCulled={false}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshBasicMaterial ref={material} toneMapped={false} />
      </instancedMesh>
    </Part>
  )
}

function ChallengeOrbit() {
  const ring = useRef<THREE.Group>(null!)
  useFrame((_, dt) => {
    ring.current.rotation.y += dt * 0.18
  })
  return (
    <group ref={ring} position-y={0.55}>
      {CHALLENGES.map((c) => {
        const a = THREE.MathUtils.degToRad(c.angle)
        return (
          <Part key={c.id} id={c.id} position={[Math.cos(a) * 1.85, Math.sin(a * 2) * 0.15, Math.sin(a) * 1.85]}>
            <Medallion icon={c.icon} color={c.color} radius={0.22} focusId={c.id} />
          </Part>
        )
      })}
    </group>
  )
}

/** Amber ripples radiating from the major trading centres - revenue. */
function RevenueRipples() {
  const hubs = useMemo(() => [0, 1, 2, 3, 4, 24, 26, 10].map((i) => project(CITIES[i][0], CITIES[i][1])), [])
  const rings = useRef<THREE.Mesh[]>([])
  const focus = useFocus('s2-revenue')

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const { on, dim } = focus.current
    rings.current.forEach((ring, i) => {
      const u = (t * 0.45 + i * 0.37) % 1
      ring.scale.setScalar((0.06 + u * 0.32) * (1 + on * 1.3))
      const m = ring.material as THREE.MeshBasicMaterial
      m.opacity = (1 - u) * (0.5 + on * 0.5) * (1 - dim * 0.7)
      const k = 1 + on * 2
      m.color.setRGB(0.96 * k, 0.76 * k, 0.35 * k)
    })
  })

  return (
    <Part id="s2-revenue">
      {hubs.map(([x, y], i) => (
        <mesh
          key={i}
          ref={(m) => {
            if (m) rings.current[i] = m
          }}
          position={[x, 0.135, -y]}
          rotation-x={-Math.PI / 2}
        >
          <ringGeometry args={[0.82, 1, 40]} />
          <meshBasicMaterial transparent depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </Part>
  )
}

/** Slide 2 - Australia & New Zealand with the store network. */
export default function Scene02() {
  return (
    <Hero>
      <DragRotate sway={0.42} tilt={0.82} radius={2.1}>
        <group position-y={-0.1}>
          <polarGridHelper args={[2.05, 16, 5, 72, '#3f9c6c', '#2c7a55']} position-y={-0.12} material-transparent material-opacity={0.35} />
          <Land />
          <StorePins />
          <Team />
          <RevenueRipples />
          <ChallengeOrbit />
        </group>
      </DragRotate>
      <Pedestal y={-1.75} r={1.85} />
    </Hero>
  )
}
