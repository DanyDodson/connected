const {
    signup,
    google,
    googleCb,
    signin,
    user,
    verify,
    verified,
    forgot,
    reset,
    signout,
    destroy,
} = require('../../controllers/auth')

const {
    newProfile
} = require('../../controllers/profile')

const {
    ckSignup,
    ckSignin,
    ckReset,
    ckResults,
} = require('../../validator')

const auth = require('../auth')
const router = require('express').Router()

router.put('/verify/send', auth.req, verify)
router.put('/verify/return', auth.req, verified, newProfile)

router.put('/forgot/send', auth.req, forgot)
router.put('/forgot/return', auth.req, ckReset, ckResults, reset)

router.get('/google', auth.req, google)
router.get('/google/callback', auth.req, googleCb)

router.post('/signup', ckSignup, ckResults, signup)
router.post('/signin', ckSignin, ckResults, signin)
router.get('/', auth.req, user)
router.get('/signout', auth.req, signout)
router.delete('/destroy', auth.req, destroy)

module.exports = router