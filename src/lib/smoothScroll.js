import Lenis from 'lenis'

// Same Lenis settings as marketacademy.in: 1.5s easeOutExpo glide, 0.8x wheel speed,
// native touch scrolling.
let lenis = null

export function initSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return lenis
  lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    wheelMultiplier: 0.8,
  })
  const raf = (t) => {
    lenis.raf(t)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
  window.lenis = lenis
  return lenis
}

// Anchor navigation: 1.2s glide, URL hash untouched (as on the reference).
export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -64, duration: 1.2 })
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export const stopScroll = () => lenis?.stop()
export const startScroll = () => lenis?.start()
