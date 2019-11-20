const {
    signup,
    signin,
    account,
    verify,
    verified,
    recover,
    recovered,
    signout,
    destroy,
} = require('../../controllers/auth')

const {
    checkSignup,
    checkSignin,
    checkRecovery,
    checkResults,
} = require('../../validator')

const auth = require('../auth')
const router = require('express').Router()

router.post('/signup', checkSignup, checkResults, signup, verify)
router.post('/signin', checkSignin, checkResults, signin)

router.get('/account', auth.required, account)

router.put('/verify', auth.required, verify)
router.put('/verified/:verifyToken', auth.required, verified)

router.put('/recover', auth.required, recover)
router.put('/recovered/:recoveryToken', auth.required, checkRecovery, checkResults, recovered)

router.get('/signout', auth.required, signout)
router.delete('/destroy', auth.required, destroy)

module.exports = router

// Token Name: Imgur - Postman Collection
// Access Token: 3e91359c2f8b96873f1a964001eca7ce1edae3d1
// Access Token new: 9b255219d8f0143aa88a2bad4144d13d1b70e63a
// Token Type: bearer
// expires_in: 315360000
// refresh_token: 52549583feca065f86f485e5857ca11dabcd30e1
// refresh_token new: 7e47300895e8aefd5546ffddb0e41c42feb64b5e
// account_id: 54253253
// account_username: ugly00casanova