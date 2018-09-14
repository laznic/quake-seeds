'use strict'

const initialRoutes = function (server, options) {

    server.route({
      method: 'GET',
      path: '/seeds',
      handler: function(request, h) {
        const seeds = request.yar.get('seeds') || []
        const checkInWarning = request.yar.get('checkInWarning')
        const fromPlayers = request.yar.get('fromPlayers')
        const renderPartial = fromPlayers ? 'players-seeds' : 'battlefy-seeds'
        const isDuel = request.yar.get('isDuel')

        request.yar.clear('seeds')
        request.yar.clear('checkInWarning')
        request.yar.clear('fromPlayers')
        request.yar.clear('isDuel')

        return h.view(renderPartial, { title: 'Quake Seeds - Seedings', seeds, checkInWarning, fromPlayers, isDuel })
      }
    })
}


exports.plugin = {
  register: initialRoutes,
  name: 'seeds-web'
}
