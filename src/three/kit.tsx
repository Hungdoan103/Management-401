import * as THREE from 'three'
import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { useFrame, type ThreeElements, type ThreeEvent } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import type { LucideIcon } from 'lucide-react'
import { useDeck } from '../store'

/* -------------------------------------------------------------------------- */
/* Palette                                                                     */
/* -------------------------------------------------------------------------- */

export const PAL = {
  night: '#0a1f17',
  pine: '#123b29',
  forest: '#1d5c40',
  green: '#2f8f5b',
  leaf: '#49b675',
  mint: '#a8e6b6',
  lime: '#d3f36b',
  amber: '#f6c15a',
  coral: '#ff8a65',
  sky: '#86d9e8',
  cream: '#f3efe2',
  violet: '#c8b3ff',
} as const

/** Where the 3D model sits: the free right-hand side of the 1600x900 stage. */
export const HERO_POS: [number, number, number] = [3.3, -0.42, 0]

const { damp } = THREE.MathUtils

/** Deterministic random numbers so every model looks the same on every run. */
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* -------------------------------------------------------------------------- */
/* Spotlight link between the HTML cards and the 3D parts                      */
/* -------------------------------------------------------------------------- */

/** false while a scene is animating out, so it stops reacting to the pointer */
export const SceneLive = createContext(true)

/**
 * Smoothed spotlight state for one or more item ids.
 * `on`  -> 1 while one of the ids is spotlighted
 * `dim` -> 1 while a different item of the slide is spotlighted
 */
export function useFocus(id: string | string[]) {
  const level = useRef({ on: 0, dim: 0 })
  useFrame((_, dt) => {
    const active = useDeck.getState().active
    const isOn = active !== null && (typeof id === 'string' ? active === id : id.includes(active))
    level.current.on = damp(level.current.on, isOn ? 1 : 0, 7, dt)
    level.current.dim = damp(level.current.dim, active !== null && !isOn ? 1 : 0, 7, dt)
  })
  return level
}

/** Pointer handlers that spotlight `id` when the 3D part is hovered. */
export function usePart(id: string) {
  const live = useContext(SceneLive)
  return useMemo(
    () => ({
      onPointerOver: (e: ThreeEvent<PointerEvent>) => {
        if (!live) return
        e.stopPropagation()
        useDeck.getState().setActive(id)
      },
      onPointerOut: () => useDeck.getState().clearActive(id),
    }),
    [id, live],
  )
}

/** A group whose children spotlight `id` on hover. */
export function Part({ id, children, ...props }: { id: string; children: ReactNode } & Omit<ThreeElements['group'], 'id'>) {
  const handlers = usePart(id)
  return (
    <group {...props} {...handlers}>
      {children}
    </group>
  )
}

/* -------------------------------------------------------------------------- */
/* Scene shell: placement + enter / exit choreography                          */
/* -------------------------------------------------------------------------- */

const easeOutBack = (t: number) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2)
const easeInCubic = (t: number) => t * t * t

export function SceneShell({ phase, dir, children }: { phase: 'in' | 'out'; dir: 1 | -1; children: ReactNode }) {
  const group = useRef<THREE.Group>(null!)
  const clock = useRef(0)
  const started = useRef(phase)

  useFrame((_, dt) => {
    if (started.current !== phase) {
      started.current = phase
      clock.current = 0
    }
    clock.current += Math.min(dt, 0.05)
    const g = group.current
    if (phase === 'in') {
      const t = THREE.MathUtils.clamp((clock.current - 0.22) / 0.95, 0, 1)
      const e = t === 0 ? 0 : easeOutBack(t)
      g.visible = t > 0
      g.scale.setScalar(Math.max(e, 0.0001))
      g.position.y = (1 - e) * -2.2 * dir
      g.rotation.y = (1 - e) * -1.6 * dir
    } else {
      const t = THREE.MathUtils.clamp(clock.current / 0.5, 0, 1)
      const e = easeInCubic(t)
      g.visible = t < 1
      g.scale.setScalar(Math.max(1 - e, 0.0001))
      g.position.y = e * 2.6 * dir
      g.rotation.y = e * 1.4 * dir
    }
  })

  // the choreography pivots around the hero zone, not the middle of the screen
  return (
    <SceneLive.Provider value={phase === 'in'}>
      <group position={HERO_POS}>
        <group ref={group} visible={false}>
          <group position={[-HERO_POS[0], -HERO_POS[1], -HERO_POS[2]]}>{children}</group>
        </group>
      </group>
    </SceneLive.Provider>
  )
}

