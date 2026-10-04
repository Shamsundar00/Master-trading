import { useEffect, useRef, useState } from 'react'
import { EVENT } from '../../config/event'
import { useBooking } from '../../context/BookingContext'
import { preloadCashfree, startBooking } from '../../lib/booking'
import { startScroll, stopScroll } from '../../lib/smoothScroll'
import { findSlot, slotAvailability, slotLabel, slotsByDay, formatWeekday, formatDayMonth } from '../../lib/slots'
import { pushDataLayer } from '../../lib/tracking'
import { CloseIcon } from '../ui/Icons'
import SlotOption from '../ui/SlotOption'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Same checks and messages as the reference popup (Name → Email → Phone).
const validate = (f) =>
  !f.name.trim()
    ? 'Name is required'
    : !f.email.trim() || !EMAIL_RE.test(f.email.trim())
      ? 'Enter a valid email address'
      : !/^\d{10}$/.test(f.phone)
        ? 'Enter a valid 10-digit mobile number'
        : ''

// Keeps digits only, so pasted "+91 98765 43210" / "098765 43210" become "9876543210".
function normalisePhone(raw) {
  let d = raw.replace(/\D/g, '')
  if (d.length > 10 && d.startsWith('91')) d = d.slice(2)
  else if (d.length > 10 && d.startsWith('0')) d = d.slice(1)
  return d.slice(0, 10)
}

const inputCls =
  'w-full rounded-lg border border-input-border bg-input px-3 py-2.5 text-sm text-white outline-none placeholder:text-[#444] focus:border-[#555] transition-colors'

function Field({ label, htmlFor, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs text-muted">
        {label} <span className="text-red-400">*</span>
      </label>
      {children}
    </div>
  )
}

function ErrorBanner({ children }) {
  if (!children) return null
  return (
    <p role="alert" className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-400">
      {children}
    </p>
  )
}

