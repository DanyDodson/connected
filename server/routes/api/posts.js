const {
    viewPosts,
    viewPost,
    createPost,
    updatePost,
    removePost,
    viewComments,
    viewComment,
    createComment,
    updateComment,
    removeComment,
} = require('../../controllers/post')

const { preloadPost, preloadComment, } = require('../../controllers/post')
const { preloadUsername, } = require('../../controllers/profile')

const { checkPost, checkComment, checkResults, } = require('../../validator')

const auth = require('../auth')
const router = require('express').Router()

router.get('/', auth.optional, viewPosts)
router.post('/create', auth.required, checkPost, checkResults, createPost)
router.get('/:slug', auth.optional, viewPost)
router.put('/:slug', auth.required, checkPost, checkResults, updatePost)
router.delete('/:slug', auth.required, removePost)

router.get('/:slug/comments/:comments', viewComments)
router.post('/:slug/comments/create', auth.required, checkComment, checkResults, createComment)
router.get('/:slug/comments/:comment', viewComment)
router.put('/:slug/comments/:comment', auth.required, checkComment, checkResults, updateComment)
router.delete('/:slug/comments/:comment', auth.required, removeComment)

router.param('slug', preloadPost)
router.param('comment', preloadComment)
router.param('username', preloadUsername)

module.exports = router