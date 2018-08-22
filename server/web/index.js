'use strict'

const initialRoutes = function (server, options) {

    server.route({
      method: 'GET',
      path: '/',
      handler: function(request, h) {
        return h.view('index', {
          title: 'Quake Seeds'
        })
      }
    })
}


exports.plugin = {
  register: initialRoutes,
  name: 'web'
}
