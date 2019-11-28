const ash = require('express-async-handler')
const mongoose = require('mongoose')
const Profile = mongoose.model('Profile')
const User = mongoose.model('User')

exports.preUsername = ash(async (req, res, next, username) => {
    const profile = await Profile.findOne({ 'details.username': username })
    req.profile = profile
    return next()
})

exports.newProfile = ash(async (req, res, next) => {
    const user = await User.findOne({ _id: req.payload.id })
    const profile = new Profile({ user: user.id, 'details.username': req.payload.username })
    await profile.save()
    user.profile = profile
    await user.save()
    return res.status(200).json({ msg: 'you\'re accounts been verified.' })
})

exports.profiles = ash(async (req, res, next) => {
    const profiles = await Profile.find()
    return res.status(200).json(profiles)
})

exports.profile = ash(async (req, res, next) => {
    const profile = req.profile
    if (profile === null) return res.status(404).json({ msg: 'profile not found' })
    return res.status(200).json(profile.profileToJson(profile))
})

exports.upProfile = ash(async (req, res, next) => {
    const user = await User.findOne({ _id: req.payload.id })
    const { name, username, about, image, } = req.body
    const { blog, instagram, twitter, facebook, youtube, linkedin, } = req.body
    const { profile_bg_color, profile_fg_color, profile_link_color, profile_menu_bg_color, profile_menu_fg_color, } = req.body
    const { role, status, phone, street, city, state, zipcode, } = req.body
    const profileFields = {}
    profileFields.user = user
    profileFields.details = {}
    profileFields.details.email = user.email
    if (name) profileFields.details.name = name
    if (username) profileFields.details.username = username
    if (about) profileFields.details.about = about
    if (image) profileFields.details.image = image || user.image
    profileFields.socials = {}
    if (blog) profileFields.socials.blog = blog
    if (instagram) profileFields.socials.instagram = instagram
    if (twitter) profileFields.socials.twitter = twitter
    if (facebook) profileFields.socials.facebook = facebook
    if (youtube) profileFields.socials.youtube = youtube
    if (linkedin) profileFields.socials.linkedin = linkedin
    profileFields.colors = {}
    if (profile_bg_color) profileFields.colors.profile_bg_color = profile_bg_color
    if (profile_fg_color) profileFields.colors.profile_fg_color = profile_fg_color
    if (profile_link_color) profileFields.colors.profile_link_color = profile_link_color
    if (profile_menu_bg_color) profileFields.colors.profile_menu_bg_color = profile_menu_bg_color
    if (profile_menu_fg_color) profileFields.colors.profile_menu_fg_color = profile_menu_fg_color
    profileFields.vender = {}
    if (role) profileFields.vender.role = role
    if (status) profileFields.vender.status = status
    if (phone) profileFields.vender.phone = phone
    profileFields.vender.location = {}
    profileFields.vender.location.address = {}
    if (street) profileFields.vender.location.address.street = street
    if (city) profileFields.vender.location.address.city = city
    if (state) profileFields.vender.location.address.state = state
    if (zipcode) profileFields.vender.location.address.zipcode = zipcode
    profileFields.updated = Date.now()
    let profile = await Profile.findOneAndUpdate({ user: req.payload.id }, { $set: profileFields }, { new: true, upsert: true })
    await profile.setUrl()
    user.username = username
    await user.save()
    return res.status(200).json(profile)
})

exports.addFollowing = ash(async (req, res, next) => {
    const profile = await Profile.findOne({ user: req.payload.id })
    if (profile.isFollowing(req.body.profileId)) return res.status(200).json({ msg: `your already following this user` })
    await profile.setFollowing(req.body.profileId)
    await profile.followingCount()
    next()
})

exports.addFollower = ash(async (req, res, next) => {
    const follower = await Profile.findOne({ user: req.payload.id })
    const profile = await Profile.findOne({ _id: req.body.profileId })
    await profile.setFollower(follower.id)
    await profile.followerCount()
    return res.status(200).json({ msg: `your now following ${profile.details.username}` })
})

exports.delFollowing = ash(async (req, res, next) => {
    const profile = await Profile.findOne({ user: req.payload.id })
    if (!profile.isFollowing(req.body.profileId)) return res.status(200).json({ msg: `your not following this user` })
    await profile.delFollowing(req.body.profileId)
    await profile.followingCount()
    next()
})

exports.delFollower = ash(async (req, res, next) => {
    const follower = await Profile.findOne({ user: req.payload.id })
    const followed = await Profile.findOne({ _id: req.body.profileId })
    await followed.delFollower(follower.id)
    await followed.followerCount()
    return res.status(200).json({ msg: `your no longer following ${followed.details.username}` })
})

exports.delProfile = ash(async (req, res, next) => {
    const profile = req.profile
    if (!profile) return res.status(404).json({ msg: 'cannot remove null profile' })
    if (profile.user.toString() !== req.payload.id.toString()) return res.status(401).json({ msg: 'user not authenticated to do that' })
    await profile.remove()
    return res.status(200).json({ msg: 'successfully removed profile' })
})