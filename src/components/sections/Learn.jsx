import molecule from '../../assets/icons/molecule.png'
import report from '../../assets/icons/report.png'
import mathematics from '../../assets/icons/mathematics.png'
import lightbulb from '../../assets/icons/lightbulb.png'
import SectionTitle from '../ui/SectionTitle'

// Topics from the ad script: basics, market analysis, chart analysis, entry, exit,
// risk management, strategy selection — grouped into the reference's 2×2 card grid.
const TOPICS = [
  [molecule, 'Trading Basics & Market Analysis', 'How the market works, the key terms, and how to read the bigger picture before you trade.'],
  [report, 'Chart Analysis', 'Read candlesticks, trends, support and resistance, and how price behaves around key levels.'],
  [mathematics, 'Entry & Exit Planning', 'Decide where to enter, where to book profit and where to step out, before you take the trade.'],
  [lightbulb, 'Risk Management & Strategy Selection', 'Size your positions, protect your capital, and choose a strategy that suits your style.'],
]

export default function Learn() {
  return (
    <section id="session" className="bg-ma-bg py-16 md:py-20">
      <div className="container-ma">
        <SectionTitle
          className="pb-12"
          sub={
            <>
              A structured, step-by-step session covering the concepts every trader needs,
              <br className="hidden md:block" /> from the fundamentals all the way to choosing a strategy.
            </>
          }
        >
          What you&apos;ll learn in <span className="grad-text">this Workshop?</span>
        </SectionTitle>
        <div className="mx-auto grid max-w-[1100px] gap-3 sm:grid-cols-2">
          {TOPICS.map(([icon, title, desc]) => (
            <div key={title} className="ma-card h-full p-4">
              <img src={icon} alt="" width="32" height="35" loading="lazy" className="h-[35px] w-8 object-contain" />
              <p className="mt-2 text-base leading-6 font-medium text-white md:text-lg md:leading-7">{title}</p>
              <p className="mt-1 text-sm leading-5 text-muted-2">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
