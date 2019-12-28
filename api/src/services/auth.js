import config from '../config'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import login from '../auth'
import getUserByEmail from '../database/user'

export default class AuthService {

  constructor (container) {
    this.logger = container.get('logger')
    this.userModel = container.get('userModel')
    this.agendaJob = container.get('agendaInstance')
  }

  /** 
   * @desc testingService
  */
  async testingService () {
    this.logger.debug('0️⃣  calling auth test endpoint')
    return { msg: 'auth test route working' }
  }

  /**
   * @desc signUpService
  */
  async signUpService (body) {
    this.logger.debug('0️⃣  calling sign up endpoint')

    const newUser = await new this.userModel(body)
    await newUser.setPassword(body.password)
    const user = await newUser.save()

    if (!user) {
      this.logger.error('❌ error on initial save of new user')
      process.exitCode = 1
    }

    this.logger.debug('1️⃣  created new user')

    const getTokenObject = user => user.verifyEmailToken()
    const tokenObject = await getTokenObject(user)
    const token = tokenObject.toString()

    user.verifyToken = token
    await user.save()

    const mailData = { email: user.email, client: config.url.client, token: token }
    await this.agendaJob.now('send-verify-account-email', mailData)

    const userData = await user.authUserToJSON()
    return { userData }
  }

  /**
   * @desc signInService
  */
  async signInService (body) {
    this.logger.debug('0️⃣  calling sign in endpoint')

    const user = await getUserByEmail({ email: body.email })
    this.logger.debug(user)

    if (!user) {
      throw new Error('user not found')
    }

    // const userData = passport.authenticate('local', { session: false })
    // await login(req, user)

    // if (user) {
    //   token = await user.authUserToken()
    // } else {
    // If user is not found
    // res.status(401).json(info)
    // }

    // const isVallid = await user.validPassword(user.hash)

    // const userData = await user.authUserToken()

    // return { user }
  }

  /**
   * @desc getUserService
  */
  async getUserService (id) {
    this.logger.debug('0️⃣  calling get user endpoint')

    const user = await this.UserModel.findOne({ _id: id })

    if (!user) {
      throw new Error('user not found')
    }
    const options = {
      issuer: 'seesee.com',
      // subject: 'verify_email',
      expiresIn: Math.floor(Date.now() / 1000) + (60 * 60),
    }


    // userData = jwt.verify(token, config.app.jwtSecret, options)
    // await passport.authenticate('jwt', { session: false })
    // await passport.authenticate('jwt', { session: false })
    const userData = passport.authenticate('jwt', { session: false })

    // const userData = user.authUserToJSON()

    return { userData }
  }

  /**
   * @desc setVerifiedService
  */
  async setVerifiedService (token) {
    this.logger.debug('0️⃣  calling verified email endpoint')

    const user = await this.UserModel.findOne({ verifyToken: token })

    if (!user) {
      process.exit(1)
      this.logger.error('❌ error on finding a user by verifyToken')
      throw new Error('no user found to verify')
    }

    user.verified = true
    user.verifyToken = null
    user.updated = Date.now()

    let updatedUser = await user.save()

    if (!updatedUser) {
      throw new Error('error updating user')
    }

    // TODO validation isnt called if this func is called again

    await this.agendaJob.now('send-verified-account-email', { email: user.email })

    return { user }
  }

  /**
   * @desc forgotPassService
  */
  async forgotPassService (id) {
    this.logger.debug('0️⃣  calling forgot password endpoint')

    const user = await this.UserModel.findOne({ _id: id })

    if (!user) {
      throw new Error('user not found')
    }

    const getTokenObject = user => user.forgotPasswordToken()
    const tokenObject = await getTokenObject(user)
    const token = tokenObject.toString()

    user.resetToken = token
    await user.save()

    this.logger.debug(user)

    const mailData = { email: user.email, client: config.url.client, token: token }
    await this.agendaJob.now('send-forgot-password-email', mailData)

    const userData = await user.forgotPasswordToken(user)


    return { userData }
  }

  /**
   * @desc resetPassService
  */
  async resetPassService (id, userInput) {
    this.logger.debug('0️⃣  calling reset password endpoint')

    const foundUser = await this.UserModel.findOne({ _id: id })
    const user = await this.UserModel.findOne({ resetToken: foundUser.resetToken })
    // const user = await this.UserModel.findOne({ resetToken: foundUser.resetToken })

    if (!foundUser || !user) {
      throw new Error('invalid reset password link')
    }

    await user.setPassword(userInput.newPassword)

    user.updated = Date.now()
    user.resetToken = null

    const updatedUser = await user.save()

    if (!updatedUser) {
      throw new Error('error updating password')
    }

    await this.agendaJob.now('send-password-reset-email', { email: user.email })

    const userData = user.resetPasswordUserToJSON()

    return { userData }
  }

  /**
   * @desc signOutService
   * @desc {  } 
  */
  async signOutService (auth) {
    const token = auth.split(' ')[1]
    // insert an add to blacklist job here
    return { token }
  }

  /**
   * @desc delUserService
  */
  async delUserService (id) {
    this.logger.debug('0️⃣  calling destroy user endpoint')

    const user = await this.UserModel.findOne({ _id: id })

    if (!foundUser || user) {
      throw new Error('user not found')
    }

    const del = await this.UserModel.findOneAndRemove({ _id: user._id })

    if (!del) {
      throw new Error('error deleting user')
    }

    return
  }
}