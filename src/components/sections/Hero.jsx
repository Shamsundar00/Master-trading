import { EVENT } from '../../config/event'
import { useBooking } from '../../context/BookingContext'
import { formatWeekday, formatDayMonth, nextOpenSlot, slotStart, slotsByDay } from '../../lib/slots'
import { WhiteCta } from '../ui/Buttons'
import Countdown from '../ui/Countdown'
import { CalendarIcon, CheckIcon, ClockIcon, MapPinIcon } from '../ui/Icons'
import SlotOption from '../ui/SlotOption'

function MetaItem({ icon: Icon, label, children, className = '' }) {
  return (
    <div className={className}>
      <div className="flex items-center justify-center md:justify-start">
        <Icon className="size-3.5 text-ma-icon md:size-[17px]" />
        <span className="grad-text ms-2 text-sm md:text-base">{label}</span>
      </div>
      <p className="mt-2 text-sm font-medium text-white md:text-base">{children}</p>
    </div>
  )
}

export function SlotPickerCard() {
  const { slots, openBooking } = useBooking()
  return (
    <div className="ma-card relative overflow-hidden p-4 sm:p-5">
      <div className="pointer-events-none absolute -top-16 -right-10 size-48 rounded-full bg-ma-blue opacity-40 blur-[60px]" />
      <div className="relative">
        <p className="text-xl font-semibold text-white sm:text-2xl">
          Choose Your <span className="grad-text">Slot</span>
        </p>
        <p className="mt-1 text-xs text-muted sm:text-sm">
          Same {EVENT.durationAdjective} workshop, 4 slots. Pick the one that suits you.
        </p>
        <div className="ma-hairline mx-auto my-4 h-px w-[85%]" />
        <div className="space-y-4">
          {slotsByDay(slots).map((day) => (
            <div key={day.date}>
              <p className="mb-2 text-sm font-semibold text-white">
                {formatWeekday(day.slots[0])}, <span className="text-muted">{formatDayMonth(day.slots[0], 'long')}</span>
              </p>
              <div className="grid gap-2">
                {day.slots.map((s) => (
                  <SlotOption key={s.id} slot={s} compact onSelect={openBooking} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          Limited seats in every slot · Booking fee <span className="font-semibold text-white">₹{EVENT.price}</span>
        </p>
      </div>
    </div>
  )
}

export default function Hero() {
  const { slots, openBooking } = useBooking()
  const next = nextOpenSlot(slots)

  return (
    <section id="top" className="bg-ma-bg pt-24 pb-16 md:pt-28 md:pb-20 lg:pt-28 lg:pb-24">
      <div className="container-ma">
        <div className="grid grid-cols-12 items-center gap-y-12 lg:gap-4">
          <div className="col-span-12 text-center lg:col-span-6 lg:text-left">
            <span className="inline-block rounded-md border border-ma-blue bg-ma-blue px-2 py-1 text-xs text-white md:px-3 md:py-1.5 md:text-sm">
              Chennai, this one&apos;s for you!
            </span>
            <h1 className="mt-6 text-[25px] leading-[33px] font-semibold text-white sm:text-[28px] md:text-2xl lg:mt-8 lg:text-4xl lg:leading-[1.25] xl:text-[44px] xl:leading-[55px]">
              Learn Trading the Structured Way.
              <br className="lg:hidden" />{' '}
              <span className="grad-text pe-2">From Basics to Strategy, in 4 Hours.</span>
            </h1>

            <div className="mt-6 space-y-4 text-xs sm:text-sm lg:space-y-2">
              <p className="font-medium text-white">4-Hour Expert Trading Workshop in Chennai. Booking Fee Just ₹{EVENT.price}!</p>
              <p className="text-muted">
                Been planning to learn trading for a long time? Don&apos;t miss this. Learn trading basics, market analysis, chart analysis, entry,
                exit, risk management and strategy selection in one structured, expert-led session.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-12">
              <MetaItem icon={CalendarIcon} label="Dates" className="md:col-span-4">
                Oct 10 &amp; 11, 2026
              </MetaItem>
              <MetaItem icon={ClockIcon} label="Slots" className="md:col-span-4">
                9AM - 1PM
                <br />
                2PM - 6PM
              </MetaItem>
              <MetaItem icon={MapPinIcon} label="Venue" className="hidden md:col-span-4 md:block">
                Guindy, Chennai
              </MetaItem>
            </div>

            <div className="mt-10 flex flex-col items-center gap-6 md:flex-row md:gap-10 lg:items-center">
              <WhiteCta size="hero" onClick={() => openBooking()} />
              {next && (
                <Countdown
                  target={slotStart(next)}
                  caption={`Next slot starts in · ${formatWeekday(next, 'short')}, ${formatDayMonth(next)}`}
                  className="md:hidden xl:block"
                />
              )}
            </div>

            <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted lg:justify-start">
              {['Secure payment via Cashfree', 'Confirmation on email', 'Limited seats per slot'].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <CheckIcon className="size-3.5 text-ma-icon" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:col-span-1 lg:block" />

          <div className="col-span-12 lg:col-span-5 lg:pt-7">
            <div className="mx-auto max-w-[460px]">
              <SlotPickerCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
