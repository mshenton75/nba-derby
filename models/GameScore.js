const mongoose = require('mongoose')
const nba = require.main.require('./lib/nba')
const _ = require('lodash')

const GameScore = new mongoose.Schema({
  date: { type: String },
  player_id: { type: String, index: true },
  game_score: {
    type: Number,
    default: function () {
      return (this.points + this.assists + this.steals + this.rebounds + this.blocks) - this.turnovers
    }
  },
  points: { type: Number, required: true },
  assists: { type: Number, required: true },
  rebounds: { type: Number, required: true },
  steals: { type: Number, required: true },
  blocks: { type: Number, required: true },
  turnovers: { type: Number, required: true }
})

GameScore.statics.saveStatsForGame = async function (gameId, date) {
  const playerStats = await nba.statsForGame(gameId)
  _.forEach(playerStats, (stats) => {
    this.create({
      date: date,
      player_id: stats.playerId,
      points: stats.points,
      assists: stats.assists,
      rebounds: stats.totReb,
      steals: stats.steals,
      blocks: stats.blocks,
      turnovers: stats.turnovers
    }, (err, result) => {
      if (err) console.error(err)
    })
  })
}

mongoose.model('GameScore', GameScore)
