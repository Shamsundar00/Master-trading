import beginners from '../../assets/icons/Group129045.svg'
import professionals from '../../assets/icons/Group-129048.svg'
import traders from '../../assets/icons/Group129047.png'
import enthusiasts from '../../assets/icons/Group-129047.svg'

const ITEMS = [
  [beginners, 'Complete Beginners', 'Been planning to learn trading for a long time? Start from the basics, the right way.'],
  [professionals, 'Working Professionals', 'Pick a weekend slot that suits you and learn the essentials in one focused session.'],
  [traders, 'Traders Seeking Consistency', 'Bring structure to your entries, exits and risk instead of trading on instinct.'],
  [enthusiasts, 'Market Enthusiasts & Investors', 'Understand how traders read the market and charts before they act.'],
]

const LINE = 'M0 120 L40 104 L80 112 L120 86 L160 94 L200 66 L240 74 L280 44 L320 52 L360 22 L400 10'

export default function WhoShouldAttend() {
  return (
    <section className="bg-ma-bg py-16 md:py-20 lg:py-24">
      <div className="container-ma">
        <div className="grid grid-cols-12 items-center gap-y-8 md:gap-10">
          <div className="col-span-12 lg:col-span-4">
            <div className="ma-photo-card relative mx-auto flex min-h-[300px] max-w-[460px] flex-col justify-between overflow-hidden p-5 lg:min-h-[340px]">
              <p className="text-2xl leading-tight font-semibold text-white md:text-3xl xl:text-[35px] xl:leading-[42px]">
                Who Should
                <br />
                Attend This
                <br />
                Workshop?
              </p>
              <svg viewBox="0 0 400 140" className="mt-6 w-full" aria-hidden="true">
                <defs>
                  <linearGradient id="whoArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#6EA0FF" stopOpacity=".45" />
                    <stop offset="1" stopColor="#6EA0FF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`${LINE} L400 140 L0 140Z`} fill="url(#whoArea)" />
                <path d={LINE} fill="none" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
              </svg>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Beginner friendly', 'Weekend slots', 'Offline · Chennai'].map((t) => (
                  <span key={t} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white">
                    {t}
                  </span>
                ))}
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
