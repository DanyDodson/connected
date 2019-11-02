const mongoose = require('mongoose')
const router = require('express').Router()
const Post = require('../../models/Post')

// get all mediums - api/mediums

router.get('/', (req, res) => {

  Post.find()
    .distinct('mediums')
    .then(mediums => res.json({ mediums: mediums }))
    .catch(err => {
      console.error(err.message)
      res.status(500).send('Server Error')
    })

})

module.exports = router
