const {
    getTags
} = require('../../controllers/tag')

const router = require('express').Router()

router.get('/', getTags)

module.exports = router
