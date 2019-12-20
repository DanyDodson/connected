import { Router } from 'express'
import auth from './auth'
import profiles from './profiles'

export default () => {
  const app = Router()
  auth(app)
  profiles(app)
  return app
}