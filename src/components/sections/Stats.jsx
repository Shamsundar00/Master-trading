const STATS = [
  ['4 Hours', 'Focused Expert Session'],
  ['4 Slots', 'Pick What Suits You'],
  ['2 Days', 'Sat 10 & Sun 11 Oct'],
  ['₹999', 'Booking Fee'],
]

export default function Stats() {
  return (
    <section className="bg-ma-bg pt-16 pb-16 md:pt-20">
      <div className="container-ma">
        <div className="grid grid-cols-12 gap-y-5 sm:gap-y-7">
          {STATS.map(([value, label], i) => (
            <div key={label} className="relative col-span-6 px-2 text-center md:col-span-3">
              <p className="text-xl leading-[30px] font-semibold text-white sm:text-[28px] lg:text-4xl lg:leading-10">{value}</p>
              <p className="mt-2 truncate text-xs text-muted md:text-sm">{label}</p>
              {i < STATS.length - 1 && <span className={`ma-vdivider absolute top-0 right-0 h-full w-0.5 ${i === 1 ? 'hidden md:block' : ''}`} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
