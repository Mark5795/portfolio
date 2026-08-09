import { readBody } from 'h3'
import { isAdminConfigured, startAdminSession, verifyAdminPassword } from '../../utils/admin-auth'

type LoginBody = { password?: unknown }

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event)
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!isAdminConfigured() || !verifyAdminPassword(password)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid admin credentials' })
  }

  startAdminSession(event)
  return { authenticated: true }
})