export default function BookingModal() {
  const { modal, slots, closeBooking } = useBooking()
  const preselected = modal?.slotId ? findSlot(modal.slotId, slots) : null
  const startOnDetails = preselected && slotAvailability(preselected).bookable

  const [step, setStep] = useState(startOnDetails ? 'details' : 'slot')
  const [slotId, setSlotId] = useState(startOnDetails ? preselected.id : null)
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const nameRef = useRef(null)

  const slot = findSlot(slotId, slots)

  const loadingRef = useRef(false)
  loadingRef.current = loading

  // Lock page scroll (Lenis + native) while open; ESC closes (not mid-redirect).
  useEffect(() => {
    stopScroll()
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    preloadCashfree()
    pushDataLayer('workshop_booking_open', { slot_id: modal?.slotId || '' })
    const onKey = (e) => e.key === 'Escape' && !loadingRef.current && closeBooking()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = prev
      startScroll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (step === 'details') nameRef.current?.focus({ preventScroll: true })
  }, [step])

  const update = (key) => (e) => {
    const value = key === 'phone' ? normalisePhone(e.target.value) : e.target.value
    setForm((f) => ({ ...f, [key]: value }))
    setError('')
  }

  const goToDetails = () => {
    if (!slot) return setError('Please select a slot to continue')
    setError('')
    pushDataLayer('workshop_slot_selected', { slot_id: slot.id, slot: slotLabel(slot) })
    setStep('details')
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!slot || !slotAvailability(slot).bookable) {
      setStep('slot')
      return setError('This slot is no longer available. Please choose another slot.')
    }
    const err = validate(form)
    if (err) return setError(err)
    setError('')
    setLoading(true)
    const res = await startBooking({ slot, ...form })
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    }
    // On success the browser is navigating to Cashfree, so keep "Processing..." showing.
  }

  return (
    <div
      className="animate-ma-fade fixed inset-0 z-[99999] flex items-start justify-center overflow-y-auto bg-ink/80 px-4 py-6 sm:items-center"
      data-lenis-prevent
      onMouseDown={(e) => e.target === e.currentTarget && !loading && closeBooking()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        className="animate-ma-pop relative w-full max-w-md overflow-hidden rounded-2xl border border-input-border bg-modal"
      >
        <div className="pointer-events-none absolute -top-16 -right-10 z-0 size-48 rounded-full bg-ma-blue opacity-50 blur-[60px]" />

        <div className="relative z-10 flex items-start justify-between gap-4 px-5 pt-5 pb-4">
          <div>
            <p id="booking-title" className="line-clamp-2 text-2xl leading-snug font-semibold text-white">
              Book {EVENT.name}
            </p>
            <p className="mt-2 text-xs text-muted">Oct 10 &amp; 11, 2026 · Guindy, Chennai</p>
          </div>
          <button
            type="button"
            onClick={closeBooking}
            disabled={loading}
            aria-label="Close"
            className="rounded-full bg-white/10 p-1.5 text-white transition-colors hover:bg-white/20 disabled:opacity-50"
          >
            <CloseIcon className="size-3.5" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="relative z-10 flex items-center gap-2 px-5 pb-4 text-[11px] text-muted">
          <span className={`h-1 flex-1 rounded-full ${step === 'slot' || step === 'details' ? 'bg-ma-blue' : 'bg-input-border'}`} />
          <span className={`h-1 flex-1 rounded-full transition-colors ${step === 'details' ? 'bg-ma-blue' : 'bg-input-border'}`} />
          <span className="ms-1 whitespace-nowrap">Step {step === 'slot' ? 1 : 2} of 2</span>
        </div>

        <div className="ma-hairline mx-auto mb-4 h-px w-[85%]" />

        {step === 'slot' ? (
          <div className="relative z-10 flex flex-col gap-3.5 px-5 pb-5">
            <p className="text-sm font-medium text-white">Choose your slot</p>
            <div role="radiogroup" aria-label="Workshop slots" className="flex flex-col gap-4">
              {slotsByDay(slots).map((day) => (
                <div key={day.date}>
                  <p className="mb-2 text-xs font-semibold text-muted">
                    {formatWeekday(day.slots[0])}, {formatDayMonth(day.slots[0], 'long')}
                  </p>
                  <div className="grid gap-2">
                    {day.slots.map((s) => (
                      <SlotOption
                        key={s.id}
                        slot={s}
                        mode="radio"
                        compact
                        selected={slotId === s.id}
                        onSelect={(id) => {
                          setSlotId(id)
                          setError('')
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <ErrorBanner>{error}</ErrorBanner>
            <button
              type="button"
              onClick={goToDetails}
              className="w-full rounded-lg bg-ma-blue py-3.5 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
            >
              Continue
            </button>
            <p className="text-center text-xs text-faint">
              Booking fee <span className="ps-1 text-white">₹{EVENT.price}</span> · You&apos;ll add your details next
            </p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="relative z-10 flex flex-col gap-3.5 px-5 pb-5">
            {slot && (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-ma-blue/40 bg-ma-blue/10 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-[11px] text-muted">Your slot</p>
                  <p className="truncate text-sm font-semibold text-white">{slotLabel(slot)}</p>
                </div>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setError('')
                    setStep('slot')
                  }}
                  className="shrink-0 text-xs font-semibold text-ma-blue-light hover:underline disabled:opacity-50"
                >
                  Change
                </button>
              </div>
            )}

            <Field label="Name" htmlFor="bk-name">
              <input ref={nameRef} id="bk-name" name="name" type="text" autoComplete="name" placeholder="Ex: Ganesh Kumar" value={form.name} onChange={update('name')} className={inputCls} />
            </Field>
            <Field label="Phone Number" htmlFor="bk-phone">
              <div className="flex gap-2">
                <span className="flex items-center rounded-lg border border-input-border bg-input px-3 text-sm text-white select-none">+91</span>
                <input
                  id="bk-phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="Ex: 9876543210"
                  value={form.phone}
                  onChange={update('phone')}
                  className={inputCls}
                />
              </div>
            </Field>
            <Field label="Email ID" htmlFor="bk-email">
              <input id="bk-email" name="email" type="email" autoComplete="email" placeholder="Ex: ganeshkumar@gmail.com" value={form.email} onChange={update('email')} className={inputCls} />
            </Field>

            <ErrorBanner>{error}</ErrorBanner>

            <div className="flex items-center justify-between rounded-lg border border-input-border bg-input px-4 py-3">
              <span className="text-sm text-muted">Ticket Fee</span>
              <div className="flex items-baseline gap-2">
                {EVENT.originalPrice && <span className="text-sm text-meta line-through">₹{EVENT.originalPrice}</span>}
                <p className="text-xl font-bold text-white">₹{EVENT.price}</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-ma-blue py-3.5 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <span className="size-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />}
              {loading ? 'Processing...' : 'Continue Booking'}
            </button>
            <p className="text-center text-xs text-faint">
              You will be redirected to <span className="ps-1 text-white">CashFree</span>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
