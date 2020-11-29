
var router = require('express').Router();

router.use('/', require('../api'));
router.use('/players', require('../api/players'))

module.exports = router