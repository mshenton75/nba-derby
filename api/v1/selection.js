require.main.require('./config')
const router = require('express').Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Selection = mongoose.model('Selection')

router.post('/', async (req, res) => {
  const player = JSON.parse(req.body.player)
  Selection.saveSelection(req.body.date, player, req.currentUser._id)
  res.send(`${player.first_name} ${player.last_name}`)
})

module.exports = router
