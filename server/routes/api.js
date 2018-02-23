const express = require('express');
const router = express.Router(); 

const Record = require('../models/record');

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
      image: req.files ? req.files.image || '' : '',
    });
    newRecord.save(err => {
      if (err) res.send(err); 
    });
    res.json({ msg: 'Record added' });
  })
  .delete((req, res) => {
    Record.remove({_id: req.query._id}, (err) => {
      if (err) res.send(err);
    });
    res.json({msg: 'Record removed'});
  })
  .put((req, res) => {
    Record.findById(req.body.id, function (err, record) {
      if (err) res.send(err);

      record.set({
        title: req.body.title,
        artist: req.body.artist,
        format: req.body.format,
        rating: req.body.rating,
        wikiHref: req.body.wikiHref,
        wikiDesc: req.body.wikiDesc,
        wikiImg: req.body.wikiImg,
        notes: req.body.notes,
      });

      if (req.files && req.files.image) {
        record.set({ image: req.files.image });
      } else if (req.body.image && req.body.image === 'null') {
        record.set({ image: undefined });
      }

      record.save(function (err, updatedRecord) {
        if (err) res.send(err);
        res.send(updatedRecord);
      });
    });
  });

module.exports = router;
