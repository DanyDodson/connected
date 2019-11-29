const ash = require('express-async-handler')
const mongoose = require('mongoose')
const config = require('config')
const img = config.get('user.image')
const Profile = mongoose.model('Profile')
const User = mongoose.model('User')

/** 
 * @desc runs on req paths containing :pro_name 
 * @route  PARAM /:pro_name
 * @access Public
 * 
*/

exports.proName = ash(async (req, res, next, pro_name) => {
    const profile = await Profile.findOne({ 'details.username': pro_name })
    if (!profile) return res.status(400).json({ err: 'profile with that username not found' })
    req.profile = profile
    return next()
})

/**
 * @desc Create a profile
 * @route POST /api/artists/create
 * @access Private
*/

exports.newProfile = ash(async (req, res, next) => {
    const user = await User.findOne({ _id: req.payload.id })
    const profile = new Profile({ user: user.id, 'details.username': req.payload.username })
    await profile.save()
    user.profile = profile
    await user.save()
    return res.status(200).json({ msg: 'you\'re accounts been verified.', profile: profile })
})

/**
 * @desc Get all profiles
 * @route GET /api/artists
 * @access Public
*/

exports.profiles = ash(async (req, res, next) => {
    const profiles = await Profile.find({})
    return res.status(200).json(profiles)
})

/**
 * @desc Get one profile
 * @route GET /api/artists/:pro_name
 * @access Public
*/

exports.profile = ash(async (req, res, next) => {
    const profile = req.profile
    if (profile === null) return res.status(404).json({ msg: 'profile not found' })
    return res.status(200).json({ profile: profile })
})

/**
 * @desc Update one profile
 * @route PUT /api/artists/:pro_name
 * @access Private
*/

exports.upProfile = ash(async (req, res, next) => {
    const user = await User.findOne({ _id: req.payload.id })
    const { name, username, about, image } = req.body
    const { blog, instagram, twitter, facebook, youtube, linkedin } = req.body
    const { pback, pfore, plink, mback, mfore } = req.body
    const { role, status } = req.body
    const { street, city, state, zip } = req.body
    const { type, points } = req.body
    const { phone } = req.body
    const { stars, critique } = req.body
    let old = req.profile
    let fresh = {}
    fresh.user = user
    fresh.details = {}
    fresh.details.email = user.email
    name ? fresh.details.name = name : fresh.details.name = old.details.name
    username ? fresh.details.username = username : fresh.details.username = old.details.username
    about ? fresh.details.about = about : fresh.details.about = old.details.about
    image ? fresh.details.image = image : fresh.details.image = img
    fresh.socials = {}
    blog ? fresh.socials.blog = blog : fresh.socials.blog = old.socials.blog
    instagram ? fresh.socials.instagram = instagram : fresh.socials.instagram = old.socials.instagram
    twitter ? fresh.socials.twitter = twitter : fresh.socials.twitter = old.socials.twitter
    facebook ? fresh.socials.facebook = facebook : fresh.socials.facebook = old.socials.facebook
    youtube ? fresh.socials.youtube = youtube : fresh.socials.youtube = old.socials.youtube
    linkedin ? fresh.socials.linkedin = linkedin : fresh.socials.linkedin = old.socials.linkedin
    fresh.colors = {}
    pback ? fresh.colors.pback = pback : fresh.colors.pback = old.colors.pback
    pfore ? fresh.colors.pfore = pfore : fresh.colors.pfore = old.colors.pfore
    plink ? fresh.colors.plink = plink : fresh.colors.plink = old.colors.plink
    mback ? fresh.colors.mback = mback : fresh.colors.mback = old.colors.mback
    mfore ? fresh.colors.mfore = mfore : fresh.colors.mfore = old.colors.mfore
    fresh.vender = {}
    role ? fresh.vender.role = role : fresh.vender.role = old.vender.role
    status ? fresh.vender.status = status : fresh.vender.status = old.vender.status
    fresh.vender.contact = {}
    phone ? fresh.vender.contact.phone = phone : fresh.vender.contact.phone = old.vender.contact.phone
    fresh.vender.reviews = {}
    stars ? fresh.vender.reviews.stars = stars : fresh.vender.reviews.stars = old.vender.reviews.stars
    critique ? fresh.vender.reviews.critique = critique : fresh.vender.reviews.critique = old.vender.reviews.critique
    fresh.vender.contact.address = {}
    street ? fresh.vender.contact.address.street = street : fresh.vender.contact.address.street = old.vender.contact.address.street
    city ? fresh.vender.contact.address.city = city : fresh.vender.contact.address.city = old.vender.contact.address.city
    state ? fresh.vender.contact.address.state = state : fresh.vender.contact.address.state = old.vender.contact.address.state
    zip ? fresh.vender.contact.address.zip = zip : fresh.vender.contact.address.zip = old.vender.contact.address.zip
    fresh.vender.contact.geo = {}
    type ? fresh.vender.contact.geo.type = type : fresh.vender.contact.geo.type = old.vender.contact.geo.type
    points ? fresh.vender.contact.geo.points = points : fresh.vender.contact.geo.points = old.vender.contact.geo.points
    let profile = await Profile.findOneAndUpdate({ user: user._id }, { $set: fresh }, { new: true, upsert: true })
    await profile.setUrl()
    username ? user.username = username : user.username = user.username
    await user.save()
    return res.status(200).json({ profile: profile })
})

/**
 * @desc Add one profile._id to following
 * @route PUT /api/artists/unfollow
 * @access Private
*/

exports.addFollowing = ash(async (req, res, next) => {
    const profile = await Profile.findOne({ user: req.payload.id })
    if (profile.isFollowing(req.body.profileId)) return res.status(200).json({ msg: `your already following this user` })
    await profile.setFollowing(req.body.profileId)
    await profile.followingCount()
    next()
})

/**
 * @desc Add one profile._id to followers
 * @route PUT /api/artists/unfollow
 * @access Private
*/

exports.addFollower = ash(async (req, res, next) => {
    const follower = await Profile.findOne({ user: req.payload.id })
    const profile = await Profile.findOne({ _id: req.body.profileId })
    await profile.setFollower(follower._id)
    await profile.followerCount()
    return res.status(200).json({ msg: `your now following ${profile.details.username}` })
})

/**
 * @desc Remove one profile._id from following
 * @route PUT /api/artists/unfollow
 * @access Private
*/

exports.delFollowing = ash(async (req, res, next) => {
    const profile = await Profile.findOne({ user: req.payload.id })
    if (!profile.isFollowing(req.body.profileId)) return res.status(200).json({ msg: `your not following this user` })
    await profile.delFollowing(req.body.profileId)
    await profile.followingCount()
    next()
})

/**
 * @desc Remove one profile._id from followers
 * @route PUT /api/artists/unfollow
 * @access Private
*/

exports.delFollower = ash(async (req, res, next) => {
    const follower = await Profile.findOne({ user: req.payload.id })
    const followed = await Profile.findOne({ _id: req.body.profileId })
    await followed.delFollower(follower._id)
    await followed.followerCount()
    return res.status(200).json({ msg: `your no longer following ${followed.details.username}` })
})

/**
 * @desc Delete one profile
 * @route DELETE /api/artists
 * @access Private
*/

exports.delProfile = ash(async (req, res, next) => {
    const profile = await Profile.findOne({ user: req.payload.id })
    if (!profile) return res.status(404).json({ msg: 'cannot remove null profile' })
    if (profile.user.toString() !== req.payload.id.toString()) return res.status(401).json({ msg: 'user not authenticated to do that' })
    await profile.remove()
    return res.status(204).json({ msg: 'successfully removed profile' })
})