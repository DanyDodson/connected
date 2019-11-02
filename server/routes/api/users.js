const express = require('express')
const { check } = require('express-validator')
const { validationResult } = require('express-validator')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const gravatar = require('gravatar')
const config = require('config')

const User = require('../../models/User')


// register user - api/users
router.post('/',
  [
    check('username', 'Username is required !').not().isEmpty(),
    check('email', 'Please include a valid email !').isEmail(),
    check('password', 'Password requires 6 or more characters !').isLength({ min: 6 })
  ],

  async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      })
    }

    const { username, email, password } = req.body

    try {

      let user = await User.findOne({ email })

      if (user) {
        return res.status(400).json({
          errors: [{
            msg: 'User already exists'
          }]
        })
      }

      const avatar = gravatar.url(email, { s: '200', r: 'x', d: 'mm' })

      user = new User({
        username,
        email,
        avatar,
        password
      })

      const salt = await bcrypt.genSalt(10)

      user.password = await bcrypt.hash(password, salt)

      await user.save()

      const payload = {
        user: {
          id: user.id
        }
      }

      jwt.sign(payload, config.get('secret'),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )
    } catch (err) {
      console.error(err.message)
      res.status(500).send({
        msg: 'Server error',
        err: err.message,
      })
    }
  }
)

module.exports = router
