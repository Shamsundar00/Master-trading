// Used only by scripts/build-preview.mjs to pre-render the landing page markup.
import { renderToString } from 'react-dom/server'
import App from './App'

export const render = () => renderToString(<App />)