/** Places a model in the hero zone. */
export function Hero({
  children,
  position = HERO_POS,
  scale = 1,
}: {
  children: ReactNode
  position?: [number, number, number]
  scale?: number
}) {
  return (
    <group position={position} scale={scale}>
      {children}
    </group>
  )
}

/* -------------------------------------------------------------------------- */
/* Drag to rotate                                                              */
/* -------------------------------------------------------------------------- */

interface DragRotateProps {
  children: ReactNode
  /** continuous spin in rad/s (ignored when `sway` is set) */
  auto?: number
  /** swing left-right by this many radians instead of spinning (keeps labels readable) */
  sway?: number
  /** resting angle around Y */
  yaw?: number
  /** resting tilt towards the viewer */
  tilt?: number
  /** radius of the invisible grab sphere */
  radius?: number
}

/**
 * Lets the audience grab the model: drag horizontally to spin (with inertia), vertically to tip.
 * When released it eases back into its idle motion.
 */
export function DragRotate({ children, auto = 0.14, sway, yaw = 0, tilt = 0, radius = 2.15 }: DragRotateProps) {
  const group = useRef<THREE.Group>(null!)
  const live = useContext(SceneLive)
  const s = useRef({ dragging: false, x: 0, y: 0, spin: 0, pitch: 0, vel: 0, idle: 0, t: 0 })

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const st = s.current
      if (!st.dragging) return
      const dx = e.clientX - st.x
      const dy = e.clientY - st.y
      st.x = e.clientX
      st.y = e.clientY
      st.spin += dx * 0.009
      st.vel = dx * 0.5
      st.pitch = THREE.MathUtils.clamp(st.pitch + dy * 0.005, -0.6, 0.6)
    }
    const up = () => {
      if (!s.current.dragging) return
      s.current.dragging = false
      s.current.idle = 0
      document.body.classList.remove('is-grabbing')
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      document.body.classList.remove('is-grab', 'is-grabbing')
    }
  }, [])

  useFrame((_, dt) => {
    const st = s.current
    st.t += dt
    if (!st.dragging) {
      st.idle += dt
      st.spin += st.vel * dt
      st.vel = damp(st.vel, 0, 2.5, dt)
      st.pitch = damp(st.pitch, 0, 2, dt)
      if (sway !== undefined) {
        // swing models drift back to face the audience once released
        if (st.idle > 1.2) st.spin = damp(st.spin, Math.round(st.spin / (Math.PI * 2)) * Math.PI * 2, 1.6, dt)
      } else {
        st.spin += auto * dt
      }
    }
    const idleMotion = sway !== undefined ? Math.sin(st.t * 0.45) * sway : 0
    group.current.rotation.set(tilt + st.pitch, yaw + st.spin + idleMotion, 0)
  })

  return (
    <group ref={group}>
      <mesh
        onPointerDown={(e) => {
          if (!live) return
          const st = s.current
          st.dragging = true
          st.x = e.clientX
          st.y = e.clientY
          st.vel = 0
          document.body.classList.add('is-grabbing')
        }}
        onPointerOver={() => live && document.body.classList.add('is-grab')}
        onPointerOut={() => document.body.classList.remove('is-grab')}
      >
        <sphereGeometry args={[radius, 20, 14]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>
      {children}
    </group>
  )
}

/* -------------------------------------------------------------------------- */
/* Textures drawn at runtime (no image files needed)                           */
/* -------------------------------------------------------------------------- */

