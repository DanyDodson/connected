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
} = require('../controllers/post')

const {
  loadPostSlug,
  loadCommentSlug,
} = require('../controllers/post')

const {
  preUsername,
} = require('../controllers/artist')

const {
  ckPost,
  ckComment,
  ckResults,
} = require('../validator')

const auth = require('../auth')
const router = require('express').Router()

router.put('/like/:post_slug', auth.req, like)
router.put('/unlike/:post_slug', auth.req, unlike)

router.put('/favorite/:post_slug', auth.req, favorite)
router.put('/unfavorite/:post_slug', auth.req, unfavorite)

router.put('/:post_slug/comments/like/:comment_slug', auth.req, likeComment)
router.put('/:post_slug/comments/unlike/:comment_slug', auth.req, unlikeComment)

router.get('/', auth.opt, posts)

router.post('/create', auth.req, ckPost, ckResults, newPost)
router.get('/see/:post_slug', auth.opt, post)
router.put('/see/:post_slug', auth.req, ckPost, ckResults, upPost)
router.delete('/delete', auth.req, delPost)

router.get('/:post_slug/comments', auth.opt, comments)

router.post('/:post_slug/comments', auth.req, ckComment, ckResults, newComment)
router.get('/:post_slug/comments/:comment_slug', auth.opt, comment)
router.put('/:post_slug/comments/:comment_slug', auth.req, ckComment, ckResults, upComment)
router.delete('/:post_slug/comments/delete', auth.req, delComment)

router.param('post_slug', loadPostSlug)
router.param('comment_slug', loadCommentSlug)

module.exports = router
