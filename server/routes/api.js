const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const Record = require('../models/record');
const User = require('../models/user');
const WishlistRecord = require('../models/wishlist-record');

// Allows that there is no access control in dev mode
const isProd = process.env.NODE_ENV === 'production';

// Handles record adding/editing
router.route('/records')
  .get((req, res, next) => {
    const sort = req.query.sort ? JSON.parse(req.query.sort) : undefined;
    User.findOne({ username: req.query.username }, (err, user) => {
      if (err) return next(err);

      if (user && (user.public || (req.session.user && user.username === req.session.user.username) || !isProd)) {
        Record.find({ userId: user._id }, (recordErr, records) => {
          if (recordErr) return next(err);
          res.status(200).json(records.map(record => {
            return {
              _id: record._id,
              date: record.date,
              title: record.title,
              artist: record.artist,
              format: record.format,
              rating: record.rating,
              wikiHref: record.wikiHref,
              wikiDesc: record.wikiDesc,
              wikiImg: record.wikiImg,
              notes: record.notes,
              image: record.image,
            };
          }));
        })
        .sort(sort || { date: -1 })
        .lean();
      } else {
        if (user) {
          res.status(401).send('401 - Unauthorized');
        } else {
          res.status(404).send('404 - Not found');
        }
      }
    })
    .lean();
  })
  .post((req, res, next) => {
    if (!req.body || !req.body.title || !req.body.username) {
      res.status(204).send({ error: 'Request lacking required fields.' });
    } else {
      User.findOne({ username: req.body.username }, (userError, user) => {
        if (userError) return next(err);

        if (user && ((req.session.user && user.username === req.session.user.username) || !isProd)) {
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

          newRecord.save((err) => {
            if (err) {
              return next(err);
            } else {
              res.status(200).json({ msg: 'Record added' });
            }
          });
        } else {
          res.status(401).send('401 - Unauthorized');
        }
      })
    .lean();
    }
  })
  .delete((req, res, next) => {
    Record.findById(req.query._id, (err, record) => {
      if (err) {
        return next(err);
      } else {
        User.findById(record.userId, (userErr, user) => {
          if (userErr) {
            return next(err);
          } else {
            if (user && ((req.session.user && user.username === req.session.user.username) || !isProd)) {
              Record.deleteOne({ _id: req.query._id }, (recordErr) => {
                if (recordErr) {
                  return next(err);
                } else {
                  res.status(200).json({ msg: 'Record removed' });
                }
              });
            } else {
              res.status(401).send('401 - Unauthorized');
            }
          }
        });
      }
    });
  })
  .put((req, res, next) => {
    Record.findById(req.body.id, (err, record) => {
      if (err) {
        return next(err);
      } else {
        User.findById(record.userId, (userErr, user) => {
          if (userErr) {
            return next(err);
          } else if (user && ((req.session.user && user.username === req.session.user.username) || !isProd)) {
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

            record.save((saveErr, updatedRecord) => {
              if (err) {
                return next(err);
              } else {
                res.status(200).send(updatedRecord);
              }
            });
          } else {
            res.status(401).send('401 - Unauthorized');
          }
        });
      }
    });
  });

