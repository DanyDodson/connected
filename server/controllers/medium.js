// Data validation
const ash = require('express-async-handler')

// Database schemas
const mongoose = require('mongoose')
const Post = mongoose.model('Post')

/** 
 * @desc runs on paths containing :mediums 
 * @route PARAM /:mediums
 * @auth public
*/

exports.loadMediums = ash(async (req, res, next, medium) => {
    const mediums = await Post.find({ 'details.mediums': medium })
    if (!mediums) return res.status(400).json({ err: 'no mediums found' })
    req.mediums = mediums
    return next()
})

/** 
 * @desc Get all mediums
 * @route GET /api/mediums
 * @auth public
*/

exports.mediums = ash(async (req, res, next) => {
    const mediums = await Post.find().distinct('details.mediums')
    return res.status(200).json(mediums)
})
