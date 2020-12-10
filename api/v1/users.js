require('../../config')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const router = require('express').Router()

const verifyUser = require.main.require('./handlers/user_verification.js')
const userInteractor = require.main.require('./interactors/user_interactor.js')

router.route('/')
  .get(async (req, res) => {
    User.find((err, users) => {
      if (err) throw err

      return res.json(users)
    })
  })
  .post(async (req, res) => {
    const body = {
      email: req.body.email,
      username: req.body.username,
      first_name: req.body.first_name,
      last_name: req.body.last_name
    }

    userInteractor.createUser(body, async (result) => {
      res.status(result.status).json(result.data)
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
