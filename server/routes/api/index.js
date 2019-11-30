const router = require('express').Router()

router.use('/auth', require('./auth'))
router.use('/users', require('./users'))
router.use('/artists', require('./artists'))
router.use('/see', require('./posts'))
router.use('/tags', require('./tags'))
router.use('/mediums', require('./mediums'))
router.use('/messages', require('./messages'))

router.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        return res.status(422).json({
            errors: Object.keys(err.errors).reduce((errors, key) => {
                errors[key] = err.errors[key].message
                return errors
            }, {})
        })
    }
    return next(err)
})

module.exports = router
