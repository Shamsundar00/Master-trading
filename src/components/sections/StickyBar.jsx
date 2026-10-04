import { EVENT } from '../../config/event'
import { useBooking } from '../../context/BookingContext'
import { nextOpenSlot, slotStart } from '../../lib/slots'
import { PriceLabel } from '../ui/Buttons'
import Countdown from '../ui/Countdown'
import { ArrowUpRightIcon } from '../ui/Icons'

// Fixed cyan→violet booking bar, visible on every screen size from first paint.
export default function StickyBar() {
  const { slots, openBooking } = useBooking()
  const next = nextOpenSlot(slots)
  return (
    <div className="ma-sticky fixed right-0 bottom-0 left-0 z-50 py-1">
      <div className="container-ma">
        <div className="flex min-h-9 items-center justify-between gap-3">
          <div className="hidden text-[13px] leading-5 font-semibold text-sticky-ink sm:block">
            <p>October 10 &amp; 11 (Sat &amp; Sun)</p>
            <p>10AM - 1:30PM · 3PM - 6:30PM</p>
          </div>
          <p className="text-xs leading-4 font-semibold text-sticky-ink sm:hidden">
            Oct 10 &amp; 11
            <br />4 slots · {EVENT.durationLabel}
          </p>

          <div className="flex items-center gap-4">
            <p className="hidden text-lg font-semibold text-white lg:block">Limited Slots Only!</p>
            <button
              type="button"
              onClick={() => openBooking()}
              className="group flex items-center gap-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink transition-all duration-150 hover:shadow-lg sm:px-2 md:gap-10"
            >
              <span className="sm:ps-2 md:ps-4">
                <PriceLabel />
              </span>
              <span className="hidden rounded-full bg-ink p-1 text-white transition-transform duration-150 group-hover:rotate-45 sm:block sm:p-2">
                <ArrowUpRightIcon className="size-4" />
              </span>
            </button>
          </div>

          {next ? <Countdown target={slotStart(next)} weight="semibold" className="hidden lg:block" /> : <span className="hidden lg:block" />}
        </div>
      </div>
    </div>
  )
}
