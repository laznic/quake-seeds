const Wreck = require('wreck')
const Promise = require('bluebird')
const { sort, descend, prop } = require('ramda')

const initialRoutes = function (server, options) {

    server.route({
      method: 'GET',
      path: '/seeds',
      handler: async function(request, h) {
        const players = request.yar.get('players')

        if (players) {
          const playerRatings = players.map(async player => {
            const promise = Wreck.get('https://stats.quake.com/api/v2/Player/Stats?name=' + player.name)

            try {
              const { payload } = await promise
              const playerData = JSON.parse(payload.toString())
              return { ...player, rating: playerData.playerRatings.duel.rating }

            } catch (err) {
              return { ...player, rating: 0 }
            }
          })

          const seeds =  await Promise.all(playerRatings).then(values => sort(descend(prop('rating')), values))

          request.yar.set('seeds', seeds)

        }

        request.yar.clear('players')
        return h.redirect('/seeds')
      }
    })
}


exports.plugin = {
  register: initialRoutes,
  name: 'seeds-api'
}
