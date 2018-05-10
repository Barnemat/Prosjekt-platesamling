const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const Record = require('../models/record');
const User = require('../models/user');

// Handles record adding/editing
router.route('/records')
  .get((req, res) => {
    const sort = req.query.sort ? JSON.parse(req.query.sort) : undefined;
    User.findOne({ username: req.query.username }, (err, user) => {
      if (err) throw err;

      if (user) {
        Record.find({ userId: user._id }, (err, records) => {
          if (err) {
            res.status(404).send(err);
          } else {
            res.json(records);
          }
        })
        .sort(sort || { date: -1 })
        .lean();
      } else {
        res.send([]);
      }
    })
    .lean();
  })
  .post((req, res) => {
    if (!req.body || !req.body.title || !req.body.username) {
      res.status(204).send({ error: 'Request lacking required fields.' });
    } else {
      User.findOne({ username: req.body.username }, (userError, user) => {
        if (userError) throw userError;

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
          userId: user._id,
        });

        let error;
        newRecord.save((err) => {
          error = err;
          if (err) res.send(err);
        });
        if (!error) {
          res.json({ msg: 'Record added' });
        }
      })
    .lean();
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
            public: user.public,
          };

          if (req.body.remember) {
            req.session.user = userObject;
            req.session.auth = true;
            req.session.remember = true;
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
  .get((req, res) => {
    const search = req.query.username ? { username: req.query.username } : { email: req.query.email };

    User.findOne(search, (err, user) => {
      let unique = false;
      if (user === null) unique = true;
      res.json({
        user: {
          username: user ? user.username : '',
          email: user ? user.email : '',
          public: user && user.public,
        },
        unique
      });
    });
  })
  .post((req, res) => {
    if (!req.body || !req.body.username || !req.body.password || !req.body.email) {
      res.status(204).send({ error: 'Request lacking required fields.' });
    } else {
      let unique = true;
      User.findOne({ username: req.body.username }, (err, user) => {
        if (user) unique = false;
      });

      if (unique) {
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
              } else {
                res.json({ success: false });
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
    User.findOne({ username: req.body.username || '' }, (err, user) => {
      if (err) {
        res.send(err);
      } else {
        if (req.body.password) {
          let password = req.body.password;

          bcrypt.genSalt(10, (error, salt) => {
            if (error) {
              throw error;
            } else {
              bcrypt.hash(password, salt, (err, hash) => {
                if (err) throw err;

                if (hash) {
                  password = hash;

                  req.session.regenerate((err) => {
                    if (err) throw err;
                  });

                  user.set({
                    password: password || user.password,
                    email: req.body.email || user.email,
                    public: typeof req.body.public === 'boolean' && req.body.public,
                  });

                  user.save((err, updatedUser) => {
                    if (err) {
                      res.send(err);
                    } else {
                      res.send(updatedUser);
                    }
                  });
                } else {
                  res.json({ success: false });
                }
              });
            }
          });
        } else {
          const userObject  = {
            username: user.username,
            email: req.body.email || user.email,
            public: user.public,
          };

          if (req.session.remember) {
            req.session.user = userObject;
            req.session.auth = true;
          }

          req.session.regenerate((err) => {
            if (err) throw err;
          });

          user.set({
            email: req.body.email || user.email,
            public: typeof req.body.public === 'boolean' && req.body.public,
          });

          user.save((err, updatedUser) => {
            if (err) {
              res.send(err);
            } else {
              res.send(updatedUser);
            }
          });
        }
      }
    });
  });

router.route('/validPassword')
  .post((req, res) => {
    User.findOne({ username: req.body.username }, (err, user) => {
      if (!user) {
        res.json({ success: false });
        return;
      }
      if (err) throw err;

      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if(err) {
          res.json({ success: false });
          return;
        }

        if (isMatch) {
          res.json({ success: true });
        } else {
          res.json({ success: false });
        }
      });
    }).lean();
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

router.route('/allMatchingUsers')
  .get((req, res) => {
    const search = req.query.username;
    const searchRegEx = new RegExp(search, "i");
    let exactUserMatch = { username: '', public: '' };

    User.findOne({username: search}, (err, user) => {
      if (user) {
        exactUserMatch = {
          username: user.username,
          public: user.public,
        };
      }

      User.find({username: { $regex: searchRegEx }}, (err, users) => {
        const userArray = users.map((user) => {
          if (user.username === exactUserMatch.username) {
            delete user;
            return;
          }
          return {
            username: user.username,
            public: user.public,
          };
        });

        if (exactUserMatch.username) {
          res.send([exactUserMatch].concat(userArray).filter(user => user !== undefined));
        } else {
          res.send(userArray.filter(user => user !== undefined));
        }
      })
      .limit(20)
      .lean();
    });
  });

module.exports = router;
