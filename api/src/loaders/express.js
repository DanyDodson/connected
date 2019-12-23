import cors from 'cors'
import express from 'express'
import path from 'path'
import session from 'express-session'
// import passport from 'passport'
import config from '../config'
import routes from '../routes'
import errors from '../middleware/errors'

export default ({ app: app }) => {

  app.get('/status', (req, res) => res.status(200).end())

  app.head('/status', (req, res) => res.status(200).end())

  app.use(cors())
  app.enable('trust proxy')
  app.use(require('method-override')())

  app.use(express.json())
  app.use(express.static(path.join(__dirname, '/public')))

  app.use(session({
    secret: config.jwtSecret,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  }))

  // app.use(passport.initialize())

  require('../auth')

  app.use(config.apiPrefix, routes())

  // Server static assets if in production
  if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('../../../client/build'))

    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../../../client', 'build', 'index.html'))
    })
  }

  app.use(errors.notFound)
  app.use(errors.unauthErrors)
  app.use(errors.serverErrors)
}