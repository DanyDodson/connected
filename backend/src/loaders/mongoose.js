const mongoose = require('mongoose')
const logger = require('./logger')
const config = require('../config')

// mongoose.Promise = global.Promise

const mongooseLoader = async () => {
  try {
    await mongoose.connect(config.mongoURL, {
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
