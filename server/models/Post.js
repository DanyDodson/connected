const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema
const config = require('config')
const image = config.get('post.img')
const client = config.get('app.client')
const slugify = require('slugify')
const Profile = require('./Profile')

const PostSchema = new mongoose.Schema({
    details: {
        mediums: { type: [String], index: 1 },
        title: String,
        description: String,
        type: String,
        tags: [String],
        author: String,
        price: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        image: { type: String, default: image },
        featured: { type: Boolean, default: false },
    },
    post: {
        posts: [{ type: ObjectId, ref: 'Post' }],
        postsCount: { type: Number, default: 0 },
    },
    listing: {
        listed: [{ type: ObjectId, ref: 'Post' }],
        listedCount: { type: Number, default: 0 },
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
    links: {
        key: String,
        slug: { type: String, unique: true },
        url: String,
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
    user: { type: ObjectId, ref: 'User' },
    profile: { type: ObjectId, ref: 'Profile' },
    created: { type: Date, default: Date.now },
    updated: { type: Date },
})

PostSchema.pre('save', function (next) {
    if (this.options.purchasable === false) this.details.price = 0
    if (this.options.purchasable === true) this.details.type = 'listing'
    if (this.options.purchasable === false) this.details.type = 'post'
    next()
})

PostSchema.post('save', function () {
    console.log(this instanceof mongoose.Query); // true
    this.start = Date.now();
    this.setkey()
    this.setslug()
    this.seturl()
})

PostSchema.pre('findOneAndUpdate', function () {
    this.findOneAndUpdate({}, { $set: { updated: Date.now() } })
    this.setslug()
    this.seturl()
    console.log(this instanceof mongoose.Query); // true
    // prints returned documents
    console.log('find() returned ' + JSON.stringify(result));
    // prints number of milliseconds the query took
    console.log('find() took ' + (Date.now() - this.start) + ' millis');
})

// PostSchema.pre('find', function () {

// console.log(this instanceof mongoose.Query); // true
// this.start = Date.now();
// })

// PostSchema.post('find', function (result) {

// console.log(this instanceof mongoose.Query); // true
// prints returned documents
// console.log('find() returned ' + JSON.stringify(result));
// prints number of milliseconds the query took
// console.log('find() took ' + (Date.now() - this.start) + ' millis');
// })

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

PostSchema.methods.isaPost = function (id) {
    if (this.listing.listed.indexOf(id) !== -1) this.listing.listed.remove(id)
    if (this.post.posts.indexOf(id) === -1) this.post.posts.push(id)
    const count = this.post.posts.length
    this.post.postsCount = count
}

PostSchema.methods.isaLsting = function (id) {
    if (this.post.posts.indexOf(id) !== -1) this.post.posts.remove(id)
    if (this.listing.listed.indexOf(id) === -1) this.listing.listed.push(id)
    const count = this.listing.listed.length
    this.listing.listedCount = count
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

// PostSchema.index({ 'details.mediums': 1, })
PostSchema.index({ 'links.slug': 1, created: 1, }, { unique: true })
PostSchema.index({ 'links.slug': 1, 'links.url': 1, }, { unique: true })

mongoose.model('Post', PostSchema)
