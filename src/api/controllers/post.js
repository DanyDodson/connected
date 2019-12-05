// cleans up async
const ash = require('express-async-handler')

// login functions
const passport = require('passport')

// db schemas
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Artist = mongoose.model('Artist')
const Post = mongoose.model('Post')
const Comment = mongoose.model('Comment')

/** 
 * @desc runs on paths containing :post_slug 
 * @route PARAM /:post_slug
 * @auth public
*/

exports.loadPostSlug = ash(async (req, res, next, post_slug) => {
    const post = await Post.findOne({ 'links.slug': post_slug })
    if (!post) return res.status(400).json({ err: 'post with that slug not found' })
    req.post = post
    return next()
})

/** 
 * @desc runs on paths containing :comment_slug 
 * @route PARAM /:comment_slug
 * @auth public
*/

exports.loadCommentSlug = ash(async (req, res, next, comment_slug) => {
    const comment = await Comment.findOne({ 'links.slug': comment_slug })
    if (!comment) return res.status(400).json({ err: 'comment with that slug not found' })
    req.comment = comment
    return next()
})

/**
 * @desc gets all posts
 * @route GET /api/see
 * @auth public
*/

exports.posts = ash(async (req, res, next) => {
    const posts = await Post.find().sort({ date: -1 })
    return res.status(200).send(posts)
})

/**
 * @desc gets one post
 * @route GET /api/see/:post_slug
 * @auth public
*/

exports.post = ash(async (req, res, next) => {
    const post = req.post
    if (post === null) return res.status(404).json({ msg: 'post not found' })
    return res.status(200).json(post)
})

/**
 * @desc create a post
 * @route PUT /api/see/create
 * @auth private
*/

exports.newPost = ash(async (req, res, next) => {
    const user = await User.findOne({ _id: req.payload.id })
    const artist = await Artist.findOne({ user: req.payload.id })
    const post = new Post(req.body)
    post.user = user
    post.artist = artist
    post.details.author = artist.details.username
    await post.save()
    await Artist.updateOne({ user: req.payload.id }, { $push: { posts: post } })
    return res.json({ post: post })
})

/**
 * @desc update a post
 * @route PUT /api/see/:post_slug
 * @auth private
*/

exports.upPost = ash(async (req, res, next) => {
    const artist = await Artist.findOne({ user: req.payload.id })
    let post = req.post
    const {
        mediums,
        title,
        description,
        tags,
        price,
        critique,
        shareable,
        purchasable,
    } = req.body
    if (mediums) post.details.mediums = mediums.split(', ').map(medium => medium.trim()) || post.details.mediums
    if (title) post.details.title = title || post.details.title
    if (description) post.details.description = description || post.details.description
    if (tags) post.details.tags = tags.split(', ').map(tag => tag.trim()) || post.details.tags
    if (price) post.details.price = price || post.details.price
    if (critique) post.options.critique = critique || post.options.critique
    if (shareable) post.options.shareable = shareable || post.options.shareable
    if (purchasable) post.options.purchasable = purchasable || post.options.purchasable
    // post.updated = Date.now()
    await Post.findOneAndUpdate({ 'links.slug': req.post.links.slug }, { $set: post }, { new: true, upsert: true })
    if (post.options.purchasable) { await artist.addListed(post._id) }
    if (!post.options.purchasable) { await artist.addPosted(post._id) }
    // await post.setslug()
    // await post.seturl()
    // await post.save()
    if (post.comments.commentCount > 0) {
        await Comment.updateMany({ post: { $in: [post._id] } }, { $set: { 'links.parent': post.links.slug } }, { upsert: true })
        let comments = await Comment.find({ post: { $in: [post._id] } })
        comments.forEach(comment => {
            comment.seturl()
            comment.save()
        })
    }
    return res.status(200).json(post)
})

/**
 * @desc like a post
 * @route PUT /api/see/like/:post_slug
 * @auth private
*/

exports.like = ash(async (req, res, next) => {
    const artist = await Artist.findOne({ user: req.payload.id })
    const post = await Post.findOne({ _id: req.post })
    if (post.isLiked(artist._id)) return res.status(200).json({ msg: `you\'ve already liked this post` })
    await post.like(artist._id)
    await post.likesCount()
    return res.status(200).json(post)
})

/**
 * @desc unlike a post
 * @routePUT /api/see/unlike/:post_slug
 * @auth private
*/

exports.unlike = ash(async (req, res, next) => {
    const artist = await Artist.findOne({ user: req.payload.id })
    const post = await Post.findOne({ _id: req.post })
    if (!post.isLiked(artist._id)) return res.status(200).json({ msg: `you\'ve havnt liked this post yet` })
    await post.unlike(artist._id)
    await post.likesCount()
    return res.status(200).json(post)
})

/**
 * @desc favorite a post
 * @route PUT /api/see/favorite/:post_slug
 * @auth private
*/

