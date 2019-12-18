import cors from 'cors'
import express from 'express'
import path from 'path'
import session from 'express-session'
import config from '../config'
import routes from '../api'
import errors from '../middleware/errors'

export default ({ app: app }) => {

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

  require('../auth/passport')

  app.use(config.api.prefix, routes())

  app.use(errors.notFound)
  app.use(errors.unauthErrors)
  app.use(errors.serverErrors)
}