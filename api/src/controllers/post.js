import asyncHandler from 'express-async-handler'
import PostService from '../services/post'
import { Container } from 'typedi'

/**
 * @desc auth test route
 * @route GET /api/auth
 * @auth public
*/
export const testingCtrl = asyncHandler(async (req, res, next) => {
    const postServiceInstance = await Container.get(PostService)
    const msg = await postServiceInstance.testingService()
    return res.status(201).json(msg)
})

/**
 * @desc runs on paths containing :post_slug
 * @route PARAM /:post_slug
 * @auth public
*/
export const loadPostSlugCtrl = asyncHandler(async (req, res, next, post_slug) => {
    const postServiceInstance = await Container.get(PostService)
    const { post } = await postServiceInstance.loadPostSlugCtrl(post_slug)
    req.post = post
    return next()
})

/**
 * @desc runs on paths containing :comment_slug
 * @route PARAM /:comment_slug
 * @auth public
*/
export const loadCommentSlugService = asyncHandler(async (req, res, next, comment_slug) => {
    const postServiceInstance = await Container.get(PostService)
    const msg = await postServiceInstance.loadCommentService(comment_slug)
    req.comment = comment
    return next()
})

/**
 * @desc gets all posts
 * @route GET /api/see
 * @auth public
*/
export const getAllPostsCtrl = asyncHandler(async (req, res, next) => {
    const postServiceInstance = await Container.get(PostService)
    const { posts } = await postServiceInstance.getAllPostsService()
    return res.status(200).send(posts)
})

/**
 * @desc create a post
 * @route PUT /api/see/create
 * @auth private
*/
export const newPostCtrl = asyncHandler(async (req, res, next) => {
    const postServiceInstance = await Container.get(PostService)
    const { post, user } = await postServiceInstance.newPostService(req.payload.id, req.body)
    return res.status(200).send(post.postToJson(user))
})

/**
 * @desc gets one post
 * @route GET /api/see/:post_slug
 * @auth public
*/
export const getPostCtrl = asyncHandler(async (req, res, next) => {
    const postServiceInstance = await Container.get(PostService)
    const { post } = await postServiceInstance.getPostService(req.post)
    return res.status(200).json(post)
})

/**
 * @desc update a post
 * @route PUT /api/see/:post_slug
 * @auth private
*/
// export const updatePostCtrl = asyncHandler(async (req, res, next) => {
//     const postServiceInstance = await Container.get(PostService)
//     const { post } = await postServiceInstance.updatePostService()

//     const artist = await Artist.findOne({ user: req.payload.id })

//     return res.status(200).json(post)
// })

/**
 * @desc like a post
 * @route PUT /api/see/like/:post_slug
 * @auth private
*/
// export const likePostCtrl = asyncHandler(async (req, res, next) => {
//     const postServiceInstance = await Container.get(PostService)
//      const { post } = await postServiceInstance.likePostService()

//     const artist = await Artist.findOne({ user: req.payload.id })
//     const post = await Post.findOne({ _id: req.post })
//     if (post.isLiked(artist._id)) return res.status(200).json({ msg: 'you\'ve already liked this post' })
//     await post.like(artist._id)
//     await post.likesCount()
//     return res.status(200).json(post)
// })

/**
 * @desc unlike a post
 * @routePUT /api/see/unlike/:post_slug
 * @auth private
*/
// export const unLikePostCtrl = asyncHandler(async (req, res, next) => {
//     const postServiceInstance = await Container.get(PostService)
//      const { post } = await postServiceInstance.unLikePostService()

//     const artist = await Artist.findOne({ user: req.payload.id })
//     const post = await Post.findOne({ _id: req.post })
//     if (!post.isLiked(artist._id)) return res.status(200).json({ msg: 'you\'ve havnt liked this post yet' })
//     await post.unlike(artist._id)
//     await post.likesCount()
//     return res.status(200).json(post)
// })

/**
 * @desc favorite a post
 * @route PUT /api/see/favorite/:post_slug
 * @auth private
*/
// export const favoritePostCtrl = asyncHandler(async (req, res, next) => {
//     const postServiceInstance = await Container.get(PostService)
//      const { post } = await postServiceInstance.favoritePostService()

//     const post = req.post
//     const artist = await Artist.findOne({ user: req.payload.id })
//     // if (artist.isFavorite(post.id)) return res.status(200).json({ msg: `you\'ve already favorited this post` })
//     await Artist.updateOne({ user: req.payload.id }, { $push: { 'favorites.favorited': post } }, { new: true })
//     // await artist.favorite(req.payload.id, post)
//     await artist.favoriteCount()
//     return res.status(200).json(artist)
// })

/**
 * @desc unfavorite a post
 * @route PUT /api/see/unfavorite/:post_slug
 * @auth private
*/
// export const unFavoritePostCtrl = asyncHandler(async (req, res, next) => {
//     const postServiceInstance = await Container.get(PostService)
//      const { post } = await postServiceInstance.unFavoritePostService()

//     const post = req.post
//     const artist = await Artist.findOne({ user: req.payload.id })
//     if (!artist.isFavorite(post.id)) return res.status(200).json({ msg: 'you\'ve hav\'nt favorited this post yet' })
//     await artist.updateOne({ user: req.payload.id }, { $pull: { 'favorites.favorited': post } }, { new: true })
//     await artist.save()
//     // await artist.unfavorite(post.id)
//     await artist.favoriteCount()
//     return res.status(200).json(artist)
// })

