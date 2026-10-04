import { EVENT } from '../../config/event'
import { CalendarClockIcon, ClockIcon, MapPinIcon } from '../ui/Icons'

const BENEFITS = [
  'You learn the concepts every trader needs, in a clear and structured order.',
  'You see market and chart analysis explained step by step, in person.',
  'You learn to plan your entry, exit and stop-loss before placing a trade.',
  'You walk out knowing how to pick a strategy that fits your capital and time.',
]

const SNAPSHOT = [
  [ClockIcon, 'Duration', `${EVENT.durationLabel}, offline`],
  [CalendarClockIcon, 'Slots', 'Sat 10 & Sun 11 Oct · 9AM / 2PM'],
  [MapPinIcon, 'Venue', 'Sai Pride, Guindy, Chennai'],
]

export default function Benefits() {
  return (
    <section className="bg-ma-bg py-16 md:py-24">
      <div className="container-ma">
        <div className="grid grid-cols-12 items-center gap-y-10">
          <div className="col-span-12 lg:col-span-4">
            <h2 className="mb-5 text-center text-2xl leading-[30px] font-bold text-white lg:text-left lg:text-4xl lg:leading-10">
              What happens <br className="hidden lg:block" />
              when you join this <br className="hidden lg:block" />
              <span className="grad-text">Workshop?</span>
            </h2>
            <div className="ma-card mx-auto mt-5 max-w-[460px] p-4">
              <p className="text-sm font-semibold text-white">Workshop at a glance</p>
              <div className="ma-hairline my-3 h-px w-full" />
              <ul className="space-y-3">
                {SNAPSHOT.map(([Icon, label, value]) => (
                  <li key={label} className="flex items-start gap-3">
                    <Icon className="mt-0.5 size-4 shrink-0 text-ma-icon" />
                    <span className="text-sm">
                      <span className="grad-text">{label}</span>
                      <span className="block text-white">{value}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-baseline justify-between rounded-lg border border-input-border bg-input px-4 py-3">
                <span className="text-sm text-muted">Booking Fee</span>
                <span className="text-xl font-bold text-white">₹{EVENT.price}</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:col-span-1 lg:block" />
          <div className="col-span-12 lg:col-span-7">
            <ol className="flex flex-col gap-5 md:gap-7">
              {BENEFITS.map((text, i) => (
                <li key={text} className="flex items-center">
                  <span className="ma-num-chip me-3 px-3 py-2 text-base leading-8 font-semibold text-white sm:text-xl md:me-5 md:text-2xl">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm text-white sm:text-[17px] md:text-xl md:leading-8">{text}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
