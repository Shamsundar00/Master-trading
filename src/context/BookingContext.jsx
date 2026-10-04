import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { SLOTS } from '../config/event'
import { fetchEventData, mergeLiveSlots } from '../lib/booking'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [slots, setSlots] = useState(SLOTS)
  // null = closed; { slotId } = open (slotId may be null → start at slot selection)
  const [modal, setModal] = useState(null)

  useEffect(() => {
    let alive = true
    fetchEventData().then((data) => alive && data && setSlots((s) => mergeLiveSlots(s, data)))
    return () => {
      alive = false
    }
  }, [])

  const openBooking = useCallback((slotId = null) => setModal({ slotId }), [])
  const closeBooking = useCallback(() => setModal(null), [])

  return <BookingContext.Provider value={{ slots, modal, openBooking, closeBooking }}>{children}</BookingContext.Provider>
}

export const useBooking = () => useContext(BookingContext)
