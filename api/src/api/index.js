import { Router } from 'express'
import auth from '../routes/auth'
import profiles from '../routes/profiles'
import agendash from '../routes/agendash'

export default () => {
  const app = Router()
  auth(app)
  profiles(app)
  agendash(app)

  return app
}