const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const Record = require('../models/record');
const User = require('../models/user');

// Handles record adding/editing
router.route('/records')
  .get((req, res) => {
    const sort = req.query.sort ? JSON.parse(req.query.sort) : undefined;
    Record.find((err, records) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.json(records);
      }
    })
    .sort(sort || { date: -1 })
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

// Handles sign in
router.route('/signin')
  .post((req, res) => {
    User.findOne({ username: req.body.username }, (err, user) => {
      if (!user) {
        res.json({ success: false, msg: 'Invalid username or password' });
        return;
      }
      if (err) throw err;

      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if(err) {
          res.json({ success: false, msg: 'Invalid username or password' });
          return;
        }

        if (isMatch) {
          const userObject  = {
            username: user.username,
            email: user.email,
          };

          if (req.body.remember) {
            req.session.user = userObject;
            req.session.auth = true;
          }

          req.session.regenerate((err) => {
            if (err) throw err;
          });
          res.json({ success: true, user: userObject, msg: 'Login successful.' });
        } else {
          res.json({ success: false, msg: 'Invalid username or password' });
        }
      });
    }).lean();
  });

// Handles sign out
router.route('/signout')
  .get((req, res) => {
    req.session.destroy();
    res.json({ msg: 'User logged out' });
  });

// Handles user registration and modifications
router.route('/user')
  .post((req, res) => {
    if (!req.body || !req.body.username || !req.body.password || !req.body.email) {
      res.status(204).send({ error: 'Request lacking required fields.' });
    } else {
      let unique = true;
      User.findOne({ username: req.body.username }, (err, user) => {
        if (user) unique = false;
      });

      if (unique){
        const newUser = new User({
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
        });

        bcrypt.genSalt(10, (error, salt) => {
          if (error) {
            throw error;
          } else {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;

              if (hash) {
                newUser.password = hash;
                newUser.save((err) => {
                  if (err) {
                    res.send(err);
                  } else {
                    res.json({ success: true, msg: 'User added' });
                  }
                });
              }
            });
          }
        });
      } else {
        res.send({ error: 'Username taken' });
      }
    }
  })
  .delete((req, res) => {
    let error;
    User.remove({ username: req.query.username }, (err) => {
      error = err;
      if (err) res.send(err);
    });
    if (error) {
      res.send(error);
    } else {
      res.json({ msg: 'User removed' });
    }
  })
  .put((req, res) => {
    /* Needs work
    User.findByOne(req.body.username, (err, user) => {
      if (err) {
        res.send(err);
      } else {
        user.set({
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
        });

        record.save((err, updatedUser) => {
          if (err) {
            res.send(err);
          } else {
            res.send(updatedUser);
          }
        });
      }
    });*/
  });

router.route('/authenticated')
  .get((req, res) => {
    if (req.session.auth && req.session.user) {
      req.session.regenerate((err) => {
        if (err) throw err;
      });
      res.json({ authenticated: req.session.auth, user: req.session.user });
    } else {
      res.json({ authenticated: false, user: {} });
    }
  });

module.exports = router;
