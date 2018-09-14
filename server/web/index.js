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
              title: 'Quake Seeds - Duel',
              isDuel: true
            }
          }
        }
      },
      {
        method: 'GET',
        path: '/2v2',
        handler: {
          view: {
            template: 'index',
            context: {
              title: 'Quake Seeds - TDM',
              isDuel: false
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

    server.ext('onPreResponse', (request, h) => {

      const response = request.response
      if (response.isBoom &&
          response.output.statusCode === 404) {

          return h.view('index', { title: 'Quake Seeds - 404' }, { layout: '404' }).code(404)
      }

      return h.continue;
  });
}


exports.plugin = {
  register: initialRoutes,
  name: 'web'
}
