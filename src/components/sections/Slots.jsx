import { EVENT } from '../../config/event'
import { useBooking } from '../../context/BookingContext'
import { formatDayMonth, formatWeekday, slotAvailability, slotTimeRange, slotsByDay } from '../../lib/slots'
import { CalendarIcon, ClockIcon, ArrowUpRightIcon } from '../ui/Icons'
import { AvailabilityBadge } from '../ui/SlotOption'
import SectionTitle from '../ui/SectionTitle'

function SlotTile({ slot, onBook }) {
  const a = slotAvailability(slot)
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-input-border bg-[#0B0D12]/70 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium tracking-wide text-muted uppercase">{slot.session}</span>
          <AvailabilityBadge slot={slot} />
        </div>
        <p className="mt-1.5 flex items-center gap-2 text-lg font-semibold text-white">
          <ClockIcon className="size-4 text-ma-icon" />
          {slotTimeRange(slot)}
        </p>
      </div>
      <button
        type="button"
        disabled={!a.bookable}
        onClick={() => onBook(slot.id)}
        className="group inline-flex shrink-0 items-center justify-between gap-6 rounded-full bg-white py-1.5 ps-4 pe-1.5 text-sm font-semibold text-ink transition-all duration-150 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-meta"
      >
        {a.bookable ? 'Book this slot' : a.label}
        <span className="grid place-items-center rounded-full bg-ink p-2 text-white transition-transform duration-150 group-hover:rotate-45 group-disabled:rotate-0">
          <ArrowUpRightIcon className="size-4" />
        </span>
      </button>
    </div>
  )
}

export default function Slots() {
  const { slots, openBooking } = useBooking()
  return (
    <section id="slots" className="bg-ma-bg py-16 md:py-20">
      <div className="container-ma">
        <SectionTitle className="pb-12" sub={`Same workshop, four slots across two days. Choose the one that suits you and book it for just ₹${EVENT.price}.`}>
          Pick a <span className="grad-text">Slot</span> That Suits You
        </SectionTitle>
        <div className="mx-auto grid max-w-[1100px] gap-3 md:grid-cols-2">
          {slotsByDay(slots).map((day) => (
            <div key={day.date} className="ma-card p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xl font-semibold text-white sm:text-2xl">{formatWeekday(day.slots[0])}</p>
                  <p className="text-sm text-muted">{formatDayMonth(day.slots[0], 'long')}, 2026</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-md border border-ma-blue bg-ma-blue px-3 py-1.5 text-xs text-white sm:text-sm">
                  <CalendarIcon className="size-3.5" />
                  {day.slots.length} slots
                </span>
              </div>
              <div className="grid gap-3">
                {day.slots.map((s) => (
                  <SlotTile key={s.id} slot={s} onBook={openBooking} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted sm:text-sm">
          {EVENT.durationAdjective} workshop · Offline at Guindy, Chennai · Limited seats in every slot
        </p>
      </div>
    </section>
  )
}
