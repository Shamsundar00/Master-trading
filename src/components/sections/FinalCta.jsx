import { useBooking } from '../../context/BookingContext'
import { WhiteCta } from '../ui/Buttons'

export default function FinalCta() {
  const { openBooking } = useBooking()
  return (
    <section className="bg-ma-bg py-16 md:py-20 lg:py-28">
      <div className="container-ma text-center">
        <h2 className="text-2xl leading-[30px] font-semibold text-white lg:text-3xl xl:text-4xl xl:leading-10">
          Join the<span className="grad-text px-2">Expert Trading Workshop</span>
          <br />
          and start your trading journey the structured way.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-muted md:text-base">Limited slots available. Book yours now, before they fill up.</p>
        <div className="mt-8 flex justify-center md:mt-10 xl:mt-14">
          <WhiteCta size="hero" onClick={() => openBooking()} />
        </div>
      </div>
    </section>
  )
}
