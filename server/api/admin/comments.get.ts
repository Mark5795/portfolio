import { createError } from 'h3'
import { isAdminSessionValid } from '../../utils/admin-auth'
import { listAllComments } from '../../utils/comments-db'

export default defineEventHandler(async (event) => {
  if (!isAdminSessionValid(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Admin authentication required' })
  }

  return { comments: await listAllComments() }
})
