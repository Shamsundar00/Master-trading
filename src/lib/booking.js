// Booking + payment hand-off.
// Mirrors the flow on marketacademy.in/price-action-masterclass:
//   register webhook (this call is the lead capture) → Cashfree checkout → this page
//   with ?payment_status=processing → poll payment status → success / failed / pending.
// Every endpoint, ID and key comes from VITE_* env vars (see .env.example) so the
// Market Academy tech team can plug in the ₹999 event without code changes.
// Note: VITE_* values are bundled into client JS, exactly like the reference page.

import { EVENT } from '../config/event'
import { decryptJson, encryptJson, sha256Hex } from './crypto'
import { pushDataLayer, trackMeta } from './tracking'
import { slotLabel } from './slots'

const env = import.meta.env
const CFG = {
  eventsUrl: env.VITE_EVENTS_API_URL || '',
  registerUrl: env.VITE_REGISTER_URL || '',
  statusUrl: env.VITE_PAYMENT_STATUS_URL || '',
  token: env.VITE_API_TOKEN || '',
  aesKey: env.VITE_PAYLOAD_AES_KEY || '',
  secretSalt: env.VITE_EVENTS_SECRET_SALT || '',
  defaultTicketTypeId: env.VITE_DEFAULT_TICKET_TYPE_ID || '',
  cashfreeMode: env.VITE_CASHFREE_MODE || 'production',
  returnUrl: env.VITE_RETURN_URL || '',
  leadWebhookUrl: env.VITE_LEAD_WEBHOOK_URL || '',
}

const STORAGE_KEY = 'ma_workshop_booking'
// Fired to show a payment-status screen without navigating (demo mode).
export const STATUS_EVENT = 'ma:payment-status'
const query = () => new URLSearchParams(location.search)

export const isBookingConfigured = () => Boolean(CFG.registerUrl)
export const isDemoMode = () => env.VITE_DEMO_BOOKING === 'true' || query().get('demo') === '1'

// Landing page URL without our own status params: what "Back to workshop" links to.
export function landingUrl() {
  const q = query()
  ;['payment_status', 'order_id'].forEach((k) => q.delete(k))
  const s = q.toString()
  return `${location.pathname}${s ? `?${s}` : ''}`
}

function returnUrl() {
  if (CFG.returnUrl) return CFG.returnUrl
  // Cashfree replaces {order_id} in the return URL with the real order id.
  return `${location.origin}${location.pathname}?payment_status=processing&order_id={order_id}`
}

const getCookie = (name) => document.cookie.split('; ').find((c) => c.startsWith(`${name}=`))?.split('=')[1] || ''
// Scoped to this page's folder and prefixed, so they never overwrite the orca_* cookies
// the Price Action Masterclass page sets on the same marketacademy.in domain.
const cookiePath = () => location.pathname.replace(/[^/]*$/, '') || '/'
const setCookie = (k, v) =>
  v != null && v !== '' && (document.cookie = `${k}=${encodeURIComponent(v)};path=${cookiePath()};max-age=3600;samesite=lax`)

function authHeaders() {
  return CFG.token ? { Authorization: `Bearer ${CFG.token}` } : {}
}

// The events webhook wraps payloads as {"data": "<hex>"} when an AES key is configured.
const seal = async (obj) => (CFG.aesKey ? { data: await encryptJson(obj, CFG.aesKey) } : obj)
const unseal = async (data) => (CFG.aesKey && typeof data === 'string' ? decryptJson(data, CFG.aesKey) : data)

export function saveBooking(info) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...info, savedAt: Date.now() }))
  } catch {
    /* storage blocked; cookies below still carry the order */
  }
  setCookie('ma_ews_order_id', info.orderId)
  setCookie('ma_ews_user_id', info.userId)
  setCookie('ma_ews_amount', info.amount)
}

