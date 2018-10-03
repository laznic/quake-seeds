'use strict'

module.exports = [
  {
    method: 'GET',
    path: '/seeds',
    handler: (request, h) => {

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
  },
  {
    method: 'GET',
    path: '/seeds/refresh',
    handler: (request, h) => {

      const tournamentId = request.yar.get('tournamentId')
      const redirectURI = `/api/battlefy/${tournamentId}`

      request.yar.clear('tournamentUrl')

      return h.redirect(redirectURI)
    }
  }
]
