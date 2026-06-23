// Configure la politique CORS du bucket R2 pour autoriser l'upload direct
// (PUT pré-signé) depuis le navigateur. À relancer si on ajoute un domaine.
//
//   node scripts/set-r2-cors.mjs
//
// Lit les variables R2_* depuis .env (ou l'environnement).
import { readFileSync } from 'node:fs'
import { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } from '@aws-sdk/client-s3'

// Petit parseur .env (suffisant ici, pas de dépendance)
try {
  const env = readFileSync(new URL('../.env', import.meta.url), 'utf8')
  for (const line of env.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
  }
} catch {
  // pas de .env : on s'appuie sur l'environnement
}

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
} = process.env

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.error('Variables R2_* manquantes (.env).')
  process.exit(1)
}

const ALLOWED_ORIGINS = [
  'https://studio-m-paris.fr',
  'https://www.studio-m-paris.fr',
  'https://master--sylvain-ouibo.netlify.app',
  'http://localhost:3000',
]

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
})

await client.send(
  new PutBucketCorsCommand({
    Bucket: R2_BUCKET_NAME,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedMethods: ['GET', 'PUT', 'HEAD'],
          AllowedOrigins: ALLOWED_ORIGINS,
          AllowedHeaders: ['*'],
          ExposeHeaders: ['ETag'],
          MaxAgeSeconds: 3600,
        },
      ],
    },
  })
)

const current = await client.send(new GetBucketCorsCommand({ Bucket: R2_BUCKET_NAME }))
console.log('CORS appliqué au bucket', R2_BUCKET_NAME)
console.log(JSON.stringify(current.CORSRules, null, 2))
