const {
  testingCtrl,
  profilesFeedCtrl,
  newProfileCtrl,
  // proName,
  // artists,
  // newArtist,
  // artist,
  // upArtist,
  // addFollowing,
  // addFollower,
  // delFollowing,
  // delFollower,
  // delArtist,
  loadUsernamesCtrl,
} = require('../controllers/profile')

// const {
// ckArtist,
// ckResults,
// } = require('../validation')

const auth = require('../middleware/auth')
const router = require('express').Router()
const asyncHandler = require('express-async-handler')

router.get('/artists/testing', auth.optional, testingCtrl)
router.get('/artists', auth.optional, asyncHandler(profilesFeedCtrl))

router.post('/artist/create', auth.required, newProfileCtrl)
// router.get('/:pro_name', auth.opt, profile)
// router.put('/:pro_name', auth.req, ckArtist, ckResults, upProfile)

// router.put('/follow', auth.req, addFollowing, addFollower)
// router.put('/unfollow', auth.req, delFollowing, delFollower)

// router.delete('/delete', auth.req, delProfile)

router.param('username', loadUsernamesCtrl)

module.exports = router