require('../../config')
const router = require('express').Router()
// const _ = require('lodash')
// const nba = require('nba')
const moment = require('moment')
const PlayersList = require('../../lib/players_list')
require('../../lib/players_list')

router.get('/', async (req, res) => {
  const date = moment()
  const playersList = await new PlayersList(date).getList()
  res.send(playersList)
})

module.exports = router
