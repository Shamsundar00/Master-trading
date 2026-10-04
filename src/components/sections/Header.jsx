import { useState } from 'react'
import logo from '../../assets/brand/normal_logo.png'
import { SITE_LINKS } from '../../config/event'
import { useBooking } from '../../context/BookingContext'
import { useScrolled } from '../../hooks/useScrolled'
import { scrollToId } from '../../lib/smoothScroll'

const NAV = [
  { label: 'About', href: SITE_LINKS.about, external: true },
  { label: 'Session', id: 'session' },
  { label: 'Slots', id: 'slots' },
  { label: 'Venue', id: 'venue' },
  { label: 'FAQ', id: 'faq' },
]

export default function Header() {
  const scrolled = useScrolled(80)
  const [open, setOpen] = useState(false)
  const { openBooking } = useBooking()

  const go = (e, item) => {
    if (item.external) return
    e.preventDefault()
    setOpen(false)
    scrollToId(item.id)
  }

  const linkCls = 'block text-sm font-semibold text-ink transition-colors hover:text-ma-blue'

  return (
    <header
      className={`top-0 right-0 left-0 transition-all duration-150 ${
        scrolled
          ? 'fixed z-[9999] bg-white/80 shadow-[inset_0_-1px_0_0_rgba(255,255,255,.1)] backdrop-blur-[4px]'
          : 'absolute z-40 bg-white'
      }`}
    >
      <div className="container-ma relative flex min-h-12 items-center justify-between lg:min-h-[59px]">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault()
            window.lenis ? window.lenis.scrollTo(0, { duration: 1.2 }) : window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className={`block ${scrolled ? 'py-3 lg:py-2' : 'py-2'}`}
          aria-label="Market Academy — back to top"
        >
          <img src={logo} alt="Market Academy" width="170" height="49" className="h-auto w-[111px] lg:w-[147px]" fetchPriority="high" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-10 lg:flex" aria-label="Primary">
          <ul className="flex items-center gap-10">
            {NAV.map((item) => (
              <li key={item.label}>
                <a
                  href={item.external ? item.href : `#${item.id}`}
                  onClick={(e) => go(e, item)}
                  className={`${linkCls} py-3`}
                  {...(item.external ? { target: '_blank', rel: 'noopener' } : {})}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => openBooking()}
            className="rounded-full bg-ma-blue px-7 py-2.5 text-[13px] font-semibold text-white transition-all duration-150 hover:shadow-lg hover:brightness-110"
          >
            Book Your Slot Now
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Mobile Menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
          className="absolute top-1/2 right-4 -translate-y-1/2 px-3 py-1.5 lg:hidden"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`relative my-1.5 block h-0.5 w-[30px] bg-ink transition-all duration-300 ${
                open ? (i === 0 ? 'top-2 rotate-45' : i === 1 ? 'opacity-0' : '-top-2 -rotate-45') : 'top-0'
              }`}
            />
          ))}
        </button>

        <div
          id="mobile-menu"
          className={`absolute right-0 w-[250px] rounded border-[.5px] border-[rgba(120,130,147,.2)] bg-white px-6 py-4 shadow-lg transition-all duration-300 lg:hidden ${
            open ? 'visible top-full opacity-100' : 'invisible top-[120%] opacity-0'
          }`}
        >
          <ul>
            {NAV.map((item) => (
              <li key={item.label}>
                <a
                  href={item.external ? item.href : `#${item.id}`}
                  onClick={(e) => go(e, item)}
                  className={`${linkCls} py-2`}
                  {...(item.external ? { target: '_blank', rel: 'noopener' } : {})}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              openBooking()
            }}
            className="mt-3 w-full rounded-full bg-ma-blue px-6 py-2.5 text-[13px] font-semibold text-white"
          >
            Book Your Slot Now
          </button>
        </div>
      </div>
    </header>
  )
}
