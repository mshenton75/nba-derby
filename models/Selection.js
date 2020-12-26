const mongoose = require('mongoose')

const Selection = new mongoose.Schema({
  date: { type: String, required: true },
  player_id: { type: Number, required: true },
  player_first_name: { type: String, required: true },
  player_last_name: { type: String, required: true },
  team_id: { type: Number, required: true },
  team_name: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

Selection.statics.saveSelection = async function (date, playerObj, userId) {
  this.create({
    date: date,
    player_id: playerObj.player_id,
    player_first_name: playerObj.first_name,
    player_last_name: playerObj.last_name,
    player_position: playerObj.position,
    team_id: playerObj.team_id,
    team_name: playerObj.team_name,
    user_id: userId
  }, (err, result) => {
    if (err) console.error(err)
  })
}

Selection.statics.byUserId = async function (userId) {
  return await this.find({ user_id: userId })
}

mongoose.model('Selection', Selection)
