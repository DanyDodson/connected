import { Container } from 'typedi'
import MailerService from '../services/mailer'

export default class SendPasswordResetJob {

  async handler (job, done) {
    const logger = Container.get('logger')

    try {

      logger.debug('✔️ send password reset job triggered')

      const { email } = job.attrs.data
      const mailerServiceInstance = Container.get(MailerService)
      await mailerServiceInstance.sendPasswordResetEmail(email)

      logger.debug('✔️ send password reset job finished')

      done()
    } catch (e) {
      logger.error('❌ error with send password reset job: %o', e)
      done(e)
    }
  }
}