const express = require('express')
const session = require('express-session')
const errors = require('../api/middleware/errors')
const config = require('../config')
const logger = require('./logger')
const routes = require('../api')
const path = require('path')
const cors = require('cors')
const app = express()

// const Honeybadger = require('honeybadger').configure({ apiKey: '70c65e55' })

const expressLoader = () => {

  // Use *before* all other app middleware.
  // app.use(Honeybadger.requestHandler)

  app.get('/status', (req, res) => res.status(200).end())

  app.head('/status', (req, res) => res.status(200).end())

  app.enable('trust proxy')
  app.use(cors())
  app.use(require('method-override')())
  app.use(express.json())
  app.use(express.static(path.join(__dirname, '/public')))

  app.use(session({
    secret: config.jwtSecret,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  }))

  require('../models/User')
  require('../models/Post')
  require('../models/Profile')
  require('../models/Comment')
  require('../models/Message')

  require('../services/passport')

  app.use(config.api.prefix, routes)

  app.listen(config.port, () => {
    logger.info(`✌️ server listening on port: ${config.port}!`)
  })

  app.use(errors.notFound)
  app.use(errors.unauthErrors)
  app.use(errors.serverErrors)

  // Use *after* all other app middleware.
  // app.use(Honeybadger.errorHandler)

}

module.exports = expressLoader