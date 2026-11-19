import * as THREE from 'three'
import { useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useDeck } from '../store'
import { DragRotate, Hero, SceneLive } from './kit'
import type { MediaSpec } from './mediaMap'

/** Slightly smaller hero so copy on the left keeps breathing room. */
const WIDTH = 4.45
const HEIGHT = 2.95

/**
 * Stage grade for bright Bunning plates:
 * lower exposure, crush whites, lift contrast + sat so icons/text stay readable.
 * No soft-key / no wash into the forest background.
 */
const gradeVert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const gradeFrag = /* glsl */ `
uniform sampler2D uMap;
uniform float uExposure;
uniform float uContrast;
uniform float uSat;
uniform float uHighlight;
uniform float uOpacity;
varying vec2 vUv;

void main() {
  vec3 rgb = texture2D(uMap, vUv).rgb;

  // 1) bring overall plate down to the dark stage
  rgb *= uExposure;

  // 2) hard-ish highlight roll-off so ceiling whites stop blowing out
  float luma = dot(rgb, vec3(0.2126, 0.7152, 0.0722));
  float hi = smoothstep(0.42, 0.92, luma) * uHighlight;
  rgb = mix(rgb, rgb / (rgb + vec3(0.7)), hi);

  // 3) contrast around mid-grey — sharpens icons / pillar colours
  rgb = (rgb - 0.5) * uContrast + 0.5;

  // 4) restore chroma so colours stay clear after the dim
  float g = dot(rgb, vec3(0.2126, 0.7152, 0.0722));
  rgb = mix(vec3(g), rgb, uSat);

  rgb = clamp(rgb, 0.0, 1.0);
  if (uOpacity < 0.01) discard;
  gl_FragColor = vec4(rgb, uOpacity);
}
`

function GradedMaterial({
  map,
  opacity = 1,
  transparent = false,
}: {
  map: THREE.Texture
  opacity?: number
  transparent?: boolean
}) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uMap: { value: map },
          uExposure: { value: 0.95 },
          uContrast: { value: 1.06 },
          uSat: { value: 1.1 },
          uHighlight: { value: 0.22 },
          uOpacity: { value: opacity },
        },
        vertexShader: gradeVert,
        fragmentShader: gradeFrag,
        toneMapped: false,
        transparent,
        depthWrite: !transparent,
        side: THREE.DoubleSide,
      }),
    [map, transparent],
  )

  useEffect(() => {
    mat.uniforms.uMap.value = map
  }, [mat, map])

  useEffect(() => {
    mat.uniforms.uOpacity.value = opacity
  }, [mat, opacity])

  useEffect(() => () => mat.dispose(), [mat])
  return <primitive object={mat} attach="material" />
}

function MediaMatte({ map, opacity = 1, transparent = false, z = 0 }: { map: THREE.Texture; opacity?: number; transparent?: boolean; z?: number }) {
  return (
    <mesh position={[0, 0, z]}>
      <planeGeometry args={[WIDTH, HEIGHT]} />
      <GradedMaterial map={map} opacity={opacity} transparent={transparent} />
    </mesh>
  )
}

function MediaFrame({ children }: { children: ReactNode }) {
  return (
    <group>
      <mesh position={[0, 0, -0.02]} raycast={() => null}>
        <planeGeometry args={[WIDTH + 0.06, HEIGHT + 0.06]} />
        <meshBasicMaterial color="#0a1f17" />
      </mesh>
      {children}
    </group>
  )
}

function ImagePanel({ src }: { src: string }) {
  const map = useTexture(src)
  useEffect(() => {
    map.colorSpace = THREE.SRGBColorSpace
    map.anisotropy = 8
  }, [map])
  return (
    <MediaFrame>
      <MediaMatte map={map} />
    </MediaFrame>
  )
}

/**
 * Poster stays under the clip; video fades in only after a real frame is painted
 * so the JPG→MP4 handoff does not flash.
 */
