// Centered section heading + sub-copy, as used for "What you'll learn", "Venue", etc.
export default function SectionTitle({ children, sub, className = '' }) {
  return (
    <div className={`mx-auto text-center ${className}`}>
      <h2 className="text-2xl leading-[30px] font-semibold text-white lg:text-3xl xl:text-4xl xl:leading-10">{children}</h2>
      {sub && <p className="mx-auto mt-4 max-w-3xl text-sm leading-5 text-muted md:mt-6 md:text-base md:leading-6">{sub}</p>}
    </div>
  )
}
