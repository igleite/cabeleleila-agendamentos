import * as jose from 'jose'
import { cookies } from 'next/headers'
import { UnauthorizedException } from '@/src/modules/_shared/middlewares/catch-errors'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function getToken(
  payload: { userId: string } | { email: string },
): Promise<string> {
  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(JWT_SECRET))

  return token
}

export function getTokenCookie() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth_token')?.value
  if (!token) {
    throw new UnauthorizedException('Credenciais inválidas.')
  }

  return token
}