function VideoPanel({ src, poster, playing }: { src: string; poster: string; playing: boolean }) {
  const posterMap = useTexture(poster)
  const [videoMap, setVideoMap] = useState<THREE.VideoTexture | null>(null)
  const [fade, setFade] = useState(0)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const fadeRef = useRef(0)
  const readyRef = useRef(false)

  useEffect(() => {
    posterMap.colorSpace = THREE.SRGBColorSpace
  }, [posterMap])

  useEffect(() => {
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.preload = 'none'
    videoRef.current = video
    readyRef.current = false
    fadeRef.current = 0
    setFade(0)
    return () => {
      video.pause()
      video.removeAttribute('src')
      video.load()
      videoRef.current = null
      readyRef.current = false
      setVideoMap((prev) => {
        prev?.dispose()
        return null
      })
    }
  }, [src])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !playing) return

    let cancelled = false
    let frameHandle = 0

    const reveal = () => {
      if (cancelled || readyRef.current) return
      const tex = new THREE.VideoTexture(video)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      setVideoMap((prev) => {
        prev?.dispose()
        return tex
      })
      readyRef.current = true
    }

    const onTime = () => {
      if (cancelled || readyRef.current) return
      if (video.readyState >= 2 && video.currentTime > 0.02) reveal()
    }

    if (!video.src) {
      video.src = src
      video.preload = 'auto'
      video.load()
    }

    video.addEventListener('timeupdate', onTime)
    video.addEventListener('playing', onTime)
    const play = video.play()
    if (play) play.catch(() => {})

    const rvfc = (video as HTMLVideoElement & {
      requestVideoFrameCallback?: (cb: () => void) => number
    }).requestVideoFrameCallback
    if (typeof rvfc === 'function') {
      frameHandle = rvfc.call(video, () => reveal())
    }

    return () => {
      cancelled = true
      video.pause()
      video.removeEventListener('timeupdate', onTime)
      video.removeEventListener('playing', onTime)
      const cancel = (video as HTMLVideoElement & {
        cancelVideoFrameCallback?: (h: number) => void
      }).cancelVideoFrameCallback
      if (frameHandle && typeof cancel === 'function') cancel.call(video, frameHandle)
    }
  }, [playing, src])

  useFrame((_, dt) => {
    const target = readyRef.current && playing ? 1 : 0
    const next = THREE.MathUtils.damp(fadeRef.current, target, 5.5, dt)
    fadeRef.current = next
    if (Math.abs(next - fade) > 0.012 || (next > 0.995 && fade < 1) || (next < 0.01 && fade > 0)) {
      setFade(next > 0.995 ? 1 : next < 0.01 ? 0 : next)
    }
  })

  return (
    <MediaFrame>
      <MediaMatte map={posterMap} z={0} />
      {videoMap && <MediaMatte map={videoMap} z={0.002} opacity={fade} transparent />}
    </MediaFrame>
  )
}

/** Quiet floor pool — no additive Pedestal glare. */
function QuietBase() {
  return (
    <group position={[0, -1.72, 0]} rotation-x={-Math.PI / 2} raycast={() => null}>
      <mesh>
        <circleGeometry args={[1.35, 48]} />
        <meshBasicMaterial color="#06140e" transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <mesh>
        <ringGeometry args={[1.28, 1.32, 64]} />
        <meshBasicMaterial color="#2a6b48" transparent opacity={0.28} depthWrite={false} />
      </mesh>
    </group>
  )
}

/** Right-hand hero: matching slide mp4 (JPG poster while loading). */
export default function MediaHero({ image, video }: MediaSpec) {
  const live = useContext(SceneLive)
  const focus = useRef(0)
  const float = useRef<THREE.Group>(null!)
  const lean = useRef<THREE.Group>(null!)

  useFrame((state, dt) => {
    const on = useDeck.getState().active ? 1 : 0
    focus.current = THREE.MathUtils.damp(focus.current, on, 6, dt)
    const t = state.clock.elapsedTime
    if (float.current) {
      float.current.position.y = Math.sin(t * 0.9) * 0.035
      float.current.position.x = Math.sin(t * 0.55) * 0.014
    }
    if (lean.current) {
      const f = focus.current
      lean.current.rotation.x = THREE.MathUtils.damp(lean.current.rotation.x, -0.025 - f * 0.03, 5, dt)
      lean.current.rotation.y = THREE.MathUtils.damp(lean.current.rotation.y, f * 0.025, 5, dt)
      lean.current.scale.setScalar(THREE.MathUtils.damp(lean.current.scale.x, 1 + f * 0.02, 5, dt))
      lean.current.position.z = THREE.MathUtils.damp(lean.current.position.z, f * 0.1, 5, dt)
    }
  })

  return (
    <Hero position={[3.45, -0.05, 0]} scale={0.88}>
      <DragRotate sway={0.06} tilt={0.07} yaw={-0.06} radius={2.85} auto={0}>
        <group ref={float}>
          <group ref={lean}>
            {video ? (
              <VideoPanel src={video} poster={image} playing={live} />
            ) : (
              <ImagePanel src={image} />
            )}
          </group>
        </group>
      </DragRotate>
      <QuietBase />
    </Hero>
  )
}
