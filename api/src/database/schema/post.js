import { model, Schema } from 'mongoose'

const PostSchema = new Schema({
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
    likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likesCount: { type: Number, default: 0 },
  },
  comments: {
    commented: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
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
    urls: { full: String, raw: String, regular: String, small: String, thumb: String, },
    permalinks: { download: String, location: String, html: String, self: String, },
    sizes: {
      srcSet: String,
      height: Number,
      width: Number,
      originalheight: Number,
      originalWidth: Number,
      src: [{ col1: { type: Number, default: 1335 } }, { col2: { type: Number, default: 992 } }, { col3: { type: Number, default: 768 } },],
    },
    medium_id: String,
    colors: Object,
  },
  user: { type: Schema.Types.String, ref: 'User' },
  profile: { type: Schema.Types.String, ref: 'Profile' },
  created: { type: Date, default: Date.now },
  updated: { type: Date },
})

const PostModel = model('Post', PostSchema)

export { PostModel }
