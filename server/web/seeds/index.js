'use strict'

const initialRoutes = function (server, options) {

    server.route({
      method: 'GET',
      path: '/seeds',
      handler: function(request, h) {
        const seeds = request.yar.get('seeds') || []
        const checkInWarning = request.yar.get('checkInWarning')
        const fromPlayers = request.yar.get('fromPlayers')
        let renderPartial = fromPlayers ? 'players-seeds' : 'battlefy-seeds'

        request.yar.clear('seeds')
        request.yar.clear('checkInWarning')
        request.yar.clear('fromPlayers')

        return h.view(renderPartial, { title: 'Quake Seeds - Seedings', seeds, checkInWarning, fromPlayers })
      }
    })
}


exports.plugin = {
  register: initialRoutes,
  name: 'seeds-web'
}
