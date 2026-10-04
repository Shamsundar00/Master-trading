import { EVENT } from '../../config/event'
import { ArrowUpRightIcon } from './Icons'

const inr = (n) => `₹${new Intl.NumberFormat('en-IN').format(n)}`

export function PriceLabel({ prefix = 'Book Your Slot @' }) {
  return (
    <>
      {prefix} {inr(EVENT.price)}
      {EVENT.originalPrice && <span className="ml-1 text-sm font-medium text-strike line-through">{inr(EVENT.originalPrice)}</span>}
    </>
  )
}

const Arrow = ({ big }) => (
  <span className={`grid place-items-center rounded-full bg-ink text-white transition-transform duration-150 ease-[cubic-bezier(.4,0,.2,1)] group-hover:rotate-45 ${big ? 'p-2.5' : 'p-2'}`}>
    <ArrowUpRightIcon className={big ? 'size-6' : 'size-4'} />
  </span>
)

// White pill with dark arrow chip — main "Book" CTA (hero, mindset band, final CTA).
export function WhiteCta({ onClick, size = 'md', children, className = '' }) {
  const hero = size === 'hero'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center justify-center rounded-full bg-white font-semibold text-ink transition-all duration-150 hover:shadow-lg sm:justify-between ${
        hero ? 'gap-6 px-6 py-3 text-base sm:p-2 lg:gap-10 2xl:gap-14' : 'gap-10 px-4 py-2 text-sm sm:p-2'
      } ${className}`}
    >
      <span className="sm:ps-4">{children ?? <PriceLabel />}</span>
      <span className="hidden sm:block">
        <Arrow big={hero} />
      </span>
    </button>
  )
}

// Blue pill with dark arrow chip — "Book Your Slot Now" (venue, footer).
export function BlueCta({ onClick, children = 'Book Your Slot Now', className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center justify-between gap-10 rounded-full bg-ma-blue p-1.5 text-sm font-medium text-white transition-all duration-150 hover:shadow-lg ${className}`}
    >
      <span className="ps-3 sm:ps-4">{children}</span>
      <Arrow />
    </button>
  )
}
