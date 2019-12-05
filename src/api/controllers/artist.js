// cleans up async
import ash = require('express-async-handler')

// global configs
import config = require('config')

// db schemas
import mongoose = require('mongoose')
import Artist = mongoose.model('Artist')
import User = mongoose.model('User')

/**
 * @desc runs on paths containing :pro_name
 * @route PARAM /:pro_name
 * @auth public
*/

exports.proName = ash(async (req, res, next, pro_name) => {
    const artist = await Artist.findOne({ 'details.username': pro_name })
    if (!artist) return res.status(400).json({ err: 'artist with that username not found' })
    req.artist = artist
    return next()
})

/**
 * @desc creates an artist
 * @route POST /api/artists/create
 * @auth private
*/

exports.newArtist = ash(async (req, res, next) => {
    const user = await User.findOne({ _id: req.payload.id })
    const artist = new Artist({ user: user.id, 'details.username': req.payload.username })
    await artist.save()
    user.artist = artist
    await user.save()
    return res.status(200).json({ msg: 'you\'re accounts been verified.', artist: artist })
})

/**
 * @desc get all artists
 * @route GET /api/artists
 * @auth public
*/

exports.artists = ash(async (req, res, next) => {
    const artists = await Artist.find({})
    return res.status(200).json(artists)
})

/**
 * @desc gets one artist
 * @route GET /api/artists/:pro_name
 * @auth public
*/

exports.artist = ash(async (req, res, next) => {
    const artist = req.artist
    if (artist === null) return res.status(404).json({ msg: 'artist not found' })
    return res.status(200).json({ artist: artist })
})

/**
 * @desc updates one artist
 * @route PUT /api/artists/:pro_name
 * @auth private
*/

exports.upArtist = ash(async (req, res, next) => {
    const user = await User.findOne({ _id: req.payload.id })
    const { name, username, about, image } = req.body
    const { blog, instagram, twitter, facebook, youtube, linkedin } = req.body
    const { pback, pfore, plink, mback, mfore } = req.body
    const { role, status } = req.body
    const { street, city, state, zip } = req.body
    const { type, points } = req.body
    const { phone } = req.body
    const { stars, critique } = req.body
    let old = req.artist
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
    let artist = await Artist.findOneAndUpdate({ user: user._id }, { $set: fresh }, { new: true, upsert: true })
    await artist.setUrl()
    username ? user.username = username : user.username = user.username
    await user.save()
    return res.status(200).json({ artist: artist })
})

/**
 * @desc adds artist to following
 * @route PUT /api/artists/unfollow
 * @auth private
*/

exports.addFollowing = ash(async (req, res, next) => {
    const artist = await Artist.findOne({ user: req.payload.id })
    if (artist.isFollowing(req.body.artistId)) return res.status(200).json({ msg: `your already following this user` })
    await artist.setFollowing(req.body.artistId)
    await artist.followingCount()
    next()
})

/**
 * @desc adds artist to followers
 * @route PUT /api/artists/unfollow
 * @auth private
*/

exports.addFollower = ash(async (req, res, next) => {
    const follower = await Artist.findOne({ user: req.payload.id })
    const artist = await Artist.findOne({ _id: req.body.artistId })
    await artist.setFollower(follower._id)
    await artist.followerCount()
    return res.status(200).json({ msg: `your now following ${artist.details.username}` })
})

/**
 * @desc removes artist from following
 * @route PUT /api/artists/unfollow
 * @auth private
*/

exports.delFollowing = ash(async (req, res, next) => {
    const artist = await Artist.findOne({ user: req.payload.id })
    if (!artist.isFollowing(req.body.artistId)) return res.status(200).json({ msg: `your not following this user` })
    await artist.delFollowing(req.body.artistId)
    await artist.followingCount()
    next()
})

/**
 * @desc removes artist from followers
 * @route PUT /api/artists/unfollow
 * @auth private
*/

exports.delFollower = ash(async (req, res, next) => {
    const follower = await Artist.findOne({ user: req.payload.id })
    const followed = await Artist.findOne({ _id: req.body.artistId })
    await followed.delFollower(follower._id)
    await followed.followerCount()
    return res.status(200).json({ msg: `your no longer following ${followed.details.username}` })
})

/**
 * @desc delete current artist
 * @route DELETE /api/artists
 * @auth private
*/

exports.delArtist = ash(async (req, res, next) => {
    const artist = await Artist.findOne({ user: req.payload.id })
    if (!artist) return res.status(404).json({ msg: 'cannot remove null artist' })
    if (artist.user.toString() !== req.payload.id.toString()) return res.status(401).json({ msg: 'user not authenticated to do that' })
    await artist.remove()
    return res.status(204).json({ msg: 'successfully removed artist' })
})
