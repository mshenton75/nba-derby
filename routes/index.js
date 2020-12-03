
const router = require('express').Router()
const API_PATH = '../api'

router.use('/', require('../api'))
router.use('/players', require(`${API_PATH}/players`))
router.use('/users', require(`${API_PATH}/users`))

module.exports = router
