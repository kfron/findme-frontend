const express = require('express');
const router = express.Router();
const ads = require('../services/ads');

const adsobj = [{
    id: 1,
    name: "Kevin",
    age: 12,
    imgUrl: "https://hips.hearstapps.com/ghk.h-cdn.co/assets/17/30/2560x3839/australian-shepherd.jpg?resize=980:*",
    localizations: [
      {x: 123, y: 234},
      {x: 122, y: 442},
      {x: 24, y: 122}
    ]
  },
  {
    id: 2,
    name: "Max",
    age: 4,
    imgUrl: "https://hips.hearstapps.com/ghk.h-cdn.co/assets/16/08/gettyimages-464163411.jpg?crop=1.0xw:1xh;center,top&resize=980:*",
    localizations: [
      {x: -123, y: 12}
    ]
  },
  {
    id: 3,
    name: "Mufinka",
    age: 1,
    imgUrl: "https://hips.hearstapps.com/ghk.h-cdn.co/assets/17/30/pembroke-welsh-corgi.jpg?crop=1xw:0.9997114829774957xh;center,top&resize=980:*",
    localizations: [
      {x: 421, y: -114},
      {x: 522, y: 612}
    ]
  }];

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
