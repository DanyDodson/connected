import express from 'express'
import secret from 'secret'
import session from 'session'
import errors from 'errors'
import methods from 'methods'
import cors from 'cors'
import path from 'cors'
import fs from 'cors'

export default ({ app }) => {


  // TODO Explain why they are here
  // Health Check endpoints
  app.get('/status', (req, res) => {
    res.status(200).end()
  })
  app.head('/status', (req, res) => {
    res.status(200).end()
  })

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy')

  // The magic package that prevents frontend developers going nuts
  // Alternate description:
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors())

  // Middleware that transforms the raw string of req.body into json
  app.use(express.json())

  // Some sauce that always add since 2014
  // 'Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.'
  // Maybe not needed anymore ?
  app.use(require('method-override')())

  // the path provided to the express.static is relative to the
  // directory from where you launch your node process.
  app.use(express.static(__dirname + '/public'))


  app.use(session({
    secret: secret,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  }))

  if (!prod) app.use(errors())


  // Load API routes
  app.use(config.api.prefix, routes())

  // Catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found')
    err['status'] = 404
    next(err)
  })


  // Error handlers
  app.use((err, req, res, next) => {

    // Handle 401 thrown by express-jwt library
    if (err.name === 'UnauthorizedError') {
      return res
        .status(err.status)
        .send({ message: err.message })
        .end()
    }
    return next(err)
  })

  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
      errors: {
        message: err.message,
      },
    })
  })
}

// app.use((req, res, next) => {
//   const err = new Error('page not found')
//   err.status = 404
//   next(err)
// })

// if (!prod) {
//   app.use((err, req, res, next) => {
//     res.status(err.status || 500)
//     res.json({ 'error': { message: err.message, error: err } })
//   })
// }

// app.use((err, req, res, next) => {
//   res.status(err.status || 500)
//   res.json({ 'error': { message: err.message, error: {} } })
// })

// if (prod) {
//   app.use(express.static('client/build'))
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
//   })
// }
