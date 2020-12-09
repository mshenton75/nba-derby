require('../config')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const router = require('express').Router()
const verifyUser = require('../handlers/user_verification.js')
const auth0Client = require('../lib/auth0')

// TODO: extract error handling into seperate module
// TODO: create one gatekeeper verifyUser definition

router.route('/')
  .get(verifyUser, async (req, res) => {
    User.find((err, users) => {
      if (err) throw err

      return res.json(users)
    })
  })
  .post(verifyUser, async (req, res) => {
    const body = {
      email: req.body.email,
      username: req.body.username,
      first_name: req.body.first_name,
      last_name: req.body.last_name
    }
    const user = new User(body)
    user.save((err, user) => {
      if (err) return res.status(422).json('Failed to create user.')

      auth0Client.registerUserId(req.user.id, user.id)
      res.json(user)
    })
  })

router.route('/:id')
  .get(verifyUser, async (req, res) => {
    const user = User.findById(req.params.id, (err, result) => {
      if (err) throw err
      if (!user) {
        return res.status(404).json('User not found.')
      }
    })
    res.json(await user)
  })
  .put(verifyUser, async (req, res) => {
    const user = User.findByIdAndUpdate(req.params.id, req.body, (err, user) => {
      if (err) throw err
      if (!user) {
        return res.status(404).json('User not found.')
      }
    })
    res.json(await user)
  })

module.exports = router
