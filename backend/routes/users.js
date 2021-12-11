const express = require('express');
const router = express.Router();
const users = require('../services/users');

router.post('/login', async function(req, res, next) {
  console.log(req.body)
  let email = req.body.email;
  let password = req.body.password;
  console.log(email)
  console.log(password)
  if (email && password) {
    res.json({"validated": true})
  } else {
    res.json({"validated": false})
  }
});

router.post('/signup', async function(req, res, next) {
  let name = req.body.name;
  let surname = req.body.surname;
  let email = req.body.email;
  let mobile = req.body.mobile;
  let password = req.body.password;

  if (await users.createUser(name, surname, email, mobile, password)) {
    res.json({"validated": true})
  } else {
    res.json({"validated": false})
  }
})

module.exports = router;
