import logo from '../../assets/brand/normal_logo.png'
import enrichLogo from '../../assets/brand/enrich_logo.svg'
import quote from '../../assets/icons/content.png'
import mic from '../../assets/sections/mic.webp'
import { SOCIALS } from '../../config/event'

// Takes the place of the reference page's "Speaker" block.
export default function Organisers() {
  const instagram = SOCIALS.find((s) => s.icon === 'instagram')
  return (
    <section id="organisers" className="bg-ma-bg py-16 md:py-20">
      <div className="container-ma">
        <div className="grid grid-cols-12 items-center gap-y-8">
          <div className="col-span-12 md:col-span-4 xl:col-span-3">
            <div className="ma-photo-card mx-auto flex max-w-[330px] flex-col items-center gap-4 px-6 py-8">
              <div className="w-full rounded-lg bg-white px-5 py-4">
                <img src={logo} alt="Market Academy" width="268" height="78" loading="lazy" className="mx-auto h-auto w-[170px]" />
              </div>
              <span className="text-2xl font-light text-white/70">×</span>
              <div className="w-full rounded-lg border border-white/10 bg-[#05070D]/60 px-5 py-5">
                <img src={enrichLogo} alt="Enrich Money" width="290" height="54" loading="lazy" className="mx-auto h-auto w-[180px]" />
              </div>
            </div>
          </div>
          <div className="col-span-12 text-center md:col-span-8 md:ps-10 md:pe-5 md:text-left xl:col-span-7">
            <p className="text-sm font-medium text-muted">Presented by</p>
            <h2 className="mt-1 text-2xl font-semibold text-white md:text-4xl md:leading-10">
              Market Academy <span className="grad-text">×</span> Enrich Money
            </h2>
            <p className="mt-1 text-sm font-medium text-muted">Expert Trading Workshop · Chennai</p>
            <p
              className="mt-8 bg-no-repeat pt-6 text-sm leading-6 font-medium text-muted"
              style={{ backgroundImage: `url(${quote})`, backgroundSize: '50px', backgroundPosition: 'left top' }}
            >
              Market Academy is an education initiative dedicated to financial literacy, market awareness and practical career exposure for
              students, young professionals and the wider learning community. This workshop is conducted in Chennai by Enrich Money, bringing a
              structured, expert-led introduction to trading for everyone who has been waiting to start.
            </p>
            <p className="mt-3 text-sm text-muted">
              Follow us on{' '}
              <a href={instagram.href} target="_blank" rel="noopener" className="text-ma-link hover:underline">
                Instagram
              </a>
            </p>
          </div>
          <div className="hidden xl:col-span-2 xl:block">
            <img src={mic} alt="" width="220" height="330" loading="lazy" className="ms-auto w-[220px]" />
          </div>
        </div>
      </div>
    </section>
  )
}
