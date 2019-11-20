

const { preloadUserId, } = require('../../controllers/user')
const { preloadUsername, } = require('../../controllers/profile')

const auth = require('../auth')
const router = require('express').Router()

// follow + unfollow users
// router.put("/user/follow", auth.required, addFollowing, addFollower)
// router.put("/user/unfollow", auth.required, removeFollowing, removeFollower)

// router.get("/users", allUsers)
// router.get("/user/:userId", auth.required, getUser)
// router.put("/user/:userId", auth.required, hasAuthorization, updateUser)
// router.delete("/user/:userId", auth.required, hasAuthorization, deleteUser)

// photo
// router.get("/user/photo/:userId", userPhoto)

// who to follow
// router.get("/user/findpeople/:userId", auth.required, findPeople)

router.param('userId', preloadUserId)
router.param('username', preloadUsername)

module.exports = router

