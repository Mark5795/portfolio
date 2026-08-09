import { isAdminConfigured, isAdminSessionValid } from '../../utils/admin-auth'

export default defineEventHandler((event) => ({
  configured: isAdminConfigured(),
  authenticated: isAdminSessionValid(event),
}))
