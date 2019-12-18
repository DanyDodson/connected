import Agenda from 'agenda'
import SendVerifyJob from '../jobs/verify-account-mail'
import config from '../config'

export default (agenda = new Agenda) => {
  agenda.define(
    'send-verify-account-email',
    { priority: 'high', concurrency: config.agenda.concurrency, },
    new SendVerifyJob().handler,
  )
  agenda.start()
}
