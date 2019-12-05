import ash from 'express-async-handler'
// import authIs from '../middleware/auth'
import AuthService from '../../services/auth-service'
import { Router } from 'express'
import { Container } from 'typedi'

import {
// signupValidator,
// signinValidator,
// resultsValidator,
} from '../validation'

const route = Router()

export default app => {
  app.use('/auth', route)

  route.post('/signup', ash(async (req, res, next) => {
    const logger = Container.get('logger')
    logger.debug('Calling Sign-Up endpoint with body: %o', req.body)
    const authServiceInstance = Container.get(AuthService)
    const { user, token } = await authServiceInstance.SignUp(req.body)
    return res.status(201).json({ user, token })
  }))

  route.post('/signin', ash(async (req, res, next) => {
    const logger = Container.get('logger')
    logger.debug('Calling Sign-In endpoint with body: %o', req.body)
    const { email, password } = req.body
    const authServiceInstance = Container.get(AuthService)
    const { user, token } = await authServiceInstance.SignIn(email, password)
    return res.json({ user, token }).status(200)
  }))

  /**
   * @TODO Let's leave this as a place holder for now
   * The reason for a logout route could be deleting a 'push notification token'
   * so the device stops receiving push notifications after logout.
   *
   * Another use case for advance/enterprise apps, you can store a record of the jwt token
   * emitted for the session and add it to a black list.
   * It's really annoying to develop that but if you had to, please use Redis as your data store
  */
  route.post('/logout', ash(async (req, res, next) => {
    const logger = Container.get('logger')
    logger.debug('Calling Sign-Out endpoint with body: %o', req.body)
    // @TODO AuthService.Logout(req.user) do some clever stuff
    return res.status(200).end()
  }))

  // router.get('/google', auth.req, google)
  // router.get('/google/callback', auth.req, googleCB)

  // router.get('/details', auth.req, user)

  // router.put('/verify/send', auth.req, verify)
  // router.put('/verify/return', auth.req, verified, newArtist)

  // router.put('/forgot/send', auth.req, forgot)
  // router.put('/forgot/return', auth.req, ckReset, ckResults, reset)

  // router.get('/signout', auth.req, signout)
  // router.delete('/delete', auth.req, destroy)
}
