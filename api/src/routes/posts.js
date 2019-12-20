import {
  testingCtrl,
  getAllPostsCtrl,
  newPostCtrl,
  getPostCtrl,
  updatePostCtrl,
  likePostCtrl,
  unLikePostCtrl,
  favoritePostCtrl,
  unFavoritePostCtrl,
  delPostCtrl,
  getAllCommentsCtrl,
  newCommentCtrl,
  getCommentCtrl,
  updateCommentCtrl,
  likeCommentCtrl,
  unlikeCommentCtrl,
  delCommentCtrl,
  loadPostSlugCtrl,
  loadCommentSlugCtrl,
} from '../controllers/post'

import {
  validatePost,
  validateComment,
  validateResults,
} from '../validation'

import { Router } from 'express'
import auth from '../middleware/auth'
import asyncHandler from 'express-async-handler'

export default (app, route = Router()) => {

  app.use('/', route)

  route.get('/see/testing', auth.optional, asyncHandler(testingCtrl))

  route.get('/see/all', auth.optional, asyncHandler(getAllPostsCtrl))

  route.post('/see/new', auth.required, validatePost, validateResults, asyncHandler(newPostCtrl))
  route.get('/see/one/:post_slug', auth.optional, asyncHandler(getPostCtrl))
  route.put('/see/one/:post_slug', auth.required, validatePost, validateResults, asyncHandler(updatePostCtrl))
  // route.delete('/delete', auth.required, asyncHandler(delPostCtrl))

  // route.put('/see/like/:post_slug', auth.required, asyncHandler(likePostCtrl))
  // route.put('/see/unlike/:post_slug', auth.required, asyncHandler(unLikePostCtrl))


  // route.put('/see-one/favorite/:post_slug', auth.required, asyncHandler(favoritePostCtrl))
  // route.put('/see-one/unfavorite/:post_slug', auth.required, asyncHandler(unFavoritePostCtrl))

  // route.put('/:post_slug/comments/like/:comment_slug', auth.req, asyncHandler(likeCommentCtrl))
  // route.put('/:post_slug/comments/unlike/:comment_slug', auth.req, asyncHandler(unlikeCommentCtrl))

  // route.get('/:post_slug/comments', auth.optional, asyncHandler(getAllCommentsCtrl))

  // route.post('/:post_slug/comments', auth.required, validateComment, validateResults, asyncHandler(newCommentCtrl))
  // route.get('/:post_slug/comments/:comment_slug', auth.optional, asyncHandler(getCommentCtrl))
  // route.put('/:post_slug/comments/:comment_slug', auth.required, validateComment, validateResults, asyncHandler(updateCommentCtrl))
  // route.delete('/:post_slug/comments/delete', auth.required, asyncHandler(delCommentCtrl))

  route.param('post_slug', loadPostSlugCtrl)
  // route.param('comment_slug', loadCommentSlugCtrl)

}
