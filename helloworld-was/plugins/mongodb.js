const fp = require('fastify-plugin');
const fastifyMongodb = require('@fastify/mongodb');

let host = process.env.MONGO_HOSTNAME
let user = process.env.MONGO_USERNAME
let passwd = process.env.MONGO_PASSWORD

const urls = `mongodb://${user}:${passwd}@${host}:27017/baedal?authMechanism=DEFAULT&authSource=admin`

module.exports = fp(async function (fastify, opts) {
  fastify.register(fastifyMongodb, {
    url: urls
  }).ready(err => {
    if (err) throw err;
    console.log(host, user,passwd)
    console.log('Connected to MongoDB')
  });

  fastify.addHook('onClose', function (fastify, done) {
    fastify.mongo.close(done);
  });
});