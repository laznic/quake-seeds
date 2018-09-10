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

          url = 'https://api.battlefy.com/tournaments/' + id + '/teams'

        } else {
          url = 'https://api.battlefy.com/tournaments/' + request.params.id + '/teams'
        }

        const promise = Wreck.get(url)

        try {
          const { payload } = await promise
          const players = JSON.parse(payload.toString()).map(player => ({ name: player.name, checkedInAt: player.checkedInAt, url: 'https://stats.quake.com/profile/' + encodeURIComponent(player.name) }))
          await request.yar.set('players', players)
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
