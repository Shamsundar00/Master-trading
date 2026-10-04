import { useCountdown } from '../../hooks/useCountdown'

export default function Countdown({ target, caption, weight = 'bold', className = '' }) {
  const t = useCountdown(target)
  const units = [
    [t.days, 'Days'],
    [t.hours, 'Hours'],
    [t.minutes, 'Minutes'],
    [t.seconds, 'Seconds'],
  ]
  return (
    <div className={className} role="timer" aria-label={caption || 'Countdown'}>
      {caption && <p className="mb-1 text-[11px] leading-[16.5px] text-muted">{caption}</p>}
      <div className="flex items-start gap-3">
        {units.map(([v, label], i) => (
          <div key={label} className="flex items-start gap-3">
            <div className="text-center">
              <p className={`tabular text-2xl leading-8 text-white ${weight === 'bold' ? 'font-bold' : 'font-semibold'}`}>{v}</p>
              <p className="text-[11px] leading-[16.5px] text-muted">{label}</p>
            </div>
            {i < units.length - 1 && <span className="text-xl leading-8 font-semibold text-white">:</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
