// import { Container } from 'typedi'
// import AuthService from '../services/tag'

// import asyncHandler from 'express-async-handler'

/**
 * @desc tags test route
 * @route GET /api/tags
 * @auth public
*/
// export const testingCtrl = asyncHandler(async (req, res, next) => {
//   const authServiceInstance = await Container.get(AuthService)
//   const msg = await authServiceInstance.testingService()
//   return res.status(201).json({ msg: msg })
//   return
// })

/**
 * @desc runs on paths containing :tags
 * @route PARAM /:tags
 * @auth public
 */
// export const loadTagsCtrl = asyncHandler(async (req, res, next) => {
//   const tags = await Post.find({ 'details.tags': tag })
//   if (!tags) return res.status(400).json({ err: 'no tags found' })
//   req.tags = tags
//   return next()
//   return
// })

/**
 * @desc gets all tags
 * @route GET /api/tags
 * @auth public
 */
// export const getAllTagsCtrl = asyncHandler(async (req, res, next) => {
//   const tags = await Post.find().distinct('details.tags')
//   return res.status(200).json(tags)
//   return
// })