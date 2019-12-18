import { Router } from 'express'
import auth from '../routes/auth'
import agendash from '../routes/agendash'

export default () => {
  const app = Router()
  auth(app)
  agendash(app)

  return app
}