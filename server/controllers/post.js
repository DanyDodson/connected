const ash = require('express-async-handler')
const passport = require('passport')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Profile = mongoose.model('Profile')
const Post = mongoose.model('Post')
const Comment = mongoose.model('Comment')

exports.loadPost = ash(async (req, res, next, post_slug) => {
    const post = await Post.findOne({ 'links.slug': post_slug })
    req.post = post
    return next()
})

exports.loadComment = ash(async (req, res, next, comment_slug) => {
    const comment = await Comment.findOne({ 'links.slug': comment_slug })
    req.comment = comment
    return next()
})

exports.posts = ash(async (req, res, next) => {
    const posts = await Post.find().sort({ date: -1 })
    return res.status(200).send(posts)
})

exports.post = ash(async (req, res, next) => {
    const post = req.post
    if (post === null) return res.status(404).json({ msg: 'post not found' })
    return res.status(200).json(post)
})

exports.newPost = ash(async (req, res, next) => {
    const user = await User.findOne({ _id: req.payload.id }).populate('profile', '_id details.username')
    const profile = await Profile.findOne({ user: req.payload.id })
    const post = new Post()
    post.user = user
    post.profile = profile
    post.details.mediums = req.body.mediums
    post.details.title = req.body.title
    post.details.description = req.body.description
    post.details.tags = req.body.tags
    post.details.price = req.body.price
    post.details.author = profile.username
    post.options.critique = req.body.critique
    post.options.shareable = req.body.shareable
    post.options.purchasable = req.body.purchasable
    await post.save()
    // await post.setkey()
    // await post.save()
    return res.json(post)
})

exports.upPost = ash(async (req, res) => {
    const profile = await Profile.findOne({ user: req.payload.id })
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
    if (post.options.purchasable) { await profile.addListed(post._id) }
    if (!post.options.purchasable) { await profile.addPosted(post._id) }
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

exports.like = ash(async (req, res, next) => {
    const profile = await Profile.findOne({ user: req.payload.id })
    const post = await Post.findOne({ _id: req.post })
    if (post.isLiked(profile._id)) return res.status(200).json({ msg: `you\'ve already liked this post` })
    await post.like(profile._id)
    await post.likesCount()
    return res.status(200).json(post)
})

exports.unlike = ash(async (req, res, next) => {
    const profile = await Profile.findOne({ user: req.payload.id })
    const post = await Post.findOne({ _id: req.post })
    if (!post.isLiked(profile._id)) return res.status(200).json({ msg: `you\'ve havnt liked this post yet` })
    await post.unlike(profile._id)
    await post.likesCount()
    return res.status(200).json(post)
})

exports.favorite = ash(async (req, res, next) => {
    const post = req.post
    const profile = await Profile.findOne({ user: req.payload.id })
    if (profile.isFavorite(post.id)) return res.status(200).json({ msg: `you\'ve already favorited this post` })
    await profile.favorite(post.id)
    await profile.favoriteCount()
    return res.status(200).json(profile)
})

exports.unfavorite = ash(async (req, res, next) => {
    const post = req.post
    const profile = await Profile.findOne({ user: req.payload.id })
    if (!profile.isFavorite(post.id)) return res.status(200).json({ msg: `you\'ve hav\'nt favorited this post yet` })
    await profile.unfavorite(post.id)
    await profile.favoriteCount()
    return res.status(200).json(profile)
})

exports.delPost = ash(async (req, res, next) => {
    const poster = req.post.user
    const user = req.payload.id
    if (!user) return res.status(401).json({ msg: 'user is unauthenticated' })
    if (poster.toString() !== user.toString()) return res.status(403).json({ msg: 'user is not authorized' })
    if (post.options.purchasable) await profile.delListed(post._id)
    if (!post.options.purchasable) await profile.delPosted(post._id)
    await Comment.deleteMany({ post: req.post.id })
    await Post.findOneAndRemove({ user: user })
    return res.status(204).json({ msg: 'your post was removed' })
})

exports.comments = ash(async (req, res, next) => {
    const comments = req.post.comments.commented
    return res.status(200).json(comments)
})

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

exports.comment = ash(async (req, res, next) => {
    const comment = req.comment
    return res.status(200).json(comment.commentToJson())
})

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

exports.likeComment = ash(async (req, res, next) => {
    const profile = await Profile.findOne({ user: req.payload.id })
    const comment = await Comment.findOne({ _id: req.comment.id })
    if (comment.isLiked(profile._id)) return res.status(200).json({ msg: `you\'ve already liked this comment` })
    await comment.like(profile._id)
    await comment.likesCount()
    return res.status(200).json(comment)
})

exports.unlikeComment = ash(async (req, res, next) => {
    const profile = await Profile.findOne({ user: req.payload.id })
    const comment = await Comment.findOne({ _id: req.comment.id })
    if (!comment.isLiked(profile._id)) return res.status(200).json({ msg: `you\'ve havnt liked this comment yet` })
    await comment.unlike(profile._id)
    await comment.likesCount()
    return res.status(200).json(comment)
})

exports.delComment = ash(async (req, res, next) => {
    const post = req.post
    await post.delComment(req.comment.id)
    await Comment.findOneAndRemove({ _id: req.comment.id })
    await post.updateCommentCount()
    return res.status(204).json({ msg: 'comment removed' })
})
