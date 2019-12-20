// import { Container } from 'typedi'
// import AuthService from '../services/tag'

// import asyncHandler from 'express-async-handler'

/**
 * @desc mediums test route
 * @route GET /api/mediums
 * @auth public
*/
// export const testingCtrl = asyncHandler(async (req, res, next) => {
//     const authServiceInstance = await Container.get(AuthService)
//     const msg = await authServiceInstance.testingService()
//     return res.status(201).json({ msg: msg })
//     return
// })

/**
 * @desc runs on paths containing :mediums
 * @route PARAM /:mediums
 * @auth public
 */
// export const loadMediumsCtrl = asyncHandler(async (req, res, next) => {
//     const mediums = await Post.find({ 'details.mediums': tag })
//     if (!mediums) return res.status(400).json({ err: 'no mediums found' })
//     req.mediums = mediums
//     return next()
//     return
// })

/**
 * @desc gets all mediums
 * @route GET /api/mediums
 * @auth public
 */
// export const getAllMediumsCtrl = asyncHandler(async (req, res, next) => {
//     const mediums = await Post.find().distinct('details.mediums')
//     return res.status(200).json(mediums)
//     return
// })