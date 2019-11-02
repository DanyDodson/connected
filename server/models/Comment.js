const mongoose = require('mongoose')
const slug = require('../middleware/slug')
const Schema = mongoose.Schema

const CommentSchema = new mongoose.Schema({
  creator: { type: String, required: true },
  image: { type: String, required: true },
  content: { type: String, required: true },
  url: { type: String, required: true, },
  parent: { type: String, required: true, },
  slug: { type: String, required: true, unique: true },
  post: { type: Schema.Types.ObjectId, ref: 'posts' },
  author: { type: Schema.Types.ObjectId, ref: 'users' },
}, { timestamps: true })

CommentSchema.pre('validate', function (next) {
  if (!this.slug) { this.slugify() }
  next()
})

CommentSchema.methods.slugify = function () {
  this.slug = slug.create(this.content) + '::' + slug.createRandom()
  this.url = this.parent + '::' + this.slug + '::' + slug.createTime()
}

CommentSchema.methods.toJSONFor = function (user) {
  return {
    id: this._id,
    content: this.body,
    createdAt: this.createdAt,
    author: this.author.toProfileJSONFor(user)
  }
}

module.exports = Comment = mongoose.model('comment', CommentSchema)