import { Container } from 'typedi'
import MailerService from '../services/mailer'

export default class sendForgotPasswordJob {

  async handler (job, done) {
    const logger = Container.get('logger')

    try {

      logger.debug('✔️ send forgot password job triggered')

      const { email, client, resetPassToken } = job.attrs.data
      const mailerServiceInstance = Container.get(MailerService)
      await mailerServiceInstance.sendForgotPasswordEmail(email, client, resetPassToken)

      logger.debug('✔️ send forgot password job finished')

      done()
    } catch (e) {
      logger.error('❌ error with send forgot password job: %o', e)
      done(e)
    }
  }
}