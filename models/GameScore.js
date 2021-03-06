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
  points: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
  rebounds: { type: Number, default: 0 },
  steals: { type: Number, default: 0 },
  blocks: { type: Number, default: 0 },
  turnovers: { type: Number, default: 0 }
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
