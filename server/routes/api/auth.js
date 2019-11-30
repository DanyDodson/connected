const {
    signup,
    google,
    googleCB,
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
    newArtist
} = require('../../controllers/artist')

const {
    ckSignup,
    ckSignin,
    ckReset,
    ckResults,
} = require('../../validator')

const auth = require('../auth')
const router = require('express').Router()

router.post('/signup', ckSignup, ckResults, signup)
router.post('/signin', ckSignin, ckResults, signin)

router.get('/google', auth.req, google)
router.get('/google/callback', auth.req, googleCB)

router.get('/details', auth.req, user)

router.put('/verify/send', auth.req, verify)
router.put('/verify/return', auth.req, verified, newArtist)

router.put('/forgot/send', auth.req, forgot)
router.put('/forgot/return', auth.req, ckReset, ckResults, reset)

router.get('/signout', auth.req, signout)
router.delete('/delete', auth.req, destroy)

module.exports = router