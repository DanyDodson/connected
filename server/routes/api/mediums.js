const {
    mediums
} = require('../../controllers/medium')

const router = require('express').Router()

router.get('/', mediums)

module.exports = router
