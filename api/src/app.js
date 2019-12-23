import config from './config'
import logger from './loaders/logger'
import expressApp from './loaders'
import express from 'express'
const app = express()

const startServer = async () => {

  await expressApp({ expressApp: app })

  app.listen(config.port, () => {
    logger.info(`✌️ ${config.env} server listening on port ${config.port}`)
  })

}

startServer()