exports.favorite = ash(async (req, res, next) => {
    const post = req.post
    const artist = await Artist.findOne({ user: req.payload.id })
    // if (artist.isFavorite(post.id)) return res.status(200).json({ msg: `you\'ve already favorited this post` })
    await Artist.updateOne({ user: req.payload.id }, { $push: { 'favorites.favorited': post } }, { new: true })
    // await artist.favorite(req.payload.id, post)
    await artist.favoriteCount()
    return res.status(200).json(artist)
})

/**
 * @desc unfavorite a post
 * @route PUT /api/see/unfavorite/:post_slug
 * @auth private
*/

exports.unfavorite = ash(async (req, res, next) => {
    const post = req.post
    const artist = await Artist.findOne({ user: req.payload.id })
    if (!artist.isFavorite(post.id)) return res.status(200).json({ msg: `you\'ve hav\'nt favorited this post yet` })
    await artist.updateOne({ user: req.payload.id }, { $pull: { 'favorites.favorited': post } }, { new: true })
    await artist.save()
    // await artist.unfavorite(post.id)
    await artist.favoriteCount()
    return res.status(200).json(artist)
})

/**
 * @desc deletes post
 * @route DELETE /api/see/delete
 * @auth private
*/

exports.delPost = ash(async (req, res, next) => {
    const poster = req.post.user
    const user = req.payload.id
    if (!user) return res.status(401).json({ msg: 'user is unauthenticated' })
    if (poster.toString() !== user.toString()) return res.status(403).json({ msg: 'user is not authorized' })
    if (post.options.purchasable) await artist.delListed(post._id)
    if (!post.options.purchasable) await artist.delPosted(post._id)
    await Comment.deleteMany({ post: req.post.id })
    await Post.findOneAndRemove({ user: user })
    return res.status(204).json({ msg: 'your post was removed' })
})

/**
 * @desc gets all comments
 * @route GET /api/see/:post_slug/comments
 * @auth public
*/

exports.comments = ash(async (req, res, next) => {
    const comments = req.post.comments.commented
    return res.status(200).json(comments)
})

/**
 * @desc creates a comment
 * @route PUT /api/see/:post_slug/comments
 * @auth private
*/

exports.newComment = ash(async (req, res, next) => {
    const post = req.post
    let comment = new Comment(req.body.comment)
    comment.post = req.post.id
    comment.user = req.payload.id
    comment.details.author = req.payload.username
    comment.details.email = req.payload.email
    comment.links.parent = req.post.links.slug
    await comment.save()
    await comment.setkey()
    await comment.setslug()
    await comment.seturl()
    await comment.save()
    await post.addComment(comment._id)
    await post.updateCommentCount()
    await Post.findOneAndUpdate({ _id: req.post.id }, { $push: [comment] }, { new: true, upsert: true })
    return res.status(200).json(comment)
})

/**
 * @desc get one comment
 * @route GET /api/see/:post_slug/comments/:comment_slug
 * @auth public
*/

exports.comment = ash(async (req, res, next) => {
    const comment = req.comment
    return res.status(200).json(comment.commentToJson())
})

/**
 * @desc update one comment
 * @route PUT /api/see/:post_slug/comments/:comment_slug
 * @auth private
*/

exports.upComment = ash(async (req, res, next) => {
    const { text } = req.body
    let commentFields = {}
    commentFields.details = {}
    commentFields.post = req.post.id
    commentFields.user = req.payload.id
    commentFields.details.author = req.payload.username
    commentFields.details.email = req.payload.email
    if (text) commentFields.details.text = text
    commentFields.updated = Date.now()
    let comment = await Comment.findOneAndUpdate({ _id: req.comment.id }, { $set: commentFields }, { new: true, upsert: true })
    await comment.setslug()
    await comment.seturl()
    await comment.save()
    return res.status(200).json(comment.commentToJson())
})

/**
 * @desc like a comment
 * @route PUT /api/see/:post_slug/comments/like/:comment_slug
 * @auth private
*/

exports.likeComment = ash(async (req, res, next) => {
    const artist = await Artist.findOne({ user: req.payload.id })
    const comment = await Comment.findOne({ _id: req.comment.id })
    if (comment.isLiked(artist._id)) return res.status(200).json({ msg: `you\'ve already liked this comment` })
    await comment.like(artist._id)
    await comment.likesCount()
    return res.status(200).json(comment)
})

/**
 * @desc unlike a comment
 * @route PUT /api/see/:post_slug/comments/unlike/:comment_slug
 * @auth private
*/

exports.unlikeComment = ash(async (req, res, next) => {
    const artist = await Artist.findOne({ user: req.payload.id })
    const comment = await Comment.findOne({ _id: req.comment.id })
    if (!comment.isLiked(artist._id)) return res.status(200).json({ msg: `you\'ve havnt liked this comment yet` })
    await comment.unlike(artist._id)
    await comment.likesCount()
    return res.status(200).json(comment)
})

/**
 * @desc deletes a comment
 * @route DELETE /api/see/:post_slug/comments/delete
 * @auth private
*/

exports.delComment = ash(async (req, res, next) => {
    const post = req.post
    await post.delComment(req.comment.id)
    await Comment.findOneAndRemove({ _id: req.comment.id })
    await post.updateCommentCount()
    return res.status(204).json({ msg: 'comment removed' })
})
