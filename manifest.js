'use strict'

const Handlebars = require('handlebars')

const manifest = {
    server: {
      port: 4000,
      debug: {
        request: ['error']
      },
      routes: {
        security: true,
        cors: true
      }
    },
    register: {
      plugins: [
        {
          plugin: 'inert'
        },
        {
          plugin: 'vision',
          options: {
            engines: {
              html: Handlebars
            },
            relativeTo: __dirname,
            path: 'templates'
          }
        },
        {
          plugin: './server/web/index',
        }
      ]
    }
}

module.exports = manifest