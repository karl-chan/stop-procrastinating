import fastifyOauth2 from '@fastify/oauth2'
import { type FastifyInstance } from 'fastify'
import { google } from 'googleapis'

export async function registerAuthRoutes (fastify: FastifyInstance): Promise<void> {
  await fastify.register(fastifyOauth2, {
    name: 'googleOAuth2',
    scope: [
      'profile',
      'https://www.googleapis.com/auth/drive.appdata'
    ],
    credentials: {
      client: {
        id: process.env.GOOGLE_CLIENT_ID!,
        secret: process.env.GOOGLE_CLIENT_SECRET!
      },
      auth: fastifyOauth2.GOOGLE_CONFIGURATION
    },
    startRedirectPath: '/api/login/google',
    callbackUri: process.env.GOOGLE_CALLBACK_URI!
  })

  fastify.get('/api/login/google/callback', async (request, reply) => {
    try {
      const { token } = await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)
      const googleAuth = new google.auth.OAuth2()
      googleAuth.setCredentials({
        access_token: token.access_token,
        refresh_token: token.refresh_token
      })

      const { data } = await google.oauth2('v2').userinfo.get({ auth: googleAuth })

      request.session.googleAuth = googleAuth
      request.session.user = { name: data.name!, avatarUrl: data.picture! }
      await reply.redirect('/')
    } catch (err) {
      await reply.status(400).send(err)
    }
  })

  fastify.post('/api/logout', async (request, reply) => {
    request.session.googleAuth = undefined
    await reply.send()
  })
}

export async function registerAuthHook (fastify: FastifyInstance): Promise<void> {
  fastify.addHook('preHandler', async (request, reply) => {
    if (request.session.googleAuth === undefined) {
      return await reply.status(401).send()
    }
  })
}
