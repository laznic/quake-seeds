'use strict'

module.exports = {
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
}
