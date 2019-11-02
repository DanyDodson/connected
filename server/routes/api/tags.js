const mongoose = require('mongoose')
const router = require('express').Router()
const Post = require('../../models/Post')

// get all tags - api/tags

router.get('/', (req, res) => {

  Post.find()
    .distinct('tags')
    .then(tags => res.json({ tags: tags }))
    .catch(err => {
      console.error(err.message)
      res.status(500).send('Server Error')
    })

})

module.exports = router
