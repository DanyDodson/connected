// cleans up async
const ash = require('express-async-handler')

// db schemas
const user = require('../../models/user')

/**
 * @desc runs on paths containing :user_id
 * @route PARAM /:user_id
 * @auth public
 */

exports.loadUserId() => {
  exports.loadUserId = ash(async (req, res, next, userId) => {
    const currentUser = await user.findOne({ _id: userId })
    if (!currentUser) return res.status(400).json({ error: 'user not found' })
    req.user = currentUser
    next()
  })
}

exports.viewStore = ash(async (req, res, next) => {
  return res.status(200).json({ msg: 'store view sellers route working' })
})

exports.viewSellers = ash(async (req, res, next) => {
  const users = await user.find()
  if (!users) return res.status(400).json({ error: 'no users found' })
  return res.status(200).json(users)
})

exports.viewSeller = ash(async (req, res, next) => {
  return res.status(200).json({ msg: 'account view seller route working' })
})

exports.updateSeller = ash(async (req, res, next) => {
  return res.status(200).json({ msg: 'account update seller route working' })
})

exports.viewBuyer = ash(async (req, res, next) => {
  return res.status(200).json({ msg: 'account view buyer route working' })
})

exports.updateBuyer = ash(async (req, res, next) => {
  return res.status(200).json({ msg: 'account update buyer route working' })
})

