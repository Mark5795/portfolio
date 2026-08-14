import { getRouterParam } from 'h3'
import { listProjectComments } from '../../utils/comments-db'

export default defineEventHandler(async (event) => {
  const projectSlug = getRouterParam(event, 'slug')?.trim()

  if (!projectSlug) {
    throw createError({ statusCode: 400, statusMessage: 'Project slug is required' })
  }

  return { comments: await listProjectComments(projectSlug) }
})
