import bg from '../../assets/sections/bg.webp'
import { useBooking } from '../../context/BookingContext'
import { WhiteCta } from '../ui/Buttons'

export default function Mindset() {
  const { openBooking } = useBooking()
  return (
    <section className="bg-ma-bg py-16 md:py-24">
      <div className="bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bg})` }}>
        <div className="container-ma py-10 md:py-14">
          <h2 className="text-xl font-semibold text-white md:text-3xl md:leading-9">
            Everyone wants profitable trades.
            <br />
            Few learn the <span className="grad-text">process</span>
            <br />
            behind them.
          </h2>
          <div className="mt-10 flex items-center md:mt-20">
            <span className="text-sm text-white">Trading is</span>
            <span className="ms-3 w-[30%] border border-[#545454] md:w-[15%]" />
          </div>
          <div className="mt-5 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="flex gap-14">
              {[
                ['80%', 'Mindset'],
                ['20%', 'Execution'],
              ].map(([v, l]) => (
                <div key={l}>
                  <p className="text-[25px] font-medium text-white md:text-5xl">{v}</p>
                  <p className="text-sm text-muted">{l}</p>
                </div>
              ))}
            </div>
            <div className="md:text-right">
              <p className="mb-3 text-base text-white">Join the workshop!</p>
              <WhiteCta onClick={() => openBooking()} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
