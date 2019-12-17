const config = require('../config')
const logger = require('../loaders/logger')
const User = require('../models/User')
const mailer = require('./mailer')

exports.testService = async () => {
  logger.debug('1️⃣  calling auth test endpoint...')
  return { auth: 'auth test route working!' }
}

exports.signUpService = async (userInput) => {
  logger.debug('0️⃣  calling sign up endpoint with body: %o', userInput)

  const user = await new User(userInput)

  if (!user) throw new Error(err)
  await user.setPassword(userInput.password)
  await user.save()

  logger.debug('1️⃣  created new user: %o', user)

  logger.debug('2️⃣  calling sendWelcomeEmail service with email: %o', user.email)

  const verifyToken = await user.generateVerifyJWT(user._id)
  await user.updateOne({ verifyToken: verifyToken })

  const mailerStatus = await mailer.sendWelcomeEmail(user.email, config.url.client, verifyToken)

  logger.debug('3️⃣  sendWelcomeEmail service response: %o', mailerStatus)

  return { user, verifyToken, mailerStatus }
}

exports.signInService = async () => {
  logger.debug('0️⃣  calling sign in endpoint...')
}

exports.getUserService = async (id) => {
  logger.debug('0️⃣  calling get user endpoint with user id: %o', id)

  const user = await User.findOne({ _id: id })

  return user
}

exports.userRolesService = async (role) => {
  let user = req.payload && req.payload.role === 'user'
  let admin = req.payload && req.payload.role === 'admin'

  const auth = user || admin
  logger.data('USER:', user, 'ADMIN:', admin)

  if (!auth) return res.status(403).json({ err: 'user is not authorized to perform this action' })

  next()
}

exports.setVerifiedService = async (verifyToken) => {
  logger.debug('0️⃣  calling verified email service...')

  const user = await User.findOne({ verifyToken: verifyToken })
  user.verifyToken = null
  user.verified = true
  user.updated = Date.now()
  let updatedUser = await user.save()
  if (!updatedUser) throw new Error(err)


  logger.debug('1️⃣  calling sendVerifiedEmail service with email: %o', user.email)

  const mailerStatus = await mailer.sendVerifiedEmail(user.email)

  logger.debug('1️⃣  sendVerifiedEmail service response: %o', mailerStatus)

  /**
   * @todo signout user and redirect to login page
   * @desc problem: validateIsVerified isnt called if this function is called again
   * @desc before requesting a new token ??? i don't get it yet !! 
   */
  return { user, mailerStatus }
}

exports.forgotPassService = async (id) => {
  logger.debug('0️⃣  calling forgot password service...')

  const user = await User.findOne({ _id: id })
  if (!user) return res.status(404).json({ msg: 'user not found' })

  const resetPassToken = await user.generateResetJWT(user.id)
  await user.updateOne({ 'resetToken': resetPassToken })

  logger.debug('1️⃣  calling sendForgotPassEmail service with email: %o', user.email)

  const mailerStatus = await mailer.sendForgotPassEmail(user.email, config.url.client, resetPassToken)

  logger.debug('2️⃣  sendForgotPassEmail service response: %o', mailerStatus)

  return { user, resetPassToken, mailerStatus }
}

exports.resetPassService = async (userInput, id) => {
  logger.debug('0️⃣  calling reset password service...')

  const foundUser = await User.findOne({ _id: id })
  const user = await User.findOne({ resetToken: foundUser.resetToken })
  if (!user) throw new Error('invalid reset password link')
  await user.setPassword(userInput.newPassword)
  user.updated = Date.now()
  user.resetToken = null
  const updatedUser = await user.save()
  if (!updatedUser) throw new Error(err)

  logger.debug('1️⃣  calling sendResetPassEmail service with email: %o', user.email)

  const mailerStatus = await mailer.sendResetPassEmail(user.email)

  logger.debug('2️⃣  sendResetPassEmail service response: %o', mailerStatus)

  return { user, mailerStatus }
}

exports.signOutService = async (auth) => {
  return { auth }
}

exports.destroyUserService = async (id) => {
  logger.debug('0️⃣  calling destroy user service')

  const user = await User.findOne({ _id: id })
  if (!user) throw new Error('user not found')
  // await Profile.findOneAndRemove({ user: user._id })
  await User.findOneAndRemove({ _id: user._id })

  return
}
