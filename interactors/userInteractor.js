require('../config')
const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = {
  createUser: async (params, fn) => {
    const user = new User(params)
    user.save(async (err, user) => {
      if (err) {
        return fn({ status: 422, json: 'Failed to create user' })
      }

      fn({ status: 201, json: user })
    })
  }
}