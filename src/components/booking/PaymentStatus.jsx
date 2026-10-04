import { useEffect, useState } from 'react'
import logo from '../../assets/brand/normal_logo.png'
import { CONTACT, EVENT, VENUE } from '../../config/event'
import { isDemoMode, landingUrl, loadBooking, pollPaymentStatus } from '../../lib/booking'
import { findSlot, slotLabel } from '../../lib/slots'
import { pushDataLayer, trackMeta } from '../../lib/tracking'
import { CheckIcon, CloseIcon, ClockIcon, MapPinIcon, CalendarClockIcon } from '../ui/Icons'

// Cashfree returns to this page with ?payment_status=processing; we poll and swap the
// status in place (and in the URL), the same states as the reference's
// /masterclass-payment-status/{processing,success,failed,pending} pages.
const THEMES = {
  success: { glow: 'bg-ma-blue', line: 'from-ma-blue via-[#5b9bff] to-ma-blue', ring: 'border-ma-blue/30', icon: 'bg-ma-blue/15 text-[#6EA0FF]' },
  failed: { glow: 'bg-red-500', line: 'from-red-500 via-red-300 to-red-500', ring: 'border-red-500/30', icon: 'bg-red-500/15 text-red-400' },
  pending: { glow: 'bg-amber-500', line: 'from-amber-500 via-amber-300 to-amber-500', ring: 'border-amber-500/30', icon: 'bg-amber-500/15 text-amber-400' },
}

function setStatusInUrl(status) {
  try {
    const q = new URLSearchParams(location.search)
    q.set('payment_status', status)
    history.replaceState(null, '', `${location.pathname}?${q}`)
  } catch {
    /* some file:// / content:// viewers block history changes */
  }
}

// Link back to the landing page, or an in-page reset when the status screen was
// opened without navigating (demo mode).
function BackLink({ onBack, href, className, children, ...rest }) {
  return onBack ? (
    <button type="button" onClick={onBack} className={className} {...rest}>
      {children}
    </button>
  ) : (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  )
}

function Details({ slot }) {
  return (
    <div className="mt-6 space-y-2 text-left">
      {slot && (
        <p className="flex items-center gap-2 rounded-lg border border-input-border bg-input px-3 py-2.5 text-sm text-white">
          <CalendarClockIcon className="size-4 shrink-0 text-ma-icon" />
          {slotLabel(slot)}
        </p>
      )}
      <p className="flex items-center gap-2 rounded-lg border border-input-border bg-input px-3 py-2.5 text-sm text-white">
        <MapPinIcon className="size-4 shrink-0 text-ma-icon" />
        {VENUE.shortAddress}
      </p>
    </div>
  )
}

export default function PaymentStatus({ initial, booking: given, onBack }) {
  const [status, setStatus] = useState(initial)
  // Only a status confirmed by polling counts as a conversion; opening
  // ?payment_status=success directly must not fire a Purchase.
  const [verified, setVerified] = useState(false)
  const [booking] = useState(() => given || loadBooking())
  const slot = booking?.slotId ? findSlot(booking.slotId) : null
  const back = landingUrl()

  useEffect(() => {
    if (status !== 'processing') return
    return pollPaymentStatus(booking.orderId, (s) => {
      setVerified(s === 'success')
      setStatus(s)
      if (!onBack) setStatusInUrl(s)
    })
  }, [status, booking.orderId, onBack])

  // Conversion events, once per order, so a refresh doesn't double count.
  useEffect(() => {
    if (status !== 'success' || !verified || isDemoMode()) return
    const key = `ma_purchase_tracked_${booking.orderId || 'unknown'}`
    try {
      if (localStorage.getItem(key)) return
      localStorage.setItem(key, '1')
    } catch {
      /* ignore */
    }
    trackMeta('Purchase', { value: booking.amount || EVENT.price, currency: 'INR', content_name: EVENT.name })
    pushDataLayer('workshop_purchase', { order_id: booking.orderId, value: booking.amount || EVENT.price, currency: 'INR', slot_id: slot?.id || '' })
  }, [status, verified, booking, slot])

  if (status === 'processing') {
    return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-ma-bg px-6 text-center">
        <span className="size-10 animate-spin rounded-full border-2 border-white/10 border-t-white" />
        <p className="text-sm text-muted">Verifying your payment...</p>
      </main>
    )
  }

  const t = THEMES[status] || THEMES.pending
  const content = {
    success: {
      icon: <CheckIcon className="size-7" />,
      kicker: 'Registration Confirmed',
      title: `You're In! See You At the ${EVENT.name}`,
      body: 'Your registration confirmation & entry pass will be sent to your registered email shortly. Please carry a valid photo ID and your registration confirmation for check-in.',
    },
    failed: {
      icon: <CloseIcon className="size-7" />,
      kicker: 'Payment Failed',
      title: 'Oops! Something Went Wrong',
      body: 'Your payment could not be processed. Please check your payment details and try again. No amount has been deducted.',
    },
    pending: {
      icon: <ClockIcon className="size-7" />,
      kicker: 'Confirmation Pending',
      title: 'Your Payment is Almost Complete',
      body: "We're facing a small issue confirming your payment status. Please don't worry. Kindly wait, our support team will reach out to you shortly to confirm your registration. Please keep your phone and email accessible.",
    },
  }[status] || {}

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#03070b] px-4 py-10">
      <div className={`pointer-events-none absolute -top-24 -left-24 size-72 rounded-full opacity-30 blur-[90px] ${t.glow}`} />
      <div className={`pointer-events-none absolute -right-24 -bottom-24 size-72 rounded-full opacity-25 blur-[90px] ${t.glow}`} />

      <div className={`relative w-full max-w-lg overflow-hidden rounded-2xl border bg-modal text-center ${t.ring}`}>
        <div className={`h-[3px] w-full bg-gradient-to-r ${t.line}`} />
        <BackLink
          onBack={onBack}
          href={back}
          aria-label="Close"
          className="group absolute top-4 right-4 rounded-full bg-white/10 p-1.5 text-white transition-colors hover:bg-white/20"
        >
          <CloseIcon className="size-3.5 transition-transform duration-200 group-hover:rotate-90" />
        </BackLink>
        <div className="px-6 pt-8 pb-7 sm:px-8">
          <div className="mx-auto mb-5 w-fit rounded-md bg-white px-3 py-1.5">
            <img src={logo} alt="Market Academy" width="268" height="78" className="h-auto w-[110px]" />
          </div>
          <span className={`mx-auto grid size-14 place-items-center rounded-full sm:size-16 ${t.icon}`}>{content.icon}</span>
          <p className="mt-4 text-xs font-semibold tracking-wider text-muted uppercase">{content.kicker}</p>
          <h1 className="mt-2 text-xl leading-snug font-semibold text-white sm:text-2xl">{content.title}</h1>
          <p className="mt-3 text-sm leading-6 text-muted">{content.body}</p>
          <Details slot={slot} />

          {status === 'failed' && (
            <BackLink onBack={onBack} href={back} className="mt-6 block w-full rounded-full bg-red-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700">
              Try Again
            </BackLink>
          )}
          {status !== 'failed' && (
            <BackLink onBack={onBack} href={back} className="mt-6 inline-block text-sm font-semibold text-ma-blue-light hover:underline">
              Back to workshop page
            </BackLink>
          )}
          <p className="mt-5 text-xs text-faint">
            Need help? {CONTACT.phoneDisplay} · {CONTACT.email}
          </p>
          {isDemoMode() && <p className="mt-3 text-[11px] text-amber-300/80">Demo mode: no real payment was made.</p>}
        </div>
      </div>
    </main>
  )
}
