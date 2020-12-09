
const router = require('express').Router()
const API_PATH = '../api'

router.use('/', require(API_PATH))
router.use('/', require(`${API_PATH}/auth.js`))
router.use('/players', require(`${API_PATH}/players.js`))
router.use('/users', require(`${API_PATH}/users.js`))

module.exports = router
