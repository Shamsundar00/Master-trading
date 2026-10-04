import coursebg from '../../assets/sections/coursebg.webp'
import { useBooking } from '../../context/BookingContext'
import { ArrowUpRightIcon } from '../ui/Icons'

// Illustrative price series (open, high, low, close): downtrend into support, base, breakout.
// Fixed numbers so the drawing is identical on every render.
const CANDLES = [
  [128, 131, 121, 123], [123, 126, 117, 119], [119, 124, 115, 122], [122, 123, 112, 114], [114, 117, 108, 110],
  [110, 113, 103, 105], [105, 109, 101, 107], [107, 108, 97, 99], [99, 101, 90, 92], [92, 96, 86, 88],
  [88, 92, 82, 90], [90, 93, 84, 85], [85, 89, 81, 87], [87, 91, 83, 84], [84, 88, 81, 86],
  [86, 94, 85, 93], [93, 99, 91, 98], [98, 100, 92, 94], [94, 104, 93, 103], [103, 111, 101, 109],
  [109, 112, 104, 106], [106, 117, 105, 116], [116, 124, 113, 122], [122, 125, 116, 119], [119, 131, 118, 129],
  [129, 138, 126, 136], [136, 140, 130, 133], [133, 147, 132, 145],
]
const y = (p) => 440 - (p - 60) * 3.2
const LEVELS = [
  { p: 150, label: 'Target', color: '#34D399' },
  { p: 95, label: 'Entry', color: '#6EA0FF' },
  { p: 81, label: 'Support', color: '#BBBBBB', dashed: true },
  { p: 76, label: 'Stop-loss', color: '#F87171' },
]
const FONT = 'Plus Jakarta Sans, sans-serif'

function ChartIllustration() {
  return (
    <svg viewBox="0 0 960 488" className="block h-auto w-full rounded-lg bg-[#0B0D12]" role="img" aria-label="Sample chart showing a planned entry, stop-loss and target">
      <defs>
        <linearGradient id="riskZone" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#F87171" stopOpacity=".16" />
          <stop offset="1" stopColor="#F87171" stopOpacity=".04" />
        </linearGradient>
        <linearGradient id="rewardZone" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#34D399" stopOpacity=".05" />
          <stop offset="1" stopColor="#34D399" stopOpacity=".16" />
        </linearGradient>
      </defs>
      {[...Array(9)].map((_, i) => (
        <line key={`h${i}`} x1="0" x2="960" y1={40 + i * 50} y2={40 + i * 50} stroke="#161922" />
      ))}
      {[...Array(12)].map((_, i) => (
        <line key={`v${i}`} y1="0" y2="488" x1={40 + i * 80} x2={40 + i * 80} stroke="#161922" />
      ))}
      {/* planned reward / risk zones from the entry candle onwards */}
      <rect x="470" y={y(150)} width="350" height={y(95) - y(150)} fill="url(#rewardZone)" />
      <rect x="470" y={y(95)} width="350" height={y(76) - y(95)} fill="url(#riskZone)" />
      {LEVELS.map((l) => (
        <g key={l.label}>
          <line x1="30" x2="828" y1={y(l.p)} y2={y(l.p)} stroke={l.color} strokeWidth="1.5" strokeDasharray={l.dashed ? '6 6' : undefined} opacity=".85" />
          <rect x="836" y={y(l.p) - 13} width="108" height="26" rx="6" fill={l.color} fillOpacity=".14" stroke={l.color} strokeOpacity=".5" />
          <text x="890" y={y(l.p) + 5} textAnchor="middle" fill={l.color} fontSize="14" fontWeight="600" fontFamily={FONT}>
            {l.label}
          </text>
        </g>
      ))}
      {CANDLES.map(([o, h, l, c], i) => {
        const x = 50 + i * 28
        const col = c >= o ? '#2660D3' : '#5B6170'
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={y(h)} y2={y(l)} stroke={col} strokeWidth="2" />
            <rect x={x - 8} y={y(Math.max(o, c))} width="16" height={Math.max(2, Math.abs(y(o) - y(c)))} rx="2" fill={col} />
          </g>
        )
      })}
      <circle cx={50 + 15 * 28} cy={y(95)} r="8" fill="none" stroke="#6EA0FF" strokeWidth="2" />
      <text x="40" y="30" fill="#BBBBBB" fontSize="15" fontFamily={FONT}>
        Sample chart · Plan the trade before you take it
      </text>
    </svg>
  )
}

export default function WhyWorkshop() {
  const { openBooking } = useBooking()
  return (
    <section className="bg-ma-bg py-16 md:py-20 lg:py-24">
      <div className="container-ma">
        <div className="mb-8 text-center md:mb-12">
          <h2 className="text-2xl leading-[30px] font-semibold text-white lg:text-4xl xl:text-5xl xl:leading-[1.15]">
            Why this isn&apos;t just another
            <br />
            <span className="grad-text">Trading Class</span>
          </h2>
          <p className="mx-auto mt-2 max-w-4xl text-sm leading-5 text-muted md:text-lg md:leading-7">
            No random tips, no shortcuts. In three focused hours, experts walk you through the concepts every trader needs, in a clear, structured
            order, so you know what to look for before you place a trade.
          </p>
        </div>

        <div className="bg-center bg-no-repeat md:py-8" style={{ backgroundImage: `url(${coursebg})`, backgroundSize: '85%' }}>
          <div className="ma-video-frame relative mx-auto w-full p-1 md:p-3 lg:w-[60%]">
            <ChartIllustration />
            <button
              type="button"
              onClick={() => openBooking()}
              className="group absolute right-3 bottom-3 flex items-center gap-3 rounded-full bg-white py-1.5 ps-4 pe-1.5 text-xs font-semibold text-ink transition-all duration-150 hover:shadow-lg sm:right-6 sm:bottom-6 sm:gap-6 sm:text-sm"
            >
              Learn this live
              <span className="grid place-items-center rounded-full bg-ink p-1.5 text-white transition-transform duration-150 group-hover:rotate-45 sm:p-2">
                <ArrowUpRightIcon className="size-3.5 sm:size-4" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
