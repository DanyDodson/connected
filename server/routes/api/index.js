const router = require('express').Router()

//-----------------------------------------------------------------------
// routes

router.use('/', require('./auth'))
router.use('/account', require('./users'))
router.use('/artists', require('./profiles'))
router.use('/see', require('./posts'))
router.use('/comments', require('./comments'))
router.use('/messages', require('./messages'))
router.use('/tags', require('./tags'))
router.use('/mediums', require('./mediums'))

//-----------------------------------------------------------------------
// handle errors

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
