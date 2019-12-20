import config from '../config'

export default class AuthService {

  constructor (container) {
    this.logger = container.get('logger')
    this.UserModel = container.get('UserModel')
    this.agendaJob = container.get('agendaInstance')
  }

  async testingService () {
    this.logger.debug('0️⃣  calling auth test endpoint')
    return { msg: 'auth test route working' }
  }

  async userRolesService (payload) {
    let user = payload && payload.role === 'user'
    let admin = payload && payload.role === 'admin'
    const auth = user || admin
    this.logger.info('user:', user, 'admin:', admin)
    if (!auth) throw new Error('user is not authorized to perform this action')
    return
  }

  async signUpService (userInput) {
    this.logger.debug('0️⃣  calling sign up endpoint')
    const user = await new this.UserModel(userInput)
    if (!user) throw new Error('error saving user')
    await user.setPassword(userInput.password)
    await user.save()
    this.logger.debug('1️⃣  created new user')
    const verifyToken = await user.generateVerifyJWT(user._id, user.username)
    await user.updateOne({ verifyToken: verifyToken })
    await this.agendaJob.now('send-verify-account-email', { email: user.email, client: config.url.client, verifyToken: verifyToken })
    return { user, verifyToken }
  }

  async signInService () {
    this.logger.debug('0️⃣  calling sign in endpoint')
    return
  }

  async getUserService (id) {
    this.logger.debug('0️⃣  calling get user endpoint')
    const user = await this.UserModel.findOne({ _id: id })
    return { user }
  }

  async setVerifiedService (verifyToken) {
    this.logger.debug('0️⃣  calling verified email endpoint')
    const user = await this.UserModel.findOne({ verifyToken: verifyToken })
    user.verifyToken = null
    user.verified = true
    user.updated = Date.now()
    let updatedUser = await user.save()
    if (!updatedUser) throw new Error('error updating user')
    await this.agendaJob.now('send-verified-account-email', { email: user.email })
    /**
     * @todo signout user and redirect to login page
     * @desc problem: validateIsVerified isnt called if this function is called again
     * @desc before requesting a new token ??? i don't get it yet !! 
    */
    return { user }
  }

  async forgotPassService (id) {
    this.logger.debug('0️⃣  calling forgot password endpoint')
    const user = await this.UserModel.findOne({ _id: id })
    if (!user) throw new Error('user not found')
    const resetPassToken = await user.generateResetJWT(user.id, user.username)
    await user.updateOne({ 'resetToken': resetPassToken })
    await this.agendaJob.now('send-forgot-password-email', { email: user.email, client: config.url.client, resetPassToken: resetPassToken, })
    return { user, resetPassToken }
  }

  async resetPassService (userInput, id) {
    this.logger.debug('0️⃣  calling reset password endpoint')
    const foundUser = await this.UserModel.findOne({ _id: id })
    const user = await this.UserModel.findOne({ resetToken: foundUser.resetToken })
    if (!user) throw new Error('invalid reset password link')
    await user.setPassword(userInput.newPassword)
    user.updated = Date.now()
    user.resetToken = null
    const updatedUser = await user.save()
    if (!updatedUser) throw new Error('error updating user')
    await this.agendaJob.now('send-password-reset-email', { email: user.email })
    return { user }
  }

  async signOutService (auth) {
    return { auth }
  }

  async delUserService (id) {
    this.logger.debug('0️⃣  calling destroy user endpoint')
    const user = await this.UserModel.findOne({ _id: id })
    if (!user) throw new Error('user not found')
    await this.UserModel.findOneAndRemove({ _id: user._id })
    return
  }
}