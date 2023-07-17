'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return 'this is an example'
  })

  fastify.post('/', async (request, reply) => {
    const collection = fastify.mongo.db.collection('mycollection')
    try {
      const result = await collection.insertOne(JSON.parse(request.body))
      reply.send(result)
    } catch (error) {
      reply.send(error)
    }
  })
}

