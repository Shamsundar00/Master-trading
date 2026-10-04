import { formatWeekday, formatDayMonth, slotAvailability, slotTimeRange } from '../../lib/slots'
import { ArrowUpRightIcon, CheckIcon } from './Icons'

const BADGE = {
  available: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/25',
  filling: 'bg-amber-400/10 text-amber-300 border-amber-400/25',
  soldout: 'bg-red-400/10 text-red-300 border-red-400/25',
  closed: 'bg-white/5 text-meta border-white/10',
}
const DOT = { available: 'bg-emerald-400', filling: 'bg-amber-400', soldout: 'bg-red-400', closed: 'bg-meta' }

export function AvailabilityBadge({ slot, className = '' }) {
  const a = slotAvailability(slot)
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${BADGE[a.key]} ${className}`}>
      <span className={`size-1.5 rounded-full ${DOT[a.key]} ${a.key === 'filling' ? 'animate-pulse' : ''}`} />
      {a.label}
    </span>
  )
}

/**
 * One slot as a clickable row.
 * mode="radio"  → selectable option inside the booking modal (radio semantics)
 * mode="button" → "book this slot" shortcut on the page; opens the modal pre-selected
 */
export default function SlotOption({ slot, mode = 'button', selected = false, onSelect, showDate = false, compact = false }) {
  const a = slotAvailability(slot)
  const radio = mode === 'radio'
  return (
    <button
      type="button"
      {...(radio
        ? { role: 'radio', 'aria-checked': selected, 'aria-label': `${formatWeekday(slot)} ${slot.session}, ${slotTimeRange(slot)}, ${a.label}` }
        : { 'aria-label': `Book ${formatWeekday(slot)} ${slot.session}, ${slotTimeRange(slot)}` })}
      disabled={!a.bookable}
      onClick={() => onSelect(slot.id)}
      className={`group relative flex w-full items-center gap-3 rounded-lg border text-left transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
        compact ? 'px-3 py-2.5' : 'px-4 py-3.5'
      } ${selected ? 'border-ma-blue bg-ma-blue/10 shadow-[0_0_0_1px_#2660D3]' : 'border-input-border bg-input enabled:hover:border-ma-blue/70'}`}
    >
      {radio && (
        <span className={`grid size-5 shrink-0 place-items-center rounded-full border transition-colors ${selected ? 'border-ma-blue bg-ma-blue text-white' : 'border-[#3a3e48]'}`}>
          {selected && <CheckIcon className="size-3" />}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-[11px] font-medium tracking-wide text-muted uppercase">
            {showDate ? `${formatWeekday(slot, 'short')}, ${formatDayMonth(slot)} · ` : ''}
            {slot.session}
          </span>
          <AvailabilityBadge slot={slot} />
        </span>
        <span className={`mt-0.5 block font-semibold whitespace-nowrap text-white ${compact ? 'text-sm' : 'text-[15px]'}`}>{slotTimeRange(slot)}</span>
      </span>
      {!radio && a.bookable && (
        <span className="hidden size-7 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform duration-150 group-hover:rotate-45 xs:grid">
          <ArrowUpRightIcon className="size-3.5" />
        </span>
      )}
    </button>
  )
}
