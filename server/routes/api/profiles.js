const {
    profiles,
    profile,
    upProfile,
    addFollowing,
    addFollower,
    delFollowing,
    delFollower,
    delProfile,
} = require('../../controllers/profile')

const {
    preUsername
} = require('../../controllers/profile')

const {
    preUserid
} = require('../../controllers/user')

const {
    ckProfile,
    ckResults,
} = require('../../validator')

const auth = require('../auth')
const router = require('express').Router()

router.param('username', preUsername)

router.put('/follow', auth.req, addFollowing, addFollower)
router.put('/unfollow', auth.req, delFollowing, delFollower)
router.get('/', auth.opt, profiles)
router.get('/:username', auth.opt, profile)
router.put('/:username', auth.req, ckProfile, ckResults, upProfile)
router.delete('/:username', auth.req, delProfile)

module.exports = router