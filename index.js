'use strict';

const Composer = require('./composer');

const startServer = async function() {
  try {
    const server = await Composer()

    await server.start()
    console.log('quake-seeds started on port ' + server.info.port)

  } catch(err) {
    console.error(err)
    process.exit(1)
  }
}

startServer()
