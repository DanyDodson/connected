import config from '../config'
import logger from '../loaders/logger'
import MailerService from './mailer'
import { EventEmitter } from '../decorators/dispatcher'
import events from '../subscribers/events'

export default class AuthService {

  constructor (container) {
    this.userModel = container.get('userModal')
    this.logger = container.get('logger')
    this.mailer = container.get(MailerService)
    this.agendaJob = container.get('agendaInstance')
  }

  async testService () {
    this.logger.debug('1️⃣ calling auth test endpoint ...')
    return { auth: 'auth test route working !' }
  }

  async signUpService (userInput) {
    this.logger.debug('0️⃣  calling sign up endpoint with body: %o', userInput)
    const user = await new this.userModel(userInput)
    if (!user) throw new Error(err)
    await user.setPassword(userInput.password)
    await user.save()
    this.logger.debug('1️⃣  created new user: %o', user)
    const verifyToken = await user.generateVerifyJWT(user._id)
    await user.updateOne({ verifyToken: verifyToken })
    await this.agendaJob.now('send-verify-account-email', { email: user.email, verifyToken: verifyToken, client: config.url.client, })
    return { user, verifyToken }
  }

  async signInService () {
    this.logger.debug('0️⃣  calling sign in endpoint...')
  }

  async getUserService (id) {
    this.logger.debug('0️⃣  calling get user endpoint with user id: %o', id)
    const user = await this.userModel.findOne({ _id: id })
    return { user }
  }

  async userRolesService (role) {
    let user = req.payload && req.payload.role === 'user'
    let admin = req.payload && req.payload.role === 'admin'
    const auth = user || admin
    this.logger.data('USER:', user, 'ADMIN:', admin)
    if (!auth) return res.status(403).json({ err: 'user is not authorized to perform this action' })
    next()
  }

  async setVerifiedService (verifyToken) {
    this.logger.debug('0️⃣  calling verified email service...')
    const user = await this.userModel.findOne({ verifyToken: verifyToken })
    user.verifyToken = null
    user.verified = true
    user.updated = Date.now()
    let updatedUser = await user.save()
    if (!updatedUser) throw new Error(err)
    this.logger.debug('1️⃣  calling sendVerifiedEmail service with email: %o', user.email)
    const mailerStatus = await this.mailer.sendVerifiedEmail(user.email)
    this.logger.debug('1️⃣  sendVerifiedEmail service response: %o', mailerStatus)
    /**
     * @todo signout user and redirect to login page
     * @desc problem: validateIsVerified isnt called if this function is called again
     * @desc before requesting a new token ??? i don't get it yet !! 
    */
    return { user, mailerStatus }
  }

  async forgotPassService (id) {
    this.logger.debug('0️⃣  calling forgot password service...')

    const user = await this.userModel.findOne({ _id: id })
    if (!user) return res.status(404).json({ msg: 'user not found' })
    const resetPassToken = await user.generateResetJWT(user.id)
    await user.updateOne({ 'resetToken': resetPassToken })
    this.logger.debug('1️⃣  calling sendForgotPassEmail service with email: %o', user.email)
    const mailerStatus = await this.mailer.sendForgotPassEmail(user.email, config.url.client, resetPassToken)
    this.logger.debug('2️⃣  sendForgotPassEmail service response: %o', mailerStatus)
    return { user, resetPassToken, mailerStatus }
  }

  async resetPassService (userInput, id) {
    this.logger.debug('0️⃣  calling reset password service...')
    const foundUser = await this.userModel.findOne({ _id: id })
    const user = await this.userModel.findOne({ resetToken: foundUser.resetToken })
    if (!user) throw new Error('invalid reset password link')
    await user.setPassword(userInput.newPassword)
    user.updated = Date.now()
    user.resetToken = null
    const updatedUser = await user.save()
    if (!updatedUser) throw new Error(err)
    this.logger.debug('1️⃣  calling sendResetPassEmail service with email: %o', user.email)
    const mailerStatus = await this.mailer.sendResetPassEmail(user.email)
    this.logger.debug('2️⃣  sendResetPassEmail service response: %o', mailerStatus)
    return { user, mailerStatus }
  }

  async signOutService (auth) {
    return { auth }
  }

  async destroyUserService (id) {
    this.logger.debug('0️⃣  calling destroy user service')
    const user = await this.userModel.findOne({ _id: id })
    if (!user) throw new Error('user not found')
    // await Profile.findOneAndRemove({ user: user._id })
    await this.userModel.findOneAndRemove({ _id: user._id })
    return
  }
}