const {
    addFollowing,
    addFollower,
    delFollowing,
    delFollower,
    profiles,
    newProfile,
    profile,
    upProfile,
    delProfile,
} = require('../../controllers/profile')

const {
    loadProfileId,
    loadProfileUsername,
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

router.put('/new', auth.req, newProfile)

router.get('/:pro_name', auth.opt, profile)
// router.get('/:pro_id', auth.opt, profile)

router.put('/:pro_name', auth.req, ckProfile, ckResults, upProfile)
router.delete('/', auth.req, delProfile)

router.param('pro_id', loadProfileId)
router.param('pro_name', loadProfileUsername)

module.exports = router