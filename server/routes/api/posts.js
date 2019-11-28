const {
    posts,
    newPost,
    post,
    upPost,
    like,
    unlike,
    favorite,
    unfavorite,
    delPost,
    comments,
    newComment,
    comment,
    upComment,
    likeComment,
    unlikeComment,
    delComment,
} = require('../../controllers/post')

const {
    prePost,
    preComment,
} = require('../../controllers/post')

const {
    preUsername,
} = require('../../controllers/profile')

const {
    ckPost,
    ckComment,
    ckResults,
} = require('../../validator')

const auth = require('../auth')
const router = require('express').Router()

router.param('post_slug', prePost)
router.param('comment_slug', preComment)

router.put('/like/:post_slug', auth.req, like)
router.put('/unlike/:post_slug', auth.req, unlike)

router.put('/favorite/:post_slug', auth.req, favorite)
router.put('/unfavorite/:post_slug', auth.req, unfavorite)

router.put('/like/:post_slug/comments/:comment_slug', auth.req, likeComment)
router.put('/unlike/:post_slug/comments/:comment_slug', auth.req, unlikeComment)

router.put('/:post_slug/comments', auth.req, ckComment, ckResults, newComment)
router.put('/:post_slug/comments/:comment_slug', auth.req, ckComment, ckResults, upComment)

router.get('/', auth.opt, posts)
router.post('/', auth.req, ckPost, ckResults, newPost)
router.get('/:post_slug', auth.opt, post)
router.put('/:post_slug', auth.req, ckPost, ckResults, upPost)
router.delete('/:post_slug', auth.req, delPost)

router.get('/:post_slug/comments', auth.opt, comments)
router.get('/:post_slug/comments/:comment_slug', auth.opt, comment)
router.delete('/:post_slug/comments/:comment_slug', auth.req, delComment)

module.exports = router