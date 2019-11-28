const ash = require('express-async-handler')
const mongoose = require('mongoose')
const Post = mongoose.model('Post')

exports.mediums = ash(async (req, res, next) => {
    const mediums = await Post.find().distinct('details.mediums')
    return res.status(200).json(mediums)
})
