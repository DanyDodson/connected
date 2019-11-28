const router = require('express').Router()

router.get('/', (req, res) => { res.send('comments route working') })

module.exports = router