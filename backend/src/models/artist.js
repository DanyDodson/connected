import mongoose from 'mongoose'
import config from 'config'

const ArtistSchema = new mongoose.Schema({
  details: {
    name: String,
    email: String,
    about: String,
    image: String,
    active: Boolean,
    username: { type: String, unique: true, index: 1 },
  },
  links: {
    url: String,
  },
  friends: {
    following: [{ type: mongoose.Schema.Types.String, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.String, ref: 'User' }],
    followingCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
  },
  favorites: {
    favorited: [{ type: mongoose.Schema.Types.String, ref: 'Post' }],
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
  user: { type: mongoose.Schema.Types.String, ref: 'User' },
  posts: [{ type: mongoose.Schema.Types.String, ref: 'Post' }],
  created: { type: Date, default: Date.now },
  updated: { type: Date },
})

ArtistSchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, { $set: { updated: Date.now() } })
  next()
})

ArtistSchema.methods.setUrl = function () {
  this.links.url = config.urls.client + '/artists/' + this.details.username
  this.save()
}

ArtistSchema.methods.isFavorite = function (post) {
  return this.favorites.favorited.some(function (favoritedId) {
    return favoritedId.toString() === post.toString()
  })
}

ArtistSchema.methods.favorite = function (id) {
  if (this.favorites.favorited.indexOf(id) === -1) {
    this.favorites.favorited.push(id)
  }
  return this.save()
}

ArtistSchema.methods.unfavorite = function (id) {
  this.favorites.favorited.remove(id)
  return this.save()
}

ArtistSchema.methods.favoriteCount = function () {
  const count = this.favorites.favorited.length
  this.favorites.favoritedCount = count
  // return this.save()
}

ArtistSchema.methods.isFollowing = function (id) {
  return this.friends.following.some(function (followId) {
    return followId.toString() === id.toString()
  })
}

ArtistSchema.methods.setFollowing = function (id) {
  if (this.friends.following.indexOf(id) === -1) {
    this.friends.following.push(id)
  }
  return this.save()
}

ArtistSchema.methods.delFollowing = function (id) {
  this.friends.following.remove(id)
  return this.save()
}

ArtistSchema.methods.followingCount = function () {
  const count = this.friends.following.length
  this.friends.followingCount = count
  return this.save()
}

ArtistSchema.methods.setFollower = function (id) {
  if (this.friends.followers.indexOf(id) === -1) {
    this.friends.followers.push(id)
  }
  return this.save()
}

ArtistSchema.methods.delFollower = function (id) {
  this.friends.followers.remove(id)
  return this.save()
}

ArtistSchema.methods.followerCount = function () {
  const count = this.friends.followers.length
  this.friends.followersCount = count
  return this.save()
}

ArtistSchema.methods.artistToJson = function (artist) {
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
    following: artist ? artist.isFollowing(this._id) : false,
  }
}

export default mongoose.model('Artist', ArtistSchema)
