require('../../config')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const router = require('express').Router()

router.route('/')
  .post(async (req, res) => {
    const body = {
      email: req.body.email,
      username: req.body.username,
      first_name: req.body.first_name,
      last_name: req.body.last_name
    }
    const user = new User(body)
    user.save((err, user) => {
      if (err) console.error(err)

      res.json(user)
    })
  })

module.exports = router