export function loadBooking() {
  let info = null
  try {
    info = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
  } catch {
    /* ignore */
  }
  const orderIdParam = query().get('order_id')
  const orderId =
    (orderIdParam && orderIdParam !== '{order_id}' ? orderIdParam : '') || info?.orderId || decodeURIComponent(getCookie('ma_ews_order_id'))
  return { ...info, orderId, amount: Number(info?.amount || getCookie('ma_ews_amount') || EVENT.price) }
}

function buildPayload({ slot, name, phone, email }) {
  const q = query()
  const booked_by = { name: name.trim(), mobile_number: phone.trim(), email_id: email.trim().toLowerCase() }
  return {
    event_id: EVENT.eventId,
    event_ticket_type_id: slot.ticketTypeId || CFG.defaultTicketTypeId,
    quantity: '1',
    referral_code: q.get('referral_id') || '',
    return_url: returnUrl(),
    booked_by,
    attendees: [{ first_name: booked_by.name, last_name: '', mobile_number: booked_by.mobile_number, email_id: booked_by.email_id }],
    // The slot the attendee picked. Lets the backend tell slots apart even if
    // all four share one ticket type.
    slot: { slot_id: slot.id, date: slot.date, start_time: slot.start, end_time: slot.end, label: slotLabel(slot) },
    marketing: {
      source: 'website',
      campaign: q.get('campaign') || q.get('utm_campaign') || 'website',
      landing_page: location.origin + location.pathname + location.search + location.hash,
      fbc: getCookie('_fbc'),
      fbp: getCookie('_fbp'),
    },
  }
}

// Optional extra lead capture (Google Sheet / CRM / Pabbly…) fired before payment,
// so drop-offs at the payment step are still recorded. Fire-and-forget.
function captureLead(payload) {
  if (!CFG.leadWebhookUrl) return
  const body = JSON.stringify({
    name: payload.booked_by.name,
    phone: payload.booked_by.mobile_number,
    email: payload.booked_by.email_id,
    event: EVENT.name,
    slot: payload.slot.label,
    slot_id: payload.slot.slot_id,
    amount: EVENT.price,
    landing_page: payload.marketing.landing_page,
    campaign: payload.marketing.campaign,
    submitted_at: new Date().toISOString(),
  })
  fetch(CFG.leadWebhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {})
}

function loadCashfree() {
  if (window.Cashfree) return Promise.resolve(window.Cashfree)
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
    s.onload = () => (window.Cashfree ? resolve(window.Cashfree) : reject(new Error('Cashfree SDK missing')))
    s.onerror = () => reject(new Error('Cashfree SDK failed to load'))
    document.head.appendChild(s)
  })
}

// Preload the SDK when the booking modal opens, like the reference does on page load.
export const preloadCashfree = () => isBookingConfigured() && loadCashfree().catch(() => {})

export const ERRORS = {
  init: 'Payment initiation failed. Please try again.',
  generic: 'Something went wrong. Please try again.',
  notLive: 'Online booking is opening shortly. Please call (+91) 63837 67446 to reserve your slot.',
}

/**
 * Registers the attendee for the chosen slot and redirects to Cashfree.
 * Resolves with { error } when something fails; on success the page navigates away.
 */
