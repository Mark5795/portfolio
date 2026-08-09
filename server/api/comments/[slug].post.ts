import { getRequestIP, getRouterParam, readBody } from 'h3'
import { createProjectComment } from '../../utils/comments-db'

const siteverifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

type CommentBody = {
  name?: unknown
  message?: unknown
  'cf-turnstile-response'?: unknown
}

export default defineEventHandler(async (event) => {
  const projectSlug = getRouterParam(event, 'slug')?.trim()
  const body = await readBody<CommentBody>(event)
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const message = typeof body?.message === 'string' ? body.message.trim() : ''
  const token = typeof body?.['cf-turnstile-response'] === 'string'
    ? body['cf-turnstile-response'].trim()
    : ''

  if (!projectSlug || !name || !message || !token) {
    throw createError({ statusCode: 400, statusMessage: 'Name, message, and Turnstile verification are required' })
  }

  if (name.length > 80 || message.length > 2000) {
    throw createError({ statusCode: 400, statusMessage: 'Comment is too long' })
  }

  const secret = process.env.TURNSTILE_SECRET
  if (!secret) {
    throw createError({ statusCode: 500, statusMessage: 'Turnstile is not configured' })
  }

  let verification: { success?: boolean }
  try {
    const response = await fetch(siteverifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret,
        response: token,
        remoteip: getRequestIP(event, { xForwardedFor: true }) || '',
      }),
    })

    if (!response.ok) {
      throw new Error(`siteverify ${response.status}`)
    }

    verification = await response.json() as { success?: boolean }
  } catch {
    throw createError({ statusCode: 403, statusMessage: 'Turnstile verification failed' })
  }

  if (verification.success !== true) {
    throw createError({ statusCode: 403, statusMessage: 'Turnstile verification failed' })
  }

  return {
    comment: createProjectComment(projectSlug, name, message),
  }
})
