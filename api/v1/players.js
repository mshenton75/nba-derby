require.main.require('./config')
const router = require('express').Router()
const moment = require('moment')
const _ = require('lodash')
const mongoose = require('mongoose')
const ActivePlayer = mongoose.model('ActivePlayer')

router.get('/', async (req, res) => {
  const date = moment(_.get(req.query, 'date'))
  const playersDocument = await ActivePlayer.find({ date: date.format('YYYY-MM-DD') })
  if (playersDocument.length === 0) {
    return res.send('No players found for that date')
  }

  res.render('active_players', { playersByGame: playersDocument[0].players })
})

module.exports = router
