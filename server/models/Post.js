const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema
const config = require('config')
const image = config.get('user.image')
const client = config.get('app.client')
const shortid = require("shortid")
const slugify = require("slugify")
const User = require('./User')
const Profile = require('./Profile')

const PostSchema = new mongoose.Schema({
    info: {
        mediums: [{ type: String }],
        title: { type: String },
        description: { type: String, default: 'post desc' },
        tags: [{ type: String }],
        price: { type: String, default: '' },
        image: { type: String, default: image },
        views: { type: Number, default: 0 },
        type: { type: String, default: 'post' },
        featured: { type: Boolean, default: false },
        author: { type: String },
    },
    links: {
        slug: { type: String, unique: true },
        url: { type: String },
    },
    likes: {
        likedBy: [{ type: ObjectId, ref: 'User' }],
        favoritedCount: { type: Number, default: 0 },
    },
    comments: {
        commentCount: { type: Number, default: 0 },
        commentedBy: [{ type: ObjectId, ref: 'Comment' }],
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
        colors: { type: Object, default: {} },
        medium_id: { type: String, default: '' },
        upload_id: { type: String, default: '' },
        src: { type: String, default: '(min-width: 1335px) 416px, (min-width: 992px) calc(calc(100vw - 72px) / 3), (min-width: 768px) calc(calc(100vw - 48px) / 2), 100vw', },
    },
    user: { type: ObjectId, ref: 'User' },
    created: { type: Date, default: Date.now },
    updated: { type: Date },
})

// create a slug for post
PostSchema.pre('validate', function (next) {
    if (!this.links.slug) {
        this.setSlug()
        this.setUrl()
    }
    next()
})

PostSchema.methods.setSlug = function () {
    const random = (Math.random() * Math.pow(36, 6) | 0).toString(36)
    this.links.slug = slugify(this.info.title + '-' + this.info.mediums[0] + '-' + random, { lower: true })
}

PostSchema.methods.setUrl = function () {
    const posted = new Date().toUTCString().split(' ').slice(1, 5).join(' ')
    this.links.url = client + this.links.slug + '-' + slugify(posted, { lower: true })
}

// fetch all posts
module.exports.getClasses = function (callback, limit) {
    Class.find(callback).limit(limit);
}

// fetch single post
module.exports.getClassById = function (id, callback) {
    Class.findById(id, callback);
}

// find same query
PostSchema.methods.findSame = function () {
    return this.find({ medium: this.medium });
}

// add like to post
PostSchema.methods.like = function (id) {
    this.likes.likedBy.unshift(id);
    return this.save()
}

// remove like to post
PostSchema.methods.unlike = function (id) {
    this.likes.likedBy.remove(id)
    return this.save()
}

// update faved count
PostSchema.methods.updateFavoriteCount = function () {
    const post = this
    return User.countDocuments({ 'likes.likedBy': { $in: [post._id] } }).then(function (count) {
        post.likes.favoritedCount = count
        return post.save()
    })
}

// check if post is faved
PostSchema.methods.isFavorite = function (id) {
    return this.favorites.some(function (favoriteId) {
        return favoriteId.toString() === id.toString()
    })
}

// fills post when loading other schemas
PostSchema.methods.toJSONFor = function (user) {
    return {
        info: this.info,
        links: this.links,
        likes: this.likes,
        comments: this.comments,
        options: this.options,
        uploads: this.uploads,
        created: this.created,
        updated: this.updated,
        user: this.user.toProfileJSONFor(user),
        favorited: user ? user.isFavorite(this._id) : false,
    }
}

PostSchema.index({ mediums: 1, })

mongoose.model('Post', PostSchema)
