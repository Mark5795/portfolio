import { endAdminSession } from '../../utils/admin-auth'

export default defineEventHandler((event) => {
  endAdminSession(event)
  return { authenticated: false }
})
