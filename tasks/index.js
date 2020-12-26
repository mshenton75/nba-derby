const mongoose = require('mongoose')
const ActivePlayer = mongoose.model('ActivePlayer')
const schedule = require('node-schedule')
const moment = require('moment')

// run at 8:00 UTC
schedule.scheduleJob('00 08 * * *', () => {
  ActivePlayer.createPlayerListDocument(moment.utc())
})
