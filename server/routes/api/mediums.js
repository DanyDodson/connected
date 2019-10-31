const router = require('express').Router()
const mongoose = require('mongoose')
const Post = require('../../models/Post')

// return a list of mediums
router.get('/', function (req, res, next) {
  Pin.find()
    .distinct('mediums')
    .then(function (mediums) { return res.json({ mediums: mediums }) })
    .catch(next)
})

module.exports = router
