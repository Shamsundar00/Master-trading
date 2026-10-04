import instagram from '../../assets/social/instagram.svg'
import facebook from '../../assets/social/facebook.svg'
import whatsapp from '../../assets/social/whatsapp.svg'
import twitter from '../../assets/social/twitter.svg'
import youtube from '../../assets/social/youtube.svg'
import linkedin from '../../assets/social/linkedin.svg'
import { CONTACT, DISCLAIMERS, SITE_LINKS, SOCIALS } from '../../config/event'
import { useBooking } from '../../context/BookingContext'
import { BlueCta } from '../ui/Buttons'
import { AtIcon, PhoneIcon } from '../ui/Icons'

const ICONS = { instagram, facebook, whatsapp, twitter, youtube, linkedin }

const LINKS = [
  { label: 'Privacy Policy', href: SITE_LINKS.privacy },
  { label: 'Terms & Conditions', href: SITE_LINKS.terms },
  { label: 'Open Demat Account', href: SITE_LINKS.demat, external: true },
]

export default function Footer() {
  const { openBooking } = useBooking()
  return (
    <footer id="footer" className="bg-ma-bg pb-24">
      <div className="border-t border-line">
        <div className="container-ma">
          <div className="grid grid-cols-12">
            {/* Left: community + socials + legal entity */}
            <div className="col-span-12 pb-10 lg:col-span-6 lg:border-r lg:border-line lg:pe-10">
              <p className="mt-10 text-sm font-medium text-white md:text-xl">Join 250+ Serious Traders &amp; Market Experts</p>
              <p className="mt-3 text-xs text-muted md:text-sm">
                Learn from respected market experts and financial educators as they share structured insights, disciplined frameworks, and
                practical strategies to navigate today&apos;s markets with confidence.
              </p>
              <ul className="mt-5 flex flex-wrap items-center gap-6" aria-label="Market Academy on social media">
                {SOCIALS.map((s) => (
                  <li key={s.icon}>
                    <a href={s.href} target="_blank" rel="noopener" aria-label={s.name} className="block opacity-90 transition-opacity hover:opacity-100">
                      <img src={ICONS[s.icon]} alt={s.name} width="24" height="24" loading="lazy" className="size-5 md:size-6" />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs text-meta md:text-sm">
                © 2026<span className="mx-2 font-medium text-white">Market Academy.</span>All Rights Reserved
              </p>
              <p className="mt-4 text-xs text-meta md:text-sm">
                Formerly known as <span className="font-medium text-white">Easy Algo Private Limited</span>.
              </p>
            </div>

            {/* Right: contact + CTA + links + disclaimer */}
            <div className="col-span-12 border-t border-line pt-10 pb-10 lg:col-span-6 lg:border-t-0 lg:ps-10">
              <p className="text-sm font-medium text-white md:text-xl">Contact</p>
              <a href={`mailto:${CONTACT.email}`} className="mt-3 flex items-center gap-2 text-xs text-muted transition-colors hover:text-white md:text-sm">
                <AtIcon className="size-4" />
                {CONTACT.email}
              </a>
              <a href={CONTACT.phoneHref} className="mt-3 flex items-center gap-2 text-xs text-muted transition-colors hover:text-white md:text-sm">
                <PhoneIcon className="size-4" />
                {CONTACT.phoneDisplay}
              </a>
              <BlueCta onClick={() => openBooking()} className="mt-5" />
              <ul className="mt-6 flex flex-col gap-2 text-xs text-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-0 md:text-sm">
                {LINKS.map((l, i) => (
                  <li key={l.label} className="flex items-center">
                    <span className={`me-2 sm:mx-3 ${i === 0 ? 'sm:hidden' : ''}`}>•</span>
                    <a href={l.href} {...(l.external ? { target: '_blank', rel: 'noopener' } : {})} className="transition-colors hover:text-white">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-meta md:text-sm">{DISCLAIMERS.market}</p>
            </div>
          </div>

          {/* Full educational disclaimer (Market Academy Terms & Conditions) */}
          <div className="border-t border-line pt-6">
            <p className="text-[11px] leading-5 text-meta md:text-xs md:leading-5">
              <span className="font-medium text-muted">Educational Purpose Disclaimer: </span>
              {DISCLAIMERS.educational}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
