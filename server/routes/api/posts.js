const express = require('express')
const router = express.Router()
const { validationResult } = require('express-validator')
const { check } = require('express-validator')
const config = require('config')

const auth = require('../../middleware/auth')
const slugs = require('../../middleware/slug')

const User = require('../../models/User')
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const Comment = require('../../models/Comment')

const cloudname = config.get('cloudname')
const cloudkey = config.get('cloudkey')
const cloudsecret = config.get('cloudsecret')
const cloudinary = require('cloudinary').v2

// cloudinary
cloudinary.config({ cloud_name: cloudname, api_key: cloudkey, api_secret: cloudsecret })

// create post /api/posts
router.post('/', [auth,
  [
    check('title', 'title is required').not().isEmpty()
  ]
], async (req, res) => {

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {

    const user = await User.findById(req.user.id).select('-password')

    const post = new Post({
      uploads: req.body.uploads,
      title: req.body.title,
      description: req.body.description,
      mediums: req.body.mediums,
      tags: req.body.tags,
      critique: req.body.critique,
      featured: req.body.featured,
      purchasable: req.body.purchasable,
      price: req.body.price,
      shareable: req.body.shareable,
      author: user,
      avatar: req.user.avatar,
    })

    await post.save()
    res.json(post)

  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// get all posts /api/posts
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 })

    res.json(posts)

  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// get post by id /api/posts/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        msg: 'Post not found'
      })
    }

    res.json(post)

  } catch (err) {

    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: 'Post not found'
      })
    }

    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// delete post by id /api/posts/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' })
    }

    if (post.uploads && post.uploads.length) {
      await cloudinary.api.delete_resources([`${req.post.uploads[0].public_id}`], () => { })
    }

    await post.remove()

    res.json({
      msg: 'Post removed',
    })

  } catch (err) {

    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: 'Post not found',
      })
    }

    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// like a post /api/posts/like/:id
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    // Check if the post has already been liked
    if (post.likes.filter(like => like._id.toString() === req.user.id).length > 0) {
      return res.status(400).json({
        msg: `You\'ve already liked this post`
      })
    }

    await post.like(req.user.id)

    return res.status(200).json({
      msg: `Liked a post titled : ${post.title}`
    })

  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// unlike a post api/posts/unlike/:id
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    // Check if the post has already been liked
    if (post.likes.filter(like => like._id.toString() === req.user.id).length === 0) {
      return res.status(400).json({
        msg: 'You havn\'t liked this post yet'
      });
    }

    // get remove index
    const removeIndex = post.likes
      .map(like => like._id.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    return res.status(200).json({
      msg: `Unliked a post titled : ${post.title}`
    })

  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// add to favorite /api/posts/favorite/:id
router.post('/favorite/:id', auth, async (req, res) => {
  try {

    const postId = await req.params.id
    const post = await Post.findById(req.params.id)
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(401).json({
        msg: 'You must be logged in to do that'
      })
    }

    if (!postId) {
      return res.status(401).json({
        msg: 'Post cannot be found'
      })
    }

    if (user.favorites.indexOf(postId) >= 0) {
      return res.status(200).json({
        msg: `Post already exists in your favorites`
      })
    }

    await user.favorite(postId)
    await post.updateFavoriteCount()

    return res.status(200).json({
      msg: `Post added to your favorites`
    })

  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// remove favorite /api/posts/favorite/:id
router.delete('/favorite/:id', auth, async (req, res) => {
  try {

    const user = await User.findById(req.user.id)
    const post = await Post.findById(req.params.id)

    if (!user) {
      return res.status(401).json({
        msg: 'You must be logged in to do that'
      })
    }

    if (!post) {
      return res.status(401).json({
        msg: 'Post cannot be found'
      })
    }

    await user.unfavorite(post)
    await post.updateFavoriteCount()

    return res.status(200).json({
      msg: `Post removed from your favorites`
    })

  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})


// get comment /api/posts/:id/comments
router.get('/:id/comments', auth, async (req, res) => {
  try {
    const comments = await Comment
      .find({ post: req.params.id })
      .sort({ date: -1 })

    res.json(comments)

  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// create comment /api/posts/:id/comments
router.post('/:id/comments', [auth,
  [
    check('content', 'Comment box cannot be empty').not().isEmpty()
  ]
], async (req, res) => {

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const user = await User.findById(req.user.id).select('-password')
    const post = await Post.findById(req.params.id)

    const comment = new Comment({
      creator: user.username,
      image: user.image,
      content: req.body.content,
      parent: post.slug,
      author: req.user.id,
      post: post,
    })

    await comment.save()
    await post.comments.push(comment)
    await post.save()

    res.status(200).send('Created Post')
    // res.json(comment)

  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// delete comment /api/posts/:id/comments/:comment_id
router.delete('/:id/comments/:comment', auth, async (req, res) => {
  try {

    const post = await Post.findById(req.params.id)
    const comment = await Comment.findById(req.params.comment)

    if (!comment) {
      res.status(404).send({
        msg: 'No comments found !'
      })
    }

    if (comment._id.toString() !== req.user.id) {
      res.status(401).send({
        msg: 'You must be logged in to do that !'
      })
    }

    await post.comments.remove(req.params.comment)
    await post.save()
    await Comment.deleteOne({ _id: req.params.comment })

    res.json({
      msg: 'Successfully removed comment !',
      comments: post.comments
    })

  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router
