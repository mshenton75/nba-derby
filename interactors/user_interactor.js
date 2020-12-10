require('../config')
const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = {
  createUser: async (params, res) => {
    const user = new User(params)
    user.save(async (err, user) => {
      if (err) {
        return res({ status: 422, data: 'Failed to create user' })
      }

      res({ status: 201, data: user })
    })
  }
}
