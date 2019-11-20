const {
    getMediums
} = require('../../controllers/medium')

const router = require('express').Router()

router.get('/', getMediums)

module.exports = router
