import dotenv from 'dotenv'

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

if (!dotenv.config()) {
  throw new Error('[error] ⚠️ Couldn\'t find .env file')
  // this should crash if .env isnt found
}

export default {

  app: {
    apiPrefix: '/api',
    env: process.env.NODE_ENV,
    port: parseInt(process.env.PORT, 10),
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: Math.floor(Date.now() / 1000) + (60 * 60),
  },

  url: {
    api: process.env.BASE_URL,
    client: process.env.BASE_URL_CLIENT
  },

  agenda: {
    collection: process.env.AGENDA_DB_COLLECTION,
    name: process.env.AGENDA_NAME,
    pooltime: process.env.AGENDA_POOL_TIME,
    concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10),
  },

  mailgun: {
    apiKey: `${process.env.MAILGUN_API_KEY}`,
    domain: `${process.env.MAILGUN_DOMAIN}`,
    name: `${process.env.MAILGUN_SMTP_NAME}`,
  },

  logs: {
    // ...debug, verbose, info, warn, error 
    level: process.env.LOG_LEVEL || 'silly',
  },

  newRelic: {
    appName: process.env.NEW_RELIC_APP_NAME,
    liscense: process.env.NEW_RELIC_LICENSE_KEY,
  },

  mongo: {
    development: process.env.MONGO_DEVELOPMENT_URI,
    testing: process.env.MONGO_TESTING_URI,
    production: process.env.MONGO_PRODUCTION_URI,
  },

}
