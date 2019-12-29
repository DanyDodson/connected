import config from './config'
import logger from './loaders/logger'
import expressApp from './loaders'
import express from 'express'

const app = express()
const env = config.app.env
const port = config.app.port

const startServer = async () => {

  await expressApp({ expressApp: app })

  app.listen(port, () => {
    logger.info(`✌  ${env} server listening on port ${port}`)
  })

}

startServer()