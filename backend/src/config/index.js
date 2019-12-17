process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const envFound = require('dotenv').config()

if (!envFound) {
  throw new Error('[error] ⚠️ Couldn\'t find .env file ⚠️')
}

module.exports = {
  api: {
    prefix: '/api',
  },

  url: {
    api: process.env.API_BASE,
    client: process.env.CLIENT_BASE
  },

  port: parseInt(process.env.PORT, 10),

  mongoURL: process.env.MONGODB_URI,

  jwtSecret: process.env.JWT_SECRET,

  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  mailgun: {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  },

  agenda: {
    dbCollection: process.env.AGENDA_DB_COLLECTION,
    pooltime: process.env.AGENDA_POOL_TIME,
    concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10),
  }
}
