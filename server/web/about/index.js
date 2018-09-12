'use strict'

const initialRoutes = function (server, options) {

    server.route({
      method: 'GET',
      path: '/about',
      handler: {
        view: {
          template: 'about',
          context: {
            title: 'Quake Seeds - About'
          }
        }
      }
    })
}


exports.plugin = {
  register: initialRoutes,
  name: 'about'
}
