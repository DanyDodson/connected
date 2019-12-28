import mongooseLoader from './mongoose'
import logger from './logger'
import depInjectorLoader from './depInjector'
import jobsLoader from './jobs'
import expressLoader from './express'
import UserModel from '../models/User'
import ProfileModel from '../models/Profile'
import PostModel from '../models/Post'
import CommentModel from '../models/Comment'
import MessageModel from '../models/Message'

export default async ({ expressApp }) => {

  const mongoConnection = await mongooseLoader()
  logger.info('✨ mongodb loaded and connected')

  const userModel = { name: 'userModel', model: UserModel }
  const profileModel = { name: 'profileModel', model: ProfileModel }
  const postModel = { name: 'postModel', model: PostModel }
  const commentModel = { name: 'commentModel', model: CommentModel }
  const messageModel = { name: 'messageModel', model: MessageModel }

  const { agenda } = await depInjectorLoader({
    mongoConnection,
    models: [userModel, profileModel, postModel, commentModel, messageModel],
  })

  logger.info('✨ dependency injector loaded')

  await jobsLoader(agenda)
  logger.info('✨ agenda jobs loaded')

  await expressLoader({ app: expressApp })
  logger.info('✨ express setup and loaded')
}
