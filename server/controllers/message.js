// Data validation
const ash = require('express-async-handler')

// Database schemas
const mongoose = require('mongoose')
const User = mongoose.model('User')

/** 
 * @desc Get all messages
 * @route GET /api/:pro_name/messages/all
 * @auth Private
*/

exports.messages = (req, res) => {
    return res.status(200).json({ message: 'messages route working' })
}