let glowTexture: THREE.CanvasTexture | null = null
function getGlowTexture() {
  if (glowTexture) return glowTexture
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.25, 'rgba(255,255,255,0.55)')
  g.addColorStop(0.6, 'rgba(255,255,255,0.12)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  glowTexture = new THREE.CanvasTexture(c)
  return glowTexture
}

/** Soft additive light blob (used for halos and the glow under each model). */
export function Glow({
  color = PAL.mint,
  size = 4,
  opacity = 0.35,
  ...props
}: { color?: string; size?: number; opacity?: number } & ThreeElements['mesh']) {
  return (
    <mesh {...props} raycast={() => null}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial
        map={getGlowTexture()}
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}

/** Glowing rings + light pool that every model floats above. */
export function Pedestal({ y = -1.85, r = 1.75, color = PAL.mint }: { y?: number; r?: number; color?: string }) {
  const ring = useRef<THREE.Mesh>(null!)
  useFrame((_, dt) => {
    ring.current.rotation.z += dt * 0.12
  })
  return (
    <group position-y={y} rotation-x={-Math.PI / 2}>
      <Glow color={color} size={r * 3.4} opacity={0.3} />
      <mesh raycast={() => null}>
        <ringGeometry args={[r, r + 0.012, 96]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} toneMapped={false} />
      </mesh>
      <mesh ref={ring} raycast={() => null}>
        <ringGeometry args={[r * 0.78, r * 0.78 + 0.02, 96, 1, 0, Math.PI * 1.35]} />
        <meshBasicMaterial color={color} transparent opacity={0.28} toneMapped={false} />
      </mesh>
    </group>
  )
}

/** Text rendered to a texture with the deck's own typefaces. */
export function useTextTexture(text: string, { color = '#ffffff', weight = 600, family = 'Fraunces' } = {}) {
  const made = useMemo(() => {
    const px = 180
    const pad = 28
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const font = `${weight} ${px}px "${family}", Georgia, serif`
    ctx.font = font
    const width = Math.ceil(ctx.measureText(text).width) + pad * 2
    const height = Math.ceil(px * 1.2) + pad * 2
    canvas.width = width
    canvas.height = height
    ctx.font = font
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, width / 2, height / 2 + px * 0.05)
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    return { texture, aspect: width / height }
  }, [text, color, weight, family])
  useEffect(() => () => made.texture.dispose(), [made])
  return made
}

