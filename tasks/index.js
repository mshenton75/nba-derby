const mongoose = require('mongoose')
const ActivePlayer = mongoose.model('ActivePlayer')
const GameScore = mongoose.model('GameScore')
const schedule = require('node-schedule')
const moment = require('moment')
const _ = require('lodash')

// run at 8:00 UTC
schedule.scheduleJob('00 08 * * *', () => {
  ActivePlayer.createPlayerListDocument(moment.utc())
})

// run at 7:45 UTC
schedule.scheduleJob('45 07 * * *', async () => {
  const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
  const games = await ActivePlayer.find({ date: yesterday })
  if (games) {
    _.forEach(games.players, (g) => {
      GameScore.saveStatsForGame(g.game_id)
    })
  }
})
