const express = require('express');
const router = express.Router(); 

const Record = require('../models/collection');

router.route('/records')
  .get((req, res) => {
    Record.find(function (err, records) {
      if (err) {
        res.status(501).send(err);
        throw err;
      }
      res.json(records);
    })
    .lean();
  })
  .post((req, res) => {
    const date = new Date();
    const newRecord = new Record({
      date: date,
      title: req.body.title,
      artist: req.body.artist,
      format: req.body.format,
      rating: req.body.rating,
      wikiHref: req.body.wikiHref,
      wikiDesc: req.body.wikiDesc,
      wikiImg: req.body.wikiImg,
      notes: req.body.notes,
      image: req.files.image,
    });
    newRecord.save(err => {
      if (err) res.send(err); 
    });
    res.json({ msg: 'Record added' });
  });

module.exports = router;
