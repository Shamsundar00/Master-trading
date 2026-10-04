import { TRACKING } from '../config/event'

// Same site-wide tags as marketacademy.in (GTM, Meta Pixel, LinkedIn Insight).
// Skipped on localhost and in dev so testing doesn't pollute the ad accounts.
const isLocal = () => /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.hostname.endsWith('.localhost')
export const trackingEnabled = () => import.meta.env.PROD && !isLocal() && import.meta.env.VITE_DISABLE_TRACKING !== 'true'

export function initTracking() {
  if (!trackingEnabled() || window.__maTrackingLoaded) return
  window.__maTrackingLoaded = true

  // Google Tag Manager (loads GA4 / Google Ads configured in the container)
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
  addScript(`https://www.googletagmanager.com/gtm.js?id=${TRACKING.gtmId}`)

  // Meta Pixel
  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return
    n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }
    if (!f._fbq) f._fbq = n
    n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []
    t = b.createElement(e); t.async = !0; t.src = v
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s)
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
  /* eslint-enable */
  window.fbq('init', TRACKING.metaPixelId)
  window.fbq('track', 'PageView')

  // LinkedIn Insight (same snippet as marketacademy.in, including the lintrk queue)
  window._linkedin_partner_id = TRACKING.linkedInPartnerId
  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || []
  window._linkedin_data_partner_ids.push(TRACKING.linkedInPartnerId)
  if (!window.lintrk) {
    window.lintrk = (a, b) => window.lintrk.q.push([a, b])
    window.lintrk.q = []
  }
  addScript('https://snap.licdn.com/li.lms-analytics/insight.min.js')
}

function addScript(src) {
  const s = document.createElement('script')
  s.async = true
  s.src = src
  document.head.appendChild(s)
}

// Meta standard event (no-op until the pixel is loaded)
export function trackMeta(event, params) {
  if (typeof window.fbq === 'function') window.fbq('track', event, params)
}

// GTM custom event, so the Market Academy team can attach GA4 / Google Ads triggers
export function pushDataLayer(event, params = {}) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...params })
}
