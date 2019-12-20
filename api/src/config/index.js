/* eslint-disable no-undef */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const envFound = require('dotenv').config()

if (!envFound) {
  throw new Error('[error] ⚠️ Couldn\'t find .env file')
}

export default {

  apiPrefix: '/api',

  port: parseInt(process.env.PORT, 10),

  env: process.env.NODE_ENV,

  jwtSecret: `${process.env.JWT_SECRET}`,

  url: {
    api: process.env.BASE_URL,
    client: process.env.BASE_URL_CLIENT
  },

  mongo: {
    development: process.env.MONGO_DEVELOPMENT_URI,
    testing: process.env.MONGO_TESTING_URI,
    production: process.env.MONGO_PRODUCTION_URI,
  },

  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  newRelic: {
    appName: process.env.NEW_RELIC_APP_NAME,
    liscense: process.env.NEW_RELIC_LICENSE_KEY,
  },

  mailgun: {
    apiKey: `${process.env.MAILGUN_API_KEY}`,
    domain: `${process.env.MAILGUN_DOMAIN}`,
    name: `${process.env.MAILGUN_SMTP_NAME}`,
  },

  agenda: {
    collection: process.env.AGENDA_DB_COLLECTION,
    name: process.env.AGENDA_NAME,
    pooltime: process.env.AGENDA_POOL_TIME,
    concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10),
  },
}
