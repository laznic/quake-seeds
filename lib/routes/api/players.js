'use strict'

const Wreck = require('wreck')
const Promise = require('bluebird')
const { sort, descend, prop } = require('ramda')

module.exports = {
  method: 'GET',
  path: '/api/players',
  handler: async (request, h) => {

    let players = Array.isArray(request.query.name) ? request.query.name : [request.query.name]

    if (players) {
      players = players.map(player => ({ name: encodeURIComponent(player), url: 'https://stats.quake.com/profile/' + encodeURIComponent(player) }))

      const playerRatings = players.map(async player => {

        const promise = Wreck.get('https://stats.quake.com/api/v2/Player/Stats?name=' + player.name)

        try {
          const { payload } = await promise
          const playerData = JSON.parse(payload.toString())

          return { ...player, rating: playerData.playerRatings.duel.rating }

        } catch (err) {

          if (!err.data) {
            const retryWithSpaceAtEnd = Wreck.get('https://stats.quake.com/api/v2/Player/Stats?name=' + player.name + '%20')

            const { payload } = await retryWithSpaceAtEnd
            const playerData = JSON.parse(payload.toString())

            return { ...player, rating: playerData.playerRatings ? playerData.playerRatings.duel.rating : 0, url: player.url + '%20' }

          }

          return { ...player, rating: 0, url: player.url }
        }
      })

      const seeds = await Promise.all(playerRatings).then(values => sort(descend(prop('rating')), values))
      request.yar.set('seeds', seeds)
      request.yar.set('isDuel', true)
      request.yar.set('fromPlayers', true)
    }

    return h.redirect('/seeds')
  }
}
