
const router = require('express').Router()
const verifyUser = require.main.require('./handlers/user_verification.js')

router.use(verifyUser, (req, res, next) => {
  next()
})

router.use('/users', require('./users'))
router.use('/players', require('./players'))

module.exports = router
