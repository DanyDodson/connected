const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema
const config = require('config')
const image = config.get('post.img')
const client = config.get('app.client')
const slugify = require('slugify')
const Profile = require('./Profile')

const PostSchema = new mongoose.Schema({
    details: {
        mediums: [{ type: String }],
        title: { type: String },
        description: { type: String, default: 'desc' },
        tags: [{ type: String }],
        image: { type: String, default: image },
        price: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        type: { type: String, default: 'post' },
        featured: { type: Boolean, default: false },
        author: { type: String },
    },
    links: {
        key: { type: String },
        slug: { type: String },
        url: { type: String },
    },
    likes: {
        likedBy: [{ type: ObjectId, ref: 'User' }],
        likesCount: { type: Number, default: 0 },
    },
    comments: {
        commented: [{ type: ObjectId, ref: 'Comment' }],
        commentCount: { type: Number, default: 0 },
    },
    options: {
        critique: { type: Boolean, default: true },
        shareable: { type: Boolean, default: true },
        purchasable: { type: Boolean, default: false },
    },
    uploads: {
        urls: {
            full: { type: String, default: '' },
            raw: { type: String, default: '' },
            regular: { type: String, default: '' },
            small: { type: String, default: '' },
            thumb: { type: String, default: '' },
        },
        links: {
            download: { type: String, default: '' },
            location: { type: String, default: '' },
            html: { type: String, default: '' },
            self: { type: String, default: '' },
        },
        sizes: {
            src: [
                { collumns01: { type: Number, default: 1335 } },
                { collumns02: { type: Number, default: 992 } },
                { collumns03: { type: Number, default: 768 } },
            ],
            srcSet: { type: String, default: '' },
            height: { type: Number },
            width: { type: Number },
            originalheight: { type: Number },
            originalWidth: { type: Number },
        },
        colors: { type: Object, default: {} },
        medium_id: { type: String, default: '' },
        upload_id: { type: String, default: '' },
    },
    user: { type: ObjectId, ref: 'User' },
    profile: { type: ObjectId, ref: 'Profile' },
    created: { type: Date, default: Date.now },
    updated: { type: Date },
})

PostSchema.pre('validate', function (next) {
    if (this.options.purchasable === false) this.details.price = 0
    next()
})

PostSchema.methods.setkey = function () {
    const random = (Math.random() * Math.pow(36, 6) | 0).toString(36)
    this.links.key = slugify(random, { lower: true })
}

PostSchema.methods.setslug = function () {
    this.links.slug = slugify(this.details.title + '-' + this.details.mediums[0] + '-' + this.links.key, { lower: true })
}

PostSchema.methods.seturl = function () {
    const posted = new Date().toUTCString().split(' ').slice(1, 5).join(' ')
    this.links.url = client + '/' + this.links.slug + '-' + slugify(posted, { lower: true })
}

PostSchema.methods.setSrc = function () {
    const collumns01 = '(min-width: 1335px) 416px'
    const collumns03 = '(min-width: 992px) calc(calc(100vw - 72px) / 3)'
    const collumns02 = '(min-width: 768px) calc(calc(100vw - 48px) / 2), 100vw'
}

PostSchema.methods.findSame = function () {
    return this.find({ medium: this.medium });
}

PostSchema.methods.isLiked = function (id) {
    return this.likes.likedBy.some(function (likedById) {
        return likedById.toString() === id.toString()
    })
}

PostSchema.methods.like = function (id) {
    if (this.likes.likedBy.indexOf(id) === -1) {
        this.likes.likedBy.push(id)
    }
    return this.save()
}

PostSchema.methods.unlike = function (id) {
    this.likes.likedBy.remove(id)
    return this.save()
}

PostSchema.methods.likesCount = function () {
    const count = this.likes.likedBy.length
    this.likes.likesCount = count
    return this.save()
}

PostSchema.methods.addComment = function (id) {
    if (this.comments.commented.indexOf(id) === -1) {
        this.comments.commented.push(id)
    }
}

PostSchema.methods.delComment = function (id) {
    let found = this.comments.commented.remove(id)
}

PostSchema.methods.updateCommentCount = function () {
    const count = this.comments.commented.length
    this.comments.commentCount = count
    return this.save()
}

PostSchema.methods.isFavorite = function (id) {
    return this.favorites.favorited.some(function (favoriteId) {
        return favoriteId.toString() === id.toString()
    })
}

PostSchema.methods.postToJson = function (user) {
    return {
        _id: this._id,
        details: this.details,
        links: this.links,
        likes: this.likes,
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


PostSchema.index({ 'details.mediums': 1, })
PostSchema.index({ 'links.slug': 1, created: 1, }, { unique: true, })
PostSchema.index({ 'links.slug': 1, 'links.url': 1, }, { unique: true, })

mongoose.model('Post', PostSchema)
