import {
  testingCtrl,
} from '../controllers/tag'

import auth from '../middleware/auth'
import asyncHandler from 'express-async-handler'
import { Router } from 'express'

export default (app, route = Router()) => {

  app.use('/tags', route)

  route.get('/testing', auth.optional, asyncHandler(testingCtrl))

}
