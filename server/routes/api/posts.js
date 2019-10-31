const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')
const slugs = require('../../middleware/slug')

const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Comment = require('../../models/Comment')

// Preload posts objects on routes with ':posts'
// router.param('posts', function (req, res, next, slug) {
//   Post.findOne({ _id: _id })
//     .populate('author')
//     .then(function (post) {
//       if (!post) { return res.sendStatus(404) }

//       req.post = post

//       return next()
//     }).catch(next)
// })

// @route    POST api/posts
// @desc     Create a post
// @access   Private

router.post('/',
  [
    auth, [
      check('content', 'content is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const user = await User.findById(req.user.id).select('-password')

      const newPost = new Post({
        content: req.body.content,
        avatar: user.avatar,
      })

      newPost.author = user

      const post = await newPost.save()
      res.json(post)

    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)

// @route    GET api/posts
// @desc     Get all posts
// @access   Private

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 })
    res.json(posts)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private

router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.json(post)
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).send('Server Error')
  }
})

// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }

    // Check user
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' })
    }

    await post.remove()

    res.json({ msg: 'Post removed' })
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).send('Server Error')
  }
})

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    // Check if the post has already been liked
    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: 'Post already liked' })
    }

    post.likes.unshift({ user: req.user.id })
    await post.updateLikesCount(post)
    return res.status(200).json({ msg: `Liked a post` })

    // await post.save()

    res.json(post.likes)
  } catch (err) {

    res.status(500).send('Server Error')
  }
})

// @route    PUT api/posts/unlike/:id
// @desc     Like a post
// @access   Private

router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    // Check if the post has already been liked
    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({ msg: 'Post has not yet been liked' })
    }

    // Get remove index
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id)

    post.likes.splice(removeIndex, 1)
    await post.updateLikesCount(post)
    return res.status(200).json({ msg: `Unliked a post` })
    // await post.save()

    res.json(post.likes)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route    POST api/posts/favorite/:id
// @desc     Save a post
// @access   Private

router.post('/favorite/:id', auth, async (req, res) => {
  try {
    const postId = await req.params.id
    const post = await Post.findById(req.params.id)
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(401).json({ msg: 'Not logged in' })
    }

    if (!postId) {
      return res.status(401).json({ msg: 'Post not found' })
    }

    // Check if already been added to collection
    if (user.favorites.indexOf(postId) >= 0) {
      return res.status(200).json({ msg: `This post is already in your collection` })
    }

    await user.favorite(postId)
    await post.updateFavoriteCount()
    return res.status(200).json({ msg: `Added a post to your collections` })

  } catch (err) {
    console.log(err)
    res.status(500).send({ msg: 'Server Error' })
  }
})

// @route    DELETE api/posts/favorite/:id
// @desc     Remove a saved post
// @access   Private

router.delete('/favorite/:id', auth, async (req, res) => {
  try {
    const postId = await req.params.id
    const post = await Post.findById(req.params.id)
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(401).json({ msg: 'Not logged in' })
    }

    if (!postId) {
      return res.status(401).json({ msg: 'Post not found' })
    }

    await user.unfavorite(postId)
    await post.updateFavoriteCount()
    return res.status(200).json({ msg: `Removed a post from your collections` })

  } catch (err) {
    res.status(500).send('Server Error')
  }
})


// @route    GET api/posts/:post_id/comments
// @desc     Comment on a post
// @access   Private

router.get('/:post_id/comments', auth, async (req, res) => {
  try {
    // const author = await User.findById(req.user.id).select('-password')
    const comments = await Comment.find({ post: req.params.post_id }).sort({ date: -1 })

    res.json(comments)

  } catch (err) {
    console.log(err)
    res.status(500).send('Server Error')
  }
})

// @route    POST api/posts/:post_id/comments
// @desc     Comment on a post
// @access   Private

router.post('/:post_id/comments', [auth, [check('content', 'Content is required').not().isEmpty()]], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const author = await User.findById(req.user.id).select('-password')
    const post = await Post.findById(req.params.post_id)

    const newComment = new Comment({
      content: req.body.content,
      url: post.url,
      author: author,
      post: post,
    })

    newComment.save()

    post.comments.push(newComment)
    post.save()
    return res.status(200).json({ msg: `Comment added` })

  } catch (err) {
    console.log(err)
    res.status(500).send('Server Error')
  }
})

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    // Pull out comment
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    )

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' })
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' })
    }

    // Get remove index
    const removeIndex = post.comments
      .map(comment => comment.id)
      .indexOf(req.params.comment_id)

    post.comments.splice(removeIndex, 1)

    await post.save()

    res.json(post.comments)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router
