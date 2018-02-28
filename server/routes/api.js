const express = require('express');
const router = express.Router(); 

const Record = require('../models/record');

router.route('/records')
  .get((req, res) => {
    Record.find((err, records) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.json(records);
      }
    })
    .lean();
  })
  .post((req, res) => {
    if (!req.body || !req.body.title) {
      res.status(204).send({ error: 'Request lacking required fields.' });
    } else {
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
          image: req.files ? (req.files.image || undefined) : undefined,
        });
        let error;
        newRecord.save((err) => {
          error = err;
          if (err) res.send(err);
        });
        if (error) {
          res.send(error);
        } else {
          res.json({ msg: 'Record added' });
        }
      }
  })
  .delete((req, res) => {
    let error;
    Record.remove({_id: req.query._id}, (err) => {
      error = err;
      if (err) res.send(err);
    });
    if (error) {
      res.send(error);
    } else {
      res.json({ msg: 'Record removed' });
    }
  })
  .put((req, res) => {
    Record.findById(req.body.id, (err, record) => {
      if (err) {
        res.send(err);
      } else {
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
        } else if (req.body.image && (req.body.image === 'undefined' || req.body.image === 'null')) {
          record.set({ image: undefined });
        }

        record.save((err, updatedRecord) => {
          if (err) {
            res.send(err);
          } else {
            res.send(updatedRecord);
          }
        });
      }
    });
  });

module.exports = router;
