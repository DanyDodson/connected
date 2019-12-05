import jwt from 'jsonwebtoken'
import config from '../config'
import argon2 from 'argon2'
import { randomBytes } from 'crypto'
import events from '../subscribers/events'

const AuthService = class AuthService {
  constructor (userModel, mailer, logger, eventDispatcher) {
    this.userModel = userModel
    this.mailer = mailer
    this.logger = logger
    this.eventDispatcher = eventDispatcher
  }

  async SignUp (userInputDTO, token) {
    try {
      const salt = randomBytes(32)

      this.logger.silly('Hashing password')
      const hashedPassword = await argon2.hash(userInputDTO.password, {
        salt
      })

      this.logger.silly('Creating user db record')
      const userRecord = await this.userModel.create({
        ...userInputDTO,
        salt: salt.toString('hex'),
        password: hashedPassword
      })

      this.logger.silly('Generating JWT')
      const token = this.generateToken(userRecord)

      if (!userRecord) {
        throw new Error('User cannot be created')
      }

      this.logger.silly('Sending welcome email')
      await this.mailer.SendWelcomeEmail(userRecord)

      this.eventDispatcher.dispatch(events.user.signUp, {
        user: userRecord
      })

      /**
       * @TODO This is not the best way to deal with this
       * There should exist a 'Mapper' layer
       * that transforms data from layer to layer
       * but that's too over-engineering for now
      */
      const user = userRecord.toObject()
      Reflect.deleteProperty(user, 'password')
      Reflect.deleteProperty(user, 'salt')
      return {
        user,
        token
      }
    } catch (e) {
      this.logger.error(e)
      throw e
    }
  }

  async SignIn (email, password) {
    const userRecord = await this.userModel.findOne({
      email
    })

    if (!userRecord) {
      throw new Error('User not registered')
    }

    // We use verify from argon2 to prevent 'timing based' attacks
    this.logger.silly('Checking password')
    const validPassword = await argon2.verify(userRecord.password, password)

    if (validPassword) {
      this.logger.silly('Password is valid!')
      this.logger.silly('Generating JWT')
      const token = this.generateToken(userRecord)
      const user = userRecord.toObject()
      Reflect.deleteProperty(user, 'password')
      Reflect.deleteProperty(user, 'salt')
      // Easy as pie, you don't need passport.js anymore :)
      return { user, token }
    } else {
      throw new Error('Invalid Password')
    }
  }

  generateToken (user) {
    const today = new Date()
    const exp = new Date(today)
    const iat = new Date(today)
    iat.setHours(today.getHours() + 0)
    exp.setHours(today.getHours() + 2)
    /**
     * A JWT means JSON Web Token, so basically it's a json that is _hashed_ into a string
     * The cool thing is that you can add custom properties a.k.a metadata
     * Here we are adding the userId, role and name
     * Beware that the metadata is public and can be decoded without _the secret_
     * but the client cannot craft a JWT to fake a userId
     * because it doesn't have _the secret_ to sign it
     * more information here: https://softwareontheroad.com/you-dont-need-passport
    */
    this.logger.silly(`Sign JWT for userId: ${user._id}`)
    return jwt.sign({
      _id: user._id,
      iss: 'SEESEE_API',
      iat: parseInt(iat.getTime() / 1000),
      nbf: parseInt(iat.getTime() / 1000),
      email: user.email,
      // username: user.username,
      // artist: user.artist,
      // verified: user.verified,
      // role: user.role,
      // vToken: user.vToken,
      // rToken: user.rToken,
      exp: parseInt(exp.getTime() / 1000),
    }, config.jwtSecret)
  }
}
export default AuthService
