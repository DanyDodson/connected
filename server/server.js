const express = require('express')
const config = require('config')
const secret = config.get('app.secret')
const session = require('express-session')
const connectDB = require('./config/dbconfig')
const errors = require('errorhandler')
const logs = require('./logs/logger')
const logdb = require('./logs/logdb')
const log = require('./logs/log')
const methods = require('methods')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const app = express()

const prod = process.env.NODE_ENV === 'production'

connectDB()
app.use(cors())
app.use(logs())
app.use(express.json())
app.use(require('method-override')())
app.use(express.static(__dirname + '/public'))

app.use(session({
    secret: secret,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
}))

if (!prod) app.use(errors())

require('./models/User')
require('./models/Artist')
require('./models/Comment')
require('./models/Post')
require('./models/Message')

require('./routes/auth/local')

app.get('/api', (req, res, next) => {
    fs.readFile('docs/routes.json', (err, data) => {
        if (err) res.status(400).json({ err: err })
        const docs = JSON.parse(data)
        res.json(docs)
    })
})

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

app.listen(PORT, () => log.exp(`[express] running on port ${PORT} ✔️`))