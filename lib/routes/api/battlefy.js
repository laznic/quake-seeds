'use strict'

const Wreck = require('wreck')

module.exports = [
  {
    method: 'GET',
    path: '/api/battlefy/{id*}',
    handler: async (request, h) => {

      let url = ''

      if (~request.params.id.indexOf('http')) {
        const idRegexp = /([a-zA-Z0-9]{24})(?:|$)/g
        const id = request.params.id.match(idRegexp)[0]

        url = 'https://api.battlefy.com/tournaments/' + id
        request.yar.set('tournamentId', id)

      } else {
        url = 'https://api.battlefy.com/tournaments/' + request.params.id
        request.yar.set('tournamentId', request.params.id)
      }

      const getTournament = Wreck.get(url)
      const getPlayers = Wreck.get(url + '/teams')

      try {
        const { payload: playersResult } = await getPlayers
        const players = JSON.parse(playersResult.toString()).map(player => ({ name: player.name, checkedInAt: player.checkedInAt, url: 'https://stats.quake.com/profile/' + encodeURIComponent(player.name) }))
        await request.yar.set('players', players)

        const { payload: tournamentResult } = await getTournament
        const tournament = JSON.parse(tournamentResult.toString())
        const checkInStart = new Date(tournament.checkInStartTime).valueOf()
        const checkInEnd = new Date(tournament.startTime).valueOf()
        const currentTime = new Date().valueOf()

        const shouldShowCheckInWarning = currentTime >= checkInStart && currentTime < checkInEnd
        request.yar.set('checkInWarning', shouldShowCheckInWarning)
        request.yar.set('isDuel', true)

        return h.redirect('/api/seeds')

      } catch (err) {
        return err
      }
    }
  },
  {
    method: 'GET',
    path: '/api/battlefy/2v2/{id*}',
    handler: async (request, h) => {

      let url = ''

      if (~request.params.id.indexOf('http')) {
        const idRegexp = /([a-zA-Z0-9]{24})(?:|$)/g
        const id = request.params.id.match(idRegexp)[0]

        url = 'https://api.battlefy.com/tournaments/' + id
        request.yar.set('tournamentId', '2v2/' + id)

      } else {
        url = 'https://api.battlefy.com/tournaments/' + request.params.id
        request.yar.set('tournamentId', '2v2/' + request.params.id)
      }

      const getTournament = Wreck.get(url)
      const getTeams = Wreck.get(url + '/teams')

      try {
        const { payload: teamsResult } = await getTeams
        const teams = JSON.parse(teamsResult.toString()).map(team => ({
          name: team.name,
          players: team.players.map(player => ({ name: player.inGameName, url: 'https://stats.quake.com/profile/' + encodeURIComponent(player.inGameName) })),
          checkedInAt: team.checkedInAt
        }))
        await request.yar.set('teams', teams)

        const { payload: tournamentResult } = await getTournament
        const tournament = JSON.parse(tournamentResult.toString())
        const checkInStart = new Date(tournament.checkInStartTime).valueOf()
        const checkInEnd = new Date(tournament.startTime).valueOf()
        const currentTime = new Date().valueOf()

        const shouldShowCheckInWarning = currentTime >= checkInStart && currentTime < checkInEnd
        request.yar.set('checkInWarning', shouldShowCheckInWarning)
        request.yar.set('isDuel', false)

        return h.redirect('/api/seeds')

      } catch (err) {
        return err
      }
    }
  }
]
