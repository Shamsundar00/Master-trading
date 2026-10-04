import beginners from '../../assets/icons/Group129045.svg'
import professionals from '../../assets/icons/Group-129048.svg'
import traders from '../../assets/icons/Group129047.png'
import enthusiasts from '../../assets/icons/Group-129047.svg'
import { useBooking } from '../../context/BookingContext'
import { WhiteCta } from '../ui/Buttons'

const ITEMS = [
  [beginners, 'Complete Beginners', 'Been planning to learn trading for a long time? Start from the basics, the right way.'],
  [professionals, 'Working Professionals', 'Pick a weekend slot that suits you and learn the essentials in one focused session.'],
  [traders, 'Traders Seeking Consistency', 'Bring structure to your entries, exits and risk instead of trading on instinct.'],
  [enthusiasts, 'Market Enthusiasts & Investors', 'Understand how traders read the market and charts before they act.'],
]

export default function WhoShouldAttend() {
  const { openBooking } = useBooking()
  return (
    <section className="bg-ma-bg py-16 md:py-20 lg:py-24">
      <div className="container-ma">
        <div className="grid grid-cols-12 items-center gap-y-8 md:gap-10">
          <div className="col-span-12 lg:col-span-4">
            <div className="ma-photo-card relative mx-auto flex min-h-[300px] max-w-[460px] flex-col justify-between overflow-hidden p-5 lg:min-h-[340px]">
              <div>
                <p className="text-2xl leading-tight font-semibold text-white md:text-3xl xl:text-[35px] xl:leading-[42px]">
                  Who Should
                  <br />
                  Attend This
                  <br />
                  Workshop?
                </p>
                <p className="mt-4 text-sm text-white/80">No prior trading experience needed. We start from the basics.</p>
              </div>
              <div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['Beginner friendly', 'Weekend slots', 'Offline in Chennai'].map((t) => (
                    <span key={t} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white">
                      {t}
                    </span>
                  ))}
                </div>
                <WhiteCta onClick={() => openBooking()} className="mt-5 w-full sm:w-auto" />
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-12">
              {ITEMS.map(([icon, title, desc]) => (
                <div key={title} className="col-span-12 p-3 text-center sm:col-span-6 sm:p-5 sm:text-left">
                  <img src={icon} alt="" width="40" height="40" loading="lazy" className="mx-auto size-10 sm:mx-0" />
                  <p className="mt-2 text-base font-semibold text-white">{title}</p>
                  <p className="mx-auto mt-2 max-w-[320px] text-sm text-muted sm:mx-0">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
