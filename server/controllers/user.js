const ash = require('express-async-handler')
const mongoose = require('mongoose')
const User = mongoose.model('User')

exports.preloadUserId = ash(async (req, res, next, id) => {
    const user = await User.userById(id)
    if (!user) return res.status(400).json({ error: 'User not found' })
    req.user = user
    next()
})