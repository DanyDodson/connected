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
  loadUsernamesCtrl,
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
  route.get('/artist/:username', auth.optional, asyncHandler(getProfileCtrl))
  route.put('/artist/:username', auth.required, validateProfile, validateResults, asyncHandler(updateProfileCtrl))

  route.put('/follow', auth.required, addFollowingCtrl, asyncHandler(addFollowerCtrl))
  route.put('/unfollow', auth.required, delFollowingCtrl, asyncHandler(delFollowerCtrl))

  route.delete('/delete', auth.required, asyncHandler(delProfileCtrl))

  route.param('username', loadUsernamesCtrl)

}