/** Flat text label standing in the scene. */
export function TextLabel({
  text,
  height = 0.3,
  color = '#ffffff',
  weight,
  family,
  opacity = 1,
  ...props
}: {
  text: string
  height?: number
  color?: string
  weight?: number
  family?: string
  opacity?: number
} & ThreeElements['mesh']) {
  const { texture, aspect } = useTextTexture(text, { color, weight, family })
  return (
    <mesh {...props} raycast={() => null}>
      <planeGeometry args={[height * aspect, height]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

/** Draws a Lucide icon (the same set the cards use) onto a texture. */
export function useIconTexture(Icon: LucideIcon, color = '#0b2219', strokeWidth = 2) {
  const texture = useMemo(() => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')!
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    const svg = renderToStaticMarkup(<Icon size={size} color={color} strokeWidth={strokeWidth} />)
    const img = new Image()
    img.onload = () => {
      ctx.clearRect(0, 0, size, size)
      ctx.drawImage(img, 0, 0, size, size)
      tex.needsUpdate = true
    }
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
    return tex
  }, [Icon, color, strokeWidth])
  useEffect(() => () => texture.dispose(), [texture])
  return texture
}

/**
 * Coin-shaped badge carrying an icon. It always faces the audience, and lights up
 * when `focusId` is spotlighted.
 */
export function Medallion({
  icon,
  color = PAL.mint,
  radius = 0.3,
  focusId,
  billboard = true,
  ...props
}: {
  icon: LucideIcon
  color?: string
  radius?: number
  focusId?: string | string[]
  billboard?: boolean
} & ThreeElements['group']) {
  const texture = useIconTexture(icon)
  const focus = useFocus(focusId ?? '__none__')
  const body = useRef<THREE.Group>(null!)
  const rim = useRef<THREE.MeshBasicMaterial>(null!)
  const face = useRef<THREE.MeshStandardMaterial>(null!)
  const tint = useMemo(() => new THREE.Color(color), [color])

  useFrame(() => {
    const { on, dim } = focus.current
    body.current.scale.setScalar(1 + on * 0.28)
    rim.current.color.copy(tint).multiplyScalar(1.1 + on * 2.4)
    face.current.emissiveIntensity = 0.25 + on * 0.75 - dim * 0.15
  })

  const coin = (
    <group ref={body}>
      <mesh rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[radius, radius, 0.07, 48]} />
        <meshStandardMaterial ref={face} color={color} emissive={color} emissiveIntensity={0.25} roughness={0.35} metalness={0.15} />
      </mesh>
      <mesh position-z={0.037}>
        <circleGeometry args={[radius * 0.7, 32]} />
        <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh>
        <torusGeometry args={[radius * 1.03, radius * 0.07, 12, 56]} />
        <meshBasicMaterial ref={rim} color={color} toneMapped={false} />
      </mesh>
    </group>
  )

  return <group {...props}>{billboard ? <Billboard>{coin}</Billboard> : coin}</group>
}

/* -------------------------------------------------------------------------- */
/* Small geometry helpers                                                      */
/* -------------------------------------------------------------------------- */

const UP = new THREE.Vector3(0, 1, 0)

/** Thin rod between two points (strings, poles, struts). */
export function Rod({
  from,
  to,
  radius = 0.012,
  children,
}: {
  from: [number, number, number]
  to: [number, number, number]
  radius?: number
  children: ReactNode
}) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const dir = b.clone().sub(a)
    const len = dir.length()
    return {
      position: a.clone().add(b).multiplyScalar(0.5),
      quaternion: new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize()),
      length: len,
    }
  }, [from, to])
  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, length, 8]} />
      {children}
    </mesh>
  )
}

let heartGeometry: THREE.ExtrudeGeometry | null = null
/** Unit heart (about 1 wide, 1 tall), centred on the origin. */
export function getHeartGeometry() {
  if (heartGeometry) return heartGeometry
  const s = new THREE.Shape()
  s.moveTo(5, 5)
  s.bezierCurveTo(5, 5, 4, 0, 0, 0)
  s.bezierCurveTo(-6, 0, -6, 7, -6, 7)
  s.bezierCurveTo(-6, 11, -3, 15.4, 5, 19)
  s.bezierCurveTo(12, 15.4, 16, 11, 16, 7)
  s.bezierCurveTo(16, 7, 16, 0, 10, 0)
  s.bezierCurveTo(7, 0, 5, 5, 5, 5)
  heartGeometry = new THREE.ExtrudeGeometry(s, {
    depth: 4,
    bevelEnabled: true,
    bevelThickness: 1.6,
    bevelSize: 1.4,
    bevelSegments: 4,
    curveSegments: 18,
  })
  heartGeometry.center()
  heartGeometry.rotateZ(Math.PI)
  heartGeometry.scale(1 / 22, 1 / 22, 1 / 22)
  return heartGeometry
}

let shieldGeometry: THREE.ExtrudeGeometry | null = null
/** Heraldic shield, about 0.9 wide and 1.15 tall, centred on the origin. */
export function getShieldGeometry() {
  if (shieldGeometry) return shieldGeometry
  const s = new THREE.Shape()
  s.moveTo(0, 0.56)
  s.quadraticCurveTo(0.24, 0.44, 0.45, 0.42)
  s.lineTo(0.45, 0.06)
  s.quadraticCurveTo(0.45, -0.36, 0, -0.6)
  s.quadraticCurveTo(-0.45, -0.36, -0.45, 0.06)
  s.lineTo(-0.45, 0.42)
  s.quadraticCurveTo(-0.24, 0.44, 0, 0.56)
  shieldGeometry = new THREE.ExtrudeGeometry(s, {
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 3,
    curveSegments: 20,
  })
  shieldGeometry.translate(0, 0, -0.05)
  return shieldGeometry
}

export { damp }