router.route('/wishlist')
  .get((req, res, next) => {
    User.findOne({ username: req.query.username }, (err, user) => {
      if (err) return next(err);

      if (user && (user.public || (req.session.user && user.username === req.session.user.username) || !isProd)) {
        WishlistRecord.find({ userId: user._id }, (recordErr, records) => {
          if (recordErr) return next(err);
          res.status(200).json(records.map(record => {
            return {
              _id: record._id,
              title: record.title,
              artist: record.artist,
              format: record.format,
            };
          }));
        }).lean();
      } else {
        if (user) {
          res.status(401).send('401 - Unauthorized');
        } else {
          res.status(404).send('404 - Not found');
        }
      }
    })
    .lean();
  })
  .post((req, res, next) => {
    if (!req.body || !req.body.title || !req.body.username) {
      res.status(204).send({ error: 'Request lacking required fields.' });
    } else {
      User.findOne({ username: req.body.username }, (userError, user) => {
        if (userError) return next(err);

        if (user && ((req.session.user && user.username === req.session.user.username) || !isProd)) {
          const newWishlistRecord = new WishlistRecord({
            title: req.body.title,
            artist: req.body.artist,
            format: req.body.format,
            userId: user._id,
          });

          newWishlistRecord.save((err) => {
            if (err) {
              return next(err);
            } else {
              res.status(200).json({ msg: 'Record added' });
            }
          });
        } else {
          res.status(401).send('401 - Unauthorized');
        }
      })
    .lean();
    }
  })
  .delete((req, res, next) => {
    WishlistRecord.findById(req.query._id, (err, record) => {
      if (err) {
        return next(err);
      } else {
        User.findById(record.userId, (userErr, user) => {
          if (userErr) {
            return next(err);
          } else {
            if (user && ((req.session.user && user.username === req.session.user.username) || !isProd)) {
              WishlistRecord.deleteOne({ _id: req.query._id }, (recordErr) => {
                if (recordErr) {
                  return next(err);
                } else {
                  res.status(200).json({ msg: 'Record removed' });
                }
              });
            } else {
              res.status(401).send('401 - Unauthorized');
            }
          }
        });
      }
    });
  });

// Handles sign in
router.route('/signin')
  .post((req, res, next) => {
    User.findOne({ username: req.body.username }, (err, user) => {
      if (err) return next(err);
      if (!user) {
        return res.status(400).json({ success: false, msg: 'Invalid username or password' });
      }

      bcrypt.compare(req.body.password, user.password, (passwordErr, isMatch) => {
        if(passwordErr) {
          return next(err);
        }

        if (isMatch) {
          const userObject  = {
            username: user.username,
            email: user.email,
            public: user.public,
          };

          req.session.regenerate((sessionErr) => {
            if (err) if (err) return next(err);
            req.session.auth = true;
            req.session.remember = req.body.remember;
            req.session.user = userObject;

            res.status(200).json({ success: true, user: userObject, msg: 'Login successful.' });
          });

        } else {
          res.status(400).json({ success: false, msg: 'Invalid username or password' });
        }
      });
    }).lean();
  });

// Handles sign out
router.route('/signout')
  .get((req, res) => {
    req.session.destroy();
    res.status(200).json({ msg: 'User logged out' });
  });

