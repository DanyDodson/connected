const ash = require('express-async-handler')
const mongoose = require('mongoose')
const Profile = mongoose.model('Profile')
const User = mongoose.model('User')

exports.preloadUsername = ash(async (req, res, next, username) => {
    const profile = await Profile.findOne({ 'details.username': username })
    req.profile = profile
    return next()
})

exports.meProfile = ash(async (req, res, next) => {
    const user = await User.findById(req.payload.id)
    const profile = await Profile.findOne({ user: user.id })
    if (!profile) return res.status(400).json({ msg: 'user hasnt created a profile yet' })
    return res.status(200).json(profile)
})

exports.viewProfiles = ash(async (req, res, next) => {
    const profiles = await Profile.find({})
    if (!profiles) return res.status(404).json({ msg: 'no profiles found' })
    return res.status(200).json(profiles)
})

exports.viewProfile = ash(async (req, res, next) => {
    const profile = req.profile
    if (profile === null) return res.status(404).json({ msg: 'profile not found' })
    return res.status(200).json(profile)
})

exports.createProfile = ash(async (req, res, next) => {
    const user = await User.findById(req.payload.id)
    if (!user) return res.status(404).json({ msg: 'user not found' })
    const profile = new Profile(req.body)
    profile.user = user
    profile.details.image = user.image
    profile.details.email = user.email
    await profile.save()
    return res.status(200).json(profile)
})

exports.updateProfile = ash(async (req, res, next) => {
    const check = req.profile.user
    const user = await User.findById(req.payload.id)
    if (check.toString() !== user.id.toString()) return res.status(401).json({ msg: 'user is unauthenticated' })
    const { details } = req.body
    const profileFields = {}
    profileFields.user = user
    profileFields.details = {}
    profileFields.details.email = user.email
    profileFields.details.image = user.image
    if (details.username) profileFields.details.username = details.username
    if (details.name) profileFields.details.name = details.name
    if (details.about) profileFields.details.about = details.about
    let profile = await Profile.findOneAndUpdate({ user: user.id }, { $set: profileFields }, { new: true, upsert: false })
    profile.updateUrl(details.username)
    return res.status(200).json(profile)
})

exports.removeProfile = ash(async (req, res, next) => {
    const profile = req.profile
    if (!profile) return res.status(404).json({ msg: 'cannot remove null profile' })
    if (profile.user.toString() !== req.payload.id.toString()) return res.status(401).json({ msg: 'user not authenticated to do that' })
    await profile.remove()
    return res.status(200).json({ msg: 'successfully removed profile' })
})