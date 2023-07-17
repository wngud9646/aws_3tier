'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    const test = this.mongo.client.db('baedal')
    const restaurants = test.collection('restaurants')

    const result = await restaurants.find({}).toArray();

    reply.code(200).send(result)
  })
}