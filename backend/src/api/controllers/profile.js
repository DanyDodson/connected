const asyncHandler = require('express-async-handler')
// const config = require('config')

const {
    testService,
    loadUsernamesService,
    profilesFeedService,
    newProfileService,
} = require('../../services/profile')


/**
 * @desc auth test route
 * @route GET /api/auth
 * @auth public
*/
exports.testingCtrl = asyncHandler(async (req, res, next) => {
    const msg = await testService()
    return res.status(201).json({ msg: msg })
})

/**
 * @desc runs on paths containing :pro_name
 * @route PARAM /:profile_name
 * @auth public
*/
exports.loadUsernamesCtrl = asyncHandler(async (req, res, next, username) => {
    const { profile } = await loadUsernamesService(username)
    req.profile = profile
    return next()
})

/**
 * @desc creates an profile
 * @route POST /api/profiles/create
 * @auth private
*/
exports.newProfileCtrl = asyncHandler(async (req, res, next) => {
    const { profile } = await newProfileService(req.payload)
})

/**
 * @desc get all profiles
 * @route GET /api/profiles
 * @auth public
*/
exports.profilesFeedCtrl = asyncHandler(async (req, res, next) => {
    const profiles = await profilesFeedService()
    return res.status(200).json(profiles)
})

/**
 * @desc gets one profile
 * @route GET /api/profiles/:pro_name
 * @auth public
*/
// exports.profile = asyncHandler(async (req, res, next) => {
//     const profile = req.profile
//     if (profile === null) return res.status(404).json({ msg: 'profile not found' })
//     return res.status(200).json({ profile: profile })
// })

/**
 * @desc updates one profile
 * @route PUT /api/profiles/:pro_name
 * @auth private
*/
// exports.upProfile = asyncHandler(async (req, res, next) => {
//     const user = await User.findOne({ _id: req.payload.id })
//     const { name, username, about, image } = req.body
//     const { blog, instagram, twitter, facebook, youtube, linkedin } = req.body
//     const { role, status } = req.body
//     const { street, city, state, zip } = req.body
//     const { phone } = req.body
//     const { stars, critique } = req.body
//     let old = req.profile
//     let fresh = {}
//     fresh.user = user
//     fresh.details = {}
//     fresh.details.email = user.email
//     name ? fresh.details.name = name : fresh.details.name = old.details.name
//     username ? fresh.details.username = username : fresh.details.username = old.details.username
//     about ? fresh.details.about = about : fresh.details.about = old.details.about
//     image ? fresh.details.image = image : fresh.details.image = img
//     fresh.socials = {}
//     blog ? fresh.socials.blog = blog : fresh.socials.blog = old.socials.blog
//     instagram ? fresh.socials.instagram = instagram : fresh.socials.instagram = old.socials.instagram
//     twitter ? fresh.socials.twitter = twitter : fresh.socials.twitter = old.socials.twitter
//     facebook ? fresh.socials.facebook = facebook : fresh.socials.facebook = old.socials.facebook
//     youtube ? fresh.socials.youtube = youtube : fresh.socials.youtube = old.socials.youtube
//     linkedin ? fresh.socials.linkedin = linkedin : fresh.socials.linkedin = old.socials.linkedin
//     fresh.vender = {}
//     role ? fresh.vender.role = role : fresh.vender.role = old.vender.role
//     status ? fresh.vender.status = status : fresh.vender.status = old.vender.status
//     fresh.vender.contact = {}
//     phone ? fresh.vender.contact.phone = phone : fresh.vender.contact.phone = old.vender.contact.phone
//     fresh.vender.reviews = {}
//     stars ? fresh.vender.reviews.stars = stars : fresh.vender.reviews.stars = old.vender.reviews.stars
//     critique ? fresh.vender.reviews.critique = critique : fresh.vender.reviews.critique = old.vender.reviews.critique
//     fresh.vender.contact.address = {}
//     street ? fresh.vender.contact.address.street = street : fresh.vender.contact.address.street = old.vender.contact.address.street
//     city ? fresh.vender.contact.address.city = city : fresh.vender.contact.address.city = old.vender.contact.address.city
//     state ? fresh.vender.contact.address.state = state : fresh.vender.contact.address.state = old.vender.contact.address.state
//     zip ? fresh.vender.contact.address.zip = zip : fresh.vender.contact.address.zip = old.vender.contact.address.zip
//     let profile = await Profile.findOneAndUpdate({ user: user._id }, { $set: fresh }, { new: true, upsert: true })
//     await profile.setUrl()
//     username ? user.username = username : user.username = user.username
//     await user.save()
//     return res.status(200).json({ profile: profile })
// })

/**
 * @desc adds profile to following
 * @route PUT /api/profiles/unfollow
 * @auth private
*/
// exports.addFollowing = asyncHandler(async (req, res, next) => {
//     const profile = await Profile.findOne({ user: req.payload.id })
//     if (profile.isFollowing(req.body.profileId)) return res.status(200).json({ msg: `your already following this user` })
//     await profile.setFollowing(req.body.profileId)
//     await profile.followingCount()
//     next()
// })

/**
 * @desc adds profile to followers
 * @route PUT /api/profiles/unfollow
 * @auth private
*/
// exports.addFollower = asyncHandler(async (req, res, next) => {
//     const follower = await Profile.findOne({ user: req.payload.id })
//     const profile = await Profile.findOne({ _id: req.body.profileId })
//     await profile.setFollower(follower._id)
//     await profile.followerCount()
//     return res.status(200).json({ msg: `your now following ${profile.details.username}` })
// })

/**
 * @desc removes profile from following
 * @route PUT /api/profiles/unfollow
 * @auth private
*/
// exports.delFollowing = asyncHandler(async (req, res, next) => {
//     const profile = await Profile.findOne({ user: req.payload.id })
//     if (!profile.isFollowing(req.body.profileId)) return res.status(200).json({ msg: `your not following this user` })
//     await profile.delFollowing(req.body.profileId)
//     await profile.followingCount()
//     next()
// })

/**
 * @desc removes profile from followers
 * @route PUT /api/profiles/unfollow
 * @auth private
*/
// exports.delFollower = asyncHandler(async (req, res, next) => {
//     const follower = await Profile.findOne({ user: req.payload.id })
//     const followed = await Profile.findOne({ _id: req.body.profileId })
//     await followed.delFollower(follower._id)
//     await followed.followerCount()
//     return res.status(200).json({ msg: `your no longer following ${followed.details.username}` })
// })

/**
 * @desc delete current profile
 * @route DELETE /api/profiles
 * @auth private
*/
// exports.delProfile = asyncHandler(async (req, res, next) => {
//     const profile = await Profile.findOne({ user: req.payload.id })
//     if (!profile) return res.status(404).json({ msg: 'cannot remove null profile' })
//     if (profile.user.toString() !== req.payload.id.toString()) return res.status(401).json({ msg: 'user not authenticated to do that' })
//     await profile.remove()
//     return res.status(204).json({ msg: 'successfully removed profile' })
// })
