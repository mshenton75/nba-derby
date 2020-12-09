var router = require('express').Router();

router.route('/')
  .get(async function (req, res) {
    console.log('here')
    res.render('index', { title: 'Something!!' })
  });

module.exports = router;