// Remplace la galerie d'un projet par les ORIGINAUX HD du dossier local.
// Usage: node upload-hd.mjs <slug> <prefixeDossier>
//   ex : node upload-hd.mjs 1cb 1CB
import { readFileSync, readdirSync } from 'fs'
import path from 'path'
import sharp from 'sharp'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const SLUG = process.argv[2]
const PREFIX = process.argv[3]
const BASE = 'C:/Users/conta/Downloads/Sylvain'
const API = 'http://localhost:3003'

// --- env (.env.local) ---
const strip = (v) => v.replace(/^['"]|['"]$/g, '')
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), strip(l.slice(i + 1).trim())] })
)
const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY },
})
const PUBLIC = env.R2_PUBLIC_URL.replace(/\/$/, '')

// --- dossier + originaux HD (hors FILEminimizer) ---
const sub = readdirSync(BASE).find((d) => d.startsWith(PREFIX))
if (!sub) { console.error('Dossier introuvable pour prefixe', PREFIX); process.exit(1) }
const dir = path.join(BASE, sub)
const files = readdirSync(dir)
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && !/FILEminimizer/i.test(f))
  .sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }))
console.log(`Dossier: ${sub} -> ${files.length} originaux HD`)

// --- optimise + upload R2 ---
const urls = []
for (let i = 0; i < files.length; i++) {
  const buf = readFileSync(path.join(dir, files[i]))
  const out = await sharp(buf).rotate().resize(2560, 2560, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 88 }).toBuffer()
  const key = `${SLUG}-hd-${String(i + 1).padStart(3, '0')}.webp`
  await r2.send(new PutObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: key, Body: out, ContentType: 'image/webp' }))
  urls.push(`${PUBLIC}/${key}`)
  process.stdout.write(`\r  upload ${i + 1}/${files.length} (${Math.round(out.length / 1024)} Ko)   `)
}
console.log('\nUpload R2 termine.')

// --- login + PUT galerie + orientations (5 premieres portrait, paysage 1/4 ensuite) ---
const token = (await fetch(`${API}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'sylvain@sylvainmarceau.com', password: 'StudioM2230' }) }).then((r) => r.json())).token
const orientations = []
for (let i = 5; i < urls.length; i++) { if ((i - 5) % 4 === 0) orientations.push({ url: urls[i], orientation: 'paysage' }) }
const res = await fetch(`${API}/api/projects/${SLUG}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify({ gallery: urls, cover: urls[0], orientations }) })
console.log('PUT galerie:', res.status)

// --- verif ---
const after = await fetch(`${API}/api/projects/${SLUG}`).then((r) => r.json())
const m = await sharp(Buffer.from(await fetch(after.cover).then((r) => r.arrayBuffer()))).metadata()
console.log(`VERIF -> ${after.gallery.length} photos, cover ${m.width}x${m.height}, ${orientations.length} paysage`)
