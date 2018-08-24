const Wreck = require('wreck')
const Promise = require('bluebird')
const { sort, descend, prop } = require('ramda')

const initialRoutes = function (server, options) {

    server.route({
      method: 'GET',
      path: '/seeds',
      handler: async function(request, h) {
        const players = request.yar.get('players')
        const playerRatings = players.map(async player => {
          const promise = Wreck.get('https://stats.quake.com/api/v2/Player/Stats?name=' + player)

          try {
            const { payload } = await promise
            const playerData = JSON.parse(payload.toString())
            return { name: player, rating: playerData.playerRatings.duel.rating }

          } catch (err) {
            return { name: player, rating: 0 }
          }
        })

        return await Promise.all(playerRatings).then(values => sort(descend(prop('rating')), values))
      }
    })
}


exports.plugin = {
  register: initialRoutes,
  name: 'seeds'
}
