import { Container } from 'typedi'
import mailgun from 'mailgun-js'
import agendaFactory from './agenda'
import loggerInstance from './logger'
import config from '../config'

export default ({ mongoConnection, models }) => {
  try {
    models.forEach(m => Container.set(m.name, m.model))

    const agendaInstance = agendaFactory({ mongoConnection })

    Container.set('agendaInstance', agendaInstance)
    Container.set('logger', loggerInstance)

    Container.set('emailClient', mailgun({
      apiKey: config.mailgun.apiKey,
      domain: config.mailgun.domain
    }))

    loggerInstance.info('✨  agenda injected into container')

    return { agenda: agendaInstance }

  } catch (e) {
    loggerInstance.error('❌ error on dependency injector loader: %o', e)
    throw e
  }
}