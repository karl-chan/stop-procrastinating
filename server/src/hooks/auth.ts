import { type FastifyInstance } from 'fastify'
import { type Auth } from 'googleapis'

export async function registerAuthHook (fastify: FastifyInstance): Promise<void> {
  fastify.addHook('preHandler', async (request, reply) => {
    if (!isAuthenticated(request.session.googleAuth)) {
      return await reply.status(401).send()
    }
  })
}

function isAuthenticated (googleAuth: Auth.OAuth2Client | undefined): boolean {
  if (googleAuth === undefined) {
    return false
  }
  if (googleAuth.credentials.refresh_token !== undefined) {
    return true
  }
  if (googleAuth.credentials.expiry_date! > Date.now()) {
    return true
  }
  return false
}
