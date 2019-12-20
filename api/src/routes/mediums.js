import {
  testingCtrl,
} from '../controllers/medium'

import auth from '../middleware/auth'
import asyncHandler from 'express-async-handler'
import { Router } from 'express'

export default (app, route = Router()) => {

  app.use('/mediums', route)

  route.get('/testing', auth.optional, asyncHandler(testingCtrl))

}