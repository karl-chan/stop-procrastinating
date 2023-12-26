import { fastifyCookie } from '@fastify/cookie'
import { fastifySession } from '@fastify/session'
import { fastifyStatic } from '@fastify/static'
import 'dotenv/config'
import { fastify, type FastifyInstance } from 'fastify'
import path from 'path'
import { registerAuthHook } from './hooks/auth'
import { registerAuthRoutes } from './routes/auth'
import { registerBackupRoutes } from './routes/backup'
import { registerUserRoutes } from './routes/user'

const PORT: number = +(process.env.PORT ?? 3000)

async function registerRoutes (fastify: FastifyInstance): Promise<void> {
  await registerAuthRoutes(fastify)
  await fastify.register(async (authed) => {
    await registerAuthHook(authed)

    await registerBackupRoutes(authed)
    await registerUserRoutes(fastify)
  })
}

async function createServer (): Promise<void> {
  const server = fastify()

  await server.register(fastifyCookie)
  await server.register(fastifySession, {
    secret: process.env.SESSION_SECRET!,
    cookie: {
      secure: false
    }
  })
  await server.register(fastifyStatic, {
    root: path.join(__dirname, '../../client/build')
  })
  await registerRoutes(server)
  server.listen({ port: PORT }, (err, address) => {
    if (err != null) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })
}

void createServer()
