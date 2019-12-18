import config from '../config'

export default class AuthService {

  constructor (container) {
    this.logger = container.get('logger')
    this.userModel = container.get('userModal')
    this.agendaJob = container.get('agendaInstance')
  }

  async testService () {
    this.logger.debug('0️⃣  calling auth test endpoint')
    return { msg: 'auth test route working' }
  }

  async signUpService (userInput) {
    this.logger.debug('0️⃣ calling sign up endpoint with body')
    const user = await new this.userModel(userInput)
    if (!user) throw new Error(err)
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
  }

  async getUserService (id) {
    this.logger.debug('0️⃣  calling get user endpoint')
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
    this.logger.debug('0️⃣  calling verified email endpoint')
    const user = await this.userModel.findOne({ verifyToken: verifyToken })
    user.verifyToken = null
    user.verified = true
    user.updated = Date.now()
    let updatedUser = await user.save()
    if (!updatedUser) throw new Error(err)
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
    const user = await this.userModel.findOne({ _id: id })
    if (!user) return res.status(404).json({ msg: 'user not found' })
    const resetPassToken = await user.generateResetJWT(user.id, user.username)
    await user.updateOne({ 'resetToken': resetPassToken })
    await this.agendaJob.now('send-forgot-password-email', { email: user.email, client: config.url.client, resetPassToken: resetPassToken, })
    return { user, resetPassToken }
  }

  async resetPassService (userInput, id) {
    this.logger.debug('0️⃣  calling reset password endpoint')
    const foundUser = await this.userModel.findOne({ _id: id })
    const user = await this.userModel.findOne({ resetToken: foundUser.resetToken })
    if (!user) throw new Error('invalid reset password link')
    await user.setPassword(userInput.newPassword)
    user.updated = Date.now()
    user.resetToken = null
    const updatedUser = await user.save()
    if (!updatedUser) throw new Error(err)
    await this.agendaJob.now('send-password-reset-email', { email: user.email })
    return { user }
  }

  async signOutService (auth) {
    return { auth }
  }

  async destroyUserService (id) {
    this.logger.debug('0️⃣  calling destroy user endpoint')
    const user = await this.userModel.findOne({ _id: id })
    if (!user) throw new Error('user not found')
    // await Profile.findOneAndRemove({ user: user._id })
    await this.userModel.findOneAndRemove({ _id: user._id })
    return
  }
}