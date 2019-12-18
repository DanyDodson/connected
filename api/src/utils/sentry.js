// const express = require('express')
// const router = express.Router()

// const Sentry = require('@sentry/node')

// Sentry.init({ dsn: process.env.SENTRY_DNS })

// app.use(Sentry.Handlers.requestHandler())
// app.get('/', function rootHandler (req, res) { res.end('Hello world!') })

// app.use(function onError (err, req, res, next) {
//   res.statusCode = 500
//   res.end(res.sentry + "\n")
// })

// app.use(Sentry.Handlers.errorHandler())

// app.use(Sentry.Handlers.requestHandler({
//   serverName: false,
//   user: ['email']
// }))

// app.use(Sentry.Handlers.errorHandler({
//   shouldHandleError (error) {
//     // Capture all 404 and 500 errors
//     if (error.status === 404 || error.status === 500) {
//       return true
//     }
//     return false
//   }
// }))

// module.exports = router