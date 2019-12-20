import mongoose from 'mongoose'
import slugify from 'slugify'
import config from '../config'

const PostSchema = new mongoose.Schema({
  details: {
    mediums: { type: [String], index: 1 },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    tags: { type: [String], default: '' },
    author: { type: String, default: '' },
    price: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    image: { type: String, default: '' },
    featured: { type: Boolean, default: false },
  },
  likes: {
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likesCount: { type: Number, default: 0 },
  },
  comments: {
    commented: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    commentCount: { type: Number, default: 0 },
  },
  options: {
    critique: { type: Boolean, default: true },
    shareable: { type: Boolean, default: true },
    purchasable: { type: Boolean, default: false },
  },
  links: {
    key: { type: String, default: '' },
    slug: { type: String, default: '', unique: true },
    url: { type: String, default: '' },
  },
  uploads: {
    upload_id: String,
    urls: {
      full: String,
      raw: String,
      regular: String,
      small: String,
      thumb: String,
    },
    permalinks: {
      download: String,
      location: String,
      html: String,
      self: String,
    },
    sizes: {
      srcSet: String,
      height: Number,
      width: Number,
      originalheight: Number,
      originalWidth: Number,
      src: [
        { col1: { type: Number, default: 1335 } },
        { col2: { type: Number, default: 992 } },
        { col3: { type: Number, default: 768 } },
      ],
    },
    medium_id: String,
    colors: Object,
  },
  user: { type: mongoose.Schema.Types.String, ref: 'User' },
  artist: { type: mongoose.Schema.Types.String, ref: 'Artist' },
  created: { type: Date, default: Date.now },
  updated: { type: Date },
})

PostSchema.post('save', function() {
  if (!this.links.key) this.setkey()
  this.setslug()
  this.seturl()
  // this.save()
})

PostSchema.pre('findOneAndUpdate', function() {
  this.findOneAndUpdate({}, { $set: { updated: Date.now() } })
})

PostSchema.methods.setkey = function() {
  const random = (Math.random() * Math.pow(36, 6) | 0).toString(36)
  this.links.key = slugify(random, { lower: true })
  this.save()
}

PostSchema.methods.setslug = function() {
  this.links.slug = slugify(this.details.title + '-' + this.details.mediums[0] + '-' + this.links.key, { lower: true })
}

PostSchema.methods.seturl = function() {
  const posted = new Date().toUTCString().split(' ').slice(1, 5).join(' ')
  this.links.url = config.url.client + '/' + this.links.slug + '-' + slugify(posted, { lower: true })
}

PostSchema.methods.setSrc = function() {
  // const collumns01 = '(min-width: 1335px) 416px'
  // const collumns03 = '(min-width: 992px) calc(calc(100vw - 72px) / 3)'
  // const collumns02 = '(min-width: 768px) calc(calc(100vw - 48px) / 2), 100vw'
}

PostSchema.methods.findSame = function() {
  return this.find({ medium: this.medium })
}

PostSchema.methods.isLiked = function(id) {
  return this.likes.likedBy.some(function(likedById) {
    return likedById.toString() === id.toString()
  })
}

PostSchema.methods.like = function(id) {
  if (this.likes.likedBy.indexOf(id) === -1) {
    this.likes.likedBy.push(id)
  }
  return this.save()
}

PostSchema.methods.unlike = function(id) {
  this.likes.likedBy.remove(id)
  return this.save()
}

PostSchema.methods.likesCount = function() {
  const count = this.likes.likedBy.length
  this.likes.likesCount = count
  return this.save()
}

PostSchema.methods.addComment = function(id) {
  if (this.comments.commented.indexOf(id) === -1) {
    this.comments.commented.push(id)
  }
}

// PostSchema.methods.delComment = function(id) {
//   const found = this.comments.commented.remove(id)
// }

PostSchema.methods.updateCommentCount = function() {
  const count = this.comments.commented.length
  this.comments.commentCount = count
  return this.save()
}

PostSchema.methods.isFavorite = function(id) {
  return this.favorites.favorited.some(function(favoriteId) {
    return favoriteId.toString() === id.toString()
  })
}

PostSchema.methods.postToJson = function(user) {
  return {
    _id: this._id,
    details: this.details,
    post: this.post,
    listing: this.listing,
    likes: this.likes,
    links: this.links,
    comments: this.comments,
    options: this.options,
    uploads: this.uploads,
    created: this.created,
    updated: this.updated,
    user: this.user.authJson(user),
    profile: this.profile.profileToJson(user),
    favorite: user ? user.isFavorite(this._id) : false,
  }
}

PostSchema.index({ 'links.slug': 1, created: 1, }, { unique: true })
PostSchema.index({ 'links.slug': 1, 'links.url': 1, }, { unique: true })

export default mongoose.model('Post', PostSchema)
