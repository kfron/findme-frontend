var express = require('express');
var router = express.Router();

const ads = [{
    id: 1234,
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
    id: 1232,
    name: "Max",
    age: 4,
    imgUrl: "https://hips.hearstapps.com/ghk.h-cdn.co/assets/16/08/gettyimages-464163411.jpg?crop=1.0xw:1xh;center,top&resize=980:*",
    localizations: [
      {x: -123, y: 12}
    ]
  },
  {
    id: 3233,
    name: "Mufinka",
    age: 1,
    imgUrl: "https://hips.hearstapps.com/ghk.h-cdn.co/assets/17/30/pembroke-welsh-corgi.jpg?crop=1xw:0.9997114829774957xh;center,top&resize=980:*",
    localizations: [
      {x: 421, y: -114},
      {x: 522, y: 612}
    ]
  }];

router.get('/getAdsList', function(req, res, next) {
  res.json(ads)
});

router.get('/getAd', function(req, res, next) {
    let id = +req.query.id;
    let ad = ads.filter((ad) => ad.id === id)
    res.json(ad)
  });

module.exports = router;
