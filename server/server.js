const express = require('express')
const session = require('express-session')
const config = require('config')
const secret = config.get('app.secret')
const connectDB = require('./config/dbconfig')
const mongoose = require('mongoose')
const mongooselogs = require('./logs/mongoose')
const logger = require('./logs/logger.js')
const errorhandler = require('errorhandler')
const logs = require('./logs/chalk')
const methods = require('methods')
const path = require('path')
const cors = require('cors')
const app = express()

const prod = process.env.NODE_ENV === 'production'

connectDB()

app.use(cors())
app.use(logger())
app.use(express.json())
app.use(require('method-override')())
app.use(express.static(__dirname + '/public'))

app.use(session({
    secret: secret,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,

    // signed: true,
    // httpOnly: true,
}))

if (!prod) app.use(errorhandler())

require('./models/User')
require('./models/Profile')
require('./models/Comment')
require('./models/Post')
require('./models/Message')

require('./routes/auth/passport')

app.use(require('./routes'))

app.use((req, res, next) => {
    const err = new Error('page not found')
    err.status = 404
    next(err)
})

if (!prod) {
    app.use((err, req, res, next) => {
        res.status(err.status || 500)
        res.json({ 'error': { message: err.message, error: err } })
    })
}

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({ 'error': { message: err.message, error: {} } })
})

if (prod) {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = process.env.PORT || 5025

app.listen(PORT, () => logs.exp(`[express] running on port ${PORT} ✔️`))