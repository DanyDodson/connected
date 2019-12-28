import { Container } from 'typedi'
import MailerService from '../services/mailer'

export default class SendVerifyEmailJob {

  async handler (job, done) {
    const logger = Container.get('logger')

    try {

      logger.debug('✔️ send verify account job triggered')

      const { email, client, token } = job.attrs.data
      const mailerServiceInstance = Container.get(MailerService)
      await mailerServiceInstance.sendVerifyEmail(email, client, token)

      logger.debug('✔️ send verify account job finished')

      done()
    } catch (e) {
      logger.error('❌ error with send verify account job: %o', e)
      done(e)
    }
  }
}