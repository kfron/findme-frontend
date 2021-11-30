var express = require('express');
var router = express.Router();

router.post('/login', function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    res.json({"validated": true})
  }
  res.json({"validated": false})
});

module.exports = router;
