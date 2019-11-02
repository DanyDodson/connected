const express = require('express')
const { check } = require('express-validator')
const { validationResult } = require('express-validator')
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')
const Comment = require('../../models/Comment')
const request = require('request')
const config = require('config')
const router = express.Router()

// get current users profile - api/profile/me
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile
      .findOne({ user: req.user.id })
      .populate('user', ['username', 'image'])
    if (!profile) {
      return res.status(400).json({ msg: 'Create a profile for a better experience' })
    }
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// create or update user profile /api/profile
router.post('/', [auth,
  [
    check('bio', 'bio is required').not().isEmpty(),
  ]
], async (req, res) => {

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const {
    bio,
    website,
    status,
    youtube,
    twitter,
    facebook,
    linkedin,
    instagram,
  } = req.body

  // Build profile object
  const profileFields = {}

  profileFields.user = req.user.id

  if (bio) profileFields.bio = bio
  if (website) profileFields.website = website
  if (status) profileFields.status = status

  // if (skills) {
  //   profileFields.skills = skills.split(',').map(skill => skill.trim())
  // }

  // Build social object
  profileFields.social = {}
  if (youtube) profileFields.social.youtube = youtube
  if (twitter) profileFields.social.twitter = twitter
  if (facebook) profileFields.social.facebook = facebook
  if (linkedin) profileFields.social.linkedin = linkedin
  if (instagram) profileFields.social.instagram = instagram

  try {
    // Using upsert option (creates new doc if no match is found):
    let profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true, upsert: true }
    )
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// get all profiles /api/profile
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['username', 'image'])
    res.json(profiles)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// get profile by user ID /api/profile/user/:user_id
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['username', 'image'])

    if (!profile) return res.status(400).json({ msg: 'Profile not found' })

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' })
    }
    res.status(500).send('Server Error')
  }
})

// delete profile, user & posts /api/profile
router.delete('/', auth, async (req, res) => {
  try {

    await Comment.deleteMany({ author: req.user.id })
    await Post.deleteMany({ author: req.user.id })
    await Profile.findOneAndRemove({ user: req.user.id })
    await User.findOneAndRemove({ 'counts.following': { _id: req.user.id } })
    await User.findOneAndRemove({ 'counts.followers': { _id: req.user.id } })

    // await User.unfollow(req.user.id)
    // await User.unfavorite()
    // await Post.updateFavoriteCount()

    // await User.findOneAndRemove({ _id: req.user.id })

    res.json({ msg: 'User deleted' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
router.put('/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id })

      profile.experience.unshift(newExp)

      await profile.save()

      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private

// router.delete('/experience/:exp_id', auth, async (req, res) => {
//   try {
//     const profile = await Profile.findOne({ user: req.user.id })

//     // Get remove index
//     const removeIndex = profile.experience
//       .map(item => item.id)
//       .indexOf(req.params.exp_id)

//     profile.experience.splice(removeIndex, 1)

//     await profile.save()

//     res.json(profile)
//   } catch (err) {
//     console.error(err.message)
//     res.status(500).send('Server Error')
//   }
// })

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id })
    const expIds = foundProfile.experience.map(exp => exp._id.toString())
    // if i dont add .toString() it returns this weird mongoose coreArray and the ids are somehow objects and it still deletes anyway even if you put /experience/5
    const removeIndex = expIds.indexOf(req.params.exp_id)
    if (removeIndex === -1) {
      return res.status(500).json({ msg: "Server error" })
    } else {
      // theses console logs helped me figure it out
      console.log("expIds", expIds)
      console.log("typeof expIds", typeof expIds)
      console.log("req.params", req.params)
      console.log("removed", expIds.indexOf(req.params.exp_id))
      foundProfile.experience.splice(removeIndex, 1)
      await foundProfile.save()
      return res.status(200).json(foundProfile)
    }
  } catch (error) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put('/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'Field of study is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id })

      profile.education.unshift(newEdu)

      await profile.save()

      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private
//router.delete('/education/:edu_id', auth, async (req, res) => {
//try {
//const profile = await Profile.findOne({ user: req.user.id })

// Get remove index
//const removeIndex = profile.education
//.map(item => item.id)
//.indexOf(req.params.edu_id)
/*
    profile.education.splice(removeIndex, 1)

    await profile.save()

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})
*/

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id })
    const eduIds = foundProfile.education.map(edu => edu._id.toString())
    // if i dont add .toString() it returns this weird mongoose coreArray and the ids are somehow objects and it still deletes anyway even if you put /education/5
    const removeIndex = eduIds.indexOf(req.params.edu_id)
    if (removeIndex === -1) {
      return res.status(500).json({ msg: "Server error" })
    } else {
      // theses console logs helped me figure it out
      /*   console.log("eduIds", eduIds)
      console.log("typeof eduIds", typeof eduIds)
      console.log("req.params", req.params)
      console.log("removed", eduIds.indexOf(req.params.edu_id))
 */ foundProfile.education.splice(
      removeIndex,
      1,
    )
      await foundProfile.save()
      return res.status(200).json(foundProfile)
    }
  } catch (error) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// get user repos from github /api/profile/github/:username
router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
        }/repos?per_page=5&sort=created:asc&client_id=${config.get(
          'githubClientId'
        )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    }

    request(options, (error, response, body) => {
      if (error) console.error(error)

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No Github profile found' })
      }

      res.json(JSON.parse(body))
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// start following a user /api/profile/user/:user_id/follow
router.post('/user/:user_id/follow', auth, async (req, res) => {
  try {

    const profile = await req.params.user_id
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(401).json({ msg: 'Not logged in' })
    }

    if (!profile) {
      return res.status(401).json({ msg: 'Profile not found' })
    }

    await user.follow(profile)
    return res.status(200).json({ msg: `Your now following id: ${profile}` })

  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// stop following a user /api/profile/user/:user_id/follow
router.delete('/user/:user_id/follow', auth, async (req, res) => {
  try {
    const profile = await req.params.user_id
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(401).json({ msg: 'Profile not found' })
    }

    if (!profile) {
      return res.status(401).json({ msg: 'Profile not found' })
    }

    await user.unfollow(profile)
    return res.status(200).json({ msg: `Your no longer following id: ${profile}` })

  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router
