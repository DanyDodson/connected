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
    proName,
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
router.put('/:pro_name', auth.req, ckProfile, ckResults, upProfile)
router.get('/:pro_name', auth.opt, profile)
router.delete('/', auth.req, delProfile)

router.param('pro_name', proName)

module.exports = router