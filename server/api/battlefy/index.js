const Wreck = require('wreck')

const initialRoutes = function (server, options) {

    server.route({
      method: 'GET',
      path: '/battlefy/{id*}',
      handler: async function(request, h) {
        let url = ''

        if (~request.params.id.indexOf('http')) {
          const idRegexp = /([a-zA-Z0-9]{24})(?:|$)/g
          const id = request.params.id.match(idRegexp)[0]

          url = 'https://api.battlefy.com/tournaments/' + id

        } else {
          url = 'https://api.battlefy.com/tournaments/' + request.params.id
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
          await request.yar.set('checkInWarning', shouldShowCheckInWarning)

          return h.redirect('/api/seeds')

        } catch (err) {
          return err
        }
      }
    })
}


exports.plugin = {
  register: initialRoutes,
  name: 'battlefy'
}
