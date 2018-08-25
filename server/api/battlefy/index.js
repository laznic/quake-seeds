const puppeteer = require('puppeteer')
const Wreck = require('wreck')

const initialRoutes = function (server, options) {

    server.route({
      method: 'GET',
      path: '/battlefy/{id*}',
      handler: async function(request, h) {
        let url = ''

        if (~request.params.id.indexOf('http')) {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.setRequestInterception(true)
          page.on('request', req => {
            if (req.resourceType() === 'xhr' && req.url().includes('cloudfront.net/tournaments') && req.url().includes('teams-count')) {
              url = req.url().replace('teams-count', 'teams')
            }

            req.continue();
          })

          await page.goto(request.params.id + '/participants');

          await browser.close();

        } else {
          url = 'https://api.battlefy.com/tournaments/' + request.params.id + '/teams'
        }

        const promise = Wreck.get(url)

        try {
          const { payload } = await promise
          const players = JSON.parse(payload.toString()).filter(player => player.checkedInAt).map(player => player.name)
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
