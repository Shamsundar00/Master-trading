// AES-256-CBC with a zero IV, PKCS7 padding and hex ciphertext, byte-compatible
// with the CryptoJS setup the events webhook expects:
//   CryptoJS.AES.encrypt(json, Utf8.parse(KEY), { mode: CBC, padding: Pkcs7, iv: Hex.parse('0'*32) }).ciphertext.toString(Hex)
// Implemented with WebCrypto so no extra dependency is bundled.

const enc = new TextEncoder()
const dec = new TextDecoder()
const ZERO_IV = new Uint8Array(16)

const toHex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
const fromHex = (hex) => new Uint8Array(hex.match(/.{1,2}/g).map((b) => parseInt(b, 16)))

const importKey = (key) => crypto.subtle.importKey('raw', enc.encode(key), { name: 'AES-CBC' }, false, ['encrypt', 'decrypt'])

export async function encryptJson(obj, key) {
  const cipher = await crypto.subtle.encrypt({ name: 'AES-CBC', iv: ZERO_IV }, await importKey(key), enc.encode(JSON.stringify(obj)))
  return toHex(cipher)
}

export async function decryptJson(hex, key) {
  const plain = await crypto.subtle.decrypt({ name: 'AES-CBC', iv: ZERO_IV }, await importKey(key), fromHex(hex))
  return JSON.parse(dec.decode(plain))
}

export async function sha256Hex(text) {
  return toHex(await crypto.subtle.digest('SHA-256', enc.encode(text)))
}
