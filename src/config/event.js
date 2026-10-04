// Single source of truth for everything event-specific on the page.
// Copy, dates, slots, price, venue and contacts live here so the page never
// shows mismatched values (the reference page had three different start times).

export const EVENT = {
  name: 'Expert Trading Workshop',
  city: 'Chennai',
  durationLabel: '4 Hours',
  durationAdjective: '4-hour',
  // Booking fee in INR. The backend/Cashfree order decides the final charge;
  // this value is what the page displays.
  price: 999,
  // Optional MRP shown struck-through next to the price. Leave null to hide.
  originalPrice: null,
  // Optional slug of this event on the events backend
  // (the reference uses `price-action-masterclass`).
  slug: import.meta.env.VITE_EVENT_SLUG || 'expert-trading-workshop',
  eventId: import.meta.env.VITE_EVENT_ID || '',
}

// The four bookable slots. Times are IST.
// ticketTypeId: the event_ticket_type_id for this slot on the backend, set via
// VITE_TICKET_TYPE_* in the env file. If the backend uses one ticket type for every
// slot, leave those empty and set VITE_DEFAULT_TICKET_TYPE_ID; the chosen slot is
// still sent in the payload.
// status: 'available' | 'filling' | 'soldout' (manual override); live seat counts
// from the events API (when configured) take priority.
// seatsLeft: number to show "N seats left", or null to hide the count.
const env = import.meta.env
export const SLOTS = [
  { id: 'sat-morning', date: '2026-10-10', start: '09:00', end: '13:00', session: 'Morning Batch', ticketTypeId: env.VITE_TICKET_TYPE_SAT_MORNING || '', status: 'available', seatsLeft: null },
  { id: 'sat-afternoon', date: '2026-10-10', start: '14:00', end: '18:00', session: 'Afternoon Batch', ticketTypeId: env.VITE_TICKET_TYPE_SAT_AFTERNOON || '', status: 'available', seatsLeft: null },
  { id: 'sun-morning', date: '2026-10-11', start: '09:00', end: '13:00', session: 'Morning Batch', ticketTypeId: env.VITE_TICKET_TYPE_SUN_MORNING || '', status: 'available', seatsLeft: null },
  { id: 'sun-afternoon', date: '2026-10-11', start: '14:00', end: '18:00', session: 'Afternoon Batch', ticketTypeId: env.VITE_TICKET_TYPE_SUN_AFTERNOON || '', status: 'available', seatsLeft: null },
]

export const VENUE = {
  name: 'Sai Pride in Guindy, Chennai',
  addressLines: [
    'SAI PRIDE, A24, 3rd Phase, Thiru Vi Ka Industrial Estate,',
    'SIDCO Industrial Estate, Ekkaduthangal, Guindy,',
    'Chennai, Tamil Nadu 600032',
  ],
  shortAddress: 'SAI PRIDE, Guindy, Chennai - 600032',
  mapEmbed:
    'https://maps.google.com/maps?q=Sai%20Pride%20in%20Guindy%2C%20Chennai%2C%20SAI%20PRIDE%2C%20A24%2C%203rd%20Phase%2C%20Thiru%20Vi%20Ka%20Industrial%20Estate%2C%2C%20%20SIDCO%20Industrial%20Estate%2C%20Ekkaduthangal%2C%20Guindy%2C&output=embed',
}

export const CONTACT = {
  email: 'info@marketacademy.in',
  phoneDisplay: '(+91) 63837 67446',
  phoneHref: 'tel:+916383767446',
}

export const SOCIALS = [
  { name: 'Instagram', href: 'https://www.instagram.com/marketacademy.in/', icon: 'instagram' },
  { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61586191610338', icon: 'facebook' },
  { name: 'WhatsApp', href: 'https://api.whatsapp.com/send?phone=919361459994&text=Support', icon: 'whatsapp' },
  { name: 'X (Twitter)', href: 'https://x.com/market_academy_?s=11', icon: 'twitter' },
  { name: 'YouTube', href: 'https://www.youtube.com/@MarketAcademyIN', icon: 'youtube' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/market-academy-learn/', icon: 'linkedin' },
]

export const SITE_LINKS = {
  privacy: 'https://marketacademy.in/privacy-policy/',
  terms: 'https://marketacademy.in/terms-conditions/',
  demat: 'https://onboarding.enrichmoney.in/?lead_source_page_name=marketacademy',
}

export const DISCLAIMERS = {
  market:
    'Disclaimer: Investment in the securities market are subject to market risks, read all the related documents carefully before investing.',
}

export const FAQS = [
  {
    q: 'Who is this workshop for?',
    a: 'Anyone who has been planning to learn trading: complete beginners, working professionals, and traders who want a more structured approach. We start from the basics, so no prior trading experience is needed.',
  },
  {
    q: 'What will I learn in 4 hours?',
    a: 'The key concepts every trader needs, in a structured order: trading basics, market analysis, chart analysis, entry and exit planning, risk management and strategy selection.',
  },
  {
    q: 'What are the dates and slots?',
    a: 'The workshop runs on Saturday, 10 October and Sunday, 11 October 2026. Each day has two slots: 9:00 AM to 1:00 PM and 2:00 PM to 6:00 PM. You choose one slot while booking.',
  },
  {
    q: 'How much does it cost and how do I pay?',
    a: 'The booking fee is just ₹999. Choose your slot, enter your details, and you will be redirected to Cashfree to complete the payment securely.',
  },
  {
    q: 'Where is the venue?',
    a: 'Sai Pride, A24, 3rd Phase, Thiru Vi Ka Industrial Estate, SIDCO Industrial Estate, Ekkaduthangal, Guindy, Chennai, Tamil Nadu 600032.',
  },
  {
    q: 'How will I receive my confirmation?',
    a: 'Once your payment is successful, your registration confirmation and entry pass will be sent to your registered email. Please carry a valid photo ID and your registration confirmation for check-in.',
  },
  {
    q: 'Can I change my slot after booking?',
    a: 'Please reach us at info@marketacademy.in or (+91) 63837 67446 before your slot begins, and our team will help you, subject to seat availability.',
  },
]

// Tracking IDs used across marketacademy.in (same as the reference page).
export const TRACKING = {
  gtmId: 'GTM-PL26CLPJ',
  metaPixelId: '210655026562849',
  linkedInPartnerId: '9139180',
}
