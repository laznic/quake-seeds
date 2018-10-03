'use strict'

module.exports = [
  {
    type: 'onPreResponse',
    method: (request, h) => {

      const response = request.response
      if (response.isBoom &&
          response.output.statusCode === 404) {

        return h.view('index', { title: 'Quake Seeds - 404' }, { layout: '404' }).code(404)
      }

      return h.continue
    }
  }
]
