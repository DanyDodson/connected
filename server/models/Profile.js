const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema
const config = require('config')
const client = config.get('app.client')

const ProfileSchema = new mongoose.Schema({
    details: {
        email: { type: String },
        image: { type: String },
        username: { type: String },
        name: { type: String, default: '' },
        about: { type: String, default: '' },
        active: { type: Boolean, default: false },
    },
    links: {
        url: { type: String, default: '' },
    },
    posted: {
        posts: [{ type: ObjectId, ref: 'Post' }],
        postedCount: { type: Number, default: 0 },
    },
    listed: {
        listed: [{ type: ObjectId, ref: 'Post' }],
        listedCount: { type: Number, default: 0 },
    },
    friends: {
        following: [{ type: ObjectId, ref: 'User' }],
        followers: [{ type: ObjectId, ref: 'User' }],
        followingCount: { type: Number, default: 0 },
        followersCount: { type: Number, default: 0 },
    },
    favorites: {
        favorited: [{ type: ObjectId, ref: 'Post' }],
        favoritedCount: { type: Number, default: 0 },
    },
    socials: {
        blog: { type: String, default: 'userblog.com' },
        instagram: { type: String, default: 'instagram.com' },
        twitter: { type: String, default: 'twitter.com' },
        facebook: { type: String, default: 'facebook.com' },
        youtube: { type: String, default: 'youtube.com' },
        linkedin: { type: String, default: 'linkedin.com' },
    },
    colors: {
        profile_bg_color: { type: String, default: '#FFFFFF' },
        profile_fg_color: { type: String, default: '#AAAAAA' },
        profile_link_color: { type: String, default: '#24DADA' },
        profile_menu_bg_color: { type: String, default: '#FFEDD4' },
        profile_menu_fg_color: { type: String, default: '#7A7A7A' },
    },
    vender: {
        role: { type: String, default: 'seller' },
        status: { type: String, default: 'dormant' },
        phone: { type: Number, default: 0 },
        reviews: [{
            stars: { type: Number, default: 0 },
            critique: { type: String, default: '' },
        }],
        location: {
            address: {
                street: { type: String, default: '' },
                city: { type: String, default: '' },
                state: { type: String, default: '' },
                zip: { type: Number, default: 0 },
            },
            geo: {
                type: { type: String, default: 'Point' },
                coordinates: [{ type: Array }],

            },
        },
    },
    user: { type: ObjectId, ref: 'User' },
    created: { type: Date, default: Date.now },
    updated: { type: Date },
})


ProfileSchema.pre('save', function (next) {
    if (!this.links.url) this.links.url = client + '/artists/' + this.details.username
    next()
})

ProfileSchema.methods.setUrl = function () {
    this.links.url = client + '/artists/' + this.details.username
    return this.save()
}

ProfileSchema.methods.addPosted = function (id) {
    if (this.listed.listed.indexOf(id) !== -1) this.listed.listed.remove(id)
    if (this.posted.posts.indexOf(id) === -1) this.posted.posts.push(id)
    const count = this.posted.posts.length
    this.posted.postedCount = count
    return this.save()
}

ProfileSchema.methods.delPosted = function (id) {
    this.posted.posts.remove(id)
    return this.save()
}

ProfileSchema.methods.addListed = function (id) {
    if (this.posted.posts.indexOf(id) !== -1) this.posted.posts.remove(id)
    if (this.listed.listed.indexOf(id) === -1) this.listed.listed.push(id)
    const count = this.listed.listed.length
    this.listed.listedCount = count
    return this.save()
}

ProfileSchema.methods.delListed = function (id) {
    this.listed.listed.remove(id)
    return this.save()
}

ProfileSchema.methods.isFavorite = function (post) {
    return this.favorites.favorited.some(function (favoritedId) {
        return favoritedId.toString() === post.toString()
    })
}

ProfileSchema.methods.favorite = function (id) {
    if (this.favorites.favorited.indexOf(id) === -1) {
        this.favorites.favorited.push(id)
    }
    return this.save()
}

ProfileSchema.methods.unfavorite = function (id) {
    this.favorites.favorited.remove(id)
    return this.save()
}

ProfileSchema.methods.favoriteCount = function () {
    const count = this.favorites.favorited.length
    this.favorites.favoritedCount = count
    return this.save()
}

ProfileSchema.methods.isFollowing = function (id) {
    return this.friends.following.some(function (followId) {
        return followId.toString() === id.toString()
    })
}

ProfileSchema.methods.setFollowing = function (id) {
    if (this.friends.following.indexOf(id) === -1) {
        this.friends.following.push(id)
    }
    return this.save()
}

ProfileSchema.methods.delFollowing = function (id) {
    this.friends.following.remove(id)
    return this.save()
}

ProfileSchema.methods.followingCount = function () {
    const count = this.friends.following.length
    this.friends.followingCount = count
    return this.save()
}

ProfileSchema.methods.setFollower = function (id) {
    if (this.friends.followers.indexOf(id) === -1) {
        this.friends.followers.push(id)
    }
    return this.save()
}

ProfileSchema.methods.delFollower = function (id) {
    this.friends.followers.remove(id)
    return this.save()
}

ProfileSchema.methods.followerCount = function () {
    const count = this.friends.followers.length
    this.friends.followersCount = count
    return this.save()
}

ProfileSchema.methods.profileToJson = function (profile) {
    return {
        _id: this._id,
        details: this.details,
        links: this.links,
        posted: this.posted,
        listed: this.listed,
        friends: this.friends,
        favorites: this.favorites,
        socials: this.socials,
        colors: this.colors,
        active: this.active,
        vendor: this.vendor,
        user: this.user,
        created: this.created,
        updated: this.updated,
        following: profile ? profile.isFollowing(this._id) : false,
    }
}

ProfileSchema.index({ 'details.username': 1, }, { unique: true })

mongoose.model('Profile', ProfileSchema)