// Handles user registration and modifications
router.route('/user')
  .get((req, res, next) => {
    const search = req.query.username ? { username: req.query.username } : { email: req.query.email };

    User.findOne(search, (err, user) => {
      if (err) return next(err);

      let unique = false;
      if (user === null) unique = true;

      res.status(200).json({
        user: {
          username: user ? user.username : '',
          public: user && user.public,
        },
        unique
      });
    });
  })
  .post((req, res, next) => {
    if (!req.body || !req.body.username || !req.body.password || !req.body.email) {
      res.status(204).send({ error: 'Request lacking required fields.' });
    } else {
      let unique = true;

      User.findOne({ username: req.body.username }, (err, user) => {
        if (err) return next(err);
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
            return next(error);
          } else {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) return next(err);

              if (hash) {
                newUser.password = hash;

                newUser.save((saveErr) => {
                  if (saveErr) {
                    return next(saveErr);
                  } else {
                    res.status(200).json({ success: true, msg: 'User added' });
                  }
                });

              } else {
                return next();
              }
            });
          }
        });
      } else {
        res.status(200).send({ error: 'Username taken' });
      }
    }
  })
  .delete((req, res, next) => {
    User.findOne({ username: req.query.username }, (err, user) => {
      if (err) return next(err);

      if (user && ((req.session.user && user.username === req.session.user.username) || !isProd)) {
        User.deleteOne({ username: req.query.username }, (innerErr) => {
          if (innerErr) return next(err);

          res.status(200).json({ msg: 'User removed' });
        });
      } else {
        res.status(401).send('401 - Unauthorized');
      }
    });
  })
  .put((req, res, next) => {
    User.findOne({ username: req.body.username || '' }, (err, user) => {
      if (err) {
        return next(err);
      } else if (user && ((req.session.user && user.username === req.session.user.username) || !isProd)) {
        const userObject  = {
          username: user.username,
          email: req.body.email || user.email,
          public: user.public,
        };

        const { remember } = req.session;

        if (req.body.password) {
          let password = req.body.password;

          bcrypt.genSalt(10, (error, salt) => {
            if (error) {
              return next(error);
            } else {
              bcrypt.hash(password, salt, (hashErr, hash) => {
                if (hashErr) return next(hashErr);

                if (hash) {
                  password = hash;

                  req.session.regenerate((sessErr) => {
                    if (sessErr) return next(sessErr);

                    if (remember) {
                      req.session.user = userObject;
                      req.session.auth = true;
                    }
                  });

                  user.set({
                    password: password || user.password,
                    email: req.body.email || user.email,
                    public: typeof req.body.public === 'boolean' && req.body.public,
                  });

                  user.save((saveErr, updatedUser) => {
                    if (saveErr) {
                      return next(saveErr);
                    } else {
                      res.status(200).send(updatedUser);
                    }
                  });
                } else {
                  res.status(200).json({ success: false });
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

          req.session.regenerate((sessErr) => {
            if (sessErr) return next(sessErr);

            if (remember) {
              req.session.user = userObject;
              req.session.auth = true;
            }
          });

          user.set({
            email: req.body.email || user.email,
            public: typeof req.body.public === 'boolean' && req.body.public,
          });

          user.save((saveErr, updatedUser) => {
            if (saveErr) {
              return next(saveErr);
            } else {
              res.status(200).send(updatedUser);
            }
          });
        }
      } else {
        res.status(401).send('401 - Unauthorized');
      }
    });
  });

router.route('/validPassword')
  .post((req, res, next) => {
    User.findOne({ username: req.body.username }, (err, user) => {
      if (err) return next(err);

      if (!user) {
        res.status(200).json({ success: false });
        return;
      }

      bcrypt.compare(req.body.password, user.password, (matchErr, isMatch) => {
        if(matchErr) {
          return next(matchErr);
        }

        if (isMatch) {
          res.status(200).json({ success: true });
        } else {
          res.status(200).json({ success: false });
        }
      });
    }).lean();
  });

router.route('/authenticated')
  .get((req, res, next) => {
    if (req.session.auth && req.session.remember) {
      const { auth, remember, user } = req.session;
      req.session.regenerate((err) => {
        if (err) return next(err);

        req.session.auth = auth;
        req.session.remember= remember;
        req.session.user = user;

        res.status(200).json({ authenticated: req.session.auth, user: req.session.user });
      });
    } else {
      req.session.auth = false;
      req.session.user = {};
      res.status(200).json({ authenticated: false, user: {} });
    }
  });

router.route('/allMatchingUsers')
  .get((req, res, next) => {
    const search = req.query.username;
    const searchRegEx = new RegExp(search, "i");
    let exactUserMatch = { username: '', public: '' };

    User.findOne({username: search}, (err, user) => {
      if (err) return next(err);

      if (user) {
        exactUserMatch = {
          username: user.username,
          public: user.public,
        };
      }

      User.find({username: { $regex: searchRegEx }}, (innerErr, users) => {
        if (innerErr) return next(innerErr);

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
          res.status(200).send([exactUserMatch].concat(userArray).filter(user => user !== undefined));
        } else {
          res.status(200).send(userArray.filter(user => user !== undefined));
        }
      })
      .limit(20)
      .lean();
    });
  });

module.exports = router;
