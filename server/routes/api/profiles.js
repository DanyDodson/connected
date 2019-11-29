const {
    profiles,
    addFollowing,
    addFollower,
    delFollowing,
    delFollower,
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

router.get('/', auth.opt, profiles)

router.put('/follow', auth.req, addFollowing, addFollower)
router.put('/unfollow', auth.req, delFollowing, delFollower)

router.post('/create', auth.req, newProfile)
router.get('/:pro_name', auth.opt, profile)
router.put('/:pro_name', auth.req, ckProfile, ckResults, upProfile)
router.delete('/', auth.req, delProfile)

router.param('pro_name', proName)

module.exports = router