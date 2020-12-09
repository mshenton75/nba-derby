require('../config')
const router = require('express').Router()
const moment = require('moment')
const PlayersList = require('../lib/players_list')
const _ = require('lodash')
require('../lib/players_list')

router.get('/', async (req, res) => {
  const date = moment(_.get(req.query, 'date'))
  const playersList = await new PlayersList(date).getList()
  res.send(playersList)
})

module.exports = router
