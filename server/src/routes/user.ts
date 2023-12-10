import { type FastifyInstance } from 'fastify'

export async function registerUserRoutes (fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/user', async (request, reply) => {
    try {
      const { name, avatarUrl } = request.session.user
      await reply.send({ name, avatarUrl })
    } catch (err) {
      await reply.send(err)
    }
  })
}
