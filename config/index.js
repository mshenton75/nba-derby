const express = require('express')
const path = require('path')
require('dotenv').config()

const logger = require('morgan')
const app = express()
const mongoose = require('mongoose')

// view engine setup
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true })

require('../models/User.js')
// const data = {
//   "username" : "mshenton1",
//   "email" : "mshenton75@gmail.edu",
//   "first_name" : "Matt",
//   "last_name" : "Shenton"
// }

// const User = mongoose.model('User')

// const record = new User(data)
// console.log(record)
// record.save((err, record) => {
//   if (err) return console.error(err)
//   console.log(record)
// })

module.exports = app 
