import { useEffect, useState } from 'react'

export function useCanvasImage(src?: string) {
  const [image, setImage] = useState<HTMLImageElement | undefined>()

  useEffect(() => {
    if (!src) return

    let active = true
    const nextImage = new Image()
    nextImage.crossOrigin = 'anonymous'
    nextImage.onload = () => {
      if (active) setImage(nextImage)
    }
    nextImage.onerror = () => {
      if (active) setImage(undefined)
    }
    nextImage.src = src

    return () => {
      active = false
    }
  }, [src])

  return src ? image : undefined
}
