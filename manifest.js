const Handlebars = require('handlebars')
require('dotenv').config()

const manifest = {
    server: {
      port: process.env.PORT || 5000,
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
              password: process.env.COOKIE_PASSWORD,
              isSecure: process.env.NODE_ENV !== 'development',
              isHttpOnly: process.env.NODE_ENV === 'development'
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
            path: 'templates/partials',
            layout: 'default',
            layoutPath: 'templates'
          }
        },
        {
          plugin: './server/web/index',
        },
        {
          plugin: './server/web/seeds/index',
        },
        {
          plugin: './server/api/battlefy/index',
          routes: { prefix: '/api' }
        },
        {
          plugin: './server/api/seeds/index',
          routes: { prefix: '/api' }
        },
        {
          plugin: './server/api/players/index',
          routes: { prefix: '/api' }
        }
      ]
    }
}

module.exports = manifest
