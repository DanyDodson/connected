import { Container } from 'typedi'
import MailerService from '../services/mailer'

export default class SendVerifiedJob {

  async handler (job, done) {
    const logger = Container.get('logger')

    try {

      logger.debug('✔️ send verified account confirmation job triggered')

      const { email } = job.attrs.data
      const mailerServiceInstance = Container.get(MailerService)
      await mailerServiceInstance.sendVerifiedEmail(email)

      logger.debug('✔️ send verified account confirmation job finished')

      done()
    } catch (e) {
      logger.error('❌ error with send verify account confirmation job: %o', e)
      done(e)
    }
  }
}