// Builds a single, self-contained HTML file for sharing previews with the team
// (WhatsApp / email / Drive, desktop or phone):
//   - all JS, CSS and images inlined (no other files needed; fonts + map load online)
//   - landing markup pre-rendered, so the design shows even where JavaScript
//     can't run (e.g. iOS Quick Look), then becomes fully interactive in a browser
//   - booking runs in demo mode (no API calls, no payment) and tracking is off
// Usage: npm run build:preview  →  preview/Market-Academy-999-Workshop-Preview.html

import { build } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

process.env.VITE_DEMO_BOOKING = 'true'
process.env.VITE_DISABLE_TRACKING = 'true'

const TMP = '.preview-tmp'
const OUT = path.join('preview', 'Market-Academy-999-Workshop-Preview.html')
const inlineEverything = () => true

// 1. Client bundle → one HTML file with JS/CSS/images inlined
await build({
  logLevel: 'warn',
  plugins: [viteSingleFile()],
  build: { outDir: `${TMP}/client`, emptyOutDir: true, assetsInlineLimit: inlineEverything },
})

// 2. Server bundle of the same app → pre-rendered markup (same data: URIs as the client)
await build({
  logLevel: 'warn',
  build: { ssr: 'src/entry-server.jsx', outDir: `${TMP}/server`, emptyOutDir: true, assetsInlineLimit: inlineEverything },
})
const { render } = await import(pathToFileURL(path.resolve(`${TMP}/server/entry-server.js`)).href)
const markup = render()

// 3. Stitch together
let html = await readFile(`${TMP}/client/index.html`, 'utf8')
if (!html.includes('<div id="root"></div>')) throw new Error('root container not found')
html = html.replace('<div id="root"></div>', () => `<div id="root">${markup}</div>`)

const favicon = (await readFile('public/favicon.png')).toString('base64')
html = html.replace(/<link rel="icon"[^>]*>/, `<link rel="icon" href="data:image/png;base64,${favicon}" sizes="any" />`)

await mkdir(path.dirname(OUT), { recursive: true })
await writeFile(OUT, html)
await rm(TMP, { recursive: true, force: true })

const kb = (Buffer.byteLength(html) / 1024).toFixed(0)
console.log(`✓ ${OUT} (${kb} KB)`)
