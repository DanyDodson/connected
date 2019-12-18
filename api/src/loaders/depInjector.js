import config from '../config'
import loggerInstance from './logger'
import agendaFactory from './agenda'
import { Container } from 'typedi'
import mailgun from 'mailgun-js'

import User from '../models/User'
import Profile from '../models/Profile'
import Post from '../models/Post'
import Comment from '../models/Comment'
import Message from '../models/Message'

export default (mongoConnection) => {
  try {
    Container.set('userModal', User)
    Container.set('profileModal', Profile)
    Container.set('postModal', Post)
    Container.set('commentModal', Comment)
    Container.set('messageModal', Message)

    const agendaInstance = agendaFactory(mongoConnection)

    Container.set('agendaInstance', agendaInstance)
    Container.set('logger', loggerInstance)
    Container.set('emailClient', mailgun({ apiKey: config.mailgun.apiKey, domain: config.mailgun.domain }))

    loggerInstance.info('✌️ agenda injected into container')

    return { agenda: agendaInstance }

  } catch (e) {
    loggerInstance.error('❌ Error on dependency injector loader: %o', e)
    throw e
  }
}