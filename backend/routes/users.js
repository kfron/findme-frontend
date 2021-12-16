const express = require('express');
const { bcrypt } = require('../services/auth');
const router = express.Router();
const users = require('../services/users');

router.post('/login', async function(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  let dbPassword = null
  try {
    dbPassword = (await users.getUser(email))[0]?.password;
  } catch (err) {
    console.error(`Error while getting user `, err.message);
    next(err);
  }

  if (!dbPassword) {
    res.json({"validated": false})
  } else {
    bcrypt.compare(password, dbPassword, function (err, result) {
      if (result == true) {
        res.json({"validated": true})
      } else {
        res.json({"validated": false})
      }
    })
  }
});

router.post('/signup', async function(req, res, next) {
  let name = req.body.name;
  let surname = req.body.surname;
  let email = req.body.email;
  let mobile = req.body.mobile;
  let password = req.body.password;

  await users.createUser(name, surname, email, mobile, password);
  res.json({"validated": true});

})

module.exports = router;
