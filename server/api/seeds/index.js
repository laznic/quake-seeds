'use strict'

const puppeteer = require('puppeteer')
const Wreck = require('wreck')

const initialRoutes = function (server, options) {

    server.route({
      method: 'GET',
      path: '/seeds',
      handler: async function(request, h) {
        const players = request.yar.get('players')
        let playerRatings = []

        await players.forEach(async player => {
          const promise = Wreck.get('https://stats.quake.com/api/v2/Player/Stats?name=' + player)
          const { payload } = await promise
          const playerRating = JSON.parse(payload.toString())
          playerRatings.push({ name: player, rating: playerRatings.duel.rating })
        })

        return playerRatings
      }
    })
}


exports.plugin = {
  register: initialRoutes,
  name: 'seeds'
}
