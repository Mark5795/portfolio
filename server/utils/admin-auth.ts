import { createHmac, timingSafeEqual } from 'node:crypto'
import { getCookie, setCookie } from 'h3'

const cookieName = 'portfolio-admin-session'
const sessionLifetimeSeconds = 60 * 60 * 12

const getAdminPassword = () => process.env.ADMIN_PASSWORD || ''

const signSession = (expiresAt: number) => createHmac('sha256', getAdminPassword())
  .update(`admin:${expiresAt}`)
  .digest('hex')

const sessionValue = (expiresAt: number) => `${expiresAt}.${signSession(expiresAt)}`

export const isAdminConfigured = () => Boolean(getAdminPassword())

export const isAdminSessionValid = (event: Parameters<typeof getCookie>[0]) => {
  const password = getAdminPassword()
  const value = getCookie(event, cookieName)
  if (!password || !value) return false

  const [expiresAtValue, signature] = value.split('.')
  const expiresAt = Number(expiresAtValue)
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000) || !signature) return false

  const expectedSignature = signSession(expiresAt)
  if (signature.length !== expectedSignature.length) return false

  return timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
}

export const verifyAdminPassword = (password: string) => {
  const configuredPassword = getAdminPassword()
  if (!configuredPassword || password.length !== configuredPassword.length) return false

  return timingSafeEqual(Buffer.from(password), Buffer.from(configuredPassword))
}

export const startAdminSession = (event: Parameters<typeof setCookie>[0]) => {
  const expiresAt = Math.floor(Date.now() / 1000) + sessionLifetimeSeconds
  setCookie(event, cookieName, sessionValue(expiresAt), {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: sessionLifetimeSeconds,
    path: '/',
  })
}

export const endAdminSession = (event: Parameters<typeof setCookie>[0]) => {
  setCookie(event, cookieName, '', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
  })
}
