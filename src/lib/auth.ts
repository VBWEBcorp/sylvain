import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

// Résolu au runtime (et non au chargement du module) pour ne pas faire échouer
// `next build` quand JWT_SECRET n'est pas présent dans l'environnement de build.
// La variable reste obligatoire à l'exécution des routes d'auth.
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET must be defined in environment variables')
  }
  return secret
}

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as JWTPayload
  } catch {
    return null
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return null

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null

  return parts[1]
}

export async function verifyAuth(request: NextRequest) {
  const token = getTokenFromRequest(request)
  if (!token) {
    return { authenticated: false, user: null }
  }

  const payload = verifyToken(token)
  if (!payload) {
    return { authenticated: false, user: null }
  }

  return { authenticated: true, user: payload }
}
