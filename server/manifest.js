'use strict'

const Dotenv = require('dotenv')
const Confidence = require('confidence')
const Toys = require('toys')

// Pull .env into process.env
Dotenv.config({ path: `${__dirname}/.env` })

// Glue manifest as a confidence store
module.exports = new Confidence.Store({
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 5000,
    debug: {
      $filter: 'NODE_ENV',
      development: {
        log: ['error', 'implementation', 'internal'],
        request: ['error', 'implementation', 'internal']
      }
    },
    routes: {
      security: true,
      cors: true
    }
  },
  register: {
    plugins: [
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
        plugin: '../lib', // Main plugin
        options: {}
      },
      {
        plugin: {
          $filter: 'NODE_ENV',
          $default: 'hpal-debug',
          production: Toys.noop
        }
      }
    ]
  }
})
