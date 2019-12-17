const router = require('express').Router()

router.use('/auth', require('./routes/auth'))
// router.use('/users', require('./users'))
router.use('/', require('./routes/profiles'))
// router.use('/see', require('./posts'))
// router.use('/tags', require('./tags'))
// router.use('/mediums', require('./mediums'))
// router.use('/messages', require('./messages'))

module.exports = router
