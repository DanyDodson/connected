// // cleans up async
// const ash = require('express-async-handler')

// // db schemas
// const mongoose = require('mongoose')
// const Post = mongoose.model('Post')

// /**
//  * @desc runs on paths containing :tags
//  * @route PARAM /:tags
//  * @auth public
// */

// exports.loadTags = ash(async (req, res, next, tag) => {
//     const tags = await Post.find({ 'details.tags': tag })
//     if (!tags) return res.status(400).json({ err: 'no tags found' })
//     req.tags = tags
//     return next()
// })

// /**
//  * @desc gets all tags
//  * @route GET /api/tags
//  * @auth public
// */

// exports.tags = ash(async (req, res) => {
//     const tags = await Post.find().distinct('details.tags')
//     return res.status(200).json(tags)
// })
