'use strict'
const { ObjectId } = require('mongodb')


module.exports = async function (fastify, opts) {
    fastify.get('/:id', async function (request, reply) {
        const test = this.mongo.client.db('baedal')
        const orders = test.collection('order')
        const orderId = request.params.id
    
        const query = { _id: new ObjectId(orderId) };
    
        const result = await orders.findOne(query)
    
        reply.code(200).send(result)
      })
  
    fastify.get('/', async function (request, reply) {
    const test = this.mongo.client.db('baedal')
    const orders = test.collection('order')

    const result = await orders.find({}).toArray();

    reply.code(200).send(result)
  })



    fastify.post('/', async function (request, reply) {
      const test = this.mongo.client.db('baedal')
      const orders = test.collection('order')
      const courier = test.collection('courier')

      const id = request.body._id;
      const restaurantId = request.body.restaurantId;
      const restaurant = await test.collection('restaurants').findOne({ _id: new ObjectId(restaurantId) })

      const orderedMenu = request.body.menu.map(menuItem => ({
        ...menuItem,
        quantity: 1
      }));
      const availableCouriers = await courier.findOne({ available: true })

      const orderData = {
        restaurant: restaurant,
        orderedMenu: orderedMenu,
        deliveryInfo: {
            status: "PREPARING",
            assignedCourier: availableCouriers.courier,
            estimatedDeleveryTime: 40
          }
      }

      const neworder = await orders.insertOne(orderData)
      const newOrderId = neworder.insertedId;

      const query = { _id: newOrderId };
      const result = await orders.findOne(query);
  
      reply.code(201).send(result)
    })
  
}