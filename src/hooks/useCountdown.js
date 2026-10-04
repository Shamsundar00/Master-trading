import { useEffect, useState } from 'react'

const pad = (n) => String(n).padStart(2, '0')

// Ticks every second towards `target` (a Date). Stops at 00:00:00:00.
export function useCountdown(target) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const diff = Math.max(0, (target?.getTime() ?? 0) - now)
  const s = Math.floor(diff / 1000)
  return {
    done: diff === 0,
    days: pad(Math.floor(s / 86400)),
    hours: pad(Math.floor((s % 86400) / 3600)),
    minutes: pad(Math.floor((s % 3600) / 60)),
    seconds: pad(s % 60),
  }
}
