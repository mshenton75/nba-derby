const router = require('express').Router()
const verifyUser = require.main.require('./handlers/user_verification.js')
const mongoose = require('mongoose')
const User = mongoose.model('User')

router.use(verifyUser, async (req, res, next) => {
  const user = await User.findOne({ auth0_id: req.user.id })
  if (!user) return console.error('No user found')

  req.currentUser = user
  next()
})

router.use('/users', require('./users'))
router.use('/players', require('./players'))

module.exports = router
