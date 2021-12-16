const express = require('express');
const router = express.Router();
const ads = require('../services/ads');

router.get('/getAdsList', async function(req, res, next) {
  try {
    res.json(await ads.getAdsList());
  } catch (err) {
    console.error(`Error while getting ads `, err.message);
    next(err);
  }
});

router.get('/getAd', async function(req, res, next) {
    let id = +req.query.id;
    try {
      res.json(await ads.getAd(id));
    } catch (err) {
      console.error(`Error while getting ad `, err.message);
      next(err);
    }
  });

module.exports = router;
