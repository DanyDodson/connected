const mongoose = require('mongoose')
const slugs = require('../middleware/slug')
const Schema = mongoose.Schema

const CommentSchema = new mongoose.Schema({
  // slug: {
  //   type: String,
  // },
  slug_base: {
    type: String, lowercase: true, unique: true,
  },
  slug_full: {
    type: String, lowercase: true, unique: true,
  },
  parent: {
    type: String,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'posts'
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  content: {
    type: String,
    //  required: true
  },
}, { timestamps: true })

CommentSchema.pre('validate', function (next) {
  if (!this.slug_base || !this.slug_full) {
    this.slugifyBase()
    this.slugifyFull()
  }
  next()
})

CommentSchema.methods.slugifyBase = function () {
  this.slug_base = slugs.getBase(this.content) + ':' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
}

CommentSchema.methods.slugifyFull = function () {
  this.slug_full = this.slug_base + ':' + slugs.getTime() + ':' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
}

module.exports = Comment = mongoose.model('comment', CommentSchema)