import { EVENT } from '../../config/event'
import { useBooking } from '../../context/BookingContext'
import { BlueCta } from '../ui/Buttons'
import { CalendarIcon, MapPinIcon } from '../ui/Icons'

const Rupee = ({ className }) => (
  <span aria-hidden="true" className={`leading-none font-bold ${className}`}>
    ₹
  </span>
)

const STEPS = [
  { icon: CalendarIcon, title: 'Pick your slot', desc: 'Choose Saturday or Sunday, morning or afternoon. The same workshop runs in every slot.' },
  { icon: Rupee, title: `Pay ₹${EVENT.price} securely`, desc: 'Enter your name, phone and email, then pay the booking fee through Cashfree.' },
  { icon: MapPinIcon, title: 'Get your entry pass', desc: 'Your confirmation and entry pass arrive on email. Bring a photo ID to Sai Pride, Guindy.' },
]

// Same layout as the reference page's "Exclusive Bonuses" block (#Bonus 1/2/3 cards).
export default function Steps() {
  const { openBooking } = useBooking()
  return (
    <section className="bg-ma-bg py-16 md:py-20 lg:pt-28">
      <div className="container-ma">
        <div className="grid grid-cols-12 items-center gap-y-10 xl:gap-10">
          <div className="col-span-12 text-center xl:col-span-4 xl:text-left">
            <h2 className="text-2xl font-medium text-white lg:text-3xl xl:text-4xl xl:leading-10">
              Book in <span className="grad-text">3 Simple Steps</span>
            </h2>
            <p className="mt-3 text-sm text-muted">Takes less than two minutes. Limited seats in every slot, so book yours before it fills up.</p>
            <BlueCta onClick={() => openBooking()} className="mt-6" />
          </div>
          <div className="col-span-12 xl:col-span-8">
            <div className="mb-2 hidden grid-cols-3 gap-5 md:grid">
              {STEPS.map((_, i) => (
                <p key={i} className="grad-text text-lg leading-7 font-semibold">
                  #Step {i + 1}
                </p>
              ))}
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {STEPS.map(({ icon: Icon, title, desc }, i) => (
                <div key={title} className="ma-card-bonus relative h-full overflow-hidden">
                  <Icon className="absolute -right-2 -bottom-3 size-24 text-[96px] text-ma-blue/20" />
                  <div className="relative p-5 pe-14">
                    <p className="grad-text mb-1 text-sm md:hidden">#Step {i + 1}</p>
                    <p className="mb-3 text-lg leading-7 font-semibold text-white">{title}</p>
                    <p className="text-sm text-muted">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
