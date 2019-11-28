const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema
const config = require('config')
const client = config.get('app.client')
const slugify = require('slugify')
const Comment = require('./Comment')
const Post = require('./Post')

const CommentSchema = new mongoose.Schema({
    details: {
        text: { type: String },
        author: { type: String },
        email: { type: String },
        image: { type: String },
    },
    links: {
        key: { type: String },
        parent: { type: String },
        slug: { type: String },
        url: { type: String },
    },
    likes: {
        likedBy: [{ type: ObjectId, ref: 'User' }],
        likesCount: { type: Number, default: 0 },
        liked_by_current: { type: Boolean, default: false },
    },
    post: { type: ObjectId, ref: 'Post' },
    user: { type: ObjectId, ref: 'User' },
    created: { type: Date, default: Date.now },
    updated: { type: Date },
})

CommentSchema.methods.setkey = function () {
    const random = (Math.random() * Math.pow(36, 6) | 0).toString(36)
    this.links.key = slugify(random, { lower: true })
}

CommentSchema.methods.setparent = function () {
    const parent = Post.findOne({ _id: this.post })
    this.links.parent = parent.links.slug
}

CommentSchema.methods.setslug = function () {
    this.links.slug = slugify(this.details.text + '-' + this.links.key, { lower: true })
}

CommentSchema.methods.seturl = function () {
    let created = new Date().toUTCString().split(' ').slice(1, 5).join(' ')
    this.links.url = client + '/' + this.links.parent + '-' + this.links.slug + '-' + slugify(created, { lower: true })
}

CommentSchema.methods.isLiked = function (id) {
    return this.likes.likedBy.some(function (likedById) {
        return likedById.toString() === id.toString()
    })
}

CommentSchema.methods.like = function (id) {
    if (this.likes.likedBy.indexOf(id) === -1) {
        this.likes.likedBy.push(id)
    }
    return this.save()
}

CommentSchema.methods.unlike = function (id) {
    this.likes.likedBy.remove(id)
    return this.save()
}

CommentSchema.methods.likesCount = function () {
    const count = this.likes.likedBy.length
    this.likes.likesCount = count
    return this.save()
}

CommentSchema.methods.commentToJson = function () {
    return {
        _id: this._id,
        details: this.details,
        links: this.links,
        likes: this.likes,
        created: this.created,
        updated: this.updated,
    }
}

CommentSchema.index({ 'links.slug': 1 }, { unique: true, })
CommentSchema.index({ 'links.parent': 1, created: 1 }, { unique: true, })
CommentSchema.index({ 'links.parent': 1, 'links.url': 1 }, { unique: true, })

mongoose.model('Comment', CommentSchema)