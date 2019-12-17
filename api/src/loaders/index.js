const mongooseLoader = require('./mongoose')
const agendaLoader = require('./agenda')
const expressLoader = require('./express')
const logger = require('./logger')

const expressApp = async (app) => {

  await mongooseLoader()
  logger.info(`✌️ mongodb loaded and connected!`)

  await expressLoader()
  logger.info(`✌️ express setup and loaded!`)
}

module.exports = expressApp