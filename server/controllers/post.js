const ash = require('express-async-handler')
const passport = require('passport')
const mongoose = require('mongoose')
const Profile = mongoose.model('Profile')
const Post = mongoose.model('Post')
const Comment = mongoose.model('Comment')
const User = mongoose.model('User')

exports.preloadPost = ash(async (req, res, next, slug) => {
    const post = await Post.findOne({ 'links.slug': slug })
    req.post = post
    return next()
})

exports.preloadComment = ash(async (req, res, next, slug) => {
    const comment = await Comment.findOne({ 'comment.slug': slug })
    req.comment = comment
    return next()
})

exports.viewPosts = ash(async (req, res, next) => {
    const posts = await Post.find().sort({ date: -1 })
    return res.status(200).send(posts)
})

exports.viewPost = ash(async (req, res, next) => {
    const post = req.post
    if (post === null) return res.status(404).json({ msg: 'post not found' })
    return res.status(200).json(post)
})

exports.createPost = ash(async (req, res, next) => {
    const user = await User.findById(req.payload.id)
    const profile = await Profile.findOne({ user: user })
    const post = new Post(req.body)
    post.user = user
    post.info.author = profile.details.username
    await post.save()
    return res.json(post)
})

exports.updatePost = ash(async (req, res) => {
    const check = req.post.user
    const user = req.payload.id
    if (check.toString() !== user.toString()) return res.status(401).json({ msg: 'user is unauthenticated' })
    const { info, options, links, uploads } = req.post
    // const { info, options, links, uploads } = req.body
    const postFields = {}
    postFields.user = user
    postFields.info = {}
    postFields.links = {}
    postFields.options = {}
    postFields.updated = Date.now()
    // if (uploads) postFields.uploads = uploads
    if (info.title) postFields.info.title = info.title
    if (info.description) postFields.info.description = info.description
    if (info.price) postFields.info.price = info.price
    if (info.tags) postFields.info.tags = info.tags
    if (info.mediums) postFields.info.mediums = info.mediums
    if (options.critique) postFields.options.critique = options.critique
    if (options.shareable) postFields.options.shareable = options.shareable
    if (options.purchasable) postFields.options.purchasable = options.purchasable
    // if (links.slug) postFields.links.slug = ''
    // if (links.url) postFields.links.url = ''
    let post = await Post.findOneAndUpdate({ user: user.id }, { $set: postFields }, { new: true, upsert: false })
    // await post.setSlug()
    // await post.setUrl()
    // res.json({ body: req.body, })
    return res.status(200).json(post)
})

exports.postedPosts = ash(async (req, res) => {
    const posts = await Post.find({ 'info.author': req.params.username, 'info.type': posted }).sort({ date: -1 })
    return res.status(200).json(posts)
})

exports.listedPosts = ash(async (req, res) => {
    const posts = await Post.find({ 'info.author': req.params.username, 'info.type': listed }).sort({ date: -1 })
    return res.status(200).json(posts)
})

exports.removePost = ash(async (req, res, next) => {
    const check = req.post.user
    const user = await User.findById(req.payload.id)
    if (!user) return res.status(401).json({ msg: 'User is Unauthenticated' })
    if (check.toString() !== user.toString()) return res.status(403).json({ msg: 'forbidden: user is not aauthorized' })
    await post.remove()
    return res.status(204).send('No Content')
})

exports.viewComments = ash(async (req, res) => { return res.status(200).json({ msg: 'view comments route' }) })

exports.viewComment = ash(async (req, res) => { return res.status(200).json({ msg: 'view comment route' }) })

exports.createComment = ash(async (req, res) => { return res.status(200).json({ msg: 'create comment route' }) })

exports.updateComment = ash(async (req, res) => { return res.status(200).json({ msg: 'update comment route' }) })

exports.removeComment = ash(async (req, res) => { return res.status(200).json({ msg: 'remove comment route' }) })
