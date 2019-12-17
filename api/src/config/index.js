const envFound = require('dotenv').config()

if (!envFound) {
  throw new Error('[error] ⚠️ Couldn\'t find .env file ⚠️')
}

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = {

  api: {
    prefix: '/api',
    port: parseInt(process.env.PORT, 10),
  },

  url: {
    api: process.env.BASE_URL,
    client: process.env.BASE_URL_CLIENT
  },

  mongo: {
    testing: process.env.MONGODB_TESTING_URI,
    development: process.env.MONGODB_DEVELOPMENT_URI,
    production: process.env.MONGODB_PRODUCTION_URI,
  },

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
