import config from './config'
import logger from './loaders/logger'
import expressApp from './loaders'
import express from 'express'
const app = express()

const startServer = async () => {
  await expressApp({ expressApp: app })

  app.listen(config.api.port, () => {
    logger.info(`✌️ ${process.env.NODE_ENV} server port: ${config.api.port}`)
  })

}

startServer()