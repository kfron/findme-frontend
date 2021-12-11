const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.json({message: 'alive'});
});

module.exports = router;
