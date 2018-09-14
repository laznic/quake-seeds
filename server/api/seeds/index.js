const Wreck = require('wreck')
const Promise = require('bluebird')
const { sort, descend, prop, mean, pluck } = require('ramda')

const initialRoutes = function (server, options) {

    server.route({
      method: 'GET',
      path: '/seeds',
      handler: async function(request, h) {
        const players = request.yar.get('players')
        const teams = request.yar.get('teams')
        const isDuel = request.yar.get('isDuel')

        if (isDuel) {
          const playerRatings = players.map(async player => {
            const promise = Wreck.get('https://stats.quake.com/api/v2/Player/Stats?name=' + encodeURIComponent(player.name))

            try {
              const { payload } = await promise
              const playerData = JSON.parse(payload.toString())
              return { ...player, rating: playerData.playerRatings.duel.rating }

            } catch (err) {
              const retryWithSpaceAtEnd = Wreck.get('https://stats.quake.com/api/v2/Player/Stats?name=' + encodeURIComponent(player.name) + '%20')

              const { payload } = await retryWithSpaceAtEnd
              const playerData = JSON.parse(payload.toString())

              return { ...player, rating: playerData.playerRatings ? playerData.playerRatings.duel.rating : 0, url: player.url + '%20' }
            }
          })

          const seeds = await Promise.all(playerRatings).then(values => sort(descend(prop('rating')), values))
          await request.yar.set('seeds', seeds)

        } else {
          const teamRatings =  teams.map(async team => {
            const playerRatings = team.players.map(async player => {
              const promise = Wreck.get('https://stats.quake.com/api/v2/Player/Stats?name=' + player.name)

              try {
                const { payload } = await promise
                const playerData = JSON.parse(payload.toString())

                if (playerData.playerRatings.tdm && playerData.playerRatings.tdm.rating > playerData.playerRatings.duel.rating)
                  return { ...player, rating: playerData.playerRatings.tdm.rating }
                else
                  return { ...player, rating: playerData.playerRatings.duel.rating }

              } catch (err) {
                const retryWithSpaceAtEnd = Wreck.get('https://stats.quake.com/api/v2/Player/Stats?name=' + player.name + '%20')

                const { payload } = await retryWithSpaceAtEnd
                const playerData = JSON.parse(payload.toString())

                if (!playerData.playerRatings)
                  return { ...player, rating: 0, url: player.url + '%20' }
                else if (playerData.playerRatings.tdm && playerData.playerRatings.tdm.rating > playerData.playerRatings.duel.rating)
                  return { ...player, rating: playerData.playerRatings.tdm.rating, url: player.url + '%20' }
                else
                  return { ...player, rating: playerData.playerRatings.duel.rating, url: player.url + '%20' }

              }
            })

            return await Promise.all(playerRatings).then(values => {
              return {
                ...team,
                rating: values.length ? mean(pluck('rating', values)) : 0
              }
            })
          })

          const seeds = await Promise.all(teamRatings).then(values => sort(descend(prop('rating')), values))
          await request.yar.set('seeds', seeds)
        }

        request.yar.clear('players')
        request.yar.clear('teams')

        return h.redirect('/seeds')
      }
    })
}


exports.plugin = {
  register: initialRoutes,
  name: 'seeds-api'
}
