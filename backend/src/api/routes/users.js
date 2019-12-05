import ash from 'express-async-handler'
import authIs from '../middleware/auth'
import { Router } from 'express'

const route = Router()

export default (app) => {
  app.use('/user', route)

  route.get('/', authIs.required, ash(async (req, res, next) => {
    return res.json({ user: req.currentUser }).status(200)
  }))

  app.use('/users', route)

  route.get('/me', authIs.required, ash(async (req, res, next) => {
    return res.json({ user: req.currentUser }).status(200)
  }))
}
