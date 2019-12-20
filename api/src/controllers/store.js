import asyncHandler from 'express-async-handler'
import ProfileService from '../services/profile'
import { Container } from 'typedi'

export const viewStore = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ msg: 'store view sellers route working' })
})

export const viewSellers = asyncHandler(async (req, res, next) => {
  const users = await user.find()
  if (!users) return res.status(400).json({ error: 'no users found' })
  return res.status(200).json(users)
})

export const viewSeller = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ msg: 'account view seller route working' })
})

export const updateSeller = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ msg: 'account update seller route working' })
})

export const viewBuyer = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ msg: 'account view buyer route working' })
})

export const updateBuyer = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ msg: 'account update buyer route working' })
})

