import { Container } from 'typedi'
import AuthService from '../services/auth'

export default class CreateVerifyTokenJob {

  async handler (job, done) {
    const logger = Container.get('logger')

    try {

      logger.debug('✔️ new verify token job triggered')

      const { user } = job.attrs.data
      const newVerifyServiceInstance = Container.get(AuthService)
      await newVerifyServiceInstance.newVerifyTokenService(user)

      logger.debug('✔️ new verify token job finished')

      done()
    } catch (e) {
      logger.error('❌ error creating new verify token job: %o', e)
      done(e)
    }
  }
}