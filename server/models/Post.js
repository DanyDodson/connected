const mongoose = require('mongoose')
const slug = require('../middleware/slug')
const User = require('./User')
const config = require('config')
const image = config.get('userImage')
const Schema = mongoose.Schema

const PostSchema = new Schema({
  uploads: [],
  url: { type: String, unique: true, required: true, },
  title: { type: String, required: true, trim: true, },
  description: { type: String, required: true, trim: true },
  mediums: { type: [String], required: true },
  tags: { type: [String], required: true },
  critique: { type: Boolean, default: true },
  purchasable: { type: Boolean, default: false },
  price: { type: String, default: null },
  shareable: { type: Boolean, default: true },
  userimage: { type: String, default: image },
  featured: { type: Boolean, default: false },
  favoritesCount: { type: Number, default: 0 },
  slug: { type: String, unique: true, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'users', },
  likes: [{ type: Schema.Types.ObjectId, ref: 'users' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'comments' }],
}, { timestamps: true })


PostSchema.pre('validate', function (next) {
  if (!this.slug) this.slugify()
  next()
})

PostSchema.methods.slugify = function () {
  this.slug = slug.createSlug(this.title)
  this.url = this.slug + '::' + slug.createTime()
}

PostSchema.methods.like = function (id) {
  this.likes.unshift(id);
  return this.save()
}

PostSchema.methods.unlike = function (id) {
  this.likes.remove(id)
  return this.save()
}

PostSchema.methods.updateFavoriteCount = function () {
  const post = this
  return User.countDocuments({ 'counts.favorites': { $in: [post._id] } }).then(function (count) {
    post.favoritesCount = count
    return post.save()
  })
}

PostSchema.methods.toJSONFor = function (user) {
  return {
    uploads: this.uploads,
    url: this.url,
    title: this.title,
    description: this.description,
    critique: this.critique,
    featured: this.featured,
    mediums: this.mediums,
    purchasable: this.purchasable,
    price: this.price,
    shareable: this.shareable,
    userimage: this.userimage,
    tags: this.tags,
    slug: this.slug,
    author: this.author.toProfileJSONFor(user),
    favoritesCount: this.favoritesCount,
    likes: this.likes,
    comments: this.comments,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    favorited: user ? user.isFavorite(this._id) : false,
  }
}

module.exports = Post = mongoose.model('post', PostSchema)
