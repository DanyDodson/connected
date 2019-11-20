const {
    meProfile,
    viewProfiles,
    createProfile,
    viewProfile,
    updateProfile,
    removeProfile,
} = require('../../controllers/profile')

const { preloadUsername } = require('../../controllers/profile')
const { preloadUserId } = require('../../controllers/user')

const { checkProfile, checkUpdate, checkResults, } = require('../../validator')

const auth = require('../auth')
const router = require('express').Router()

router.get('/', viewProfiles)
router.get('/me', auth.required, meProfile)
router.post('/create', auth.required, checkProfile, checkResults, createProfile)
router.get('/:username', viewProfile)
router.put('/:username', auth.required, checkUpdate, checkResults, updateProfile)
router.delete('/:username', auth.required, removeProfile)

router.param('username', preloadUsername)
router.param('userId', preloadUserId)

module.exports = router