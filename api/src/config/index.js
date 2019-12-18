process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const envFound = require('dotenv').config()

if (!envFound) {
  throw new Error('[error] ⚠️ Couldn\'t find .env file ⚠️')
}

export default {
  api: {
    prefix: '/api',
    port: parseInt(process.env.PORT, 10),
  },
  url: {
    api: process.env.BASE_URL,
    client: process.env.BASE_URL_CLIENT
  },
  mongo: {
    development: `${process.env.MONGODB_DEVELOPMENT_URI}`,
    testing: process.env.MONGODB_TESTING_URI,
    production: process.env.MONGODB_PRODUCTION_URI,
  },
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  jwtSecret: `${process.env.JWT_SECRET}`,
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
  agendash: {
    user: process.env.AGENDASH_USER,
    password: process.env.AGENDASH_PASSWORD,
  }
}
