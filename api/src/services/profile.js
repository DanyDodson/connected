const config = require('../config')
const logger = require('../loaders/logger')
const User = require('../models/User')
const Profile = require('../models/Profile')

export default class ProfileService {

  async testService = async () => {
    logger.debug('1️⃣  calling test endpoint')
    return { auth: 'profile test route working!' }
  }

  async profilesFeedService = async () => {
    logger.debug('0️⃣  calling get profiles service')
    const profiles = await Profile.find()
    return profiles
  }

  async loadUsernamesService = async (username) => {
    logger.debug('0️⃣  calling preload usernames service')
    const profile = await Profile.findOne({ 'details.username': username })
    if (!profile) throw new Error('profile with that username not found')
    return { user }
  }

  async newProfileService = async (payload) => {
    logger.debug('0️⃣  calling new profile service')

    const user = await User.findOne({ _id: payload.id })
    const profile = new Profile({ user: user.id, 'details.username': payload.username })

    // const newProfile = await profile.save()
    await profile.save()
    user.profile = newProfile
    await user.save()

    return { profile }

  }

  // exports.signUpService = async (userInput) => {
  //   logger.debug('0️⃣  calling service: %o',) 
  //   return { user }
  // }

  // exports.signUpService = async (userInput) => {
  //   logger.debug('0️⃣  calling service: %o',) 
  //   return { user }
  // }

  // exports.signUpService = async (userInput) => {
  //   logger.debug('0️⃣  calling service: %o',) 
  //   return { user }
  // }

  // exports.signUpService = async (userInput) => {
  //   logger.debug('0️⃣  calling service: %o',) 
  //   return { user }
  // }

}