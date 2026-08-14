import { createError, getRouterParam } from 'h3'
import { isAdminSessionValid } from '../../../utils/admin-auth'
import { deleteComment } from '../../../utils/comments-db'

export default defineEventHandler(async (event) => {
  if (!isAdminSessionValid(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Admin authentication required' })
  }

  const commentId = Number(getRouterParam(event, 'id'))
  if (!Number.isSafeInteger(commentId) || commentId <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid comment id' })
  }

  if (!await deleteComment(commentId)) {
    throw createError({ statusCode: 404, statusMessage: 'Comment not found' })
  }

  return { deleted: true }
})
