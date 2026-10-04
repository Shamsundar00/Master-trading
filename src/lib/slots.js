import { SLOTS } from '../config/event'

const TZ = 'Asia/Kolkata'

export const slotStart = (slot) => new Date(`${slot.date}T${slot.start}:00+05:30`)
export const slotEnd = (slot) => new Date(`${slot.date}T${slot.end}:00+05:30`)

const fmt = (opts) => new Intl.DateTimeFormat('en-IN', { timeZone: TZ, ...opts })

// "10:00 AM" / "3:00 PM"
export const formatTime = (d) => fmt({ hour: 'numeric', minute: '2-digit', hour12: true }).format(d).toUpperCase()

// "10AM" / "1:30PM": compact form used in the sticky bar, minutes dropped when :00
export const formatTimeShort = (d) => {
  const t = fmt({ hour: 'numeric', minute: '2-digit', hour12: true }).format(d).toUpperCase().replace(/\s/g, '')
  return t.replace(':00', '')
}

export const slotTimeRange = (slot) => `${formatTime(slotStart(slot))} - ${formatTime(slotEnd(slot))}`

// "Saturday" / "Sat"
export const formatWeekday = (slot, style = 'long') => fmt({ weekday: style }).format(slotStart(slot))

// "10 Oct" / "October 10"
export const formatDayMonth = (slot, style = 'short') =>
  style === 'short'
    ? fmt({ day: 'numeric', month: 'short' }).format(slotStart(slot))
    : `${fmt({ month: 'long' }).format(slotStart(slot))} ${fmt({ day: 'numeric' }).format(slotStart(slot))}`

// "Sat, 10 Oct · 10:00 AM - 1:30 PM"
export const slotLabel = (slot) => `${formatWeekday(slot, 'short')}, ${formatDayMonth(slot)} · ${slotTimeRange(slot)}`

// Slots grouped by date, preserving config order
export const slotsByDay = (slots = SLOTS) => {
  const days = []
  for (const s of slots) {
    let day = days.find((d) => d.date === s.date)
    if (!day) days.push((day = { date: s.date, slots: [] }))
    day.slots.push(s)
  }
  return days
}

// Booking for a slot closes when it starts.
export function slotAvailability(slot, now = new Date()) {
  if (now >= slotStart(slot)) return { key: 'closed', label: 'Booking closed', bookable: false }
  if (slot.status === 'soldout' || slot.seatsLeft === 0) return { key: 'soldout', label: 'Sold out', bookable: false }
  if (typeof slot.seatsLeft === 'number')
    return {
      key: slot.seatsLeft <= 10 ? 'filling' : 'available',
      label: `${slot.seatsLeft} seat${slot.seatsLeft === 1 ? '' : 's'} left`,
      bookable: true,
    }
  if (slot.status === 'filling') return { key: 'filling', label: 'Filling fast', bookable: true }
  return { key: 'available', label: 'Seats available', bookable: true }
}

export const nextOpenSlot = (slots = SLOTS, now = new Date()) => slots.find((s) => slotStart(s) > now) || null

export const findSlot = (id, slots = SLOTS) => slots.find((s) => s.id === id) || null
