const {
    tags
} = require('../../controllers/tag')

const router = require('express').Router()

router.get('/', tags)

module.exports = router
