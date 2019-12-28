import { User } from '../../models/User'

export const getUserById = async (id) => {
  return await User.findById(id).exec()
}

export const getUserByEmail = async (email) => {
  return await User.findOne({ email }).exec()
}

export const getUserByUsername = async (username) => {
  return await User.findOne({ username }).exec()
}
