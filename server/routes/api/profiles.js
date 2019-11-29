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
    loadUsername
} = require('../../controllers/profile')

const {
    ckProfile,
    ckResults,
} = require('../../validator')

const auth = require('../auth')
const router = require('express').Router()


router.put('/follow', auth.req, addFollowing, addFollower)
router.put('/unfollow', auth.req, delFollowing, delFollower)
router.get('/', auth.opt, profiles)
router.get('/:username', auth.opt, profile)
router.put('/:username', auth.req, ckProfile, ckResults, upProfile)
router.delete('/:username', auth.req, delProfile)

router.param('username', loadUsername)

module.exports = router