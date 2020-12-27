require.main.require('./config')
const router = require('express').Router()
const moment = require('moment')
const _ = require('lodash')
const mongoose = require('mongoose')
const ActivePlayer = mongoose.model('ActivePlayer')
const userInteractor = require.main.require('./interactors/user_interactor.js')

router.use('/selection', require('./selection'))

router.get('/', async (req, res) => {
  const userSelections = await userInteractor.userSelections(req.currentUser.id)
  const date = moment(_.get(req.query, 'date'))
  const playersDocument = await ActivePlayer.find({ date: date.format('YYYY-MM-DD') })

  if (playersDocument.length === 0) {
    return res.send('No players found for that date')
  }
  res.render('active_players', {
    playersByGame: playersDocument[0].players,
    date: playersDocument[0].date,
    userSelections: userSelections
  })
})

module.exports = router
