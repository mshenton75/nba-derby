var router = require('express').Router();

router.route('/')
  .get(async function (req, res) {
    res.send('this is from index')
  });

module.exports = router;