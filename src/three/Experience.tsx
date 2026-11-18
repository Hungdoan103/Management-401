import * as THREE from 'three'
import { useEffect, useMemo, useState, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, PerformanceMonitor, Sparkles } from '@react-three/drei'
import { Bloom, EffectComposer, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { useDeck } from '../store'
import { Glow, HERO_POS, PAL } from './kit'
import SceneSwitcher from './SceneSwitcher'

const BASE_FOV = 35
const STAGE_ASPECT = 16 / 9

/**
 * Keeps the 3D world locked to the 1600x900 HTML stage on any screen shape
 * (the stage is letter-boxed, so the camera must "contain" the same way),
 * and adds a gentle parallax that follows the pointer.
 */
function Rig() {
  useFrame((state, dt) => {
    const camera = state.camera as THREE.PerspectiveCamera
    const aspect = state.size.width / state.size.height
    const fov =
      aspect >= STAGE_ASPECT
        ? BASE_FOV
        : THREE.MathUtils.radToDeg(
            2 * Math.atan((Math.tan(THREE.MathUtils.degToRad(BASE_FOV / 2)) * STAGE_ASPECT) / aspect),
          )
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }
    camera.position.x = THREE.MathUtils.damp(camera.position.x, state.pointer.x * 0.32, 2.5, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, state.pointer.y * 0.2, 2.5, dt)
    camera.lookAt(0, 0, 0)
  })
  return null
}

/** Deep-forest gradient painted once and used as the scene background. */
function Backdrop() {
  const scene = useThree((s) => s.scene)
  const texture = useMemo(() => {
    const w = 960
    const h = 540
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#081a13'
    ctx.fillRect(0, 0, w, h)

    const blob = (x: number, y: number, r: number, color: string) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, color)
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
    }
    blob(w * 0.72, h * 0.52, w * 0.5, 'rgba(46, 120, 82, 0.62)') // light behind the model
    blob(w * 0.16, h * 0.12, w * 0.45, 'rgba(26, 78, 56, 0.6)')
    blob(w * 0.34, h * 1.05, w * 0.5, 'rgba(20, 66, 50, 0.55)')
    blob(w * 0.98, h * 0.02, w * 0.3, 'rgba(110, 150, 70, 0.2)')

    // a touch of noise hides gradient banding on projectors
    const img = ctx.getImageData(0, 0, w, h)
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 5
      img.data[i] += n
      img.data[i + 1] += n
      img.data[i + 2] += n
    }
    ctx.putImageData(img, 0, 0)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  useEffect(() => {
    scene.background = texture
    return () => {
      scene.background = null
      texture.dispose()
    }
  }, [scene, texture])
  return null
}

/** Studio lighting built from light panels (no HDR download, works offline). */
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.55} color="#dff5e6" />
      <directionalLight position={[-3, 6, 7]} intensity={2.4} color="#fff3dc" />
      <directionalLight position={[7, 2, -3]} intensity={1.6} color="#8ff0c0" />
      <pointLight position={[HERO_POS[0], -2.4, 2.5]} intensity={10} distance={9} color="#b8ffd2" />
      <Environment resolution={256} frames={1} environmentIntensity={0.75}>
        <color attach="background" args={['#0b2219']} />
        <Lightformer form="rect" intensity={3.2} color="#fff6e6" position={[-3, 4, 4]} scale={[6, 3, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2} color="#a8e6b6" position={[5, 1, -3]} scale={[4, 6, 1]} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={2.4} color="#d3f36b" position={[0, -4, 2]} scale={4} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.2} color="#86d9e8" position={[-5, -1, -4]} scale={[5, 4, 1]} target={[0, 0, 0]} />
      </Environment>
    </>
  )
}

export default function Experience({ eventSource }: { eventSource: RefObject<HTMLDivElement> }) {
  const quality = useDeck((s) => s.quality)
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio, 1.75))
  const high = quality === 'high'

  return (
    <Canvas
      className="webgl"
      dpr={high ? dpr : 1}
      camera={{ position: [0, 0, 10], fov: BASE_FOV, near: 0.1, far: 60 }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
      eventSource={eventSource}
      eventPrefix="client"
    >
      {/* drop resolution automatically if the projector laptop struggles */}
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(Math.min(window.devicePixelRatio, 1.75))} />
      <Backdrop />
      <Rig />
      <Lighting />

      {/* drifting dust motes give the space depth */}
      <Sparkles count={150} scale={[19, 10, 7]} position={[0, 0, -1]} size={2.6} speed={0.28} opacity={0.55} color={PAL.mint} noise={1.2} />
      <Sparkles count={40} scale={[16, 9, 4]} position={[0, 0, 2]} size={5} speed={0.2} opacity={0.3} color={PAL.lime} noise={1} />
      <Glow position={[HERO_POS[0], HERO_POS[1] + 0.2, -3]} size={11} opacity={0.2} color="#58c98a" />

      <SceneSwitcher />

      {high && (
        <EffectComposer multisampling={4}>
          <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.25} intensity={0.85} radius={0.72} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      )}
    </Canvas>
  )
}
