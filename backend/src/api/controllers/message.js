// cleans up async
const ash = require('express-async-handler')

// db schemas
const mongoose = require('mongoose')
const User = mongoose.model('User')

/**
 * @desc get all messages
 * @route GET /api/messages
 * @auth private
*/

exports.messages = (req, res) => {
    return res.status(200).json({ message: 'messages route working' })
}
