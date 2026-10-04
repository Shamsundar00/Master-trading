# Market Academy — ₹999 Expert Trading Workshop (Chennai)

Landing page for the 3-hour offline Expert Trading Workshop (Enrich Money × Market Academy),
built in **React + Tailwind CSS** with the same design system, behaviour and booking flow as
[marketacademy.in/price-action-masterclass](https://marketacademy.in/price-action-masterclass/).

- **Dates:** Sat 10 Oct & Sun 11 Oct 2026, 4 slots: 10:00 AM – 1:30 PM and 3:00 PM – 6:30 PM each day
- **Venue:** Sai Pride, A24, 3rd Phase, Thiru Vi Ka Industrial Estate, SIDCO Industrial Estate, Ekkaduthangal, Guindy, Chennai 600032
- **Fee:** ₹999 booking fee, paid through Cashfree

## Run / build

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static output in dist/
npm run preview    # serve dist/ locally
```

`dist/` is plain static files. Assets use relative paths (`base: './'`), so the same build works
when uploaded to **any sub-folder** (e.g. `marketacademy.in/expert-trading-workshop/`) or a
**subdomain root**. No server rewrites are needed: the payment-status screens live on the same
page via `?payment_status=…`.

Set `VITE_SITE_URL` to the final public URL before building so the canonical and Open Graph tags
point to the right place (default: `https://marketacademy.in/expert-trading-workshop/`).

## Booking flow (for the Market Academy / Enrich Money tech team)

Same flow as the Price Action Masterclass page:

1. Visitor picks one of the 4 slots → enters Name, Phone (+91), Email → **Continue Booking**.
2. `POST VITE_REGISTER_URL` with the register payload (AES-256-CBC encrypted as `{"data":"<hex>"}`
   when `VITE_PAYLOAD_AES_KEY` is set). This call is the lead capture.
3. The response's `payment_session_id` opens **Cashfree** checkout (JS SDK v3, `redirectTarget: "_self"`).
4. Cashfree returns to `<page>?payment_status=processing&order_id={order_id}`; the page polls
   `VITE_PAYMENT_STATUS_URL?order_id=…` every 3 s (max 20) → **success / failed / pending** screen.

### What the backend needs

- An event record for this workshop (`VITE_EVENT_ID`, slug `VITE_EVENT_SLUG`) priced at ₹999.
- Slot handling — either:
  - **one ticket type per slot** → put each `event_ticket_type_id` in `SLOTS[].ticketTypeId`
    in `src/config/event.js` (also enables live seat counts per slot), **or**
  - **one shared ticket type** → set `VITE_DEFAULT_TICKET_TYPE_ID` and read the chosen slot from
    the payload's `slot` object.
- `return_url` from the payload honoured as the Cashfree return URL.

Payload sent to the register webhook (before encryption):

```json
{
  "event_id": "…",
  "event_ticket_type_id": "…",
  "quantity": "1",
  "referral_code": "?referral_id=",
  "return_url": "https://…/?payment_status=processing&order_id={order_id}",
  "booked_by": { "name": "…", "mobile_number": "9876543210", "email_id": "…" },
  "attendees": [{ "first_name": "…", "last_name": "", "mobile_number": "…", "email_id": "…" }],
  "slot": { "slot_id": "sat-morning", "date": "2026-10-10", "start_time": "10:00", "end_time": "13:30", "label": "Sat, 10 Oct · 10:00 AM – 1:30 PM" },
  "marketing": { "source": "website", "campaign": "?campaign= | ?utm_campaign= | website", "landing_page": "full URL incl. UTMs", "fbc": "_fbc", "fbp": "_fbp" }
}
```

Expected responses: register → `{ success, data: { payment_session_id, order_id, user_id, amount } }`;
status → `{ success, data: { payment_status: "success" | "failed" | … } }`.

All endpoints, IDs and keys are environment variables. Copy `.env.example` to `.env.production`
and fill it in (`.env*` files are git-ignored). Until `VITE_REGISTER_URL` is set, the popup shows
"Online booking is opening shortly. Please call…" instead of failing silently.

**QA without payments:** add `?demo=1` to the URL to run the whole flow (slot → form → processing →
success screen) without calling any API or firing conversions.

## Editing content

| What | Where |
|---|---|
| Price, slots, seat status / seats left, venue, contacts, socials, disclaimers, FAQ, tracking IDs | `src/config/event.js` |
| Section copy & layout | `src/components/sections/*` |
| Booking popup / status screens | `src/components/booking/*` |
| Design tokens (colours, gradients, breakpoints) | `src/index.css` |

Slot status: `available` | `filling` | `soldout`, or set `seatsLeft` to show "N seats left".
Booking for a slot closes automatically when it starts.

## Tracking

GTM `GTM-PL26CLPJ`, Meta Pixel `210655026562849` and LinkedIn Insight `9139180` load in production
builds only (never on localhost). Events:

| Moment | Meta Pixel | GTM dataLayer |
|---|---|---|
| Page load | `PageView` | — |
| Popup opened | — | `workshop_booking_open` |
| Slot chosen | — | `workshop_slot_selected` |
| Valid form submitted | `Lead` | `workshop_lead` |
| Redirecting to Cashfree | `InitiateCheckout` | `workshop_checkout` |
| Payment verified | `Purchase` (value, INR) — once per order | `workshop_purchase` |

Add a GTM trigger on `workshop_purchase` for the Google Ads conversion: the existing
`/payment-status/success/` URL trigger does not match this page.

## Notes

- Smooth scrolling uses Lenis with the reference page's settings (1.5 s ease-out, 0.8× wheel).
- Icons are the reference site's Flaticon UIcons, inlined as SVG (no 1 MB icon fonts).
- The Market Academy logo has a dark wordmark, so it sits on the white header bar exactly like the reference.
