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
          plugin: 'yar',
          options: {
            name: 'quake-seeds',
            cache: {
              expiresIn: 24 * 60 * 60 * 1000
            },
            storeBlank: false,
            cookieOptions: {
              password: 'thisIsMeTestingThisCookieLongPassword',
              isSecure: false,
              isSameSite: false,
              isHttpOnly: true
            }
          }
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
        },
        {
          plugin: './server/api/battlefy/index',
          routes: { prefix: '/api' }
        },
        {
          plugin: './server/api/seeds/index',
          routes: { prefix: '/api' }
        }
      ]
    }
}

module.exports = manifest