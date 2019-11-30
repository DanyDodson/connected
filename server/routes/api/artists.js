const {
    artists,
    newArtist,
    artist,
    upArtist,
    addFollowing,
    addFollower,
    delFollowing,
    delFollower,
    delArtist,
} = require('../../controllers/artist')

const {
    proName,
} = require('../../controllers/artist')

const {
    ckArtist,
    ckResults,
} = require('../../validator')

const auth = require('../auth')
const router = require('express').Router()

router.get('/', auth.opt, artists)

router.post('/create', auth.req, newArtist)
router.get('/:pro_name', auth.opt, artist)
router.put('/:pro_name', auth.req, ckArtist, ckResults, upArtist)

router.put('/follow', auth.req, addFollowing, addFollower)
router.put('/unfollow', auth.req, delFollowing, delFollower)

router.delete('/delete', auth.req, delArtist)

router.param('pro_name', proName)

module.exports = router