import { useEffect } from 'react'
import { BookingProvider, useBooking } from './context/BookingContext'
import { initSmoothScroll } from './lib/smoothScroll'
import Header from './components/sections/Header'
import Hero from './components/sections/Hero'
import Stats from './components/sections/Stats'
import WhyWorkshop from './components/sections/WhyWorkshop'
import WhoShouldAttend from './components/sections/WhoShouldAttend'
import Learn from './components/sections/Learn'
import Slots from './components/sections/Slots'
import Benefits from './components/sections/Benefits'
import Mindset from './components/sections/Mindset'
import Venue from './components/sections/Venue'
import Steps from './components/sections/Steps'
import FinalCta from './components/sections/FinalCta'
import Faq from './components/sections/Faq'
import Footer from './components/sections/Footer'
import StickyBar from './components/sections/StickyBar'
import BookingModal from './components/booking/BookingModal'
import PaymentStatus from './components/booking/PaymentStatus'

const STATUSES = ['processing', 'success', 'failed', 'pending']

function Landing() {
  const { modal } = useBooking()
  useEffect(() => {
    initSmoothScroll()
  }, [])
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <WhyWorkshop />
        <WhoShouldAttend />
        <Learn />
        <Slots />
        <Benefits />
        <Mindset />
        <Venue />
        <Steps />
        <FinalCta />
        <Faq />
      </main>
      <Footer />
      <StickyBar />
      {/* Unmounts on close so the form resets each time, like the reference */}
      {modal && <BookingModal key={modal.slotId ?? 'any'} />}
    </>
  )
}

export default function App() {
  const status = new URLSearchParams(location.search).get('payment_status')
  if (STATUSES.includes(status)) return <PaymentStatus initial={status} />
  return (
    <BookingProvider>
      <Landing />
    </BookingProvider>
  )
}
