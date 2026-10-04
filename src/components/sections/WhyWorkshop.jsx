import { useBooking } from '../../context/BookingContext'
import { WhiteCta } from '../ui/Buttons'
import { CheckIcon, CloseIcon } from '../ui/Icons'

const ALONE = [
  'Random tips from reels and chat groups',
  'No clear plan for where to enter or exit',
  'Losses that come from skipping risk management',
  'Confusion about which strategy to follow',
]

const WORKSHOP = [
  'A structured path, from trading basics to strategy',
  'Learn exactly where to enter and where to exit',
  'Risk management built into every trade plan',
  'Pick a strategy that fits your capital and time',
]

// Takes the place of the reference page's video block: same heading, same
// gradient frame (#292D2D → #2660D3), used here around the workshop column.
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
            No random tips, no shortcuts. In four focused hours, experts walk you through the concepts every trader needs, in a clear,
            structured order.
          </p>
        </div>

        <div className="mx-auto grid max-w-[1000px] gap-3 md:grid-cols-2 md:items-stretch">
          <div className="rounded-lg border border-card-border bg-[#0B0D12] p-5 md:p-7">
            <p className="text-sm font-medium tracking-wide text-muted uppercase">Learning on your own</p>
            <ul className="mt-5 space-y-4">
              {ALONE.map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-muted md:text-base">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white/5 text-meta">
                    <CloseIcon className="size-3" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="ma-video-frame p-[2px]">
            <div className="relative h-full overflow-hidden rounded-[7px] bg-[#0B0D12] p-5 md:p-7">
              <div className="pointer-events-none absolute -top-16 -right-10 size-48 rounded-full bg-ma-blue opacity-40 blur-[60px]" />
              <p className="relative text-sm font-semibold tracking-wide text-white uppercase">
                At the <span className="grad-text">Expert Trading Workshop</span>
              </p>
              <ul className="relative mt-5 space-y-4">
                {WORKSHOP.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-white md:text-base">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ma-blue text-white">
                      <CheckIcon className="size-3" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <WhiteCta onClick={() => openBooking()} />
        </div>
      </div>
    </section>
  )
}
