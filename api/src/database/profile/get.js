import {
  ProfileModel,
} from '../schema'

async function getProfileById (id) {
  return await ProfileModel.findOne({ id }).exec()
}

async function getProfileByUsername (username) {
  return await ProfileModel.findById(username).exec()
}


export {
  getProfileById,
  getProfileByUsername,
}
