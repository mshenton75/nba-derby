const mongoose = require('mongoose')
const schedule = require('node-schedule')
const moment = require('moment')
const PlayersList = require.main.require('./lib/players_list')

const ActivePlayer = new mongoose.Schema({
  date: { type: Date, index: true },
  players: { type: Array }
})

ActivePlayer.statics.createPlayerListDocument = async function (date) {
  const players = await new PlayersList(date).getList()
  this.create({ date: date, players: players }, (err, result) => {
    if (err) return console.error(err)

    console.log('Created Player List Record')
  })
}

mongoose.model('ActivePlayer', ActivePlayer)
