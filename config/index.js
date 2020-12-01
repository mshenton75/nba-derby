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

module.exports = app
