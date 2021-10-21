const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('ciao sono ad un corso');
});

module.exports = router;
