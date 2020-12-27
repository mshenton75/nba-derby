const mongoose = require('mongoose')
const ActivePlayer = mongoose.model('ActivePlayer')
const GameScore = mongoose.model('GameScore')
const schedule = require('node-schedule')
const moment = require('moment')
const _ = require('lodash')

// run at 9:00 UTC
// Get players for today's games
schedule.scheduleJob('00 09 * * *', () => {
  ActivePlayer.createPlayerListDocument(moment.utc())
})

// run at 8:30 UTC
// calculate game scores for yesterday
schedule.scheduleJob('30 08 * * *', async () => {
  const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
  const games = await ActivePlayer.find({ date: yesterday })
  if (games) {
    _.forEach(games[0].players, (g) => {
      GameScore.saveStatsForGame(g.game_id)
    })
  }
})
