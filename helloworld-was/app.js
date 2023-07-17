const path = require('path');
const AutoLoad = require('@fastify/autoload');


module.exports = async function (fastify, opts) {
  // This loads all plugins defined in plugins
  // define your plugins in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  });
};
