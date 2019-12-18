import mongooseLoader from './mongoose'
import depInjectorLoader from './depInjector'
import expressLoader from './express'
import jobsLoader from './jobs'
import logger from './logger'
import './events'

export default async ({ expressApp }) => {

  const mongoConnection = await mongooseLoader()
  logger.info('✌️ mongodb loaded and connected')

  const { agenda } = await depInjectorLoader(mongoConnection)
  logger.info('✌️ dependency injector loaded')

  await jobsLoader(agenda)
  logger.info('✌️ agenda jobs loaded')

  await expressLoader({ app: expressApp })
  logger.info('✌️ express setup and loaded')
}
