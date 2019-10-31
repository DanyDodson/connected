const mongoose = require('mongoose')
const slugs = require('../middleware/slug')
const User = require('./User')
const Schema = mongoose.Schema

const PostSchema = new Schema({
  slug: {
    type: String,
    // lowercase: true,
    // unique: true,
  },
  url: {
    type: String,
  },
  // user: {
  //   type: Schema.Types.ObjectId, ref: 'users'
  // },
  author: {
    type: Schema.Types.ObjectId, ref: 'users'
  },
  // uploads: [],
  // text: {
  //   type: String, required: true
  // },
  // name: {
  //   type: String
  // },
  content: {
    type: String
  },
  avatar: {
    type: String
  },
  // tagList: [{
  //   type: String
  // }],
  // likes: [{
  //   user: { type: Schema.Types.ObjectId, ref: 'users' }
  // }],
  likesCount: {
    type: Number, default: 0
  },
  favoritesCount: {
    type: Number, default: 0
  },
  comments: [{
    type: Schema.Types.ObjectId, ref: 'comments'
  }],
  // comments: [
  //   {
  //     user: {
  //       type: Schema.Types.ObjectId, ref: 'users'
  //     },
  //     text: {
  //       type: String, required: true
  //     },
  //     name: {
  //       type: String
  //     },
  //     avatar: {
  //       type: String
  //     },
  //     date: {
  //       type: Date, default: Date.now
  //     },
  //   }
  // ],
}, { timestamps: true })


PostSchema.pre('validate', function (next) {
  if (!this.slug || !this.url) {
    this.slugBase()
    // this.slugFull()
  }
  next()
})

PostSchema.methods.slugBase = function () {
  this.url = slugs.getBase(this.url)
}

// PostSchema.methods.slugFull = function () {
//   this.slug = slugs.getBase(this.content) + ':' + slugs.getTime() + ':' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
// }

PostSchema.methods.like = function (id) {
  if (this.favorites.indexOf(id) === -1) {
    this.favorites.push(id)
  }

  return this.save()
}

PostSchema.methods.unlike = function (id) {
  this.favorites.remove(id)
  return this.save()
}

PostSchema.methods.updateLikesCount = function (id) {
  const post = this
  return Post.countDocuments({ likes: { $in: [post._id] } }).then(function (count) {
    post.likesCount = count
    return post.save()
  })
}

PostSchema.methods.updateFavoriteCount = function () {
  const post = this
  return User.countDocuments({ favorites: { $in: [post._id] } }).then(function (count) {
    post.favoritesCount = count
    return post.save()
  })
}

PostSchema.methods.toJSONFor = function (user) {
  return {
    slug: this.slug,
    author: this.author,
    content: this.content,
    avatar: this.avatar,
    likes: this.likes,
    likesCount: this.likesCount,
    favoritesCount: this.favoritesCount,
    favorited: user ? user.isFavorite(this._id) : false,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

module.exports = Post = mongoose.model('post', PostSchema)
