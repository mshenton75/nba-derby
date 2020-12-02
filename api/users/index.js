require('../../config')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const router = require('express').Router()
const raiseError = require('http-errors')

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

router.get('/:id', async (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) return console.error(err)
    if (!user) {
      // TODO: extract into seperate error handling module
      console.error('User not found')
      res.status(404)
      res.json('User not found')
    }
    res.json(user)
  })
})

module.exports = router
