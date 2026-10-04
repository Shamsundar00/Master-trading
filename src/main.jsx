import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { initTracking } from './lib/tracking'

initTracking()

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// The single-file preview ships pre-rendered landing markup (so it still shows
// where JavaScript can't run, e.g. iOS Quick Look); hydrate it. A payment-status
// URL renders a different screen, so start fresh there.
const isStatusUrl = new URLSearchParams(location.search).has('payment_status')
if (root.firstElementChild && !isStatusUrl) {
  hydrateRoot(root, app)
} else {
  root.textContent = ''
  createRoot(root).render(app)
}
