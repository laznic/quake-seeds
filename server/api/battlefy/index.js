'use strict'

const puppeteer = require('puppeteer')
const Wreck = require('wreck')

const initialRoutes = function (server, options) {

    server.route({
      method: 'GET',
      path: '/battlefy',
      handler: async function(request, h) {
        let url = ''

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setRequestInterception(true)
        page.on('request', req => {
          if (req.resourceType() === 'xhr' && req.url().includes('cloudfront.net/tournaments') && req.url().includes('teams-count')) {
            url = req.url().replace('teams-count', 'teams')
          }

          req.continue();
        })
        await page.goto('https://battlefy.com/quake/quake-champions-community-tournament-amateur-duel-eu-2/5b33baaa14237c03994f7ccf/participants');

        await browser.close();
        const promise = Wreck.get(url)

        try {
          const { payload } = await promise
          const players = JSON.parse(payload.toString()).map(player => player.name)
          request.yar.set('players', players)
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
