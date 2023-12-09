import { type FastifyInstance } from 'fastify'
import { google } from 'googleapis'

export async function registerBackupRoutes (fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/backups', async (request, reply) => {
    try {
      const { data } = await google.drive('v3').files.list({
        spaces: 'appDataFolder',
        fields: 'nextPageToken, files(id, name)',
        auth: request.session.googleAuth
      })
      const backups = data.files!
        .filter(f =>
          f.name!.startsWith('backup.') &&
          f.name!.endsWith('.json'))
        .map(f => ({
          id: f.id,
          timestamp: +f.name!.match(/backup\.([0-9]+)\.json/)![1]
        }))
      await reply.send(backups)
    } catch (err) {
      await reply.status(400).send(err)
    }
  })

  fastify.get('/api/backup/:id', async (request, reply) => {
    try {
      const { id } = request.params as any
      const { data } =
        await google.drive('v3').files.get({
          fileId: id,
          alt: 'media',
          auth: request.session.googleAuth
        })
      await reply.send(data)
    } catch (err) {
      await reply.status(400).send(err)
    }
  })

  fastify.delete('/api/backup/:id', async (request, reply) => {
    try {
      const { id } = request.params as any
      await google.drive('v3').files.delete({
        fileId: id,
        auth: request.session.googleAuth
      })
      await reply.send()
    } catch (err) {
      await reply.status(400).send(err)
    }
  })

  fastify.post('/api/backup', async (request, reply) => {
    const content = request.body as string

    try {
      const timestamp = Date.now()
      const { data } = await google.drive('v3').files.create({
        requestBody: {
          name: `backup.${timestamp}.json`,
          parents: ['appDataFolder']
        },
        media: {
          mimeType: 'application/json',
          body: content
        },
        auth: request.session.googleAuth
      })
      await reply.send({
        id: data.id,
        timestamp
      })
    } catch (err) {
      await reply.status(400).send(err)
    }
  })
}
