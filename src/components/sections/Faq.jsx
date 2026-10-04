import { useState } from 'react'
import { FAQS } from '../../config/event'
import { ArrowSmallRightIcon } from '../ui/Icons'

// Single-open accordion, first item open by default (as on the reference),
// with real buttons + aria state so it works from the keyboard too.
export default function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="bg-ma-bg pt-10 pb-16 md:pb-32">
      <div className="container-ma">
        <div className="grid grid-cols-12 gap-y-6 pt-10">
          <div className="col-span-12 md:col-span-3">
            <h2 className="text-center text-2xl font-medium text-white md:ps-5 md:pt-5 md:text-left md:text-4xl md:leading-10">
              Frequently <br className="hidden md:block" />
              Asked <br />
              Questions
            </h2>
          </div>
          <div className="col-span-12 md:col-span-8 md:col-start-5">
            {FAQS.map((f, i) => {
              const isOpen = open === i
              return (
                <article key={f.q} className={i < FAQS.length - 1 ? 'border-b border-line' : ''}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className={`ms-2 flex w-full items-start pt-5 text-left text-sm font-medium text-white sm:text-base md:text-lg ${isOpen ? 'pb-4' : 'pb-6'}`}
                    >
                      <ArrowSmallRightIcon className={`me-2 mt-0.5 size-5 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                      {f.q}
                    </button>
                  </h3>
                  {isOpen && (
                    <p id={`faq-${i}`} className="ms-4 pb-6 text-left text-xs leading-[25px] text-para sm:text-sm md:ms-9">
                      {f.a}
                    </p>
                  )}
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
