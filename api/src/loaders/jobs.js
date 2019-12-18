import config from '../config'

import Agenda from 'agenda'
import SendVerifyJob from '../jobs/verify-account'
import SendVerifiedJob from '../jobs/verified-account'
import SendForgotPasswordJob from '../jobs/forgot-password'
import SendPasswordResetJob from '../jobs/reset-password'

export default (agenda = new Agenda) => {

  agenda.define(
    'send-verify-account-email',
    { priority: 'high', concurrency: config.agenda.concurrency, },
    new SendVerifyJob().handler,
  )

  agenda.define(
    'send-verified-account-email',
    { priority: 'high', concurrency: config.agenda.concurrency, },
    new SendVerifiedJob().handler,
  )

  agenda.define(
    'send-forgot-password-email',
    { priority: 'high', concurrency: config.agenda.concurrency, },
    new SendForgotPasswordJob().handler,
  )

  agenda.define(
    'send-password-reset-email',
    { priority: 'high', concurrency: config.agenda.concurrency, },
    new SendPasswordResetJob().handler,
  )

  agenda.start()
}
