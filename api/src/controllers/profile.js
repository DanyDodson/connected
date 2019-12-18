import { Container } from 'typedi'
import ProfileService from '../services/profile'

import asyncHandler from 'express-async-handler'

/**
 * @desc auth test route
 * @route GET /api/auth
 * @auth public
*/
export const testingCtrl = asyncHandler(async (req, res, next) => {
    const profileServiceInstance = await Container.get(ProfileService)
    const msg = await profileServiceInstance.testingService()
    return res.status(201).json({ msg: msg })
})

/**
 * @desc runs on paths containing :pro_name
 * @route PARAM /:profile_name
 * @auth public
*/
export const loadUsernamesCtrl = asyncHandler(async (req, res, next, username) => {
    const profileServiceInstance = await Container.get(ProfileService)
    const { profile } = await profileServiceInstance.loadUsernamesService(username)
    req.profile = profile
    return next()
})

/**
 * @desc get all profiles
 * @route GET /api/profiles
 * @auth public
*/
export const profilesFeedCtrl = asyncHandler(async (req, res, next) => {
    const profileServiceInstance = await Container.get(ProfileService)
    const { profiles } = await profileServiceInstance.profilesFeedService()
    return res.status(200).json(profiles)
})

/**
 * @desc creates an profile
 * @route POST /api/profiles/create
 * @auth private
*/
export const newProfileCtrl = asyncHandler(async (req, res, next) => {
    const profileServiceInstance = await Container.get(ProfileService)
    const { profile } = await profileServiceInstance.newProfileService(req.payload)
    return res.status(200).json(profile)
})

/**
 * @desc gets one profile
 * @route GET /api/profiles/:username
 * @auth public
*/
export const getProfileCtrl = asyncHandler(async (req, res, next) => {
    const profileServiceInstance = await Container.get(ProfileService)
    const { profile } = await profileServiceInstance.getProfileService(req.profile)
    if (profile === null) return res.status(404).json({ msg: 'profile not found' })
    return res.status(200).json(profile)
})

/**
 * @desc updates one profile
 * @route PUT /api/profiles/:pro_name
 * @auth private
 */
export const updateProfileCtrl = asyncHandler(async (req, res, next) => {
    const profileServiceInstance = await Container.get(ProfileService)
    const { profile } = await profileServiceInstance.updateProfileService(req.payload.id, req.body)
    return res.status(200).json(profile)
})

/**
 * @desc adds profile to following
 * @route PUT /api/profiles/unfollow
 * @auth private
 */
export const addFollowingCtrl = asyncHandler(async (req, res, next) => {
    // const profileServiceInstance = await Container.get(ProfileService)
    // const { profile } = await profileServiceInstance.addFollowingService(req.payload.id, req.body)

    // const profile = await Profile.findOne({ user: req.payload.id })
    // if (profile.isFollowing(req.body.profileId)) return res.status(200).json({ msg: `your already following this user` })
    // await profile.setFollowing(req.body.profileId)
    // await profile.followingCount()
    // next()
    return
})

/**
 * @desc adds profile to followers
 * @route PUT /api/profiles/unfollow
 * @auth private
 */
export const addFollowerCtrl = asyncHandler(async (req, res, next) => {
    // const profileServiceInstance = await Container.get(ProfileService)
    // const { profile } = await profileServiceInstance.addFollowerService(req.payload.id, req.body)

    // const follower = await Profile.findOne({ user: req.payload.id })
    // const profile = await Profile.findOne({ _id: req.body.profileId })
    // await profile.setFollower(follower._id)
    // await profile.followerCount()
    // return res.status(200).json({ msg: `your now following ${profile.details.username}` })
    return
})

/**
 * @desc removes profile from following
 * @route PUT /api/profiles/unfollow
 * @auth private
*/
export const delFollowingCtrl = asyncHandler(async (req, res, next) => {
    // const profileServiceInstance = await Container.get(ProfileService)
    // const { profile } = await profileServiceInstance.delFollowingService(req.payload.id, req.body)

    // const profile = await Profile.findOne({ user: req.payload.id })
    // if (!profile.isFollowing(req.body.profileId)) return res.status(200).json({ msg: `your not following this user` })
    // await profile.delFollowing(req.body.profileId)
    // await profile.followingCount()
    // next()
    return
})

/**
 * @desc removes profile from followers
 * @route PUT /api/profiles/unfollow
 * @auth private
*/
export const delFollowerCtrl = asyncHandler(async (req, res, next) => {
    // const profileServiceInstance = await Container.get(ProfileService)
    // const { profile } = await profileServiceInstance.delFollowerService(req.payload.id, req.body)

    // const follower = await Profile.findOne({ user: req.payload.id })
    // const followed = await Profile.findOne({ _id: req.body.profileId })
    // await followed.delFollower(follower._id)
    // await followed.followerCount()
    // return res.status(200).json({ msg: `your no longer following ${followed.details.username}` })
    return
})

/**
 * @desc delete current profile
 * @route DELETE /api/profiles
 * @auth private
*/
export const delProfileCtrl = asyncHandler(async (req, res, next) => {
    // const profileServiceInstance = await Container.get(ProfileService)
    // const { profile } = await profileServiceInstance.delProfileService(req.payload.id)

    // const profile = await Profile.findOne({ user: req.payload.id })
    // if (!profile) return res.status(404).json({ msg: 'cannot remove null profile' })
    // if (profile.user.toString() !== req.payload.id.toString()) return res.status(401).json({ msg: 'user not authenticated to do that' })
    // await profile.remove()
    // return res.status(204).json({ msg: 'successfully removed profile' })
    return
})
