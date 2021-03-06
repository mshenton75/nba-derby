require('../config')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const auth0Client = require.main.require('./lib/auth0')
const _ = require('lodash')
const Selection = mongoose.model('Selection')

module.exports = {
  createUser: async (params, res) => {
    const user = new User(params)
    user.save(async (err, user) => {
      if (err) {
        return res({ status: 422, data: 'Failed to create user' })
      }
      auth0Client.registerUserId(user.auth0_id, user.id)
      res({ status: 201, data: user })
    })
  },
  searchUser: async (query, res) => {
    User.findOne(query, (err, user) => {
      if (err) return console.error(err)

      res(user)
    })
  },
  userSelections: async (userId) => {
    const selections = new Set()
    _.forEach(await Selection.byUserId(userId), (s) => {
      selections.add(s.player_id)
    })

    return selections
  }
}