export async function startBooking(form) {
  const payload = buildPayload(form)
  const meta = { content_name: EVENT.name, content_category: form.slot.id, value: EVENT.price, currency: 'INR' }

  trackMeta('Lead', meta)
  pushDataLayer('workshop_lead', { slot_id: form.slot.id, slot: payload.slot.label, value: EVENT.price })
  captureLead(payload)

  if (!isBookingConfigured()) {
    if (isDemoMode()) {
      const booking = { orderId: `DEMO-${Date.now()}`, userId: '', amount: EVENT.price, slotId: form.slot.id }
      saveBooking(booking)
      // Switch to the status screen in place (no URL change), so the demo also
      // works when the page is opened as a local file on a phone.
      window.dispatchEvent(new CustomEvent(STATUS_EVENT, { detail: { status: 'processing', booking } }))
      return {}
    }
    console.warn('[booking] VITE_REGISTER_URL is not set, see .env.example')
    return { error: ERRORS.notLive }
  }

  try {
    const res = await fetch(CFG.registerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(await seal(payload)),
    })
    if (!res.ok) throw new Error(`Server error: ${res.status}`)
    const json = await res.json()
    if (!json?.success || !json?.data) return { error: ERRORS.init }

    const { payment_session_id, order_id, user_id, amount } = await unseal(json.data)
    saveBooking({ orderId: order_id, userId: user_id, amount: amount ?? EVENT.price, slotId: form.slot.id })
    if (!payment_session_id) return { error: ERRORS.init }

    trackMeta('InitiateCheckout', { ...meta, value: Number(amount ?? EVENT.price) })
    pushDataLayer('workshop_checkout', { slot_id: form.slot.id, order_id, value: Number(amount ?? EVENT.price) })

    const Cashfree = await loadCashfree()
    Cashfree({ mode: CFG.cashfreeMode }).checkout({ paymentSessionId: payment_session_id, redirectTarget: '_self' })
    return {}
  } catch (e) {
    console.error('[booking]', e)
    return { error: ERRORS.generic }
  }
}

/**
 * Polls the payment status every 3 s, up to 20 times (≈1 min), then gives up as "pending".
 * Returns a cancel function. onDone receives 'success' | 'failed' | 'pending'.
 */
export function pollPaymentStatus(orderId, onDone) {
  if (isDemoMode()) {
    const t = setTimeout(() => onDone('success'), 1800)
    return () => clearTimeout(t)
  }
  // Without an order id or status endpoint there is nothing to poll, so fall
  // through to "pending" (support follows up) instead of spinning forever.
  if (!orderId || !CFG.statusUrl) {
    const t = setTimeout(() => onDone('pending'), 1500)
    return () => clearTimeout(t)
  }

  let tries = 0
  let stopped = false
  let timer
  const finish = (s) => {
    if (stopped) return
    stopped = true
    clearInterval(timer)
    onDone(s)
  }
  const check = async () => {
    tries++
    try {
      const r = await fetch(`${CFG.statusUrl}?order_id=${encodeURIComponent(orderId)}`, { headers: authHeaders() })
      if (!r.ok) throw new Error(r.status)
      const j = await r.json()
      if (j?.success && j?.data) {
        const status = String((await unseal(j.data))?.payment_status || '').toLowerCase()
        if (status === 'success') return finish('success')
        if (status === 'failed') return finish('failed')
      }
    } catch {
      /* retry */
    }
    if (tries >= 20) finish('pending')
  }
  check()
  timer = setInterval(check, 3000)
  return () => {
    stopped = true
    clearInterval(timer)
  }
}

/**
 * Optional: live prices + seat counts from the events webhook (same GET the reference
 * page makes). Returns the API `data` object or null.
 */
export async function fetchEventData() {
  if (!CFG.eventsUrl || !CFG.secretSalt) return null
  try {
    // The reference hashes the visitor's local hour; kept identical for compatibility.
    const secret = await sha256Hex(`${CFG.secretSalt}|${new Date().getHours()}`)
    const r = await fetch(`${CFG.eventsUrl}?secret=${secret}&page_url=${encodeURIComponent(EVENT.slug)}`, { headers: authHeaders() })
    if (!r.ok) return null
    const j = await r.json()
    return (await unseal(j?.data ?? j)) || null
  } catch {
    return null
  }
}

/**
 * Merges live ticket-type data into the slot config. Matches on ticketTypeId.
 * Seat field names vary by backend version, so a few common ones are accepted.
 */
export function mergeLiveSlots(slots, data) {
  const types = data?.event_ticket_types
  if (!Array.isArray(types)) return slots
  return slots.map((s) => {
    const t = types.find((x) => x.event_ticket_type_id && x.event_ticket_type_id === s.ticketTypeId)
    if (!t) return s
    const left = t.available_quantity ?? t.available_seats ?? t.remaining_quantity ?? t.seats_left
    return { ...s, seatsLeft: Number.isFinite(Number(left)) && left !== null ? Number(left) : s.seatsLeft }
  })
}
