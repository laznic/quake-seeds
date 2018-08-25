const Wreck = require('wreck')
const Promise = require('bluebird')
const { sort, descend, prop } = require('ramda')

const initialRoutes = function (server, options) {

    server.route({
      method: 'GET',
      path: '/seeds',
      handler: function(request, h) {
        const seeds = request.yar.get('seeds')
        return h.view('seeds', { title: 'Seeds', seeds })
      }
    })
}


exports.plugin = {
  register: initialRoutes,
  name: 'seeds-web'
}
