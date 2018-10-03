'use strict'

const Handlebars = require('handlebars')

module.exports = (server, options) => ({
  engines: {
    html: Handlebars
  },
  relativeTo: __dirname,
  path: 'templates/partials',
  layout: 'default',
  layoutPath: 'templates'
})
