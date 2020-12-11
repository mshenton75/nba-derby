const router = require('express').Router()

router.route('/')
  .get(async function (req, res) {
    if (process.env.DISPLAY_PLACEHOLDER === 'true') {
      res.render('placeholder')
    } else {
      res.render('index')
    }
  })

module.exports = router
