import location from '../../assets/sections/location.webp'
import { VENUE } from '../../config/event'
import { useBooking } from '../../context/BookingContext'
import { BlueCta } from '../ui/Buttons'
import { CalendarClockIcon } from '../ui/Icons'
import SectionTitle from '../ui/SectionTitle'

export default function Venue() {
  const { openBooking } = useBooking()
  return (
    <section id="venue" className="bg-ma-bg py-16 md:py-20">
      <div className="container-ma">
        <SectionTitle
          className="pb-12"
          sub="Your workshop happens at Sai Pride in Guindy, Chennai. Easy to reach, with comfortable seating, so you can focus on learning trading in person."
        >
          Find Us at the <span className="grad-text">Venue</span>
        </SectionTitle>

        <div className="mx-auto grid max-w-[1100px] gap-3 xl:grid-cols-2">
          <div className="relative overflow-hidden rounded-xl">
            <img src={location} alt="Sai Pride building, Guindy, Chennai" width="700" height="700" loading="lazy" className="block h-full w-full object-cover" />
            <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent p-4 md:p-8">
              <span className="inline-block rounded-md border border-ma-blue bg-ma-blue px-2 py-1 text-xs text-white md:px-3 md:py-1.5 md:text-sm">Event Venue</span>
              <p className="mt-4 text-xl font-semibold text-white md:text-3xl">{VENUE.name}</p>
              <p className="mt-4 text-xs text-white md:text-sm xl:text-base">
                {VENUE.addressLines.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < VENUE.addressLines.length - 1 && <br className="hidden md:block" />}{' '}
                  </span>
                ))}
              </p>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-4 h-[220px] overflow-hidden rounded-lg md:h-[350px] xl:h-auto xl:flex-1">
              <iframe
                src={VENUE.mapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={VENUE.name}
                className="h-full min-h-[220px] w-full"
              />
            </div>
            <div className="ma-card p-3 sm:p-4">
              <p className="flex items-center gap-2">
                <CalendarClockIcon className="size-4 text-ma-icon" />
                <span className="grad-text text-base">Date &amp; Time</span>
              </p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 sm:items-center">
                <div className="space-y-1 text-sm font-medium text-white md:text-base">
                  <p>October 10 (Saturday) &amp; October 11 (Sunday)</p>
                  <p className="text-sm text-muted">
                    Morning: 10:00 AM to 1:30 PM
                    <br />
                    Afternoon: 3:00 PM to 6:30 PM
                  </p>
                </div>
                <div className="sm:text-right">
                  <BlueCta onClick={() => openBooking()} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
