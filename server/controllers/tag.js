const ash = require('express-async-handler')
const mongoose = require('mongoose')
const Post = mongoose.model('Post')

exports.tags = ash(async (req, res) => {
    const tags = await Post.find().distinct('details.tags')
    return res.status(200).json(tags)
})
