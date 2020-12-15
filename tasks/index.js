const mongoose = require('mongoose')
const ActivePlayer = mongoose.model('ActivePlayer')
const schedule = require('node-schedule')
const moment = require('moment')

// run at 3:00 AM Eastern, 8:00 AM UTC
schedule.scheduleJob('00 08 * * *', () => {
  const date = moment()
  ActivePlayer.createPlayerListDocument(date.clone())
})
