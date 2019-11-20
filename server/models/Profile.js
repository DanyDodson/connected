const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema
const config = require('config')
const client = config.get('app.client')
const shortid = require("shortid")
const slugify = require("slugify")

const ProfileSchema = new mongoose.Schema({
    details: {
        email: { type: String },
        image: { type: String },
        name: { type: String, default: '' },
        about: { type: String, default: '' },
        username: { type: String, unique: true },
        active: { type: Boolean, default: false },
    },
    links: {
        url: { type: String, default: '' },
    },
    posted: {
        posted: [{ type: ObjectId, ref: 'Post' }],
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
        unsplash: { type: String, default: 'unsplash.com' },
        deviantart: { type: String, default: 'deviantart.com' },
        linkedin: { type: String, default: 'linkedin.com' },
    },
    colors: {
        profile_bg_color: { type: String, default: '#FFFFFF' },
        profile_fg_color: { type: String, default: '#AAAAAA' },
        profile_link_color: { type: String, default: '#24DADA' },
        profile_menu_bg_color: { type: String, default: '#FFEDD4' },
        profile_menu_fg_color: { type: String, default: '#7A7A7A' },
    },
    notifications: {
        type: { type: String, optional: false, default: '' },
        url: { type: String, optional: false, default: '' },
        to: { type: String, optional: false, default: '' },
        message: { type: String, optional: false, default: '' },
        hasDetails: { type: Boolean, optional: false, default: true },
        details: { type: String, optional: true, default: '' },
        status: String,
        timeSent: Date,
    },
    user: { type: ObjectId, ref: 'User' },
    created: { type: Date, default: Date.now },
    updated: { type: Date },
})


// creates a url for users profile
ProfileSchema.pre('validate', function (next) {
    if (!this.links.url) this.links.url = client + '/artists/' + this.details.username
    next()
})

// creates a url for users profile
ProfileSchema.methods.updateUrl = function (username) {
    return this.links.url = client + '/artists/' + username
}

// get profile by username
ProfileSchema.methods.getProfileByUsername = function (username, cb) {
    const query = { username: username }
    Profile.findOne(query, cb)
}

// add posts to favorites
ProfileSchema.methods.favorite = function (id) {
    if (this.favorites.favorited.indexOf(id) === -1) {
        this.favorites.favorited.push(id)
    }
    return this.save()
}

// remove posts to favorites
ProfileSchema.methods.unfavorite = function (id) {
    this.favorites.favorited.remove(id)
    return this.save()
}

// check if post is favorited
ProfileSchema.methods.isFavorite = function (id) {
    return this.favorites.favorited.some(function (favoriteId) {
        return favoriteId.toString() === id.toString()
    })
}

// follow users
ProfileSchema.methods.follow = function (id) {
    if (this.friends.following.indexOf(id) === -1) {
        this.friends.following.push(id)
    }
    return this.save()
}

// unfollow users
ProfileSchema.methods.unfollow = function (id) {
    this.friends.following.remove(id)
    return this.save()
}

// check if user is following
ProfileSchema.methods.isFollowing = function (id) {
    return this.friends.following.some(function (followId) {
        return followId.toString() === id.toString()
    })
}

// fills user when loading other schemas
ProfileSchema.methods.toJSONFor = function (profile) {
    return {
        details: this.details,
        posted: this.posted,
        listed: this.listed,
        friends: this.friends,
        favorites: this.favorites,
        colors: this.colors,
        socials: this.socials,
        notifications: this.notifications,
        active: this.active,
        created: this.created,
        updated: this.updated,
        user: this.user.toProfileJSONFor(profile),
        // following: profile ? profile.isFollowing(this._id) : false,
    }
}

mongoose.model('Profile', ProfileSchema)
