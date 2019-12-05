import { Container } from 'typedi'
import events from './events'

const UserSubscriber = class UserSubscriber {
  /**
   * A great example of an event that you want to handle
   * save the last time a user signin, your boss will be pleased.
   *
   * Altough it works in this tiny toy API, please don't do this for a production product
   * just spamming insert/update to mongo will kill it eventualy
   *
   * Use another approach like emit events to a queue (rabbitmq/aws sqs),
   * then save the latest in Redis/Memcache or something similar
   */
  onUserSignIn ({ _id }) {
    const Logger = Container.get('logger')
    try {
      const UserModel = Container.get('UserModel')
      UserModel.update({ _id }, { $set: { lastLogin: new Date() } })
    } catch (e) {
      Logger.error(`🔥 Error on event ${events.user.signIn}: %o`, e)
      // Throw the error so the process die (check src/app.js)
      throw e
    }
  }

  onUserSignUp ({ name, email, _id }) {
    const Logger = Container.get('logger')
    try {
      /**
       * @TODO implement this
       */
      // Call the tracker tool so your investor knows that there is a new signup
      // and leave you alone for another hour.
      // TrackerService.track('user.signup', { email, _id })
      // Start your email sequence or whatever
      // MailService.startSequence('user.welcome', { email, name })
    } catch (e) {
      Logger.error(`🔥 Error on event ${events.user.signUp}: %o`, e)
      // Throw the error so the process dies (check src/app.js)
      throw e
    }
  }

  onUserResetPassword ({ name, email, _id }) {
    const Logger = Container.get('logger')
    try {
      /**
       * @TODO implement this
       */
      // Call the tracker tool so your investor knows that there is a new signup
      // and leave you alone for another hour.
      // TrackerService.track('user.signup', { email, _id })
      // Start your email sequence or whatever
      // MailService.startSequence('user.welcome', { email, name })
    } catch (e) {
      Logger.error(`🔥 Error on event ${events.user.signUp}: %o`, e)
      // Throw the error so the process dies (check src/app.js)
      throw e
    }
  }
}

export default UserSubscriber
