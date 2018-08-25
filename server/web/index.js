'use strict'

const initialRoutes = function (server, options) {

    server.route([
      {
        method: 'GET',
        path: '/',
        handler: {
          view: {
            template: 'index',
            context: {
              title: 'Quake Seeds'
            }
          }
        }
      },
      {
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'static'
            }
        }
      }
    ])
}


exports.plugin = {
  register: initialRoutes,
  name: 'web'
}
