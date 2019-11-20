const mongoose = require('mongoose')
const shortid = require("shortid")
const slugify = require("slugify")

const CommentSchema = new mongoose.Schema({
    text: { type: String },

    author: { type: String },
    image: { type: String },
    email: { type: String },

    url: { type: String },
    slug: { type: String, unique: true },

    liked_count: { type: Number, default: 0 },
    liked_by_current: { type: Boolean, default: false },

    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    parent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    liked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    posted: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
})

CommentSchema.pre("validate", function (next) {
    if (this.parent) {
        this.slugify()
    }
    next()
})

CommentSchema.methods.slugify = function () {
    let posted = new Date()
    let time = slugify(posted.toUTCString())
    let url = time + ":" + this._id
    if (this.parent) {
        this.parent = Comment.findOne({ post_id: this.post_id, slug: this.parent })
        this.slug = this.parent["slug"] + "/" + this._id
        this.url = this.parent["url"] + "/" + url
    } else {
        this.slug = this._id
        this.url = url
    }
}

CommentSchema.methods.findCommentBySlug = function (parent, slug) {
    return Comment.find_one({ 'parent': parent, 'slug': slug })
}

CommentSchema.methods.findSubCommentBySlug = function (parent, slug) {
    return Comment.find_one({
        'parent': parent, 'url': re.compile('^' + re.escape(slug))
    })

    subdiscussion = subdiscussion.sort('full_slug')
    Comment.find_one({ 'discussion_id': discussion_id, 'slug': comment_slug })
}

CommentSchema.methods.toJSONFor = function (user) {
    return {
        id: this._id,
        text: this.text,
        posted: this.posted,
        author: this.author.toProfileJSONFor(user)
    }
}

CommentSchema.index({ parent: 1, posted: 1, }, { unique: true, })
CommentSchema.index({ parent: 1, url: 1, }, { unique: true, })

mongoose.model('Comment', CommentSchema)