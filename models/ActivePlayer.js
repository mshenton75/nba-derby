const mongoose = require('mongoose')
const PlayersList = require.main.require('./lib/players_list')

const ActivePlayer = new mongoose.Schema({
  date: { type: String, index: true },
  players: { type: Array }
})

ActivePlayer.statics.createPlayerListDocument = async function (date) {
  const players = await new PlayersList(date).getList()
  this.create({ date: date.clone().format('YYYY-MM-DD'), players: players }, (err, result) => {
    if (err) return console.error(err)
  })
}

mongoose.model('ActivePlayer', ActivePlayer)
