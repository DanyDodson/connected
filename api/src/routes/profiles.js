import {
  testingCtrl,
  profilesFeedCtrl,
  newProfileCtrl,
  getProfileCtrl,
  updateProfileCtrl,
  addFollowingCtrl,
  addFollowerCtrl,
  delFollowingCtrl,
  delFollowerCtrl,
  delProfileCtrl,
} from '../controllers/profile'

import {
  validateProfile,
  validateResults,
} from '../validation'

import { Router } from 'express'
import auth from '../middleware/auth'
import asyncHandler from 'express-async-handler'

export default (app, route = Router()) => {

  app.use('/', route)

  route.get('/artists/testing', auth.optional, testingCtrl)
  route.get('/artists', auth.optional, asyncHandler(profilesFeedCtrl))

  route.post('/artist/create', auth.required, asyncHandler(newProfileCtrl))

  route.put('/artist/follow/:username', auth.required, asyncHandler(addFollowingCtrl), asyncHandler(addFollowerCtrl))
  route.put('/artist/unfollow/:username', auth.required, asyncHandler(delFollowingCtrl), asyncHandler(delFollowerCtrl))

  route.get('/artist/:username', auth.optional, asyncHandler(getProfileCtrl))
  route.put('/artist/:username', auth.required, validateProfile, validateResults, asyncHandler(updateProfileCtrl))

  route.delete('/artist/delete', auth.required, asyncHandler(delProfileCtrl))
}