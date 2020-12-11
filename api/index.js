const router = require('express').Router()

router.route('/')
  .get(async function (req, res) {
    res.render('index')
  })

module.exports = router