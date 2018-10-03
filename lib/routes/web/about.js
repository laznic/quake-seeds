'use strict'

module.exports = {
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
}
