'use strict'

const Wreck = require('wreck')
const Promise = require('bluebird')
const { sort, descend, prop, mean, pluck } = require('ramda')

module.exports = {
  method: 'GET',
  path: '/api/teams',
  handler: async (request, h) => {

    const teams = Object.keys(request.query).map(key => {

      return {
        name: key,
        players: request.query[key].split(',').map(player => ({ name: encodeURIComponent(player), url: 'https://stats.quake.com/profile/' + encodeURIComponent(player) }))
      }
    })

    if (teams) {
      const teamRatings = teams.map(async team => {

        const playerRatings = team.players.map(async player => {

          const promise = Wreck.get('https://stats.quake.com/api/v2/Player/Stats?name=' + player.name)

          try {
            const { payload } = await promise
            const playerData = JSON.parse(payload.toString())

            if (playerData.playerRatings.tdm && playerData.playerRatings.tdm.rating > playerData.playerRatings.duel.rating) {
              return { ...player, rating: playerData.playerRatings.tdm.rating }
            }

            return { ...player, rating: playerData.playerRatings.duel.rating }

          } catch (err) {
            if (!err.data) {
              const retryWithSpaceAtEnd = Wreck.get('https://stats.quake.com/api/v2/Player/Stats?name=' + player.name + '%20')

              const { payload } = await retryWithSpaceAtEnd
              const playerData = JSON.parse(payload.toString())

              if (playerData.playerRatings.tdm && playerData.playerRatings.tdm.rating > playerData.playerRatings.duel.rating) {
                return { ...player, rating: playerData.playerRatings ? playerData.playerRatings.tdm.rating : 0, url: player.url + '%20' }
              }

              return { ...player, rating: playerData.playerRatings ? playerData.playerRatings.duel.rating : 0, url: player.url + '%20' }
            }

            return { ...player, rating: 0, url: player.url }
          }
        })

        return await Promise.all(playerRatings).then(values =>  {

          return {
            ...team,
            rating: mean(pluck('rating', values))
          }
        })
      })

      const seeds = await Promise.all(teamRatings).then(values => sort(descend(prop('rating')), values))
      request.yar.set('seeds', seeds)
      request.yar.set('isDuel', false)
      request.yar.set('fromPlayers', true)
    }

    return h.redirect('/seeds')
  }
}
