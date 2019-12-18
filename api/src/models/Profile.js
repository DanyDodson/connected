import mongoose from 'mongoose'
import config from '../config'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const ProfileSchema = new Schema({
  details: {
    name: String,
    email: String,
    about: String,
    image: String,
    active: Boolean,
    username: { type: String, unique: true, index: 1 },
  },
  links: {
    url: String
  },
  friends: {
    following: [{ type: ObjectId, ref: 'User' }],
    followers: [{ type: ObjectId, ref: 'User' }],
    followingCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
  },
  favorites: {
    favorited: [{ type: ObjectId, ref: 'Post' }],
    favoritedCount: { type: Number, default: 0 },
  },
  socials: {
    blog: String,
    instagram: String,
    twitter: String,
    facebook: String,
    youtube: String,
    linkedin: String,
  },
  colors: {
    bg: { type: String, default: '#FFFFFF' },
    fg: { type: String, default: '#AAAAAA' },
    mbg: { type: String, default: '#FFEDD4' },
    mfg: { type: String, default: '#7A7A7A' },
    ln: { type: String, default: '#24DADA' },
  },
  vender: {
    role: { type: String, default: 'selling' },
    status: { type: String, default: 'dormant' },
    contact: {
      address: {
        street: String,
        city: String,
        state: String,
        zip: Number,
      },
      geo: {
        type: { type: String, default: 'Point' },
        points: [{ type: Array }],
      },
      phone: Number,
    },
    reviews: {
      critique: String,
      stars: { type: Number, default: 0 },
    },
  },
  user: { type: ObjectId, ref: 'User' },
  posts: [{ type: ObjectId, ref: 'Post' }],
  created: { type: Date, default: Date.now },
  updated: { type: Date },
})

ProfileSchema.pre('findOneAndUpdate', function(next) {
  this.findOneAndUpdate({}, { $set: { updated: Date.now() } })
  next()
})

ProfileSchema.methods.setProfileUrl = function() {
  this.links.url = config.url.client + '/profiles/' + this.details.username
  this.save()
}

ProfileSchema.methods.isFavorite = function(post) {
  return this.favorites.favorited.some(function(favoritedId) {
    return favoritedId.toString() === post.toString()
  })
}

ProfileSchema.methods.favorite = function(id) {
  if (this.favorites.favorited.indexOf(id) === -1) {
    this.favorites.favorited.push(id)
  }
  return this.save()
}

ProfileSchema.methods.unfavorite = function(id) {
  this.favorites.favorited.remove(id)
  return this.save()
}

ProfileSchema.methods.favoriteCount = function() {
  const count = this.favorites.favorited.length
  this.favorites.favoritedCount = count
  // return this.save()
}

ProfileSchema.methods.isFollowing = function(id) {
  return this.friends.following.some(function(followId) {
    return followId.toString() === id.toString()
  })
}

ProfileSchema.methods.setFollowing = function(id) {
  if (this.friends.following.indexOf(id) === -1) {
    this.friends.following.push(id)
  }
  return this.save()
}

ProfileSchema.methods.delFollowing = function(id) {
  this.friends.following.remove(id)
  return this.save()
}

ProfileSchema.methods.followingCount = function() {
  const count = this.friends.following.length
  this.friends.followingCount = count
  return this.save()
}

ProfileSchema.methods.setFollower = function(id) {
  if (this.friends.followers.indexOf(id) === -1) {
    this.friends.followers.push(id)
  }
  return this.save()
}

ProfileSchema.methods.delFollower = function(id) {
  this.friends.followers.remove(id)
  return this.save()
}

ProfileSchema.methods.followerCount = function() {
  const count = this.friends.followers.length
  this.friends.followersCount = count
  return this.save()
}

ProfileSchema.methods.profileToJson = function(profile) {
  return {
    id: this._id,
    details: this.details,
    links: this.links,
    friends: this.friends,
    favorites: this.favorites,
    socials: this.socials,
    colors: this.colors,
    vendor: this.vendor,
    user: this.user,
    created: this.created,
    updated: this.updated,
    following: profile ? profile.isFollowing(this._id) : false,
  }
}

export default mongoose.model('Profile', ProfileSchema)
