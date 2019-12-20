export default class ProfileService {

  constructor (container) {
    this.logger = container.get('logger')
    this.ProfileModel = container.get('ProfileModel')
    this.UserModel = container.get('UserModel')
  }

  async testingService () {
    this.logger.debug('0️⃣  calling profiles test endpoint')
    return { msg: 'profiles test route working' }
  }

  async loadUsernamesService (username) {
    this.logger.debug('0️⃣  calling preload username endpoint')
    const profile = await this.ProfileModel.findOne({ 'details.username': username })
    if (!profile) throw new Error('profile with that username not found')
    return { profile }
  }

  async profilesFeedService () {
    this.logger.debug('0️⃣  calling profiles feed endpoint')
    const profiles = await this.ProfileModel.find()
    return { profiles }
  }

  async newProfileService (payload) {
    this.logger.debug('0️⃣  calling new profile endpoint')
    const user = await this.UserModel.findOne({ _id: payload.id })
    const profile = new this.ProfileModel({ user: user._id, 'details.username': payload.username })
    await profile.save()
    user.profile = profile
    await user.save()
    return { profile }
  }

  async getProfileService (foundProfile) {
    this.logger.debug('0️⃣  calling get profile endpoint')
    const profile = foundProfile
    return { profile }
  }

  async updateProfileService (id, body) {
    this.logger.debug('0️⃣  calling update profile endpoint')
    const user = await this.UserModel.findOne({ _id: id })
    const { name, username, about, image } = body
    const { blog, instagram, twitter, facebook, youtube, linkedin } = body
    const { role, status } = body
    const { street, city, state, zip } = body
    const { phone } = body
    const { stars, critique } = body
    let old = profile
    let fresh = {}
    fresh.user = user
    fresh.details = {}
    fresh.details.email = user.email
    name ? fresh.details.name = name : fresh.details.name = old.details.name
    username ? fresh.details.username = username : fresh.details.username = old.details.username
    about ? fresh.details.about = about : fresh.details.about = old.details.about
    image ? fresh.details.image = image : fresh.details.image = null
    fresh.socials = {}
    blog ? fresh.socials.blog = blog : fresh.socials.blog = old.socials.blog
    instagram ? fresh.socials.instagram = instagram : fresh.socials.instagram = old.socials.instagram
    twitter ? fresh.socials.twitter = twitter : fresh.socials.twitter = old.socials.twitter
    facebook ? fresh.socials.facebook = facebook : fresh.socials.facebook = old.socials.facebook
    youtube ? fresh.socials.youtube = youtube : fresh.socials.youtube = old.socials.youtube
    linkedin ? fresh.socials.linkedin = linkedin : fresh.socials.linkedin = old.socials.linkedin
    // fresh.vender = {}
    // role ? fresh.vender.role = role : fresh.vender.role = old.vender.role
    // status ? fresh.vender.status = status : fresh.vender.status = old.vender.status
    // fresh.vender.contact = {}
    // phone ? fresh.vender.contact.phone = phone : fresh.vender.contact.phone = old.vender.contact.phone
    // fresh.vender.reviews = {}
    // stars ? fresh.vender.reviews.stars = stars : fresh.vender.reviews.stars = old.vender.reviews.stars
    // critique ? fresh.vender.reviews.critique = critique : fresh.vender.reviews.critique = old.vender.reviews.critique
    // fresh.vender.contact.address = {}
    // street ? fresh.vender.contact.address.street = street : fresh.vender.contact.address.street = old.vender.contact.address.street
    // city ? fresh.vender.contact.address.city = city : fresh.vender.contact.address.city = old.vender.contact.address.city
    // state ? fresh.vender.contact.address.state = state : fresh.vender.contact.address.state = old.vender.contact.address.state
    // zip ? fresh.vender.contact.address.zip = zip : fresh.vender.contact.address.zip = old.vender.contact.address.zip
    let profile = await this.ProfileModel.findOneAndUpdate({ user: user._id }, { $set: fresh }, { new: true, upsert: true })
    await profile.setProfileUrl()
    username ? user.username = username : user.username
    await user.save()
    return { profile }
  }

  async addFollowingService (user_id, username) {
    this.logger.debug('0️⃣  calling add following endpoint')
    const isAuthUsersProfile = await this.ProfileModel.findOne({ user: user_id })
    const noAuthUserProfile = await this.ProfileModel.findOne({ 'details.username': username })
    if (isAuthUsersProfile.isFollowing(noAuthUserProfile._id)) throw new Error('your already following this user')
    await isAuthUsersProfile.setFollowing(noAuthUserProfile._id)
    await isAuthUsersProfile.followingCount()
    return { isAuthUsersProfile }
  }

  async addFollowerService (user_id, username) {
    this.logger.debug('0️⃣  calling add follower endpoint')
    const isAuthUsersProfile = await this.ProfileModel.findOne({ user: user_id })
    const noAuthUserProfile = await this.ProfileModel.findOne({ 'details.username': username })
    await noAuthUserProfile.setFollower(isAuthUsersProfile._id)
    await noAuthUserProfile.followerCount()
    return { noAuthUserProfile }
  }

  async delFollowingService (user_id, username) {
    this.logger.debug('0️⃣  calling delete following endpoint')
    const isAuthUsersProfile = await this.ProfileModel.findOne({ user: user_id })
    const noAuthUserProfile = await this.ProfileModel.findOne({ 'details.username': username })
    if (!isAuthUsersProfile.isFollowing(noAuthUserProfile._id)) throw new Error('your not following this user')
    await isAuthUsersProfile.delFollowing(noAuthUserProfile._id)
    await isAuthUsersProfile.followingCount()
    return { isAuthUsersProfile }
  }

  async delFollowerService (user_id, username) {
    this.logger.debug('0️⃣  calling delete follower endpoint')
    const isAuthUsersProfile = await this.ProfileModel.findOne({ user: user_id })
    const noAuthUserProfile = await this.ProfileModel.findOne({ 'details.username': username })
    await noAuthUserProfile.delFollower(isAuthUsersProfile._id)
    await noAuthUserProfile.followerCount()
    return { noAuthUserProfile }
  }

  async delProfileService (user_id) {
    this.logger.debug('0️⃣  calling delete profile endpoint')
    const profile = await this.ProfileModel.findOne({ user: user_id })
    if (!profile) throw new Error('cannot remove null profile')
    if (profile.user.toString() !== user_id.toString()) throw new Error('user not authenticated to do that')
    await profile.remove()
    return
  }

}