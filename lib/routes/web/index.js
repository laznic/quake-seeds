'use strict'

module.exports = {
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
}
