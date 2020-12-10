
const router = require('express').Router()
const API_PATH = '../api'
const GATEKEEPER_PATH = '../api/v1/gatekeeper.js'

router.use('/', require(API_PATH))
router.use('/', require(`${API_PATH}/auth.js`))
router.use('/', require(GATEKEEPER_PATH))

module.exports = router