/**
 * @desc deletes post
 * @route DELETE /api/see/delete
 * @auth private
*/
// export const delPostCtrl = asyncHandler(async (req, res, next) => {
//     const postServiceInstance = await Container.get(PostService)
//     await postServiceInstance.delPostService()

//     const poster = req.post.user
//     const user = req.payload.id
//     if (!user) return res.status(401).json({ msg: 'user is unauthenticated' })
//     if (poster.toString() !== user.toString()) return res.status(403).json({ msg: 'user is not authorized' })
//     if (post.options.purchasable) await artist.delListed(post._id)
//     if (!post.options.purchasable) await artist.delPosted(post._id)
//     await Comment.deleteMany({ post: req.post.id })
//     await Post.findOneAndRemove({ user: user })
//     return res.status(204).json({ msg: 'your post was removed' })
// })

/**
 * @desc gets all comments
 * @route GET /api/see/:post_slug/comments
 * @auth public
*/
// export const getAllCommentsCtrl = asyncHandler(async (req, res, next) => {
//     const postServiceInstance = await Container.get(PostService)
//      const { comments } = await postServiceInstance.getAllCommentsService()

//     const comments = req.post.comments.commented
//     return res.status(200).json(comments)
// })

/**
 * @desc creates a comment
 * @route PUT /api/see/:post_slug/comments
 * @auth private
*/
// export const newCommentCtrl = asyncHandler(async (req, res, next) => {
//     const postServiceInstance = await Container.get(PostService)
//     const { comment } = await postServiceInstance.newCommentService()

//     const post = req.post
//     let comment = new Comment(req.body.comment)
//     comment.post = req.post.id
//     comment.user = req.payload.id
//     comment.details.author = req.payload.username
//     comment.details.email = req.payload.email
//     comment.links.parent = req.post.links.slug
//     await comment.save()
//     await comment.setkey()
//     await comment.setslug()
//     await comment.seturl()
//     await comment.save()
//     await post.addComment(comment._id)
//     await post.updateCommentCount()
//     await Post.findOneAndUpdate({ _id: req.post.id }, { $push: [comment] }, { new: true, upsert: true })
//     return res.status(200).json(comment)
// })

/**
 * @desc get one comment
 * @route GET /api/see/:post_slug/comments/:comment_slug
 * @auth public
*/
// export const getCommentCtrl = asyncHandler(async (req, res, next) => {
//     const postServiceInstance = await Container.get(PostService)
//     const { comment } = await postServiceInstance.getCommentService()

//     const comment = req.comment
//     return res.status(200).json(comment.commentToJson())
// })

/**
 * @desc update one comment
 * @route PUT /api/see/:post_slug/comments/:comment_slug
 * @auth private
*/
// export const updateCommentCtrl = asyncHandler(async (req, res, next) => {
//     const postServiceInstance = await Container.get(PostService)
//     const { comment } = await postServiceInstance.updateCommentService()

//     const { text } = req.body
//     let commentFields = {}
//     commentFields.details = {}
//     commentFields.post = req.post.id
//     commentFields.user = req.payload.id
//     commentFields.details.author = req.payload.username
//     commentFields.details.email = req.payload.email
//     if (text) commentFields.details.text = text
//     commentFields.updated = Date.now()
//     let comment = await Comment.findOneAndUpdate({ _id: req.comment.id }, { $set: commentFields }, { new: true, upsert: true })
//     await comment.setslug()
//     await comment.seturl()
//     await comment.save()
//     return res.status(200).json(comment.commentToJson())
// })

/**
 * @desc like a comment
 * @route PUT /api/see/:post_slug/comments/like/:comment_slug
 * @auth private
*/
// export const likeCommentCtrl = asyncHandler(async (req, res, next) => {
//     const postServiceInstance = await Container.get(PostService)
//     const { comment } = await postServiceInstance.likeCommentService()

//     const artist = await Artist.findOne({ user: req.payload.id })
//     const comment = await Comment.findOne({ _id: req.comment.id })
//     if (comment.isLiked(artist._id)) return res.status(200).json({ msg: 'you\'ve already liked this comment' })
//     await comment.like(artist._id)
//     await comment.likesCount()
//     return res.status(200).json(comment)
// })

/**
 * @desc unlike a comment
 * @route PUT /api/see/:post_slug/comments/unlike/:comment_slug
 * @auth private
*/
// export const unlikeCommentCtrl = asyncHandler(async (req, res, next) => {
//     const postServiceInstance = await Container.get(PostService)
//     const { comment } = await postServiceInstance.unlikeCommentService()

//     const artist = await Artist.findOne({ user: req.payload.id })
//     const comment = await Comment.findOne({ _id: req.comment.id })
//     if (!comment.isLiked(artist._id)) return res.status(200).json({ msg: 'you\'ve havnt liked this comment yet' })
//     await comment.unlike(artist._id)
//     await comment.likesCount()
//     return res.status(200).json(comment)
// })

/**
 * @desc deletes a comment
 * @route DELETE /api/see/:post_slug/comments/delete
 * @auth private
*/
// export const delCommentCtrl = asyncHandler(async (req, res, next) => {
//     const postServiceInstance = await Container.get(PostService)
//     await postServiceInstance.delCommentService()
//     return res.status(204).json({ msg: 'comment removed' })
// })
