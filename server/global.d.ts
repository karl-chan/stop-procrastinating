import { type OAuth2Namespace } from '@fastify/oauth2'
import { type Auth } from 'googleapis'

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace
  }
  interface Session {
    googleAuth: Auth.OAuth2Client | undefined
    user: {
      name: string
      avatarUrl: string
    }
  }
}
