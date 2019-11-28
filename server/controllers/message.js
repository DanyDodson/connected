const ash = require('express-async-handler')
const mongoose = require('mongoose')
const User = mongoose.model('User')

exports.messages = (req, res) => {
    return res.status(200).json({ message: 'messages route working' })
}
