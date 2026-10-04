import { useEffect, useState } from 'react'
import { BookingProvider, useBooking } from './context/BookingContext'
import { initSmoothScroll } from './lib/smoothScroll'
import { STATUS_EVENT } from './lib/booking'
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

// Status from the Cashfree return URL (?payment_status=…). Guarded so the page can be pre-rendered.
const statusFromUrl = () => {
  if (typeof window === 'undefined') return null
  const s = new URLSearchParams(window.location.search).get('payment_status')
  return STATUSES.includes(s) ? s : null
}

export default function App() {
  const [view, setView] = useState(() => ({ status: statusFromUrl(), booking: null, inPage: false }))

  // Demo bookings switch to the status screen in place instead of navigating.
  useEffect(() => {
    const show = (e) => {
      window.scrollTo(0, 0)
      setView({ status: e.detail.status, booking: e.detail.booking, inPage: true })
    }
    window.addEventListener(STATUS_EVENT, show)
    return () => window.removeEventListener(STATUS_EVENT, show)
  }, [])

  if (view.status) {
    return (
      <PaymentStatus
        initial={view.status}
        booking={view.booking}
        onBack={view.inPage ? () => setView({ status: null, booking: null, inPage: false }) : undefined}
      />
    )
  }
  return (
    <BookingProvider>
      <Landing />
    </BookingProvider>
  )
}
