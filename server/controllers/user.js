const ash = require('express-async-handler')
const mongoose = require('mongoose')
const User = mongoose.model('User')

exports.loadUserid = ash(async (req, res, next, id) => {
    const user = await User.userById(id)
    if (!user) return res.status(400).json({ error: 'User not found' })
    req.user = user
    next()
})

exports.viewStore = ash(async (req, res) => {
    return res.status(200).json({ msg: 'store view sellers route working' })
})

exports.viewSellers = ash(async (req, res) => {
    const users = await User.find()
    if (!users) return res.status(400).json({ error: 'no users found' })
    return res.status(200).json(users)
})

exports.viewSeller = ash(async (req, res) => {
    return res.status(200).json({ msg: 'account view seller route working' })
})

exports.updateSeller = ash(async (req, res) => {
    return res.status(200).json({ msg: 'account update seller route working' })
})

exports.viewBuyer = ash(async (req, res) => {
    return res.status(200).json({ msg: 'account view buyer route working' })
})

exports.updateBuyer = ash(async (req, res) => {
    return res.status(200).json({ msg: 'account update buyer route working' })
})