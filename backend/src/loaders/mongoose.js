const mongoose = require('mongoose')
const logger = require('./logger')
const config = require('../config')

let db
if (process.env.NODE_ENV === 'development') db = config.mongo.development
if (process.env.NODE_ENV === 'test') db = config.mongo.testing
if (process.env.NODE_ENV === 'production') db = config.mongo.production

const mongooseLoader = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
  } catch (err) {
    logger.error(err.message)
    process.exit(1)
  }
}

module.exports = mongooseLoader 
