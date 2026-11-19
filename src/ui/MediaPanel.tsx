import { useEffect, useRef } from 'react'
import type { MediaSpec } from '../three/mediaMap'

/** Bottom-band media: natural colors, full image visible, optional video loop. */
export default function MediaPanel({ image, video }: MediaSpec) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v || !video) return
    const play = () => {
      const p = v.play()
      if (p) p.catch(() => {})
    }
    play()
    return () => v.pause()
  }, [video, image])

  return (
    <div className="media-slot-panel">
      {video ? (
        <video
          ref={videoRef}
          className="media-slot-asset"
          src={video}
          poster={image}
          muted
          loop
          playsInline
          autoPlay
          draggable={false}
        />
      ) : (
        <img className="media-slot-asset" src={image} alt="" draggable={false} />
      )}
    </div>
  )
}
