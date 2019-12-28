import asyncHandler from 'express-async-handler'
import ProfileService from '../services/profile'
import { Container } from 'typedi'

/**
 * @desc auth test route
 * @route GET /api/auth
 * @auth public
*/
export const testingCtrl = asyncHandler(async (req, res, next) => {
    const profileServiceInstance = await Container.get(ProfileService)
    const msg = await profileServiceInstance.testingService()
    return res.status(201).json(msg)
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
    const profileServiceInstance = await Container.get(ProfileService)
    await profileServiceInstance.addFollowingService(req.payload.id, req.params.username)
    // await profileServiceInstance.addFollowingService(req.payload.id, req.body.profile_id)
    next()
})

/**
 * @desc adds profile to followers
 * @route PUT /api/profiles/unfollow
 * @auth private
*/
export const addFollowerCtrl = asyncHandler(async (req, res, next) => {
    const profileServiceInstance = await Container.get(ProfileService)
    const { noAuthUserProfile } = await profileServiceInstance.addFollowerService(req.payload.id, req.params.username)
    return res.status(200).json({ msg: `your now following ${noAuthUserProfile.details.username}` })
})

/**
 * @desc removes profile from following
 * @route PUT /api/profiles/unfollow
 * @auth private
*/
export const delFollowingCtrl = asyncHandler(async (req, res, next) => {
    const profileServiceInstance = await Container.get(ProfileService)
    await profileServiceInstance.delFollowingService(req.payload.id, req.params.username)
    next()
})

/**
 * @desc removes profile from followers
 * @route PUT /api/profiles/unfollow
 * @auth private
*/
export const delFollowerCtrl = asyncHandler(async (req, res, next) => {
    const profileServiceInstance = await Container.get(ProfileService)
    const { noAuthUserProfile } = await profileServiceInstance.delFollowerService(req.payload.id, req.params.username)
    return res.status(200).json({ msg: `your no longer following ${noAuthUserProfile.details.username}` })

})

/**
 * @desc delete current profile
 * @route DELETE /api/profiles
 * @auth private
*/
export const delProfileCtrl = asyncHandler(async (req, res, next) => {
    const profileServiceInstance = await Container.get(ProfileService)
    await profileServiceInstance.delProfileService(req.payload.id)
    // return res.status(204).json({ msg: 'successfully removed profile' })
    next()
})
